import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Product } from './ProductGrid';
import { OptimizedImage } from './OptimizedImage';
import { getTopProducts } from '../utils/bestSellerTracker';

interface Props {
  products: Product[];
  onClick: (product: Product) => void;
}

export const HeroBestSellers: React.FC<Props> = ({ products, onClick }) => {
  const bestSellers = useMemo(() => {
    // Use the tracker to get actual best sellers (by clicks)
    // If no clicks yet, it falls back to the first few products
    return getTopProducts(products, 8);
  }, [products]);

  if (!bestSellers.length) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-12 mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span className="text-primary">🔥</span> Bestsellers
          </h2>
          <p className="text-xs text-muted mt-1 font-medium">Most loved by the community</p>
        </div>
      </div>

      {/* Mobile & Tablet: horizontal scroll with iOS momentum */}
      <div
        className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x snap-mandatory scroll-momentum"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {bestSellers.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="min-w-[160px] sm:min-w-[180px] snap-start group cursor-pointer"
            onClick={() => onClick(product)}
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-white/5 relative">
              <OptimizedImage
                src={product.image}
                alt={product.title}
                priority={index < 4}
                containerClassName="absolute inset-0 w-full h-full"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center border border-white/10">
                {index + 1}
              </div>
            </div>
            <div className="mt-3 px-1">
              <h3 className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-0.5">
                {product.category}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grid view for larger screens is handled by the horizontal scroll + snap on most devices, 
          but we've optimized the layout to feel premium. */}
    </section>
  );
};
