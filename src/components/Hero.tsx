import React, { useState, useEffect, useMemo } from 'react';

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

// ── Poster pool — curated diverse sample across all categories ────────────────
// Cloudinary transforms injected at runtime: w_90,h_126,c_fill,q_auto:low,f_auto
// Each image ~2-4 KB
const POSTER_POOL = [
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

// Inject Cloudinary transforms: tiny poster thumb, ~2-5 KB each
function toThumbUrl(url: string): string {
  return url.replace(
    '/image/upload/',
    '/image/upload/w_90,h_126,c_fill,q_auto:low,f_auto/'
  );
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Responsive poster-size config ─────────────────────────────────────────────
// Tightly packed: gap=2px on all breakpoints, fills every pixel
function getPosterConfig() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 390;
  if (w < 480) {
    return [
      { height: 76,  gap: 2, offset:   0, speed: 28 },
      { height: 64,  gap: 2, offset:  -8, speed: 20, reverse: true },
      { height: 82,  gap: 2, offset:   6, speed: 34 },
    ];
  }
  if (w < 768) {
    return [
      { height: 96,  gap: 2, offset:   0, speed: 32 },
      { height: 80,  gap: 2, offset: -10, speed: 22, reverse: true },
      { height: 104, gap: 2, offset:   8, speed: 38 },
    ];
  }
  return [
    { height: 114, gap: 2, offset:   0, speed: 38 },
    { height: 96,  gap: 2, offset: -14, speed: 26, reverse: true },
    { height: 122, gap: 2, offset:  10, speed: 44 },
  ];
}

// How many images fill a row? Poster w ≈ h × 0.714 (3:4 ratio)
// ×3 to fully cover even ultra-wide displays (we use translate to loop)
function countNeeded(h: number, gap: number): number {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 390;
  const thumbW = Math.round(h * 0.714) + gap;
  return Math.ceil((vw * 3) / thumbW) + 4; // small safety buffer
}

// ── Poster Background ──────────────────────────────────────────────────────────
// 3 rows, tightly packed, each row scrolls at its own speed in opposite directions.
// Images lazy-loaded so they never affect LCP.
const PosterBackground: React.FC = () => {
  const [rowConfigs] = useState(() => getPosterConfig());

  const rows = useMemo(() => {
    const base = shuffle(POSTER_POOL);
    return rowConfigs.map((cfg, idx) => {
      const s = idx === 0 ? base : shuffle([...base]);
      const need = countNeeded(cfg.height, cfg.gap);
      const out: string[] = [];
      while (out.length < need) out.push(...s);
      return out.slice(0, need);
    });
  }, [rowConfigs]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Inject keyframe animations */}
      <style>{`
        @keyframes posterScrollL {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes posterScrollR {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      {/* Poster rows */}
      <div
        className="absolute inset-0 flex flex-col justify-around"
        style={{ padding: '2px 0' }}
      >
        {rows.map((row, rowIdx) => {
          const cfg = rowConfigs[rowIdx];
          const thumbW = Math.round(cfg.height * 0.714);
          const isReverse = (cfg as { reverse?: boolean }).reverse;
          // Duplicate row for seamless infinite loop
          const doubled = [...row, ...row];

          return (
            <div
              key={rowIdx}
              className="overflow-hidden"
              style={{ marginTop: cfg.offset, flexShrink: 0 }}
            >
              <div
                style={{
                  display: 'flex',
                  columnGap: cfg.gap,
                  opacity: 0.18,
                  width: 'max-content',
                  animation: `${isReverse ? 'posterScrollR' : 'posterScrollL'} ${cfg.speed}s linear infinite`,
                  willChange: 'transform',
                }}
              >
                {doubled.map((url, i) => (
                  <img
                    key={`${rowIdx}-${i}`}
                    src={toThumbUrl(url)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={thumbW}
                    height={cfg.height}
                    style={{
                      width: thumbW,
                      height: cfg.height,
                      objectFit: 'cover',
                      borderRadius: 3,
                      flexShrink: 0,
                      display: 'block',
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edge fade masks */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: [
            'linear-gradient(to right,  #0a0a0a 0%, rgba(10,10,10,0.75) 7%, transparent 16%)',
            'linear-gradient(to left,   #0a0a0a 0%, rgba(10,10,10,0.75) 7%, transparent 16%)',
            'linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.55) 9%, transparent 20%)',
            'linear-gradient(to top,    #0a0a0a 0%, rgba(10,10,10,0.55) 9%, transparent 20%)',
          ].join(', '),
        }}
      />
    </div>
  );
};

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
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulseDot shrink-0" />
        <span className="text-[10px] font-body font-semibold text-green-400 uppercase tracking-wider">
          {String(liveCount).padStart(2, '0')} ordering now
        </span>
      </div>

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
      {/* 1. Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-surface" />

      {/* 2. Poster mosaic — random, tightly packed, animated */}
      <PosterBackground />

      {/* 3. Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.025]" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* 4. Radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full opacity-12 blur-[90px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FACB15 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Foreground content */}
      <div className="relative z-10 text-center w-full max-w-lg mx-auto px-4 flex flex-col items-center gap-3 sm:gap-4">

        {isMainH1 ? (
          <h1
            className="font-display text-white leading-[1.08] tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}
          >
            Your Walls{' '}
            <span className="text-primary">Define You.</span>
          </h1>
        ) : (
          <h2
            className="font-display text-white leading-[1.08] tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}
          >
            Your Walls{' '}
            <span className="text-primary">Define You.</span>
          </h2>
        )}

        <p className="font-body text-muted text-xs sm:text-sm max-w-[260px] sm:max-w-xs font-medium leading-relaxed">
          Premium posters at unbeatable prices.
        </p>

        <LiveStats />

        {/* CTA Buttons */}
        <div className="flex gap-2.5 w-full max-w-[300px] sm:max-w-none sm:w-auto">
          <button
            onClick={onShopNow}
            className="font-body flex-1 sm:flex-none sm:w-auto px-6 py-3 min-h-[44px] bg-primary text-black font-bold text-sm rounded-full transition-all duration-200 active:scale-95 hover:brightness-110 shadow-[0_8px_28px_rgba(250,203,21,0.3)]"
          >
            Shop Posters
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
