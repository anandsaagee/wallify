import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Product } from './ProductGrid';
import { OptimizedImage } from './OptimizedImage';

interface Props {
  products: Product[];
  onClick: (product: Product) => void;
}

// Utility: shuffle + pick with category diversity
function getRandomProducts(products: Product[], count: number) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());

  const selected: Product[] = [];
  const usedCategories = new Set<string>();

  for (const p of shuffled) {
    if (!usedCategories.has(p.category)) {
      selected.push(p);
      usedCategories.add(p.category);
    }
    if (selected.length >= count) break;
  }

  return selected;
}

export const HeroBestSellers: React.FC<Props> = ({ products, onClick }) => {
  const bestSellers = useMemo(() => {
    return getRandomProducts(products, 10);
  }, [products]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
        🔥 Best Sellers
      </h2>

      {/* Mobile: horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto sm:hidden pb-2">
        {bestSellers.map((product, index) => (
          <div
            key={product.id}
            className="min-w-[140px] cursor-pointer"
            onClick={() => onClick(product)}
          >
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface relative">
              <OptimizedImage
                src={product.image}
                alt={product.title}
                containerClassName="absolute inset-0 w-full h-full"
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-xs mt-1 truncate">{product.title}</p>
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {bestSellers.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onClick(product)}
            className="cursor-pointer group"
          >
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface relative">
              <OptimizedImage
                src={product.image}
                alt={product.title}
                containerClassName="absolute inset-0 w-full h-full"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="text-xs mt-1 truncate">{product.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
