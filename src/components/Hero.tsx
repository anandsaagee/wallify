import React from 'react';

export const Hero: React.FC<{ onShopNow: () => void; onExplore: () => void }> = ({
  onShopNow,
  onExplore,
}) => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-[85vh] sm:min-h-[90vh]">
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
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #FACB15 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-[0.15em]">
            Premium Poster Store
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.95] tracking-tight">
          Transform Your Walls{' '}
          <br className="hidden sm:block" />
          with{' '}
          <span className="relative">
            <span className="text-primary">Wallify</span>
            <span className="text-primary">.</span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-muted text-base sm:text-lg md:text-xl max-w-xl font-medium leading-relaxed">
          Premium posters at unbeatable prices.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
          <button
            onClick={onShopNow}
            className="px-8 py-4 bg-primary text-black font-black text-sm sm:text-base rounded-full transition-all duration-200 active:scale-95 hover:brightness-110 shadow-[0_8px_32px_rgba(250,203,21,0.25)]"
          >
            Shop Now
          </button>
          <button
            onClick={onExplore}
            className="px-8 py-4 font-bold text-white rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/10 active:scale-95 transition-all duration-200 text-sm sm:text-base"
          >
            Explore Collection
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center gap-6 sm:gap-8 mt-4 text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-8 h-[1px] bg-white/10" />
            <span>Free Posters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-[1px] bg-white/10" />
            <span>Premium Quality</span>
          </div>
          <div className="flex items-center gap-2 hidden sm:flex">
            <div className="w-8 h-[1px] bg-white/10" />
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
};
