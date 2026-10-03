import React, { useMemo, useCallback } from 'react';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: string) => void;
}

const FEATURED = [
  { name: 'Abstract',   sub: 'Modern Art' },
  { name: 'Anime',      sub: 'Anime & Manga' },
  { name: 'Automotive', sub: 'Speed & Power' },
  { name: 'Football',   sub: 'Football Legends' },
  { name: 'Hollywood',  sub: 'Tinseltown Icons' },
  { name: 'Mollywood',  sub: 'Cinema Icons' },
  { name: 'Music',      sub: 'Rock & Pop Vibes' },
  { name: 'Quotes',     sub: 'Words That Inspire' },
  { name: 'Spiritual',  sub: 'Calm & Peace' },
  { name: 'Tamil',      sub: 'Kollywood Icons' },
] as const;

const scrollToCollection = () => {
  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
};

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const thumbnails = useMemo(() => {
    const map: Record<string, string> = {};
    FEATURED.forEach(({ name }) => {
      const first = products.find((p) => p.category === name);
      if (first) map[name] = first.image;
    });
    return map;
  }, []);

  const handleSelect = useCallback(
    (name: string) => {
      onSelectCategory(name);
      scrollToCollection();
    },
    [onSelectCategory]
  );

  return (
    <section className="py-6 sm:py-8" aria-label="Browse by Category">
      <div className="px-4 mb-4">
        <h2 className="font-display text-xl sm:text-2xl text-white">Browse by Category</h2>
        <p className="font-body text-[11px] text-muted mt-1 font-medium">Tap a vibe to explore</p>
      </div>

      {/* Responsive grid: 2 cols on mobile, 3 on sm, 4 on md */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 px-4">
        {FEATURED.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleSelect(cat.name)}
            style={{ contain: 'layout paint' }}
            className="group relative h-40 sm:h-48 w-full rounded-2xl overflow-hidden border border-white/10 text-left transition-transform duration-200 ease-out sm:hover:scale-[1.03] active:scale-95 will-change-transform touch-manipulation"
          >
            {/* Shop badge */}
            <div className="absolute top-2 left-2 z-20 bg-primary text-black text-[9px] font-body font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
              Shop
            </div>

            {thumbnails[cat.name] && (
              <OptimizedImage
                src={thumbnails[cat.name]}
                alt={cat.name}
                containerClassName="absolute inset-0 w-full h-full"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-3">
              <h3 className="font-display text-sm sm:text-base text-white uppercase leading-tight">
                {cat.name}
              </h3>
              <div className="flex items-center gap-1 text-primary font-body font-semibold text-[10px] sm:text-xs mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                {cat.sub}
                <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
