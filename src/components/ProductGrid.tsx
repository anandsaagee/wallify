import React, { memo, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
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
  }, [ref, options?.rootMargin, options?.threshold]);
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard: React.FC<{ product: Product; onClick: () => void; index: number }> = memo(
  ({ product, onClick, index }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const observerOptions = useMemo(() => ({ rootMargin: '200px' }), []);
    useIntersectionObserver(cardRef as React.RefObject<Element>, (visible) => {
      if (visible) setIsVisible(true);
    }, observerOptions);

    const isBestSeller = useMemo(() => {
      const numId = parseInt(product.id.replace(/\D/g, ''), 10);
      return !isNaN(numId) && numId > 0 && numId % 9 === 0;
    }, [product.id]);

    return (
      <div
        ref={cardRef}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-label={`View ${product.title}`}
        className="group cursor-pointer flex flex-col gap-1.5 active:scale-[0.97] transition-transform duration-150 will-change-transform"
        style={{ animationDelay: `${index * 30}ms` }}
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
          {isVisible && (
            <OptimizedImage
              src={product.image}
              alt={product.title}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              containerClassName="absolute inset-0 w-full h-full"
              className={`transition-transform duration-700 group-hover:scale-110 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-150" />

          {isBestSeller && (
            <div className="absolute top-2 left-2 z-10 bg-primary text-black text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight shadow-md flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className="hidden sm:inline">Best Seller</span>
              <span className="sm:hidden">Hot</span>
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

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageWindow = (maxVisible: number) => {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const mobilePages = getPageWindow(5);
  const desktopPages = getPageWindow(8);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 px-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 active:scale-95"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 sm:hidden">
        {mobilePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`min-w-[40px] h-10 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              currentPage === page
                ? 'bg-primary text-black border border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="hidden sm:flex items-center gap-1">
        {desktopPages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`min-w-[40px] h-10 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              currentPage === page
                ? 'bg-primary text-black border border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 active:scale-95"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── ProductGrid ──────────────────────────────────────────────────────────────
interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [totalPages]
  );

  // Memoize individual card click handlers to avoid creating new fns on every render
  const cardClickHandlers = useMemo(
    () => new Map(pageProducts.map((p) => [p.id, () => onProductClick(p)])),
    [pageProducts, onProductClick]
  );

  return (
    <div id="collection">
      {/* AnimatePresence fades the grid out/in on page change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {totalPages > 1 && (
        <p className="text-center text-[10px] text-muted font-medium mt-3">
          Page {currentPage} of {totalPages} · {products.length} posters
        </p>
      )}
    </div>
  );
};
