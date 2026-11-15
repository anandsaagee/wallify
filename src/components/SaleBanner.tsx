import React, { useState, useEffect } from 'react';
import { isSaleActive, SALE } from '../utils/sale';

// ── Anniversary Sale Modal Popup ──────────────────────────────────────────────
// Full-screen modal with the anniversary image + offer details.
// Pops in with a spring animation after a short delay.
// Dismissable: once per session (sessionStorage).

const SESSION_KEY = 'wallify_sale_modal_dismissed_v2';

export const SaleBanner: React.FC<{ onShopNow?: () => void }> = ({ onShopNow }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isSaleActive()) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const t = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, '1');
    setTimeout(() => setMounted(false), 400);
  };

  const handleShopNow = () => {
    dismiss();
    onShopNow?.();
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes modalBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalBackdropOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes modalCardIn {
          0%   { opacity: 0; transform: scale(0.82) translateY(32px); }
          65%  { transform: scale(1.03) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes modalCardOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.9) translateY(20px); }
        }
        @keyframes shimmerGold {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes pulseRed {
          0%, 100% { box-shadow: 0 0 0 0 rgba(185,28,28,0.5); }
          50%       { box-shadow: 0 0 0 10px rgba(185,28,28,0); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-5px) rotate(-2deg); }
        }
        @keyframes confettiSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .sale-backdrop-in  { animation: modalBackdropIn  0.3s ease forwards; }
        .sale-backdrop-out { animation: modalBackdropOut 0.35s ease forwards; }
        .sale-card-in      { animation: modalCardIn  0.55s cubic-bezier(0.34,1.4,0.64,1) forwards; }
        .sale-card-out     { animation: modalCardOut 0.35s ease forwards; }

        .shimmer-gold {
          background: linear-gradient(90deg,
            #b45309 0%, #d97706 20%, #fbbf24 40%, #fef3c7 50%,
            #fbbf24 60%, #d97706 80%, #b45309 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerGold 2.5s linear infinite;
        }

        .pulse-red-btn { animation: pulseRed 2s ease-in-out infinite; }
        .float-badge   { animation: floatBadge 2.8s ease-in-out infinite; }
      `}</style>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4
          ${visible ? 'sale-backdrop-in' : 'sale-backdrop-out'}`}
        style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
        onClick={dismiss}
      >
        {/* Modal card — stop propagation so clicks inside don't close */}
        <div
          className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl
            ${visible ? 'sale-card-in' : 'sale-card-out'}`}
          onClick={(e) => e.stopPropagation()}
          style={{ background: '#fff' }}
        >
          {/* ── Close button ── */}
          <button
            aria-label="Close sale popup"
            onClick={dismiss}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 transition-all flex items-center justify-center text-white text-sm font-bold backdrop-blur-sm border border-white/20"
          >
            ✕
          </button>

          {/* ── Anniversary Image ── */}
          <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
            <img
              src="/anniversary-sale.jpg"
              alt="1st Anniversary Sale"
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Floating 10% OFF badge on top of image */}
            <div
              className="float-badge absolute top-4 left-4 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl px-3 py-2 shadow-xl border-2 border-white/30"
              style={{ boxShadow: '0 8px 24px rgba(185,28,28,0.5)' }}
            >
              <p className="text-white font-black text-2xl leading-none">10%</p>
              <p className="text-white/90 font-black text-[9px] uppercase tracking-widest">OFF</p>
            </div>
          </div>

          {/* ── Offer Details Panel ── */}
          <div className="bg-gradient-to-b from-[#1a0505] to-[#2d0a0a] px-5 pb-5 pt-4">

            {/* Headline */}
            <p className="text-center font-black text-lg leading-tight mb-1">
              <span className="shimmer-gold">Exclusive Sale Offers</span>
            </p>
            <p className="text-center text-white/60 text-[11px] font-semibold mb-4 tracking-wide">
              Original prices unchanged · Discount applied at checkout
            </p>

            {/* Offer pills */}
            <div className="space-y-2.5 mb-5">

              {/* 10% off row */}
              <div className="flex items-center gap-3 bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-white font-black text-sm leading-none">10%</span>
                  <span className="text-white/80 font-black text-[8px] uppercase leading-none mt-0.5">OFF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm">10% Off on All Posters</p>
                  <p className="text-white/55 text-[10px] font-semibold mt-0.5 leading-snug">
                    Automatically deducted · No coupon needed
                  </p>
                </div>
                <span className="shrink-0 text-green-400 font-black text-xs bg-green-400/15 px-2 py-1 rounded-lg border border-green-400/25">
                  AUTO
                </span>
              </div>

              {/* Free delivery row */}
              <div className="flex items-center gap-3 bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🚚</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm">Free Delivery on All Orders</p>
                  <p className="text-white/55 text-[10px] font-semibold mt-0.5 leading-snug">
                    Anywhere in India · No minimum order
                  </p>
                </div>
                <span className="shrink-0 text-green-400 font-black text-xs bg-green-400/15 px-2 py-1 rounded-lg border border-green-400/25">
                  FREE
                </span>
              </div>

            </div>

            {/* CTA */}
            <button
              onClick={handleShopNow}
              className="pulse-red-btn w-full py-3.5 rounded-2xl font-black text-white text-sm uppercase tracking-widest transition-all active:scale-95 border border-red-400/30"
              style={{
                background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #be123c 100%)',
                boxShadow: '0 12px 32px rgba(185,28,28,0.45)',
              }}
            >
              🎉 Shop the Sale Now
            </button>

            {/* Fine print */}
            <p className="text-center text-white/35 text-[10px] font-medium mt-3 leading-snug">
              Limited time only · Auto-applied · No code needed
            </p>

          </div>
        </div>
      </div>
    </>
  );
};
