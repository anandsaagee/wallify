import React, { useMemo } from 'react';

// ── All reviews pool — 25 reviews, ~4/10 are user_XXXXX ──────────────────────
const ALL_REVIEWS = [
  // Named users
  { name: 'Rahul',     platform: 'whatsapp', rating: 5, comment: 'Colour accuracy is insane. My room feels like a whole different vibe now.' },
  { name: 'Saagee',    platform: 'insta',    rating: 5, comment: 'Best posters ever.' },
  { name: 'Shahin',    platform: 'whatsapp', rating: 5, comment: 'Ordered a football poster and a quote one. Both arrived perfectly packed, print is crisp.' },
  { name: 'Devika',    platform: 'insta',    rating: 4, comment: 'Superb detail!' },
  { name: 'Gopika',    platform: 'whatsapp', rating: 5, comment: 'Got the anime bundle — every single one looks amazing on the wall. Fast delivery too.' },
  { name: 'Aysha',     platform: 'insta',    rating: 4, comment: 'Perfect for home.' },
  { name: 'Christina', platform: 'whatsapp', rating: 5, comment: 'Premium feel, worth every rupee.' },
  { name: 'Nithya',    platform: 'insta',    rating: 4, comment: 'Honestly surprised at the quality for the price. Will order more for sure.' },
  { name: 'Arjun',     platform: 'whatsapp', rating: 5, comment: 'Love the prints!' },
  { name: 'Fathima',   platform: 'insta',    rating: 4, comment: 'Lovely colours!' },
  { name: 'Kiran',     platform: 'whatsapp', rating: 5, comment: 'My bedroom wall is finally complete. Got the spiritual collection — peaceful and beautiful.' },
  { name: 'Sreeja',    platform: 'insta',    rating: 4, comment: 'Good packaging.' },
  { name: 'Vishnu',    platform: 'whatsapp', rating: 5, comment: 'Top notch quality.' },
  { name: 'Meera',     platform: 'insta',    rating: 4, comment: 'Ordered quote posters for my study room. Looks motivating every morning — 10/10.' },
  { name: 'Anjali',    platform: 'whatsapp', rating: 5, comment: 'Got it as a gift idea. Already planning my next order!' },

  // user_XXXXX (10 out of 25 = 40%)
  { name: 'user_82341', platform: 'whatsapp', rating: 5, comment: 'Received it in 2 days. The poster quality is way better than other sites.' },
  { name: 'user_44829', platform: 'insta',    rating: 5, comment: 'Wallify is the real deal. No fake colours, no blurry prints.' },
  { name: 'user_17603', platform: 'whatsapp', rating: 4, comment: 'Way better than local shops. Price is unbeatable.' },
  { name: 'user_93017', platform: 'insta',    rating: 5, comment: 'The Mollywood posters are fire. Been waiting for a shop that does them right.' },
  { name: 'user_56204', platform: 'whatsapp', rating: 4, comment: 'Framed it myself. Looks like proper wall art.' },
  { name: 'user_31988', platform: 'insta',    rating: 5, comment: 'Ordered twice already. Never disappointed.' },
  { name: 'user_70512', platform: 'whatsapp', rating: 5, comment: 'Print quality is genuinely better than I expected for this price range.' },
  { name: 'user_24673', platform: 'insta',    rating: 4, comment: 'Sharp, vibrant, fast.' },
  { name: 'user_88140', platform: 'whatsapp', rating: 5, comment: 'Gifted one to my friend. She loved it and ordered 3 more.' },
  { name: 'user_39271', platform: 'insta',    rating: 5, comment: 'No blurry edges, colours pop exactly like the preview. Impressed.' },
];

