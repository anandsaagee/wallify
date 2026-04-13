import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  image: string;
  category: string;
  size: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, size: string) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  totals: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('wallify_v2_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wallify_v2_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, size: string) => {
    const variantId = `${product.id}-${size}`;
    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      if (existing) {
        return prev.map(item => 
          item.variantId === variantId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, {
        variantId,
        productId: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        size,
        price: 33, // Simplified for V2
        quantity: 1
      }];
    });
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.variantId === variantId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  const calculateTotals = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let freeCount = 0;
    if (totalItems >= 20) freeCount = 6;
    else if (totalItems >= 10) freeCount = 3;
    else if (totalItems >= 7) freeCount = 2;
    else if (totalItems >= 5) freeCount = 1;

    // Find cheapest items to discount
    const allPrices = cart.flatMap(item => Array(item.quantity).fill(item.price)).sort((a, b) => a - b);
    const discount = allPrices.slice(0, freeCount).reduce((sum, p) => sum + p, 0);

    return { totalItems, subtotal, discount, finalTotal: subtotal - discount, freeCount };
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totals: calculateTotals() }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
