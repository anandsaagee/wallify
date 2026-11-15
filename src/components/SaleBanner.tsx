import React, { useState, useEffect } from 'react';
import { isSaleActive, saleDaysLeft, SALE } from '../utils/sale';

// ── Anniversary Sale Banner ───────────────────────────────────────────────────
// Mounts as an animated pill on the Hero. Dismissable per session.
// Only renders during the active sale window.

const SESSION_KEY = 'wallify_sale_dismissed_v1';

export const SaleBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isSaleActive()) return;
    // Don't show if dismissed this session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Slight delay so it pops in after the hero renders
    const t = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    }, 600);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  const days = saleDaysLeft();

  return (
    <>
      <style>{`
        @keyframes salePop {
          0%   { opacity: 0; transform: translateY(-16px) scale(0.92); }
          60%  { transform: translateY(4px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes saleShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes salePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.5); }
          50%       { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
        }
        @keyframes saleFlicker {
          0%, 100% { opacity: 1; }
          48%       { opacity: 1; }
          50%       { opacity: 0.7; }
          52%       { opacity: 1; }
        }
        .sale-banner-enter {
          animation: salePop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .sale-shimmer-text {
          background: linear-gradient(
            90deg,
            #fff 0%, #fca5a5 30%, #fff 50%, #fca5a5 70%, #fff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: saleShimmer 2.4s linear infinite;
        }
        .sale-pulse {
          animation: salePulse 2s ease-in-out infinite;
        }
        .sale-dot-flicker {
          animation: saleFlicker 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`relative z-20 w-full max-w-sm mx-auto ${visible ? 'sale-banner-enter' : 'opacity-0'}`}
        role="banner"
        aria-label="Anniversary Sale"
      >
        <div
          className="sale-pulse relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-600 via-red-500 to-rose-600 px-4 py-3 shadow-xl shadow-red-600/40 cursor-default select-none"
        >
          {/* Noise/grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
            }}
          />

          {/* Top row: sale name + dismiss */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Live dot */}
              <span className="sale-dot-flicker shrink-0 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.7)]" />
              <span className="sale-shimmer-text text-[11px] font-black uppercase tracking-[0.15em] truncate">
                🎉 1st Anniversary Sale
              </span>
            </div>

            {/* Dismiss */}
            <button
              aria-label="Dismiss sale banner"
              onClick={() => {
                setVisible(false);
                setTimeout(() => setMounted(false), 300);
                sessionStorage.setItem(SESSION_KEY, '1');
              }}
              className="shrink-0 w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 transition-all flex items-center justify-center text-white/80 text-[10px] font-bold leading-none"
            >
              ✕
            </button>
          </div>

          {/* Offer details */}
          <div className="mt-2 flex items-center gap-3">
            {/* 10% off pill */}
            <div className="shrink-0 flex flex-col items-center bg-white rounded-xl px-3 py-1.5 shadow-md">
              <span className="text-red-600 font-black text-lg leading-none">10%</span>
              <span className="text-red-500 font-black text-[9px] uppercase tracking-widest leading-none mt-0.5">OFF</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-sm leading-tight">
                Everything in the store
              </p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1">
                  🚚 Free Delivery
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                  All Orders
                </span>
              </div>
            </div>
          </div>

          {/* Countdown / deadline */}
          <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="text-white/80 text-[10px] font-semibold">
              Ends Dec 31 · No code needed
            </span>
            {days > 0 && (
              <span className="text-white font-black text-[11px] bg-white/20 px-2 py-0.5 rounded-lg border border-white/30">
                {days}d left
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
