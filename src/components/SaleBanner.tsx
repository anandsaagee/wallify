import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { isSaleActive, SALE } from '../utils/sale';
import anniversaryImg from '../assets/anniversary-sale.jpg';

export const SaleBanner: React.FC<{ onShopNow?: () => void }> = ({ onShopNow }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isSaleActive()) return;
    const t = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => setMounted(false), 350);
  };

  const handleShopNow = () => { dismiss(); onShopNow?.(); };

  if (!mounted) return null;

  // ── Portal renders directly into document.body — escapes all overflow/z-index traps ──
  return createPortal(
    <>
      <style>{`
        @keyframes saleIn {
          0%   { opacity:0; transform:scale(0.84) translateY(30px); }
          65%  { transform:scale(1.03) translateY(-3px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes saleOut {
          to { opacity:0; transform:scale(0.9) translateY(16px); }
        }
        @keyframes pulseCta {
          0%,100% { box-shadow:0 0 0 0 rgba(185,28,28,.55); }
          50%      { box-shadow:0 0 0 10px rgba(185,28,28,0); }
        }
        @keyframes shimmerGold {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        .sale-in  { animation:saleIn  .52s cubic-bezier(.34,1.4,.64,1) forwards; }
        .sale-out { animation:saleOut .32s ease forwards; }
        .cta-pulse { animation:pulseCta 2s ease-in-out infinite; }
        .shimmer-gold {
          background:linear-gradient(90deg,#92400e 0%,#d97706 25%,#fef3c7 50%,#d97706 75%,#92400e 100%);
          background-size:200% auto;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmerGold 2.4s linear infinite;
        }
      `}</style>

      {/* Full-screen backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          background: 'rgba(0,0,0,0.70)',
          backdropFilter: 'blur(6px)',
          transition: 'opacity .3s',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
        onClick={dismiss}
      >
        {/* Modal card */}
        <div
          className={visible ? 'sale-in' : 'sale-out'}
          style={{ width: '100%', maxWidth: 320, borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close btn */}
          <button
            aria-label="Close"
            onClick={dismiss}
            style={{
              position: 'absolute',
              top: 10, right: 10,
              zIndex: 10,
              width: 28, height: 28,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.52)',
              border: '1.5px solid rgba(255,255,255,0.28)',
              color: '#fff',
              fontWeight: 900,
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>

          {/* ── Full-width image ── */}
          <img
            src={anniversaryImg}
            alt="1st Anniversary Sale"
            style={{ display: 'block', width: '100%', height: 'auto' }}
            draggable={false}
          />

          {/* ── Dark details panel ── */}
          <div style={{ background: 'linear-gradient(160deg,#1b0303,#280505)', padding: '14px 16px 16px' }}>

            <p style={{ textAlign: 'center', margin: '0 0 2px' }}>
              <span className="shimmer-gold" style={{ fontWeight: 900, fontSize: 13 }}>
                Exclusive Anniversary Offers
              </span>
            </p>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Original prices unchanged · Auto-applied at checkout
            </p>

            {/* 10% off row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '10px 12px', marginBottom: 8,
            }}>
              <div style={{
                flexShrink: 0, width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg,#b91c1c,#dc2626)',
                boxShadow: '0 4px 10px rgba(185,28,28,0.5)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 13, lineHeight: 1 }}>{SALE.discountPct}%</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 900, fontSize: 7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>OFF</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 900, fontSize: 11, margin: 0, lineHeight: 1.3 }}>10% Off on All Posters</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 500, margin: '2px 0 0' }}>No coupon · Applied at checkout</p>
              </div>
              <span style={{
                flexShrink: 0, fontWeight: 900, fontSize: 9, color: '#4ade80',
                background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.28)',
                borderRadius: 6, padding: '3px 6px',
              }}>AUTO</span>
            </div>

            {/* Free delivery row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '10px 12px', marginBottom: 12,
            }}>
              <div style={{
                flexShrink: 0, width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg,#047857,#059669)',
                boxShadow: '0 4px 10px rgba(5,150,105,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>🚚</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 900, fontSize: 11, margin: 0, lineHeight: 1.3 }}>Free Delivery on All Orders</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 500, margin: '2px 0 0' }}>Anywhere in India · Zero charges</p>
              </div>
              <span style={{
                flexShrink: 0, fontWeight: 900, fontSize: 9, color: '#4ade80',
                background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.28)',
                borderRadius: 6, padding: '3px 6px',
              }}>FREE</span>
            </div>

            {/* CTA */}
            <button
              className="cta-pulse"
              onClick={handleShopNow}
              style={{
                width: '100%', padding: '12px 0',
                borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)',
                background: 'linear-gradient(135deg,#b91c1c 0%,#dc2626 60%,#be123c 100%)',
                color: '#fff', fontWeight: 900, fontSize: 11,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                cursor: 'pointer',
              }}
            >
              🎉 Shop the Sale Now →
            </button>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
