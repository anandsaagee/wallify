import React, { memo, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { ITEMS_PER_PAGE } from '../data/config';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';

export interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
}

// ─── Shared IntersectionObserver hook ────────────────────────────────────────
// One observer for the entire page — far more efficient than one per card.
type ObserverCallback = (visible: boolean) => void;

function useIntersectionObserver(
  ref: React.RefObject<Element>,
  callback: ObserverCallback,
  options?: IntersectionObserverInit
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => callbackRef.current(entry.isIntersecting),
      options
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard: React.FC<{ product: Product; onClick: () => void; index: number }> = memo(
  ({ product, onClick, index }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const isBestSeller = useMemo(() => {
      // Deterministic randomness based on ID for consistency within a session
      const numId = parseInt(product.id.replace(/\D/g, ''), 10);
      return !isNaN(numId) && numId > 0 && numId % 12 === 0;
    }, [product.id]);

    const isHotDeal = useMemo(() => {
      const numId = parseInt(product.id.replace(/\D/g, ''), 10);
      // Let's make hot deals different from best sellers
      return !isNaN(numId) && numId > 0 && (numId + 3) % 15 === 0;
    }, [product.id]);

    // Memoize the delay string so it never triggers a style recalc on re-render
    const animDelay = useMemo(() => `${Math.min(index, 12) * 30}ms`, [index]);

    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-label={`View ${product.title}`}
        className="group cursor-pointer flex flex-col gap-1.5 active:scale-[0.97] transition-transform duration-150 will-change-transform"
        style={{ animationDelay: animDelay, contain: 'layout style paint' }}
      >
        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-white/5 relative">
          {!loaded && !error && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" aria-hidden="true" />
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface">
              <span className="text-xs text-muted">Image unavailable</span>
            </div>
          )}
          <OptimizedImage
            src={product.image}
            alt={product.title}
            priority={index < 6}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            containerClassName="absolute inset-0 w-full h-full"
            className={`transition-transform duration-500 will-change-transform group-hover:scale-110 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-150" />

          {isBestSeller && (
            <div className="absolute top-2 left-2 z-10 bg-primary text-black text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight shadow-md flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className="hidden sm:inline">Best Seller</span>
              <span className="sm:hidden">Hot</span>
            </div>
          )}

          {isHotDeal && !isBestSeller && (
            <div className="absolute top-2 left-2 z-10 bg-rose-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight shadow-md flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3 fill-current" />
              <span>Hot Deal</span>
            </div>
          )}
        </div>

        <div className="px-0.5">
          <span className="text-[9px] text-muted font-bold uppercase tracking-wider truncate block">
            {product.category}
          </span>
          <h3 className="text-xs font-semibold text-white truncate leading-tight">
            {product.title}
          </h3>
        </div>
      </div>
    );
  }
);


ProductCard.displayName = 'ProductCard';

// ─── ProductGrid ──────────────────────────────────────────────────────────────
interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [products]);

  const pageProducts = useMemo(() => {
    return products.slice(0, displayedCount);
  }, [products, displayedCount]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback(
    (visible: boolean) => {
      if (visible && displayedCount < products.length) {
        setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, products.length));
      }
    },
    [displayedCount, products.length]
  );

  // Pre-load images 600px before they enter the viewport — reduces perceived load time
  const observerOptions = useMemo(() => ({ rootMargin: '600px' }), []);
  
  useIntersectionObserver(
    sentinelRef as React.RefObject<Element>,
    observerCallback,
    observerOptions
  );

  // Memoize individual card click handlers to avoid creating new fns on every render
  const cardClickHandlers = useMemo(
    () => new Map(pageProducts.map((p) => [p.id, () => onProductClick(p)])),
    [pageProducts, onProductClick]
  );

  return (
    <div
      id="collection"
      style={{ overscrollBehavior: 'contain' }}
      className="overscroll-contain"
    >
      {/* AnimatePresence fades the grid out/in on initial load or category change */}
      <AnimatePresence mode="wait">
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 px-4 sm:px-5 lg:px-7"
        >
          {pageProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={cardClickHandlers.get(product.id)!}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div ref={sentinelRef} className="h-10 w-full mt-4" aria-hidden="true" />
      
      {displayedCount >= products.length && products.length > 0 && (
        <p className="text-center text-[10px] text-muted font-medium mt-3 mb-8">
          Showing all {products.length} posters
        </p>
      )}
    </div>
  );
};
