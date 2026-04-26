import React, { useMemo } from 'react';
import { products } from '../data/products';
import { TrendingUp } from 'lucide-react';

// Fisher-Yates shuffle for uniform randomness
function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const COLUMN_SLICES: [number, number, string][] = [
  [0, 3, '-80px'],
  [3, 6, '80px'],
  [6, 8, '-40px'],
  [8, 10, '40px'],
];

// Mark certain poster indices as "best sellers"
const BEST_SELLER_INDICES = new Set([1, 4, 7]);

export const Hero: React.FC = () => {
  const heroPosters = useMemo(() => shuffled(products).slice(0, 10), []);

  let globalIndex = 0;

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: '82vh', minHeight: 520 }}
      aria-label="Hero"
    >
      {/* Decorative poster grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 flex justify-center items-start gap-6 md:gap-10 mask-hero-radial"
          style={{
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            width: 'max-content',
            minWidth: '130vw',
            opacity: 0.25,
          }}
        >
          {COLUMN_SLICES.map(([start, end, offset], idx) => (
            <div
              key={idx}
              className="flex flex-col gap-6 md:gap-10"
              style={{ marginTop: offset }}
            >
              {heroPosters.slice(start, end).map((poster, pIdx) => {
                const currentGlobalIndex = globalIndex++;
                const isBestSeller = BEST_SELLER_INDICES.has(currentGlobalIndex);

                return (
                  <div
                    key={poster.id}
                    className="relative overflow-hidden border border-white/10 shadow-xl rounded-xl"
                    style={{
                      width: 'clamp(120px, 18vw, 200px)',
                      aspectRatio: '3/4',
                    }}
                  >
                    <img
                      src={poster.image}
                      alt=""
                      loading={idx === 0 && pIdx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    {/* Best Seller badge */}
                    {isBestSeller && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary text-black text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tight shadow-lg">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Best Seller
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(10,10,10,0.85) 80%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto flex flex-col items-center gap-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-primary text-[10px] font-black tracking-widest uppercase">
          ✨ Premium Poster Collective
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
          ART FOR THE <br />
          <span className="text-primary">MODERN</span> SPACE
          <span className="text-primary">.</span>
        </h1>

        <p className="text-muted text-sm md:text-xl max-w-2xl font-medium leading-relaxed px-2">
          Museum-grade fine art prints curated for enthusiasts.{' '}
          <br className="hidden md:block" />
          Transform your blank walls into a masterpiece.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
          <button
            onClick={() =>
              document
                .getElementById('category-filter-section')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-8 py-4 bg-primary text-black font-black text-base rounded-full transition-all duration-200 active:scale-95 hover:brightness-110"
          >
            Explore Collection
          </button>
          <button className="px-8 py-4 font-bold text-white rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 active:scale-95 transition-all duration-200 text-base">
            Our Story
          </button>
        </div>
      </div>
    </section>
  );
};
