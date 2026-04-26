import React, { useState, useCallback, useRef } from 'react';
import { ShoppingBag, Zap, Check, Package, Gift } from 'lucide-react';
import { SIZES } from '../data/config';
import { useCart } from '../hooks/useCart';

interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface ProductPreviewProps {
  product: Product;
}

// ─── Size Selector Button ────────────────────────────────────────────────────
interface SizeButtonProps {
  size: (typeof SIZES)[number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const SizeButton: React.FC<SizeButtonProps> = ({ size, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(size.id)}
    aria-pressed={isSelected}
    aria-label={`Size ${size.label} — ₹${size.price}`}
    className={`
      flex flex-col items-center justify-center min-h-[56px] px-2 py-3
      rounded-2xl border-2 transition-all duration-200 active:scale-95
      ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-[0_0_16px_rgba(250,203,21,0.15)]'
          : 'border-white/8 bg-white/[0.03] hover:border-white/20'
      }
    `}
  >
    <span
      className={`text-base font-black leading-none ${
        isSelected ? 'text-primary' : 'text-white'
      }`}
    >
      {size.label}
    </span>
    <span className="text-[9px] font-semibold text-white/40 mt-1">{size.dim}</span>
    <span
      className={`text-[11px] font-black mt-1 ${
        isSelected ? 'text-primary' : 'text-white/60'
      }`}
    >
      ₹{size.price}{' '}
      <span className="line-through opacity-40 text-[9px]">₹{size.strikePrice}</span>
    </span>
  </button>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const ProductPreview: React.FC<ProductPreviewProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(SIZES[1].id); // A5 default
  const [cartState, setCartState] = useState<'idle' | 'added'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addToCart, freeGiftMessage } = useCart();

  const currentSize = SIZES.find((s) => s.id === selectedSize) ?? SIZES[1];
  const discount = Math.round(
    ((currentSize.strikePrice - currentSize.price) / currentSize.strikePrice) * 100
  );

  const handleAddToCart = useCallback(() => {
    addToCart(product, selectedSize);
    setCartState('added');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCartState('idle'), 2000);
  }, [addToCart, product, selectedSize]);

  const handleBuyNow = useCallback(() => {
    addToCart(product, selectedSize);
  }, [addToCart, product, selectedSize]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* 1 — Product Image (compact, well-contained) */}
        <div className="px-4 pt-1 flex justify-center">
          <div className="w-full max-h-[22dvh] max-w-[180px] aspect-[3/4] overflow-hidden rounded-xl border border-white/5 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <img
              src={product.image}
              alt={product.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 2 — Title, Category & Price */}
        <div className="px-4 pt-3">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            {product.category}
          </span>

          <h2 className="text-lg font-black text-white leading-tight mt-1 tracking-tight">
            {product.title}
          </h2>

          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-black text-primary">
              ₹{currentSize.price}
            </span>
            <span className="text-sm text-muted line-through opacity-60">
              ₹{currentSize.strikePrice}
            </span>
            <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          </div>
        </div>

        {/* 3 — Size Selection (visible without scrolling) */}
        <div className="px-4 pt-3">
          <p className="text-[11px] font-extrabold text-white/50 uppercase tracking-widest mb-2">
            Select Size <span className="text-primary">*</span>
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((size) => (
              <SizeButton
                key={size.id}
                size={size}
                isSelected={selectedSize === size.id}
                onSelect={setSelectedSize}
              />
            ))}
          </div>
        </div>

        {/* 4 — Bundle Offer */}
        <div className="px-4 pt-3">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Gift className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                Special Offer
              </span>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-3 flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">🎁</span>
              <div>
                <p className="text-xs font-extrabold text-white">Buy 5 Posters → Get 1 Free</p>
                <p className="text-[10px] text-muted font-medium mt-0.5">
                  A mystery poster matching your selected size will be automatically added!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Free gift notification */}
        {freeGiftMessage && (
          <div className="px-4 pt-2.5">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2.5 flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🎉</span>
              <p className="text-[11px] font-bold text-green-400">{freeGiftMessage}</p>
            </div>
          </div>
        )}

        {/* 5 — Delivery Info */}
        <div className="px-4 pt-2.5 pb-4 flex flex-col gap-1.5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold text-white/35">
            <Package className="w-3 h-3 shrink-0" aria-hidden="true" />
            Ships in 3–5 days
          </p>
          <p className="text-[10px] font-medium text-white/30 leading-relaxed">
            * Delivery charges will be calculated based on your pincode.
          </p>
        </div>
      </div>

      {/* Sticky CTA Bar */}
      <div className="shrink-0 flex gap-2.5 px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))] bg-gradient-to-t from-surface from-80% to-surface/95 border-t border-white/5">
        <button
          onClick={handleAddToCart}
          aria-label={cartState === 'added' ? 'Added to cart' : 'Add to cart'}
          className={`
            shrink-0 w-[52px] h-[52px] rounded-2xl border-[1.5px] flex items-center
            justify-center transition-all duration-200 active:scale-90
            ${
              cartState === 'added'
                ? 'bg-green-500/15 border-green-500 text-green-400'
                : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/10'
            }
          `}
        >
          {cartState === 'added' ? (
            <Check className="w-[18px] h-[18px]" />
          ) : (
            <ShoppingBag className="w-[18px] h-[18px]" />
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 h-[52px] rounded-2xl bg-primary text-black font-black text-[15px] flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95 hover:brightness-110"
        >
          <Zap className="w-[18px] h-[18px]" aria-hidden="true" />
          Buy Now — ₹{currentSize.price}
        </button>
      </div>
    </div>
  );
};
