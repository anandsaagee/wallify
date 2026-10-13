import React, { useState, useEffect } from 'react';

// ── Stable random helpers ────────────────────────────────────────────────────
function seedRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getWeeklyOrders(): number {
  const daySeed = new Date().getDate();
  return Math.floor(seedRandom(daySeed + 100) * 58) + 42;
}

function getLiveOrdering(): number {
  const weekly = getWeeklyOrders();
  const max = weekly - 5;
  const min = Math.max(10, Math.floor(weekly * 0.3));
  const hourSeed = new Date().getHours();
  return Math.floor(seedRandom(hourSeed) * (max - min + 1)) + min;
}

// ── Live Stats Widget ────────────────────────────────────────────────────────
const LiveStats: React.FC = () => {
  const [weeklyCount] = useState(getWeeklyOrders());
  const [liveCount, setLiveCount] = useState(getLiveOrdering());

  useEffect(() => {
    const tick = () => {
      setLiveCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return Math.max(10, Math.min(weeklyCount - 5, next));
      });
    };
    const id = setInterval(tick, 28000);
    return () => clearInterval(id);
  }, [weeklyCount]);

  return (
    <div className="flex items-center gap-2 justify-center">
      {/* Ordering Now */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulseDot shrink-0" />
        <span className="text-[10px] font-body font-semibold text-green-400 uppercase tracking-wider">
          {String(liveCount).padStart(2, '0')} ordering now
        </span>
      </div>

      {/* Orders This Week */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <span className="text-[10px] font-body font-semibold text-primary uppercase tracking-wider">
          {String(weeklyCount).padStart(2, '0')} this week
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
        minHeight: 'clamp(380px, 72svh, 680px)',
        paddingLeft:  'max(0px, env(safe-area-inset-left))',
        paddingRight: 'max(0px, env(safe-area-inset-right))',
        paddingTop:   'max(72px, env(safe-area-inset-top))',
        paddingBottom: '24px',
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
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FACB15 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center w-full max-w-lg mx-auto px-4 flex flex-col items-center gap-3 sm:gap-4">

        {/* Headline — compact single line on mobile */}
        {isMainH1 ? (
          <h1
            className="font-display text-white leading-[1.1] tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(26px, 5.5vw, 52px)' }}
          >
            Transform Your Walls{' '}
            <span className="text-primary">with Wallify.</span>
          </h1>
        ) : (
          <h2
            className="font-display text-white leading-[1.1] tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(26px, 5.5vw, 52px)' }}
          >
            Transform Your Walls{' '}
            <span className="text-primary">with Wallify.</span>
          </h2>
        )}

        {/* Subheading */}
        <p className="font-body text-muted text-xs sm:text-sm max-w-[260px] sm:max-w-xs font-medium leading-relaxed">
          Premium posters at unbeatable prices.
        </p>

        {/* ── Live Stats — compact inline pills ── */}
        <LiveStats />

        {/* CTA Buttons */}
        <div className="flex gap-2.5 w-full max-w-[300px] sm:max-w-none sm:w-auto">
          <button
            onClick={onShopNow}
            className="font-body flex-1 sm:flex-none sm:w-auto px-6 py-3 min-h-[44px] bg-primary text-black font-bold text-sm rounded-full transition-all duration-200 active:scale-95 hover:brightness-110 shadow-[0_8px_28px_rgba(250,203,21,0.3)]"
          >
            Shop Now
          </button>
          <button
            onClick={onExplore}
            className="font-body flex-1 sm:flex-none sm:w-auto px-6 py-3 min-h-[44px] font-semibold text-white rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/10 active:scale-95 transition-all duration-200 text-sm"
          >
            Explore
          </button>
        </div>

        {/* WhatsApp Custom Order CTA */}
        <a
          href="https://wa.me/917736497186?text=Hi!%20I%27d%20like%20to%20customize%20my%20own%20poster%20or%20car%20frame%20%F0%9F%9A%97%F0%9F%96%BC%EF%B8%8F"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 active:scale-95 transition-all duration-200 group w-full max-w-[300px] sm:max-w-[320px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6 shrink-0" aria-hidden="true">
            <circle cx="24" cy="24" r="24" fill="#25D366" />
            <path fill="#fff" d="M34.6 13.4A14.9 14.9 0 0 0 24 9C16.3 9 10 15.3 10 23c0 2.5.7 4.9 1.9 7L10 39l9.3-1.9a15 15 0 0 0 4.7.8C31.7 38 38 31.7 38 24c0-4-1.6-7.8-3.4-10.6zM24 35.7c-2.1 0-4.2-.6-6-1.6l-.4-.3-4.4.9.9-4.3-.3-.5A12.1 12.1 0 0 1 12 23c0-6.6 5.4-12 12-12 3.2 0 6.2 1.2 8.5 3.5A11.9 11.9 0 0 1 36 23c0 6.6-5.4 12-12 12zm6.6-9c-.4-.2-2.1-1-2.4-1.1-.3-.1-.6-.2-.8.2-.3.4-1 1.1-1.2 1.3-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6z" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="font-body text-[#25D366] font-semibold text-xs group-hover:text-white transition-colors duration-200">
              Customize your poster or frame
            </span>
            <span className="font-body text-[10px] text-[#25D366]/70 font-medium group-hover:text-white/70 transition-colors duration-200">
              Posters Free · Frames from ₹349
            </span>
          </div>
        </a>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[9px] sm:text-[10px] font-body font-semibold text-muted uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-px bg-white/20" />Free Posters
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-px bg-white/20" />Premium Quality
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-px bg-white/20" />Fast Delivery
          </span>
        </div>
      </div>
    </section>
  );
};
