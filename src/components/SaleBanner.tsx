import React, { useState, useEffect } from 'react';
import { isSaleActive, SALE } from '../utils/sale';
import anniversaryImg from '../assets/anniversary-sale.jpg';

const SESSION_KEY = 'wallify_sale_modal_v3';

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
          0%   { opacity:0; transform:scale(0.86) translateY(24px); }
          65%  { transform:scale(1.02) translateY(-3px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes saleOut {
          to { opacity:0; transform:scale(0.92) translateY(16px); }
        }
        @keyframes floatBadge {
          0%,100% { transform:translateY(0) rotate(-3deg); }
          50%      { transform:translateY(-4px) rotate(-3deg); }
        }
        @keyframes shimmerGold {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseCta {
          0%,100% { box-shadow:0 0 0 0 rgba(185,28,28,.5); }
          50%      { box-shadow:0 0 0 8px rgba(185,28,28,0); }
        }
        .sale-in  { animation:saleIn  .5s cubic-bezier(.34,1.4,.64,1) forwards; }
        .sale-out { animation:saleOut .32s ease forwards; }
        .float-badge { animation:floatBadge 2.6s ease-in-out infinite; }
        .shimmer-gold {
          background:linear-gradient(90deg,#92400e 0%,#d97706 25%,#fef3c7 50%,#d97706 75%,#92400e 100%);
          background-size:200% auto;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmerGold 2.4s linear infinite;
        }
        .cta-pulse { animation:pulseCta 2s ease-in-out infinite; }
      `}</style>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] flex items-center justify-center p-4
          transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
        onClick={dismiss}
      >
        {/* Card — max 340px wide, compact */}
        <div
          className={visible ? 'sale-in' : 'sale-out'}
          style={{ width: '100%', maxWidth: 340 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#fff' }}>

            {/* ── Close button ── */}
            <button
              aria-label="Close"
              onClick={dismiss}
              className="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 active:scale-90 transition-all flex items-center justify-center text-white text-xs font-bold"
            >✕</button>

            {/* ── Image (top half) ── */}
            <div className="relative w-full" style={{ height: 200 }}>
              <img
                src={anniversaryImg}
                alt="1st Anniversary Sale"
                className="w-full h-full object-cover object-center"
                draggable={false}
              />

              {/* Floating discount badge */}
              <div
                className="float-badge absolute bottom-3 left-3 rounded-xl px-2.5 py-1.5 border-2 border-white/40 shadow-lg"
                style={{ background: 'linear-gradient(135deg,#b91c1c,#dc2626)' }}
              >
                <p className="text-white font-black text-xl leading-none">{SALE.discountPct}%</p>
                <p className="text-white/90 font-black text-[8px] uppercase tracking-wider">OFF</p>
              </div>
            </div>

            {/* ── Offer panel (dark bottom) ── */}
            <div
              className="px-4 pt-3 pb-4"
              style={{ background: 'linear-gradient(160deg,#1c0505,#2d0808)' }}
            >
              {/* Title */}
              <p className="text-center font-black text-base leading-tight mb-0.5">
                <span className="shimmer-gold">Exclusive Anniversary Offers</span>
              </p>
              <p className="text-center text-white/50 text-[10px] font-semibold mb-3 tracking-wide">
                Original prices unchanged · Auto-applied at checkout
              </p>

              {/* Two offer rows */}
              <div className="space-y-2 mb-3">

                {/* 10% off */}
                <div className="flex items-center gap-2.5 bg-white/[0.07] border border-white/10 rounded-xl px-3 py-2.5">
                  <div
                    className="shrink-0 w-9 h-9 rounded-lg flex flex-col items-center justify-center shadow"
                    style={{ background: 'linear-gradient(135deg,#b91c1c,#dc2626)' }}
                  >
                    <span className="text-white font-black text-sm leading-none">{SALE.discountPct}%</span>
                    <span className="text-white/80 font-black text-[7px] uppercase">OFF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-xs leading-tight">10% Off on All Posters</p>
                    <p className="text-white/50 text-[9px] font-semibold mt-0.5">No coupon needed · Applied automatically</p>
                  </div>
                  <span className="shrink-0 text-[9px] font-black text-green-400 bg-green-400/15 px-1.5 py-0.5 rounded-md border border-green-400/25">
                    AUTO
                  </span>
                </div>

                {/* Free delivery */}
                <div className="flex items-center gap-2.5 bg-white/[0.07] border border-white/10 rounded-xl px-3 py-2.5">
                  <div
                    className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg shadow"
                    style={{ background: 'linear-gradient(135deg,#047857,#059669)' }}
                  >🚚</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-xs leading-tight">Free Delivery on All Orders</p>
                    <p className="text-white/50 text-[9px] font-semibold mt-0.5">Anywhere in India · Zero delivery charges</p>
                  </div>
                  <span className="shrink-0 text-[9px] font-black text-green-400 bg-green-400/15 px-1.5 py-0.5 rounded-md border border-green-400/25">
                    FREE
                  </span>
                </div>

              </div>

              {/* CTA */}
              <button
                onClick={handleShopNow}
                className="cta-pulse w-full py-3 rounded-xl font-black text-white text-xs uppercase tracking-widest active:scale-95 transition-transform border border-red-400/30"
                style={{ background: 'linear-gradient(135deg,#b91c1c,#dc2626,#be123c)' }}
              >
                🎉 Shop the Sale Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
