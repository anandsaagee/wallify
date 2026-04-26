import React, { memo, useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Product {
  id: string;
  title: string;
  category: string;
  basePrice: number;
  image: string;
}

// ─── Product Card ────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1598128558393-70ff22444bb0?auto=format&fit=crop&q=60&w=400';

const ProductCard: React.FC<ProductCardProps> = memo(({ product, onClick }) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ${product.title}`}
      className="group cursor-pointer flex flex-col gap-1.5 active:scale-[0.97] transition-transform duration-150"
    >
      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-white/5 relative">
        {!loaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" aria-hidden="true" />
        )}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105 transition-transform ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-black/0 active:bg-black/10 transition-colors duration-150" />
      </div>

      <div className="px-0.5">
        <span className="text-[9px] text-muted font-bold uppercase tracking-wider truncate block">
          {product.category}
        </span>
        <h3 className="text-xs font-semibold text-white truncate leading-tight">
          {product.title}
        </h3>
        <p className="text-sm font-black text-primary mt-0.5">
          ₹{product.basePrice}
        </p>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

// ─── Pagination ──────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 16; // 4 rows × 4 cols on desktop

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Dynamic window: mobile 5, desktop 8
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
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 active:scale-95"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Mobile pages (sm and below) */}
      <div className="flex items-center gap-1 sm:hidden">
        {mobilePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
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

      {/* Desktop pages (sm+) */}
      <div className="hidden sm:flex items-center gap-1">
        {desktopPages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
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

      {/* Next */}
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

// ─── Product Grid ────────────────────────────────────────────────────────────

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  // Reset to page 1 when products change (filter/search)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  // Only render current page data
  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        // Scroll to collection section
        document.getElementById('category-filter-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [totalPages]
  );

  return (
    <div>
      {/* Responsive grid: 2 cols mobile, 3 tablet, 4 desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 sm:px-5 lg:px-7">
        {pageProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Page info */}
      {totalPages > 1 && (
        <p className="text-center text-[10px] text-muted font-medium mt-3">
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
};
