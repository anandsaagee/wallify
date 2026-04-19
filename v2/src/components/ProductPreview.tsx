import React, { useState } from 'react';
import { ShoppingBag, Zap, Check, Truck, Package } from 'lucide-react';

const SIZES = [
  { id: 'A6', label: 'A6', dim: '10.5×14.8 cm', price: 17, strikePrice: 33 },
  { id: 'A5', label: 'A5', dim: '14.8×21 cm', price: 33, strikePrice: 49 },
  { id: 'A4', label: 'A4', dim: '21×29.7 cm', price: 49, strikePrice: 99 },
  { id: 'A3', label: 'A3', dim: '29.7×42 cm', price: 99, strikePrice: 149 },
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
  const [addedState, setAddedState] = useState<'idle' | 'added'>('idle');

  const currentSize = SIZES.find((s) => s.id === selectedSize)!;
  const discount = Math.round(
    ((currentSize.strikePrice - currentSize.price) / currentSize.strikePrice) * 100
  );

  const handleAdd = () => {
    setAddedState('added');
    setTimeout(() => setAddedState('idle'), 2000);
  };

  return (
    <div className="product-preview-layout">
      {/* ━━━━━━━━━━ SCROLLABLE MIDDLE ━━━━━━━━━━ */}
      <div className="product-preview-content">

        {/* ── 1. Image — 30-40% of viewport, centered ── */}
        <div style={{ padding: '4px 16px 0' }}>
          <div className="product-preview-image">
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
        <div style={{ padding: '16px 16px 0' }}>
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
        <div style={{ padding: '16px 16px 0' }}>
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
          <div className="size-grid">
            {SIZES.map((size) => {
              const isSelected = selectedSize === size.id;
              return (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className="size-option"
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
        <div style={{ padding: '14px 16px 0' }}>
          <div className="offers-card">
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
        <div
          style={{
            padding: '12px 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
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
      <div className="product-preview-cta">
        {/* Secondary: Add to Cart */}
        <button
          onClick={handleAdd}
          className="cta-secondary"
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
        <button onClick={handleAdd} className="cta-primary">
          <Zap style={{ width: 18, height: 18 }} />
          Buy Now — ₹{currentSize.price}
        </button>
      </div>
    </div>
  );
};
