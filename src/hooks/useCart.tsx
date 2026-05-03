import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SIZES, getEligibleFreeItems } from '../data/config';

export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  image: string;
  category: string;
  size: string;
  sizeId: string;
  price: number;
  quantity: number;
  isFreeGift: boolean;
}

export interface CartTotals {
  totalPaidItems: number;
  subtotal: number;
  freeGiftCount: number;
  eligibleFreeGifts: number;
  totalItems: number;
  finalTotal: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: string; title: string; image: string; category: string }, sizeId: string) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  totals: CartTotals;
  clearCart: () => void;
  selectFreePoster: (product: { id: string; title: string; image: string; category: string }, sizeId: string) => void;
  removeFreePoster: (variantId: string) => void;
  freeSlots: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'wallify_cart_v3';

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function computeTotals(cart: CartItem[]): CartTotals {
  const paidItems = cart.filter((item) => !item.isFreeGift);
  const freeItems = cart.filter((item) => item.isFreeGift);

  const totalPaidItems = paidItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = paidItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeGiftCount = freeItems.reduce((sum, item) => sum + item.quantity, 0);
  const eligibleFreeGifts = getEligibleFreeItems(totalPaidItems);

  return {
    totalPaidItems,
    subtotal,
    freeGiftCount,
    eligibleFreeGifts,
    totalItems: totalPaidItems + freeGiftCount,
    finalTotal: subtotal,
  };
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = useCallback(
    (product: { id: string; title: string; image: string; category: string }, sizeId: string) => {
      const sizeConfig = SIZES.find((s) => s.id === sizeId) ?? SIZES[1];
      const variantId = `${product.id}-${sizeId}`;

      setCart((prev) => {
        const existing = prev.find((item) => item.variantId === variantId);
        if (existing) {
          return prev.map((item) =>
            item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prev,
          {
            variantId,
            productId: product.id,
            title: product.title,
            image: product.image,
            category: product.category,
            size: sizeConfig.label,
            sizeId,
            price: sizeConfig.price,
            quantity: 1,
            isFreeGift: false,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId && !item.isFreeGift) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const selectFreePoster = useCallback(
    (product: { id: string; title: string; image: string; category: string }, sizeId: string) => {
      const sizeConfig = SIZES.find((s) => s.id === sizeId) ?? SIZES[1];
      const variantId = `free-${product.id}-${sizeId}`;

      setCart((prev) => {
        const freeItems = prev.filter((item) => item.isFreeGift);
        const paidItems = prev.filter((item) => !item.isFreeGift);
        const totalPaidItems = paidItems.reduce((sum, item) => sum + item.quantity, 0);
        const eligible = getEligibleFreeItems(totalPaidItems);
        const currentFreeCount = freeItems.reduce((sum, item) => sum + item.quantity, 0);

        if (currentFreeCount >= eligible) {
          return prev;
        }

        const existing = prev.find((item) => item.variantId === variantId);
        if (existing) {
          if (existing.quantity < eligible - (currentFreeCount - existing.quantity)) {
            return prev.map((item) =>
              item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return prev;
        }

        return [
          ...prev,
          {
            variantId,
            productId: product.id,
            title: product.title,
            image: product.image,
            category: product.category,
            size: sizeConfig.label,
            sizeId,
            price: 0,
            quantity: 1,
            isFreeGift: true,
          },
        ];
      });
    },
    []
  );

  const removeFreePoster = useCallback((variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  }, []);

  const totals = useMemo(() => computeTotals(cart), [cart]);

  const freeSlots = useMemo(() => {
    return Math.max(0, totals.eligibleFreeGifts - totals.freeGiftCount);
  }, [totals.eligibleFreeGifts, totals.freeGiftCount]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totals,
        clearCart,
        selectFreePoster,
        removeFreePoster,
        freeSlots,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
