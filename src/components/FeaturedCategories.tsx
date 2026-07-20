import React, { useMemo, useCallback } from 'react';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: string) => void;
}

const FEATURED = [
  { name: 'Abstract', sub: 'Modern Art' },
  { name: 'Anime', sub: 'Anime & Manga' },
  { name: 'Automotive', sub: 'Speed & Power' },
  { name: 'Football', sub: 'Football Legends' },
  { name: 'Hollywood', sub: 'Tinseltown Icons' },
  { name: 'Mollywood', sub: 'Cinema Icons' },
  { name: 'Music', sub: 'Rock & Pop Vibes' },
  { name: 'Quotes', sub: 'Words That Inspire' },
  { name: 'Spiritual', sub: 'Calm & Peace' },
  { name: 'Tamil', sub: 'Kollywood Icons' },
] as const;

const scrollToCollection = () => {
  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
};

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const thumbnails = useMemo(() => {
    const map: Record<string, string> = {};
    FEATURED.forEach(({ name }) => {
      // Use the first product in each category for stable, consistent thumbnails
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
    <section className="py-8" aria-label="Browse by Category">
      <div className="px-4 mb-4">
        <h2 className="text-2xl font-black text-white tracking-tight">Browse by Category</h2>
        <p className="text-xs text-muted mt-1 font-medium">Tap a vibe to explore</p>
      </div>

      {/* Responsive grid: 1 col at 320px, 2 col default, 3 on sm, 4 on md */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 px-4">
        {FEATURED.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleSelect(cat.name)}
            style={{ contain: 'layout paint' }}
            className="group relative h-48 w-full rounded-2xl overflow-hidden border border-white/10 text-left transition-transform duration-200 ease-out hover:scale-105 active:scale-95 will-change-transform"
          >
            <div className="absolute top-2 left-2 z-20 bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter sm:top-3 sm:left-3 sm:text-[10px] sm:px-3 sm:py-1">
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
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-4">
              <h3 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-tighter leading-tight">
                {cat.name}
              </h3>
              <div className="flex items-center gap-1 text-primary font-bold text-[10px] sm:text-xs mt-1 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                {cat.sub}
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
