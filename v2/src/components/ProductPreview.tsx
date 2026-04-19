import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

const SIZES = [
  { id: 'A6', label: 'A6', price: 17, strikePrice: 33 },
  { id: 'A5', label: 'A5', price: 33, strikePrice: 49 },
  { id: 'A4', label: 'A4', price: 49, strikePrice: 99 },
  { id: 'A3', label: 'A3', price: 99, strikePrice: 149 },
];

interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface ProductPreviewProps {
  product: Product;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('A5');
  const [added, setAdded] = useState(false);

  const currentSize = SIZES.find((s) => s.id === selectedSize)!;

  const handleAddToBag = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col">
      {/* ── Image — compact height so content is visible without scrolling ── */}
      <div className="px-4 pt-2">
        <div
          className="w-full overflow-hidden rounded-2xl border border-white/5 bg-black shadow-2xl"
          style={{ maxHeight: '36vh', aspectRatio: '3/4' }}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>
      </div>

      {/* ── Info ── */}
      <div className="px-4 pt-4 flex flex-col gap-4 pb-6">
        {/* Title & price */}
        <div>
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">
            {product.category}
          </span>
          <h2 className="text-xl font-black text-white mt-0.5 leading-tight">
            {product.title}
          </h2>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-black text-primary">₹{currentSize.price}</span>
            <span className="text-sm text-muted line-through opacity-60">
              ₹{currentSize.strikePrice}
            </span>
            <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              {Math.round(
                ((currentSize.strikePrice - currentSize.price) / currentSize.strikePrice) * 100
              )}% OFF
            </span>
          </div>
        </div>

        {/* ── Size Selection — single horizontal row of 4 pills ── */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
            Size <span className="text-primary">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className="flex flex-col items-center justify-center py-2.5 rounded-xl border-2 transition-all duration-150 active:scale-95"
                style={{
                  borderColor:
                    selectedSize === size.id
                      ? 'rgba(250,203,21,1)'
                      : 'rgba(255,255,255,0.07)',
                  background:
                    selectedSize === size.id
                      ? 'rgba(250,203,21,0.12)'
                      : 'rgba(255,255,255,0.04)',
                }}
              >
                <span
                  className="text-sm font-black"
                  style={{
                    color: selectedSize === size.id ? '#FACB15' : '#fff',
                  }}
                >
                  {size.label}
                </span>
                <span className="text-[9px] font-bold opacity-60 mt-0.5">₹{size.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Bundle Offers — compact single row ── */}
        <div
          className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 overflow-x-auto"
          style={{ background: 'rgba(255,255,255,0.03)', scrollbarWidth: 'none' }}
        >
          <span className="text-[10px] font-black text-primary whitespace-nowrap">🎁 BUNDLE:</span>
          {[
            { label: 'Buy 5 → 1 Free' },
            { label: 'Buy 10 → 3 Free' },
            { label: 'Buy 20 → 8 Free' },
          ].map((o) => (
            <span
              key={o.label}
              className="text-[10px] font-bold text-white/60 bg-white/5 px-3 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0"
            >
              {o.label}
            </span>
          ))}
        </div>

        {/* ── Delivery info ── */}
        <div className="flex items-center gap-4 text-[10px] font-bold text-white/40">
          <span>🚚 Free delivery ≥ ₹299</span>
          <span>📦 Ships in 3–5 days</span>
        </div>

        {/* ── Add to Bag CTA — inline (not fixed), safe for bottom sheet ── */}
        <button
          onClick={handleAddToBag}
          className="w-full py-4 rounded-full font-black text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
          style={{
            background: added ? '#22c55e' : '#FACB15',
            color: '#000',
          }}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              Added to Bag!
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Add to Bag — ₹{currentSize.price}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
