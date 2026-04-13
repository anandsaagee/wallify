import React, { useMemo } from 'react';
import { products } from '../data/products';

export const Hero: React.FC = () => {
  const heroPosters = useMemo(() => {
    return [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, 15);
  }, []);

  // Split into 5 columns for the track
  const columns = [
    { posters: heroPosters.slice(0, 3), offset: '-100px' },
    { posters: heroPosters.slice(3, 6), offset: '100px' },
    { posters: heroPosters.slice(6, 9), offset: '-50px' },
    { posters: heroPosters.slice(9, 12), offset: '50px' },
    { posters: heroPosters.slice(12, 15), offset: '-80px' },
  ];

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Animated Background Track */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 hero-track-rotate w-max min-w-[150vw] flex justify-center items-center gap-10 mask-hero-radial opacity-30 md:opacity-50 pointer-events-none">
          {columns.map((col, idx) => (
            <div 
              key={idx} 
              className="flex flex-col gap-10" 
              style={{ marginTop: col.offset }}
            >
              {col.posters.map((poster, pIdx) => (
                <div 
                  key={poster.id} 
                  className="w-[200px] md:w-[240px] aspect-[3/4] rounded-premium overflow-hidden border border-white/10 shadow-2xl reveal-fade"
                  style={{ animationDelay: `${(idx + pIdx) * 0.1}s` }}
                >
                  <img 
                    src={poster.image} 
                    alt={poster.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary text-xs font-black tracking-widest uppercase mb-4">
          ✨ Premium Poster Collective
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
          ART FOR THE <br />
          <span className="text-primary">MODERN</span> SPACE<span className="text-primary">.</span>
        </h1>
        <p className="text-muted text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
          Museum-grade fine art prints curated for enthusiasts. <br className="hidden md:block" />
          Transform your blank walls into a masterpiece.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <button 
            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
            className="px-10 py-4 btn-primary text-lg"
          >
            Explore Collection
          </button>
          <button className="px-10 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-all text-lg">
            Our Story
          </button>
        </div>
      </div>
    </section>
  );
};
