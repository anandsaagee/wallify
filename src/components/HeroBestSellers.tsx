import React, { useMemo } from 'react';
import { Product } from './ProductGrid';
import { OptimizedImage } from './OptimizedImage';
import { getTopProducts } from '../utils/bestSellerTracker';
import { getCleanPosterName } from '../utils/seoHelpers';

interface Props {
  products: Product[];
  onClick: (product: Product) => void;
}

export const HeroBestSellers: React.FC<Props> = ({ products, onClick }) => {
  const bestSellers = useMemo(() => getTopProducts(products, 8), [products]);

  if (!bestSellers.length) return null;

  return (
    <section className="px-4 sm:px-5 mt-10 mb-12" aria-label="Best Sellers">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-white flex items-center gap-2">
            <span className="text-primary">🔥</span> Bestsellers
          </h2>
          <p className="font-body text-[11px] text-muted mt-0.5 font-medium">Most loved by the community</p>
        </div>
      </div>

      {/* Horizontal scroll — snap on mobile */}
      <div
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar snap-x snap-mandatory scroll-momentum"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {bestSellers.map((product, index) => {
          const cleanName = getCleanPosterName(product.title);
          return (
          <div
            key={product.id}
            className="w-[120px] sm:w-[150px] snap-start group cursor-pointer shrink-0"
            onClick={() => onClick(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick(product)}
            aria-label={`View ${cleanName}`}
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-white/5 relative">
              <OptimizedImage
                src={product.image}
                alt={cleanName}
                priority={index < 4}
                containerClassName="absolute inset-0 w-full h-full"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              {/* Rank badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-body font-black w-6 h-6 rounded-lg flex items-center justify-center border border-white/10">
                {index + 1}
              </div>
            </div>
            <div className="mt-2 px-0.5">
              <h3 className="font-body text-xs font-semibold text-white truncate group-hover:text-primary transition-colors">
                {cleanName}
              </h3>
              <p className="font-body text-[10px] text-muted font-medium uppercase tracking-wider mt-0.5">
                {product.category}
              </p>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
};
