import React, { useState, useMemo } from 'react';
import { products } from './data/products';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { BottomSheet } from './components/BottomSheet';
import { ProductPreview } from './components/ProductPreview';
import { CartProvider } from './hooks/useCart';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { Search } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
        <Header />
        
        <Hero />

        <main className="">
          <FeaturedCategories onSelectCategory={setSelectedCategory} />

          <div id="category-filter-section" className="px-4 mb-2 mt-12">
            <h2 className="text-3xl font-black text-white tracking-tight">The Collection</h2>
          </div>

          {/* Search Bar (Compact) */}
          <div className="px-4 mt-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search posters..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus:text-primary transition-colors" />
            </div>
          </div>

          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />

          <ProductGrid 
            products={filteredProducts} 
            onProductClick={setSelectedProduct} 
          />
        </main>

        <BottomSheet 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)}
        >
          {selectedProduct && <ProductPreview product={selectedProduct} />}
        </BottomSheet>
      </div>
    </CartProvider>
  );
};

export default App;
