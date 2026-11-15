import React, { useMemo } from 'react';
import { SaleBanner } from './SaleBanner';

// ── Stable live-stats helpers ─────────────────────────────────────────────────
function seedRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getWeeklyOrders(): number {
  const daySeed = new Date().getDate();
  return Math.floor(seedRandom(daySeed + 100) * 58) + 42;
}

function getLiveOrdering(weekly: number): number {
  const max = weekly - 5;
  const min = Math.max(10, Math.floor(weekly * 0.3));
  const hourSeed = new Date().getHours();
  return Math.floor(seedRandom(hourSeed) * (max - min + 1)) + min;
}

// ── Poster pool — curated diverse sample across all categories ────────────────
const POSTER_POOL: readonly string[] = [
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879347/wallify/assets/SPIRITUAL/SPIRITUAL-007.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879639/wallify/assets/mollywood/mollywood-115.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879646/wallify/assets/mollywood/mollywood-141.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879441/wallify/assets/automotive/automotive-036.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879501/wallify/assets/football/football-004.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879628/wallify/assets/mollywood/mollywood-072.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879421/wallify/assets/anime/anime-048.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879439/wallify/assets/automotive/automotive-029.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879737/wallify/assets/quotes/quotes-190.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879411/wallify/assets/anime/anime-009.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879508/wallify/assets/football/football-036.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879382/wallify/assets/abstract/abstract-063.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879504/wallify/assets/football/football-015.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879428/wallify/assets/anime/anime-063.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879750/wallify/assets/tamil/tamil-015.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879507/wallify/assets/football/football-029.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879683/wallify/assets/quotes/quotes-007.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879383/wallify/assets/abstract/abstract-071.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879681/wallify/assets/mollywood/mollywood-281.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879757/wallify/assets/tamil/tamil-041.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879360/wallify/assets/SPIRITUAL/SPIRITUAL-048.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879349/wallify/assets/SPIRITUAL/SPIRITUAL-015.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879479/wallify/assets/automotive/automotive-164.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879702/wallify/assets/quotes/quotes-071.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879689/wallify/assets/quotes/quotes-029.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879526/wallify/assets/football/football-082.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879556/wallify/assets/hollywood/hollywood-064.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879452/wallify/assets/automotive/automotive-071.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879450/wallify/assets/automotive/automotive-063.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879539/wallify/assets/hollywood/hollywood-030.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879323/wallify/assets/MUSIC/MUSIC-004.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879747/wallify/assets/tamil/tamil-002.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879353/wallify/assets/SPIRITUAL/SPIRITUAL-029.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879372/wallify/assets/abstract/abstract-027.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879367/wallify/assets/abstract/abstract-007.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879504/wallify/assets/football/football-014.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879504/wallify/assets/football/football-018.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879325/wallify/assets/MUSIC/MUSIC-012.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879431/wallify/assets/automotive/automotive-007.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879698/wallify/assets/quotes/quotes-058.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879332/wallify/assets/MUSIC/MUSIC-036.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879405/wallify/assets/abstract/abstract-164.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879448/wallify/assets/automotive/automotive-058.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879623/wallify/assets/mollywood/mollywood-058.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879375/wallify/assets/abstract/abstract-036.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879532/wallify/assets/hollywood/hollywood-007.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879413/wallify/assets/anime/anime-015.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879327/wallify/assets/MUSIC/MUSIC-018.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879325/wallify/assets/MUSIC/MUSIC-014.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879751/wallify/assets/tamil/tamil-018.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879642/wallify/assets/mollywood/mollywood-126.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879749/wallify/assets/tamil/tamil-009.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879345/wallify/assets/SPIRITUAL/SPIRITUAL-004.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879373/wallify/assets/abstract/abstract-029.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879381/wallify/assets/abstract/abstract-058.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879692/wallify/assets/quotes/quotes-036.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879507/wallify/assets/football/football-032.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879356/wallify/assets/SPIRITUAL/SPIRITUAL-036.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879621/wallify/assets/mollywood/mollywood-053.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879593/wallify/assets/hollywood/hollywood-165.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879326/wallify/assets/MUSIC/MUSIC-015.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879538/wallify/assets/hollywood/hollywood-028.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879560/wallify/assets/hollywood/hollywood-072.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879486/wallify/assets/automotive/automotive-190.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879608/wallify/assets/mollywood/mollywood-013.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879413/wallify/assets/anime/anime-016.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879551/wallify/assets/hollywood/hollywood-059.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879409/wallify/assets/anime/anime-004.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879749/wallify/assets/tamil/tamil-008.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879731/wallify/assets/quotes/quotes-164.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879430/wallify/assets/anime/anime-065.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879414/wallify/assets/anime/anime-018.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879751/wallify/assets/tamil/tamil-016.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879331/wallify/assets/MUSIC/MUSIC-032.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879330/wallify/assets/MUSIC/MUSIC-029.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879542/wallify/assets/hollywood/hollywood-037.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879759/wallify/assets/tamil/tamil-048.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879386/wallify/assets/abstract/abstract-080.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879394/wallify/assets/abstract/abstract-115.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879338/wallify/assets/MUSIC/MUSIC-055.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879519/wallify/assets/football/football-063.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879569/wallify/assets/hollywood/hollywood-090.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879460/wallify/assets/automotive/automotive-087.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879717/wallify/assets/quotes/quotes-117.webp",
  "https://res.cloudinary.com/dkwx4bacj/image/upload/v1790879658/wallify/assets/mollywood/mollywood-178.webp",
];

