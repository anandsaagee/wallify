import React, { useState, useEffect } from 'react';
import { isSaleActive, SALE } from '../utils/sale';
import anniversaryImg from '../assets/anniversary-sale.jpg';

const SESSION_KEY = 'wallify_sale_modal_v5';

export const SaleBanner: React.FC<{ onShopNow?: () => void }> = ({ onShopNow }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isSaleActive()) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, '1');
    setTimeout(() => setMounted(false), 350);
  };

  const handleShopNow = () => { dismiss(); onShopNow?.(); };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes saleIn {
          0%   { opacity:0; transform:scale(0.86) translateY(28px); }
          65%  { transform:scale(1.025) translateY(-3px); }
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

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] flex items-center justify-center p-4
          transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(6px)' }}
        onClick={dismiss}
      >
        {/* Card — image on top, details panel below */}
        <div
          className={`relative w-full rounded-2xl overflow-hidden shadow-2xl ${visible ? 'sale-in' : 'sale-out'}`}
          style={{ maxWidth: 320 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            aria-label="Close"
            onClick={dismiss}
            className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all active:scale-90"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1.5px solid rgba(255,255,255,0.3)' }}
          >✕</button>

          {/* ── TOP: Full-width image ── */}
          <img
            src={anniversaryImg}
            alt="1st Anniversary Sale"
            style={{ display: 'block', width: '100%', height: 'auto' }}
            draggable={false}
          />

          {/* ── BOTTOM: Dark offer details panel ── */}
          <div
            className="px-4 pt-3.5 pb-4"
            style={{ background: 'linear-gradient(160deg, #1c0404, #2a0606)' }}
          >
            {/* Headline */}
            <p className="text-center font-black text-sm leading-tight mb-0.5">
              <span className="shimmer-gold">Exclusive Anniversary Offers</span>
            </p>
            <p className="text-center text-white/45 text-[9px] font-semibold mb-3 tracking-wider uppercase">
              Original prices unchanged · Auto-applied at checkout
            </p>

            {/* Offer rows */}
            <div className="space-y-2 mb-3">

              {/* 10% off */}
              <div
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.11)' }}
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex flex-col items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#b91c1c,#dc2626)', boxShadow: '0 4px 10px rgba(185,28,28,0.5)' }}
                >
                  <span className="text-white font-black text-sm leading-none">{SALE.discountPct}%</span>
                  <span className="text-white/80 font-black text-[7px] uppercase tracking-wider">OFF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-xs leading-tight">10% Off on All Posters</p>
                  <p className="text-white/45 text-[9px] font-medium mt-0.5">No coupon · Applied at checkout</p>
                </div>
                <span
                  className="shrink-0 font-black text-[9px] text-green-400 px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.28)' }}
                >AUTO</span>
              </div>

              {/* Free delivery */}
              <div
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.11)' }}
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-base"
                  style={{ background: 'linear-gradient(135deg,#047857,#059669)', boxShadow: '0 4px 10px rgba(5,150,105,0.4)' }}
                >🚚</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-xs leading-tight">Free Delivery on All Orders</p>
                  <p className="text-white/45 text-[9px] font-medium mt-0.5">Anywhere in India · Zero charges</p>
                </div>
                <span
                  className="shrink-0 font-black text-[9px] text-green-400 px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.28)' }}
                >FREE</span>
              </div>

            </div>

            {/* CTA */}
            <button
              onClick={handleShopNow}
              className="cta-pulse w-full py-3 rounded-xl font-black text-white text-xs uppercase tracking-widest active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg,#b91c1c 0%,#dc2626 60%,#be123c 100%)',
                boxShadow: '0 8px 24px rgba(185,28,28,0.45)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              🎉 Shop the Sale Now →
            </button>

          </div>
        </div>
      </div>
    </>
  );
};
