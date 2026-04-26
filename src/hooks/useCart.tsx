import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SIZES } from '../data/config';

// ─── Types ───────────────────────────────────────────────────────────────────

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
  isFreeGift?: boolean;
}

export interface CartTotals {
  totalItems: number;       // paid items only
  totalPaidItems: number;   // same as totalItems (clarity alias)
  subtotal: number;
  freeGiftCount: number;    // number of mystery posters currently in cart
  eligibleFreeGifts: number; // how many free gifts the user has earned
  finalTotal: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: string; title: string; image: string; category: string }, sizeId: string) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  totals: CartTotals;
  clearCart: () => void;
  freeGiftMessage: string | null;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'wallify_v2_cart';
const MYSTERY_PRODUCT_ID = 'mystery-poster-free';

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

  // For every 5 paid posters, earn 1 free mystery poster
  const eligibleFreeGifts = Math.floor(totalPaidItems / 5);
  const freeGiftCount = freeItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    totalItems: totalPaidItems,
    totalPaidItems,
    subtotal,
    freeGiftCount,
    eligibleFreeGifts,
    finalTotal: subtotal, // no discount on price — the gift is a separate free item
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Quota exceeded or private mode — silently ignore
    }
  }, [cart]);

  // Auto-manage mystery poster free gifts
  useEffect(() => {
    const paidItems = cart.filter((item) => !item.isFreeGift);
    const totalPaidItems = paidItems.reduce((sum, item) => sum + item.quantity, 0);
    const eligibleFreeGifts = Math.floor(totalPaidItems / 5);

    // Determine the most common sizeId among paid items (for matching size)
    const sizeCounts: Record<string, number> = {};
    paidItems.forEach((item) => {
      sizeCounts[item.sizeId] = (sizeCounts[item.sizeId] || 0) + item.quantity;
    });
    const dominantSizeId = Object.entries(sizeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'A5';
    const sizeConfig = SIZES.find((s) => s.id === dominantSizeId) ?? SIZES[1];

    const existingFree = cart.filter((item) => item.isFreeGift);
    const currentFreeCount = existingFree.reduce((sum, item) => sum + item.quantity, 0);

    if (eligibleFreeGifts > currentFreeCount) {
      // Add mystery poster(s)
      const diff = eligibleFreeGifts - currentFreeCount;
      const freeVariantId = `${MYSTERY_PRODUCT_ID}-${dominantSizeId}`;
      const existingFreeItem = existingFree.find((item) => item.variantId === freeVariantId);

      setCart((prev) => {
        if (existingFreeItem) {
          return prev.map((item) =>
            item.variantId === freeVariantId
              ? { ...item, quantity: item.quantity + diff, size: sizeConfig.label, sizeId: dominantSizeId }
              : item
          );
        }
        return [
          ...prev,
          {
            variantId: freeVariantId,
            productId: MYSTERY_PRODUCT_ID,
            title: 'Mystery Poster (Free Surprise)',
            image: '',
            category: 'Gift',
            size: sizeConfig.label,
            sizeId: dominantSizeId,
            price: 0,
            quantity: diff,
            isFreeGift: true,
          },
        ];
      });
    } else if (eligibleFreeGifts < currentFreeCount) {
      // Remove excess free gifts
      setCart((prev) => {
        let toRemove = currentFreeCount - eligibleFreeGifts;
        return prev
          .map((item) => {
            if (item.isFreeGift && toRemove > 0) {
              const removeFromThis = Math.min(toRemove, item.quantity);
              toRemove -= removeFromThis;
              return { ...item, quantity: item.quantity - removeFromThis };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);
      });
    }
  }, [cart.filter(i => !i.isFreeGift).map(i => `${i.variantId}:${i.quantity}`).join(',')]);

  const addToCart = useCallback(
    (
      product: { id: string; title: string; image: string; category: string },
      sizeId: string
    ) => {
      const sizeConfig = SIZES.find((s) => s.id === sizeId) ?? SIZES[1];
      const variantId = `${product.id}-${sizeId}`;

      setCart((prev) => {
        const existing = prev.find((item) => item.variantId === variantId);
        if (existing) {
          return prev.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: item.quantity + 1 }
              : item
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
          },
        ];
      });
    },
    []
  );

  const updateQuantity = useCallback((variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId && !item.isFreeGift) {
            return { ...item, quantity: Math.max(0, item.quantity + delta) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId || item.isFreeGift));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // Memoize totals
  const totals = useMemo(() => computeTotals(cart), [cart]);

  // Free gift eligibility message
  const freeGiftMessage = useMemo(() => {
    const paidCount = totals.totalPaidItems;
    const nextThreshold = (Math.floor(paidCount / 5) + 1) * 5;
    const remaining = nextThreshold - paidCount;

    if (paidCount >= 5 && paidCount % 5 === 0) {
      return "🎉 You're eligible for a free mystery poster!";
    }
    if (remaining <= 2 && remaining > 0) {
      return `🔥 Add ${remaining} more poster${remaining > 1 ? 's' : ''} to get a FREE mystery poster!`;
    }
    return null;
  }, [totals.totalPaidItems]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, totals, clearCart, freeGiftMessage }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
