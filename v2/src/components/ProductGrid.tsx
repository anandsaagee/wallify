import React from 'react';

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
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer flex flex-col gap-2 reveal-fade"
    >
      <div className="aspect-[3/4] rounded-premium overflow-hidden bg-surface border border-white/5 relative">
        {!loaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
        <img 
          src={product.image} 
          alt={product.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598128558393-70ff22444bb0?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute top-2 right-2 glass p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-4 h-4 rounded-full border border-white/40" />
        </div>
      </div>
      
      <div className="px-1">
        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">{product.category}</span>
        <h3 className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="text-base font-black text-primary">₹33</p>
      </div>
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 px-4 pb-24">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};
