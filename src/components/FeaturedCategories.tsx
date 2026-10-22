import React, { useMemo, useCallback, useRef, useState } from 'react';
import { products } from '../data/products';
import { ArrowRight, ChevronRight } from 'lucide-react';
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
  /** Build thumbnail map: category name → random product image for that category on each visit */
  const thumbnails = useMemo(() => {
    const map: Record<string, string> = {};
    const allCats = [
      ...PRIMARY.map((c) => c.name),
      ...SECONDARY.map((c) => c.name),
    ];
    allCats.forEach((name) => {
      const catProducts = products.filter(
        (p) => p.category.toLowerCase() === name.toLowerCase() && p.image
      );
      if (catProducts.length > 0) {
        const randomIndex = Math.floor(Math.random() * catProducts.length);
        map[name] = catProducts[randomIndex].image;
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

  const secondaryRef = useRef<HTMLDivElement>(null);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);

  const handleSecondaryScroll = useCallback(() => {
    if (scrollHintVisible) setScrollHintVisible(false);
  }, [scrollHintVisible]);

  return (
    <section className="py-5 sm:py-8" aria-label="Browse by Category">
      {/* Section header */}
      <div className="px-4 mb-4">
        <h2 className="font-display text-xl sm:text-2xl text-black">Shop by Category</h2>
        <p className="font-body text-[11px] text-black/70 mt-0.5 font-medium">
          Starting from <span className="bg-primary text-black font-black px-1.5 py-0.5 rounded text-[10px]">₹{FROM_PRICE}</span> · tap to explore
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
              <h3 className="font-display text-xs sm:text-sm text-white group-hover:text-primary transition-colors leading-tight">
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

      {/* ── Secondary: horizontal scroll row with scroll hint ───────── */}
      <div className="px-4 relative">
        {/* Right-edge scroll nudge — fades out once user scrolls */}
        {scrollHintVisible && (
          <div
            className="absolute right-4 top-0 bottom-0 z-10 flex items-center justify-end pointer-events-none"
            style={{
              width: 72,
              background: 'linear-gradient(to right, transparent 0%, rgba(245,245,245,0.9) 50%, #f5f5f5 100%)',
            }}
          >
            <div className="flex flex-col items-center gap-0.5 pr-1.5">
              <ChevronRight className="w-4 h-4 text-black/50 animate-bounce" style={{ animationDuration: '1.1s' }} />
              <span className="text-[8px] text-black/30 font-body font-semibold uppercase tracking-widest">more</span>
            </div>
          </div>
        )}

        <div
          ref={secondaryRef}
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          onScroll={handleSecondaryScroll}
        >
          {SECONDARY.map((cat) => (
            <a
              key={cat.name}
              href={`/category/${cat.name.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); handleSelect(cat.name); }}
              style={{ contain: 'layout paint', minWidth: '110px' }}
              className="group relative h-24 sm:h-28 rounded-xl overflow-hidden border border-black/10 transition-transform duration-200 ease-out active:scale-95 will-change-transform touch-manipulation shrink-0 flex-none"
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
                <h3 className="font-display text-[10px] sm:text-xs text-white group-hover:text-primary transition-colors leading-tight uppercase">
                  {cat.label}
                </h3>
                <p className="text-[8px] text-primary font-body font-semibold mt-px hidden sm:block">
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
