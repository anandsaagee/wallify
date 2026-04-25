import React, { useState, useMemo, useEffect } from 'react';
import { products } from './data/products';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { BottomSheet } from './components/BottomSheet';
import { ProductPreview } from './components/ProductPreview';
import { CartProvider } from './hooks/useCart';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { Customize } from './components/Customize';
import { Checkout } from './components/Checkout';
import { Search, X } from 'lucide-react';

type View = 'store' | 'customize' | 'checkout';

const App: React.FC = () => {
  const [view, setView] = useState<View>('store');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Hide mobile menu behavior if handled here
  }, [view]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const renderContent = () => {
    switch (view) {
      case 'customize':
        return <Customize />;
      case 'checkout':
        return <Checkout onBack={() => setView('store')} />;
      case 'store':
      default:
        return (
          <>
            <Hero />
            <main className="pb-20">
              <FeaturedCategories onSelectCategory={setSelectedCategory} />

              <div
                id="category-filter-section"
                className="px-4 mb-1 mt-8 flex items-center justify-between"
              >
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    The Collection
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    {filteredProducts.length} poster{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-4 mt-3">
                <div className="relative">
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: '#a1a1aa' }}
                  />
                  <input
                    type="text"
                    placeholder="Search posters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl border border-white/10 focus:outline-none focus:border-primary/50 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    >
                      <X className="w-4 h-4 text-muted" />
                    </button>
                  )}
                </div>
              </div>

              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {filteredProducts.length > 0 ? (
                <ProductGrid
                  products={filteredProducts}
                  onProductClick={setSelectedProduct}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <span className="text-5xl mb-4">🎨</span>
                  <p className="text-white font-bold">No posters found</p>
                  <p className="text-muted text-sm mt-1">
                    Try a different search or category
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-transform"
                    style={{ background: '#FACB15', color: '#000' }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </main>
          </>
        );
    }
  };

  return (
    <CartProvider>
      <div
        className="min-h-screen bg-background text-white"
        style={{ overflowX: 'hidden', maxWidth: '100%' }}
      >
        <Header currentView={view} setView={setView} />
        
        <div className={view === 'store' ? '' : 'pt-24'}>
          {renderContent()}
        </div>

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
