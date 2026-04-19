import React, { useMemo } from 'react';
import { products } from '../data/products';

export const Hero: React.FC = () => {
  // Limit to 8 posters on mobile to reduce paint cost
  const heroPosters = useMemo(() => {
    return [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
  }, []);

  // 4 columns on desktop, but the visual is still treated as decorative background
  const columns = [
    { posters: heroPosters.slice(0, 3), offset: '-80px' },
    { posters: heroPosters.slice(3, 6), offset: '80px' },
    { posters: heroPosters.slice(6, 8), offset: '-40px' },
    { posters: heroPosters.slice(8, 10), offset: '40px' },
  ];

  return (
    <section className="relative flex items-center justify-center overflow-hidden" style={{ height: '82vh', minHeight: 520 }}>
      {/* Animated Background Track — GPU-composited via translate3d */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 flex justify-center items-start gap-6 md:gap-10 mask-hero-radial"
          style={{
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            width: 'max-content',
            minWidth: '130vw',
            opacity: 0.25,
            willChange: 'transform',
          }}
        >
          {columns.map((col, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-6 md:gap-10"
              style={{ marginTop: col.offset }}
            >
              {col.posters.map((poster, pIdx) => (
                <div
                  key={poster.id}
                  className="overflow-hidden border border-white/10 shadow-xl rounded-xl"
                  style={{
                    width: 'clamp(120px, 18vw, 200px)',
                    aspectRatio: '3/4',
                    animationDelay: `${(idx + pIdx) * 0.08}s`,
                  }}
                >
                  <img
                    src={poster.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    style={{ willChange: 'auto' }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dark vignette for text legibility */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(10,10,10,0.85) 80%)',
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto flex flex-col items-center gap-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-primary text-[10px] font-black tracking-widest uppercase"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}>
          ✨ Premium Poster Collective
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
          ART FOR THE <br />
          <span className="text-primary">MODERN</span> SPACE<span className="text-primary">.</span>
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
            className="px-8 py-4 font-black text-base rounded-full transition-all active:scale-95"
            style={{ background: '#FACB15', color: '#000' }}
          >
            Explore Collection
          </button>
          <button
            className="px-8 py-4 font-bold text-white rounded-full hover:bg-white/10 active:scale-95 transition-all text-base border border-white/10"
            style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}
          >
            Our Story
          </button>
        </div>
      </div>
    </section>
  );
};
