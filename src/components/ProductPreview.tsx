import React, { useState } from 'react';
import { ShoppingBag, Zap, Check, Truck, Package } from 'lucide-react';
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

export const ProductPreview: React.FC<ProductPreviewProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('A5');
  const [addedState, setAddedState] = useState<'idle' | 'added'>('idle');
  const { addToCart } = useCart();

  const currentSize = SIZES.find((s) => s.id === selectedSize)!;
  const discount = Math.round(
    ((currentSize.strikePrice - currentSize.price) / currentSize.strikePrice) * 100
  );

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAddedState('added');
    setTimeout(() => setAddedState('idle'), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ━━━━━━━━━━ SCROLLABLE MIDDLE ━━━━━━━━━━ */}
      <div className="flex-1 overflow-y-auto overscroll-contain">

        {/* ── 1. Image — 30-40% of viewport, centered ── */}
        <div className="px-4 pt-1">
          <div className="w-full max-h-[25dvh] max-w-[220px] aspect-[3/4] overflow-hidden rounded-xl border border-white/5 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.4)] mx-auto">
            <img
              src={product.image}
              alt={product.title}
              loading="eager"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        {/* ── 2. Title + Category + Price ── */}
        <div className="px-4 pt-4">
          {/* Category badge */}
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: '#FACB15',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            {product.category}
          </span>

          {/* Title */}
          <h2
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.15,
              marginTop: 4,
              letterSpacing: '-0.02em',
            }}
          >
            {product.title}
          </h2>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FACB15' }}>
              ₹{currentSize.price}
            </span>
            <span
              style={{
                fontSize: 14,
                color: '#a1a1aa',
                textDecoration: 'line-through',
                opacity: 0.6,
              }}
            >
              ₹{currentSize.strikePrice}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                color: '#4ade80',
                background: 'rgba(74,222,128,0.1)',
                padding: '2px 8px',
                borderRadius: 100,
              }}
            >
              {discount}% OFF
            </span>
          </div>
        </div>

        {/* ── 3. Size Selection — 2×2 Grid ── */}
        <div className="px-4 pt-4">
          <label
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'block',
              marginBottom: 10,
            }}
          >
            Select Size <span style={{ color: '#FACB15' }}>*</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {SIZES.map((size) => {
              const isSelected = selectedSize === size.id;
              return (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className="flex flex-col items-center justify-center min-h-[48px] px-2 py-2.5 rounded-2xl border-2 transition-all duration-150 cursor-pointer active:scale-95"
                  style={{
                    borderColor: isSelected
                      ? 'rgba(250,203,21,1)'
                      : 'rgba(255,255,255,0.07)',
                    background: isSelected
                      ? 'rgba(250,203,21,0.1)'
                      : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: isSelected ? '#FACB15' : '#fff',
                    }}
                  >
                    {size.label}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.4)',
                      marginTop: 2,
                    }}
                  >
                    {size.dim}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: isSelected ? '#FACB15' : 'rgba(255,255,255,0.6)',
                      marginTop: 2,
                    }}
                  >
                    ₹{size.price}{' '}
                    <span
                      style={{
                        textDecoration: 'line-through',
                        opacity: 0.4,
                        fontSize: 9,
                      }}
                    >
                      ₹{size.strikePrice}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4. Bundle Offers — visually separated card ── */}
        <div className="px-4 pt-3.5">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 14 }}>🎁</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#FACB15',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Bundle & Save
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 6,
              }}
            >
              {[
                { qty: 'Buy 5', bonus: '1 Free', tag: '🔥' },
                { qty: 'Buy 10', bonus: '3 Free', tag: '⚡' },
                { qty: 'Buy 20', bonus: '8 Free', tag: '🏆' },
              ].map((o) => (
                <div
                  key={o.qty}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 10,
                    padding: '8px 6px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 12 }}>{o.tag}</span>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#fff',
                      marginTop: 2,
                    }}
                  >
                    {o.qty}
                  </p>
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#4ade80',
                      marginTop: 1,
                    }}
                  >
                    {o.bonus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. Delivery Info ── */}
        <div className="flex flex-col gap-2 px-4 pt-3 pb-4">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Package style={{ width: 12, height: 12 }} /> Ships in 3–5 days
            </span>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            *A minimal delivery charge will apply to every order based on your pincode.
          </span>
        </div>
      </div>

      {/* ━━━━━━━━━━ STICKY BOTTOM CTA ━━━━━━━━━━ */}
      <div className="shrink-0 sticky bottom-0 flex gap-2.5 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#111] from-80% to-[#111]/95 border-t border-white/5">
        {/* Secondary: Add to Cart */}
        <button
          onClick={handleAdd}
          className="shrink-0 w-[52px] h-[52px] rounded-2xl border-[1.5px] border-white/10 flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90"
          style={{
            background: addedState === 'added' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
            borderColor: addedState === 'added' ? '#22c55e' : 'rgba(255,255,255,0.08)',
            color: addedState === 'added' ? '#4ade80' : '#fff',
          }}
        >
          {addedState === 'added' ? (
            <Check style={{ width: 18, height: 18 }} />
          ) : (
            <ShoppingBag style={{ width: 18, height: 18 }} />
          )}
        </button>

        {/* Primary: Buy Now */}
        <button onClick={handleAdd} className="flex-1 h-[52px] rounded-2xl border-none bg-primary text-black font-black text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-95">
          <Zap style={{ width: 18, height: 18 }} />
          Buy Now — ₹{currentSize.price}
        </button>
      </div>
    </div>
  );
};
