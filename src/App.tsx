import React, { useState, useCallback } from 'react';
import { products } from './data/products';
import { useProductFilters } from './hooks/useProductFilters';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { SizeFilter } from './components/SizeFilter';
import { ProductGrid } from './components/ProductGrid';
import { BottomSheet } from './components/BottomSheet';
import { ProductPreview } from './components/ProductPreview';
import { CartProvider, useCart } from './hooks/useCart';
import { Hero } from './components/Hero';
import { HeroBestSellers } from './components/HeroBestSellers';
import { FeaturedCategories } from './components/FeaturedCategories';
import { Pricing } from './components/Pricing';
import { BulkOffers } from './components/BulkOffers';
import { Checkout } from './components/Checkout';
import { Search, X, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackProductClick } from './utils/bestSellerTracker'; // ✅ NEW

type View = 'store' | 'checkout';

interface ProductData {
  id: string;
  title: string;
  category: string;
  image: string;
}

const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('store');
  const { totals } = useCart(); // Added useCart to access totals here

  const {
    selectedCategory,
    setSelectedCategory,
    selectedSize,
    setSelectedSize,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    handleClearFilters
  } = useProductFilters();

  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  // ✅ NEW: SMART CLICK HANDLER
  const handleProductClick = useCallback((product: ProductData) => {
    if (!product?.id) return;

    try {
      trackProductClick(product.id);
    } catch (err) {
      console.warn('Click tracking failed:', err);
    }

    setSelectedProduct(product);
  }, []);

  const handleSetView = useCallback((nextView: View) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const scrollToCollection = useCallback(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const showFreeGiftBanner = totals.eligibleFreeGifts > 0 && totals.freeGiftCount < totals.eligibleFreeGifts;

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden flex flex-col">
      <Header currentView={view} setView={handleSetView} />

      <div className={view === 'store' ? 'flex-1' : 'pt-24 flex-1'}>
        <AnimatePresence mode="wait">

          {/* CHECKOUT */}
          {view === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Checkout onBack={() => handleSetView('store')} onProductClick={() => {}} />
            </motion.div>
          )}

          {/* STORE */}
          {view === 'store' && (
            <motion.div
              key="store"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Hero onShopNow={scrollToCollection} onExplore={scrollToCollection} />

              {/* Inline Reward Banner (Replaced fixed toast) */}
              <AnimatePresence>
                {showFreeGiftBanner && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 mb-6"
                  >
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Gift className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-white uppercase tracking-tight">
                          Reward Unlocked!
                        </p>
                        <p className="text-xs text-muted font-medium mt-0.5">
                          You have {totals.eligibleFreeGifts} free mystery poster{totals.eligibleFreeGifts > 1 ? 's' : ''} unlocked! 
                          <button 
                            onClick={() => handleSetView('checkout')}
                            className="text-primary font-bold ml-1 hover:underline"
                          >
                            View in bag →
                          </button>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 🔥 BEST SELLERS (TRACKED) */}
              <HeroBestSellers
                products={products}
                onClick={handleProductClick} // ✅ UPDATED
              />

              <main className="pb-24">
                <FeaturedCategories onSelectCategory={setSelectedCategory} />

                <div id="collection-header" className="px-4 mb-1 mt-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      The Collection
                    </h2>
                    <p className="text-xs text-muted mt-0.5">
                      {filteredProducts.length} poster{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="px-4 mt-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="search"
                      placeholder="Search posters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-muted focus:border-primary/30 outline-none transition-colors"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-4 h-4 text-muted" />
                      </button>
                    )}
                  </div>
                </div>

                <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                <SizeFilter selectedSize={selectedSize} onSelectSize={setSelectedSize} />

                {/* Minimized Price and Offer details under categories */}
                <Pricing />
                <BulkOffers />

                {/* ✅ GRID UPDATED */}
                {filteredProducts.length > 0 ? (
                  <ProductGrid
                    products={filteredProducts}
                    onProductClick={handleProductClick} // ✅ UPDATED
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                    <span className="text-5xl mb-4">🎨</span>
                    <p className="text-white font-bold text-base">No posters found</p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-5 px-6 py-2.5 rounded-full bg-primary text-black font-bold text-sm"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomSheet isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <ProductPreview 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </BottomSheet>
    </div>
  );
};

const App: React.FC = () => (
  <CartProvider>
    <AppContent />
  </CartProvider>
);

export default App;
