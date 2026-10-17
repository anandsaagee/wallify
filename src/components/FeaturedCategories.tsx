import React, { useMemo, useCallback } from 'react';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { SIZES } from '../data/config';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: string) => void;
}

// ── Primary categories (large cards) ─────────────────────────────────────────
const PRIMARY = [
  { name: 'Anime',      label: 'Anime Posters',  sub: 'Anime & Manga',    emoji: '⚡' },
  { name: 'Hollywood',  label: 'Movie Posters',   sub: 'Hollywood Hits',   emoji: '🎬' },
  { name: 'Automotive', label: 'Car Posters',     sub: 'Speed & Power',    emoji: '🏎️' },
] as const;

// ── Secondary categories (small grid) ────────────────────────────────────────
const SECONDARY = [
  { name: 'Mollywood', label: 'Mollywood', sub: 'Cinema Icons'        },
  { name: 'Tamil',     label: 'Kollywood', sub: 'Tamil Icons'         },
  { name: 'Football',  label: 'Football',  sub: 'Football Legends'    },
  { name: 'Music',     label: 'Music',     sub: 'Rock & Pop Vibes'    },
  { name: 'Abstract',  label: 'Abstract',  sub: 'Modern Art'          },
  { name: 'Quotes',    label: 'Quotes',    sub: 'Words That Inspire'  },
  { name: 'Spiritual', label: 'Spiritual', sub: 'Calm & Peace'        },
] as const;

const scrollToCollection = () => {
  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
};

// Cheapest poster price for display
const FROM_PRICE = SIZES[0].price; // A6 = ₹29

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  /** Build thumbnail map: category name → first product image */
  const thumbnails = useMemo(() => {
    const map: Record<string, string> = {};
    const allCats = [
      ...PRIMARY.map((c) => c.name),
      ...SECONDARY.map((c) => c.name),
    ];
    allCats.forEach((name) => {
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
    <section className="py-5 sm:py-8" aria-label="Browse by Category">
      {/* Section header */}
      <div className="px-4 mb-4">
        <h2 className="font-display text-xl sm:text-2xl text-white">Shop by Category</h2>
        <p className="font-body text-[11px] text-muted mt-0.5 font-medium">
          Starting from <span className="text-primary font-black">₹{FROM_PRICE}</span> — tap to explore
        </p>
      </div>

      {/* ── Primary: 3 big cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-2">
        {PRIMARY.map((cat) => (
          <a
            key={cat.name}
            href={`/category/${cat.name.toLowerCase()}`}
            onClick={(e) => { e.preventDefault(); handleSelect(cat.name); }}
            style={{ contain: 'layout paint' }}
            className="group relative h-44 sm:h-56 w-full rounded-2xl overflow-hidden border border-white/10 transition-transform duration-200 ease-out sm:hover:scale-[1.03] active:scale-95 will-change-transform touch-manipulation block"
          >
            {/* Price badge */}
            <div className="absolute top-2 right-2 z-20 bg-black/70 text-primary text-[9px] font-black px-2 py-0.5 rounded-full border border-primary/30 backdrop-blur-sm">
              from ₹{FROM_PRICE}
            </div>

            {/* Shop badge */}
            <div className="absolute top-2 left-2 z-20 bg-primary text-black text-[9px] font-body font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {cat.emoji}
            </div>

            {thumbnails[cat.name] && (
              <OptimizedImage
                src={thumbnails[cat.name]}
                alt={`${cat.label} wall art`}
                containerClassName="absolute inset-0 w-full h-full"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-3">
              <h3 className="font-display text-xs sm:text-sm text-white leading-tight">
                {cat.label}
              </h3>
              <div className="flex items-center gap-1 text-primary font-body font-semibold text-[9px] sm:text-[10px] mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                {cat.sub}
                <ArrowRight className="w-2.5 h-2.5 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* ── Secondary: horizontal scroll row ─────────────────────────── */}
      <div className="px-4">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {SECONDARY.map((cat) => (
            <a
              key={cat.name}
              href={`/category/${cat.name.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); handleSelect(cat.name); }}
              style={{ contain: 'layout paint', minWidth: '110px' }}
              className="group relative h-24 sm:h-28 rounded-xl overflow-hidden border border-white/10 transition-transform duration-200 ease-out active:scale-95 will-change-transform touch-manipulation shrink-0 flex-none"
            >
              {thumbnails[cat.name] && (
                <OptimizedImage
                  src={thumbnails[cat.name]}
                  alt={`${cat.label} posters`}
                  containerClassName="absolute inset-0 w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2">
                <h3 className="font-display text-[10px] sm:text-xs text-white leading-tight uppercase">
                  {cat.label}
                </h3>
                <p className="text-[8px] text-primary/80 font-body font-semibold mt-px hidden sm:block">
                  {cat.sub}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
