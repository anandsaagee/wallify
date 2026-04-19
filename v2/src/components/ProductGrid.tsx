import React, { memo } from 'react';

interface Product {
  id: string;
  title: string;
  category: string;
  basePrice: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product, onClick, index }) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col gap-1.5 active:scale-[0.97] transition-transform duration-150"
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
    >
      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-white/5 relative">
        {!loaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1598128558393-70ff22444bb0?auto=format&fit=crop&q=60&w=400';
          }}
        />
        {/* Quick-view badge on tap — mobile only */}
        <div className="absolute inset-0 bg-black/0 active:bg-black/10 transition-colors" />
      </div>

      <div className="px-0.5">
        <span className="text-[9px] text-muted font-bold uppercase tracking-wider truncate block">
          {product.category}
        </span>
        <h3 className="text-xs font-semibold text-white truncate leading-tight">
          {product.title}
        </h3>
        <p className="text-sm font-black text-primary mt-0.5">₹33</p>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  return (
    /* product-grid class is defined in index.css with hard media queries */
    <div className="product-grid">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};
