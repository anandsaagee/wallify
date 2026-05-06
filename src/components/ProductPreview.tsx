import React, { useState, useCallback } from 'react';
import { ShoppingBag, Zap, Check, Gift } from 'lucide-react';
import { SIZES } from '../data/config';
import { useCart } from '../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';

interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface ProductPreviewProps {
  product: Product;
  /** If provided (e.g. from SizeFilter), pre-selects this size on open */
  initialSizeId?: string;
  onClose?: () => void;
}

const SizeButton: React.FC<{
  size: (typeof SIZES)[number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ size, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(size.id)}
    aria-pressed={isSelected}
    className={`flex flex-col items-center justify-center min-h-[56px] px-2 py-3 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
      isSelected
        ? 'border-primary bg-primary/10 shadow-[0_0_16px_rgba(250,203,21,0.15)]'
        : 'border-white/8 bg-white/[0.03] hover:border-white/20'
    }`}
  >
    <span className={`text-base font-black leading-none ${isSelected ? 'text-primary' : 'text-white'}`}>
      {size.label}
    </span>
    <span className="text-[9px] font-semibold text-white/40 mt-1">{size.dim}</span>
    <span className={`text-[11px] font-black mt-1 ${isSelected ? 'text-primary' : 'text-white/60'}`}>
      ₹{size.price}
    </span>
  </button>
);

const BULK_OFFERS_INLINE = [
  { buy: 5, free: 1 },
  { buy: 7, free: 2 },
  { buy: 10, free: 3 },
  { buy: 20, free: 7 },
] as const;

export const ProductPreview: React.FC<ProductPreviewProps> = ({ product, initialSizeId, onClose }) => {
  const defaultSize = SIZES.find((s) => s.id === initialSizeId) ?? SIZES[1];
  const [selectedSize, setSelectedSize] = useState(defaultSize.id);
  const [cartState, setCartState] = useState<'idle' | 'added'>('idle');
  const { addToCart, totals } = useCart();

  const currentSize = SIZES.find((s) => s.id === selectedSize) ?? SIZES[1];

  const freeIndicator = React.useMemo(() => {
    const currentTotal = totals.totalPaidItems;
    const thresholds = [5, 7, 10, 20];
    for (const threshold of thresholds) {
      if (currentTotal < threshold) {
        return { away: threshold - currentTotal, threshold };
      }
    }
    return null;
  }, [totals.totalPaidItems]);

  const handleAddToCart = useCallback(() => {
    addToCart(product, selectedSize);
    setCartState('added');
    
    // Close window and return to main page after adding
    setTimeout(() => {
      onClose?.();
      setCartState('idle');
    }, 600);
  }, [addToCart, product, selectedSize, onClose]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Product Image */}
        <div className="px-4 pt-1 flex justify-center">
          <div className="w-full max-h-[45dvh] max-w-[320px] aspect-[3/4] overflow-hidden rounded-xl border border-white/5 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <OptimizedImage
              src={product.image}
              alt={product.title}
              priority={true}
              containerClassName="w-full h-full"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Title, Category & Price */}
        <div className="px-4 pt-3">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            {product.category}
          </span>
          <h2 className="text-lg font-black text-white leading-tight mt-1 tracking-tight">
            {product.title}
          </h2>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-black text-primary">₹{currentSize.price}</span>
            <span className="text-sm text-white/40 font-medium">Single poster</span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="px-4 pt-3">
          <p className="text-[11px] font-extrabold text-white/50 uppercase tracking-widest mb-2">
            Select Size
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

        {/* Free Poster Indicator */}
        <AnimatePresence>
          {freeIndicator && (
            <motion.div
              key="free-indicator"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pt-3 overflow-hidden"
            >
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex items-center gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    You are <span className="text-primary">{freeIndicator.away}</span>{' '}
                    item{freeIndicator.away > 1 ? 's' : ''} away from a free poster
                  </p>
                  <p className="text-[10px] text-muted font-medium mt-0.5">
                    Buy {freeIndicator.threshold} posters total to unlock free picks
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Offer Banner */}
        <div className="px-4 pt-3">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Gift className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                Bulk Offers
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BULK_OFFERS_INLINE.map((o) => (
                <div
                  key={o.buy}
                  className="bg-white/[0.04] rounded-xl p-2 text-center"
                >
                  <p className="text-[10px] font-black text-white">Buy {o.buy}</p>
                  <p className="text-[10px] font-bold text-primary">Get {o.free} FREE</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="px-4 pt-2.5 pb-4">
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
          className={`shrink-0 w-[52px] h-[52px] rounded-2xl border-[1.5px] flex items-center justify-center transition-all duration-200 active:scale-90 ${
            cartState === 'added'
              ? 'bg-green-500 text-black border-green-500'
              : 'bg-white text-black border-white hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
          }`}
        >
          {cartState === 'added' ? (
            <Check className="w-[20px] h-[20px] stroke-[3px]" />
          ) : (
            <ShoppingBag className="w-[20px] h-[20px] stroke-[2.5px]" />
          )}
        </button>

        <button
          onClick={handleAddToCart}
          className="flex-1 h-[52px] rounded-2xl bg-primary text-black font-black text-[15px] flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95 hover:brightness-110 shadow-[0_8px_20px_rgba(250,203,21,0.2)]"
        >
          <Zap className="w-[18px] h-[18px]" aria-hidden="true" />
          Add to Cart — ₹{currentSize.price}
        </button>
      </div>
    </div>
  );
};
