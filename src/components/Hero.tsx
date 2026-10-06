import React, { useState, useEffect, useRef } from 'react';

// ── Stable random helpers ────────────────────────────────────────────────────
// Numbers are seeded from the current hour so they feel "live" but don't
// thrash on every render.
function seedRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getWeeklyOrders(): number {
  // 2-digit number between 42 and 99 — changes each day
  const daySeed = new Date().getDate();
  return Math.floor(seedRandom(daySeed + 100) * 58) + 42;
}

function getLiveOrdering(): number {
  // Always strictly lower than weeklyOrders by at least 5
  const weekly = getWeeklyOrders();
  const max = weekly - 5;          // leave a visible gap
  const min = Math.max(10, Math.floor(weekly * 0.3)); // at least 30% lower
  const hourSeed = new Date().getHours();
  return Math.floor(seedRandom(hourSeed) * (max - min + 1)) + min;
}

// ── Live Stats Widget ────────────────────────────────────────────────────────
const LiveStats: React.FC = () => {
  const [weeklyCount] = useState(getWeeklyOrders());
  const [liveCount, setLiveCount] = useState(getLiveOrdering());

  // Bump live count slightly every ~30s — always stays below weeklyCount
  useEffect(() => {
    const tick = () => {
      setLiveCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        // Never exceed weekly - 5, never go below 10
        return Math.max(10, Math.min(weeklyCount - 5, next));
      });
    };
    const id = setInterval(tick, 28000);
    return () => clearInterval(id);
  }, [weeklyCount]);

  return (
    <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
      {/* Ordering Now */}
      <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 min-w-[110px]">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulseDot shrink-0" />
          <span className="text-[10px] font-body font-semibold text-green-400 uppercase tracking-widest">
            Ordering Now
          </span>
        </div>
        <span className="text-3xl sm:text-4xl font-display text-green-400 leading-none">
          {String(liveCount).padStart(2, '0')}
        </span>
      </div>

      {/* Orders This Week */}
      <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 min-w-[110px]">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="text-[10px] font-body font-semibold text-primary uppercase tracking-widest">
            This Week
          </span>
        </div>
        <span className="text-3xl sm:text-4xl font-display text-primary leading-none">
          {String(weeklyCount).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

// ── Hero ─────────────────────────────────────────────────────────────────────
export const Hero: React.FC<{
  onShopNow: () => void;
  onExplore: () => void;
  isMainH1?: boolean;
}> = ({
  onShopNow,
  onExplore,
  isMainH1 = true,
}) => {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: 'clamp(520px, 88svh, 880px)',
        paddingLeft:  'max(0px, env(safe-area-inset-left))',
        paddingRight: 'max(0px, env(safe-area-inset-right))',
        paddingTop:   'max(80px, env(safe-area-inset-top))',
        paddingBottom: '32px',
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-surface" />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-15 blur-[90px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FACB15 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center w-full max-w-xl mx-auto px-4 flex flex-col items-center gap-5 sm:gap-6">

        {/* Headline — DM Serif Display */}
        {isMainH1 ? (
          <h1
            className="font-display text-white leading-[1.1] tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(30px, 6vw, 64px)' }}
          >
            Transform Your Walls
            <br />
            <span className="text-primary">with Wallify.</span>
          </h1>
        ) : (
          <h2
            className="font-display text-white leading-[1.1] tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(30px, 6vw, 64px)' }}
          >
            Transform Your Walls
            <br />
            <span className="text-primary">with Wallify.</span>
          </h2>
        )}

        {/* Subheading — DM Sans */}
        <p className="font-body text-muted text-sm sm:text-base max-w-xs font-medium leading-relaxed">
          Premium posters at unbeatable prices.
        </p>

<<<<<<< HEAD
        {/* ── Live Stats ── */}
        <LiveStats />
=======
        {/* Stats Boxes — side by side, compact */}
        <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
          {/* Ordering Now */}
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <div>
              <p className="text-[11px] font-black text-white leading-none">47 ordering</p>
              <p className="text-[9px] font-semibold text-muted mt-0.5 leading-none">right now</p>
            </div>
          </div>

          {/* Last Week Orders */}
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5">
            <span className="text-base leading-none">📦</span>
            <div>
              <p className="text-[11px] font-black text-white leading-none">1.2k orders</p>
              <p className="text-[9px] font-semibold text-muted mt-0.5 leading-none">last week</p>
            </div>
          </div>
        </div>
>>>>>>> 039688a (Update project)

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={onShopNow}
            className="font-body w-full sm:w-auto px-7 py-3.5 min-h-[48px] bg-primary text-black font-bold text-sm sm:text-[15px] rounded-full transition-all duration-200 active:scale-95 hover:brightness-110 shadow-[0_8px_28px_rgba(250,203,21,0.3)]"
          >
            Shop Now
          </button>
          <button
            onClick={onExplore}
            className="font-body w-full sm:w-auto px-7 py-3.5 min-h-[48px] font-semibold text-white rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/10 active:scale-95 transition-all duration-200 text-sm sm:text-[15px]"
          >
            Explore Collection
          </button>
        </div>

        {/* WhatsApp Custom Order CTA */}
        <a
          href="https://wa.me/917736497186?text=Hi!%20I%27d%20like%20to%20customize%20my%20own%20poster%20or%20car%20frame%20%F0%9F%9A%97%F0%9F%96%BC%EF%B8%8F"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 active:scale-95 transition-all duration-200 group w-full max-w-[320px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-7 h-7 shrink-0" aria-hidden="true">
            <circle cx="24" cy="24" r="24" fill="#25D366" />
            <path fill="#fff" d="M34.6 13.4A14.9 14.9 0 0 0 24 9C16.3 9 10 15.3 10 23c0 2.5.7 4.9 1.9 7L10 39l9.3-1.9a15 15 0 0 0 4.7.8C31.7 38 38 31.7 38 24c0-4-1.6-7.8-3.4-10.6zM24 35.7c-2.1 0-4.2-.6-6-1.6l-.4-.3-4.4.9.9-4.3-.3-.5A12.1 12.1 0 0 1 12 23c0-6.6 5.4-12 12-12 3.2 0 6.2 1.2 8.5 3.5A11.9 11.9 0 0 1 36 23c0 6.6-5.4 12-12 12zm6.6-9c-.4-.2-2.1-1-2.4-1.1-.3-.1-.6-.2-.8.2-.3.4-1 1.1-1.2 1.3-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6z" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="font-body text-[#25D366] font-semibold text-sm group-hover:text-white transition-colors duration-200">
              Customize your poster or frame
            </span>
            <span className="font-body text-[11px] text-[#25D366]/70 font-medium group-hover:text-white/70 transition-colors duration-200">
              Posters Free · Frames from ₹349
            </span>
          </div>
        </a>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-[10px] sm:text-[11px] font-body font-semibold text-muted uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-px bg-white/20" />Free Posters
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-px bg-white/20" />Premium Quality
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-px bg-white/20" />Fast Delivery
          </span>
        </div>
      </div>
    </section>
  );
};