// Cloudinary: tiny poster thumb ~2-5 KB each
function toThumbUrl(url: string): string {
  return url.replace('/image/upload/', '/image/upload/w_90,h_126,c_fill,q_auto:low,f_auto/');
}

// Fisher-Yates shuffle — truly random on each call
function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Row height responsive config (5 rows, no gaps)
interface RowConfig {
  height: number;
}

function getPosterConfig(): RowConfig[] {
  const w = typeof window !== 'undefined' ? window.innerWidth : 390;
  const height = w < 480 ? 100 : w < 768 ? 130 : 160;
  return Array.from({ length: 5 }, () => ({ height }));
}

// How many posters fill a row (3:4 aspect ratio)
function countNeeded(h: number): number {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 390;
  const thumbW = Math.round(h * 0.714);
  return Math.ceil(vw / thumbW) + 2; // just enough to fill viewport + 2 buffer
}

// ── Static Poster Background (no animation) ───────────────────────────────────
const PosterBackground: React.FC = () => {
  const rows = useMemo(() => {
    const configs = getPosterConfig();
    return configs.map((cfg) => {
      const need = countNeeded(cfg.height);
      const pool = shuffle(POSTER_POOL);
      const out: string[] = [];
      while (out.length < need) out.push(...pool);
      return { height: cfg.height, images: out.slice(0, need) };
    });
  }, []); // computed once per mount — new random order every page load

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Poster rows — static grid filling the hero */}
      <div className="absolute inset-0 flex flex-col" style={{ gap: 0 }}>
        {rows.map((row, rowIdx) => {
          const thumbW = Math.round(row.height * 0.714);
          return (
            <div
              key={rowIdx}
              className="flex-1 overflow-hidden"
              style={{ display: 'flex', gap: 0, minHeight: 0 }}
            >
              {row.images.map((url, i) => (
                <img
                  key={`${rowIdx}-${i}`}
                  src={toThumbUrl(url)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={thumbW}
                  height={row.height}
                  style={{
                    width: thumbW,
                    height: '100%',
                    objectFit: 'cover',
                    flexShrink: 0,
                    display: 'block',
                    opacity: 0.28,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Edge fade masks */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: [
            'linear-gradient(to right,  #ffffff 0%, rgba(255,255,255,0.6) 6%, transparent 13%)',
            'linear-gradient(to left,   #ffffff 0%, rgba(255,255,255,0.6) 6%, transparent 13%)',
            'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.4) 6%, transparent 14%)',
            'linear-gradient(to top,    #ffffff 0%, rgba(255,255,255,0.4) 6%, transparent 14%)',
          ].join(', '),
        }}
      />
    </div>
  );
};

// ── Live Stats Widget ─────────────────────────────────────────────────────────
const LiveStats: React.FC = () => {
  const weekly = getWeeklyOrders();
  const live = getLiveOrdering(weekly);

  return (
    <div className="flex items-center gap-2 justify-center flex-wrap">
      <div className="flex items-center gap-2 bg-black/5 border border-black/10 rounded-xl px-3 py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulseDot shrink-0" />
        <span className="text-xs font-body font-semibold text-green-700 uppercase tracking-wider">
          {String(live).padStart(2, '0')} ordering now
        </span>
      </div>
      <div className="flex items-center gap-2 bg-black/5 border border-black/10 rounded-xl px-3 py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
        <span className="text-xs font-body font-semibold text-muted uppercase tracking-wider">
          {String(weekly).padStart(2, '0')} this week
        </span>
      </div>
    </div>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────
export const Hero: React.FC<{
  onShopNow: () => void;
  onExplore: () => void;
  isMainH1?: boolean;
}> = ({ onShopNow, onExplore, isMainH1 = true }) => {
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
      {/* 1. Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-surface" />

      {/* 2. Static poster mosaic — randomised fresh each page load */}
      <PosterBackground />

      {/* 3. Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* 4. Radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[260px] h-[260px] rounded-full opacity-[0.06] blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FACB15 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Foreground content */}
      <div className="relative z-10 text-center w-full max-w-lg mx-auto px-4 flex flex-col items-center gap-3 sm:gap-4">

        {/* Anniversary Sale banner — animated popup */}
        <SaleBanner />

        {isMainH1 ? (
          <h1
            className="font-display text-black leading-[1.08] tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}
          >
            Your Walls{' '}
            <span className="italic text-black underline decoration-primary decoration-4 underline-offset-4">Define You.</span>
          </h1>
        ) : (
          <h2
            className="font-display text-black leading-[1.08] tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}
          >
            Your Walls{' '}
            <span className="italic text-black underline decoration-primary decoration-4 underline-offset-4">Define You.</span>
          </h2>
        )}

        <p className="font-body text-muted text-sm sm:text-base max-w-[280px] sm:max-w-sm font-medium leading-relaxed">
          Premium posters at unbeatable prices.
          <span className="hidden sm:inline"> Transform your space today.</span>
        </p>

        <LiveStats />

        {/* CTA Buttons */}
        <div className="flex gap-2.5 w-full max-w-[300px] sm:max-w-none sm:w-auto">
          <button
            onClick={onShopNow}
            className="font-body flex-1 sm:flex-none sm:w-auto px-6 py-3 min-h-[44px] bg-primary text-black font-bold text-sm rounded-full transition-all duration-200 active:scale-95 hover:brightness-110 shadow-md shadow-primary/25"
          >
            Shop Posters
          </button>
          <button
            onClick={onExplore}
            className="font-body flex-1 sm:flex-none sm:w-auto px-6 py-3 min-h-[44px] font-semibold text-black rounded-full border border-black/15 bg-black/[0.04] backdrop-blur-sm hover:bg-black/10 active:scale-95 transition-all duration-200 text-sm"
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
            <span className="font-body text-[#15803d] font-semibold text-xs transition-colors duration-200">
              Customize your poster or frame
            </span>
            <span className="font-body text-[10px] text-[#15803d]/80 font-medium transition-colors duration-200">
              Posters Free · Frames from ₹349
            </span>
          </div>
        </a>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[11px] sm:text-xs font-body font-semibold text-muted uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-px bg-black/20" />Free Posters
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-px bg-black/20" />Premium Quality
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-px bg-black/20" />Fast Delivery
          </span>
        </div>

      </div>
    </section>
  );
};
