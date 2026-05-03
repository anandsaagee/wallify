import React, { useMemo, useCallback } from 'react';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: string) => void;
}

const FEATURED = [
  { name: 'Aesthetic', sub: 'Modern Minimalist' },
  { name: 'Anime', sub: 'Anime & Manga' },
  { name: 'Automotive', sub: 'Cars & Speed' },
  { name: 'Classic Cars', sub: 'Vintage Machines' },
  { name: 'Football', sub: 'Football Legends' },
  { name: 'Hollywood', sub: 'Cinema Icons' },
] as const;

const scrollToCollection = () => {
  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
};

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const thumbnails = useMemo(() => {
    const map: Record<string, string> = {};
    FEATURED.forEach(({ name }) => {
      const catProducts = products.filter((p) => p.category === name);
      if (catProducts.length > 0) {
        map[name] = catProducts[Math.floor(Math.random() * catProducts.length)].image;
      }
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

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-2 hide-scrollbar">
        {FEATURED.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleSelect(cat.name)}
            className="shrink-0 snap-start relative overflow-hidden rounded-2xl border border-white/10 active:scale-95 transition-transform duration-150 w-[140px] h-[190px]"
          >
            {thumbnails[cat.name] && (
              <img
                src={thumbnails[cat.name]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute top-2.5 left-2.5 bg-primary text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight">
              Shop
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white font-black text-xs uppercase leading-tight tracking-tighter">
                {cat.name}
              </p>
              <p className="text-primary text-[9px] font-bold opacity-80 mt-0.5 flex items-center gap-1">
                {cat.sub}
                <ArrowRight className="w-2.5 h-2.5" />
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 px-4">
        {FEATURED.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleSelect(cat.name)}
            className="group relative h-[350px] rounded-2xl overflow-hidden border border-white/10 cursor-pointer text-left"
          >
            <div className="absolute top-4 left-4 z-20 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
              Featured
            </div>
            {thumbnails[cat.name] && (
              <img
                src={thumbnails[cat.name]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                {cat.name}
              </h3>
              <div className="flex items-center gap-2 text-primary font-bold text-sm mt-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                {cat.sub}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
