import React, { useState, useMemo, useCallback } from 'react';
import { products } from './data/products';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { BottomSheet } from './components/BottomSheet';
import { ProductPreview } from './components/ProductPreview';
import { CartProvider, useCart } from './hooks/useCart';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { Customize } from './components/Customize';
import { Checkout } from './components/Checkout';
import { Search, X, Gift } from 'lucide-react';

type View = 'store' | 'customize' | 'checkout';

interface Product {
  id: string;
  title: string;
  category: string;
  basePrice: number;
  image: string;
}

// ─── Free Gift Toast ─────────────────────────────────────────────────────────
const FreeGiftToast: React.FC = () => {
  const { freeGiftMessage } = useCart();

  if (!freeGiftMessage) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[90] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-surface border border-green-500/20 rounded-2xl p-3.5 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
          <Gift className="w-5 h-5 text-green-400" />
        </div>
        <p className="text-xs font-bold text-white leading-snug">{freeGiftMessage}</p>
      </div>
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────
const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('store');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSetView = useCallback((nextView: View) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchesCategory =
          selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = p.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());
        return matchesCategory && matchesSearch;
      }),
    [selectedCategory, searchQuery]
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
  }, []);

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      <Header currentView={view} setView={handleSetView} />

      <div className={view === 'store' ? '' : 'pt-24'}>
        {view === 'customize' && <Customize />}

        {view === 'checkout' && <Checkout onBack={() => handleSetView('store')} />}

        {view === 'store' && (
          <>
            <Hero />
            <main className="pb-24">
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
                    {filteredProducts.length} poster
                    {filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-4 mt-3">
                <div className="relative">
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    placeholder="Search posters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors duration-150"
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
                <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                  <span className="text-5xl mb-4" aria-hidden="true">
                    🎨
                  </span>
                  <p className="text-white font-bold text-base">
                    No posters found
                  </p>
                  <p className="text-muted text-sm mt-1">
                    Try a different search or category
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-5 px-6 py-2.5 rounded-full bg-primary text-black font-bold text-sm active:scale-95 transition-transform duration-150"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </main>
          </>
        )}
      </div>

      <BottomSheet
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      >
        {selectedProduct && <ProductPreview product={selectedProduct} />}
      </BottomSheet>

      {/* Free gift notification toast */}
      <FreeGiftToast />
    </div>
  );
};

const App: React.FC = () => (
  <CartProvider>
    <AppContent />
  </CartProvider>
);

export default App; // Trigger Vercel redeploy