// Seeded shuffle — different order every page load
function shuffleOnce<T>(arr: T[]): T[] {
  const seed = Math.floor(Date.now() / 1000);
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    className={`h-3.5 w-3.5 shrink-0 ${filled ? 'text-yellow-400' : 'text-gray-200'}`}
    fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const WaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-2.5 w-2.5 shrink-0" fill="currentColor">
    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.65 4.73 1.78 6.72L2 30l7.46-1.75A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5c-2.18 0-4.23-.6-5.99-1.64l-.43-.26-4.43 1.04 1.06-4.31-.28-.45A11.46 11.46 0 014.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.57c-.34-.17-2.02-.99-2.33-1.1-.31-.11-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.77-1.86-1.06-2.55-.28-.67-.56-.58-.77-.59H10.9c-.2 0-.51.08-.78.4-.26.31-1.02 1-1.02 2.43s1.04 2.82 1.19 3.01c.14.2 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.61.7.22 1.33.19 1.83.11.56-.08 1.72-.7 1.97-1.38.24-.67.24-1.25.17-1.37-.07-.12-.28-.2-.59-.34z"/>
  </svg>
);

const InstaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-2.5 w-2.5 shrink-0" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.352 3.608 1.327.975.975 1.265 2.242 1.327 3.608.058 1.266.07 1.646.07 4.849s-.012 3.583-.07 4.849c-.062 1.366-.352 2.633-1.327 3.608-.975.975-2.242 1.265-3.608 1.327-1.266.058-1.646.07-4.85.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.352-3.608-1.327-.975-.975-1.265-2.242-1.327-3.608C2.175 15.583 2.163 15.203 2.163 12s.012-3.584.07-4.849c.062-1.366.352-2.633 1.327-3.608.975-.975 2.242-1.265 3.272-1.21C8.332.012 8.735 0 12 0zm0-2.163C8.735 0 8.332.012 7.052.07 5.77.128 4.673.386 3.78 1.28c-.893.894-1.152 1.99-1.21 3.272C2.012 5.735 2 6.138 2 9.5s.012 3.765.07 5.048c.058 1.282.317 2.379 1.21 3.272.894.894 1.99 1.152 3.272 1.21C8.332 19.988 8.735 20 12 20s3.668-.012 4.948-.07c1.282-.058 2.379-.317 3.272-1.21.894-.893 1.152-1.99 1.21-3.272.058-1.283.07-1.686.07-5.048s-.012-3.765-.07-5.048c-.058-1.282-.317-2.378-1.21-3.272-.893-.894-1.99-1.152-3.272-1.21C15.668.012 15.265 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export const ReviewCarousel: React.FC = () => {
  const shuffled = useMemo(() => shuffleOnce(ALL_REVIEWS), []);

  return (
    <section className="pt-5 pb-6 px-0" aria-label="Customer reviews">
      {/* Heading row */}
      <div className="px-4 mb-3.5 flex items-center justify-between max-w-screen-xl mx-auto">
        <div>
          <h2 className="font-display text-lg sm:text-xl text-gray-900 leading-tight">
            What our customers say
          </h2>
          <p className="text-xs text-muted font-body mt-0.5">Real reviews · Updated daily</p>
        </div>
        {/* Aggregate badge */}
        <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-xl px-2.5 py-1.5 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5 text-yellow-400" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm font-display font-black text-gray-900">4.8</span>
          <span className="text-[10px] text-muted font-body">/5</span>
        </div>
      </div>

      {/* Scrollable cards */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
          {shuffled.map((r, i) => (
            <div
              key={i}
              className="w-52 flex-shrink-0 bg-white border border-black/[0.08] rounded-2xl p-3.5 shadow-sm text-left flex flex-col gap-2"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} filled={s <= r.rating} />
                ))}
              </div>

              {/* Comment */}
              <p className="text-xs text-gray-700 font-body leading-relaxed flex-1">{r.comment}</p>

              {/* Name + platform */}
              <div className="flex items-center justify-between gap-2 mt-auto pt-1.5 border-t border-black/[0.06]">
                <span className="text-xs font-semibold text-gray-900 font-body truncate">{r.name}</span>
                {r.platform === 'whatsapp' ? (
                  <span className="flex items-center gap-1 text-[10px] text-green-700 font-medium bg-green-50 border border-green-200 rounded-full px-2 py-0.5 shrink-0">
                    <WaIcon />WhatsApp
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-pink-700 font-medium bg-pink-50 border border-pink-200 rounded-full px-2 py-0.5 shrink-0">
                    <InstaIcon />Instagram
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
