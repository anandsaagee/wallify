import React, { useState, useCallback, useEffect, useRef } from 'react';
import { products } from './data/products';
import { useProductFilters } from './hooks/useProductFilters';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { SizeFilter } from './components/SizeFilter';
import { ProductGrid } from './components/ProductGrid';
import { BottomSheet } from './components/BottomSheet';
import { ProductPreview } from './components/ProductPreview';
import { SEO } from './components/SEO';
import { FAQ } from './components/FAQ';
import { CATEGORY_SEO } from './data/categorySeo';

import { CartProvider, useCart } from './hooks/useCart';
import { Hero } from './components/Hero';
import { HeroBestSellers } from './components/HeroBestSellers';
import { FeaturedCategories } from './components/FeaturedCategories';
import { Pricing } from './components/Pricing';
import { BulkOffers } from './components/BulkOffers';
import { Checkout } from './components/Checkout';
import { Footer } from './components/Footer';
import { Search, X, Gift, ShoppingBag } from 'lucide-react';
import { trackProductClick } from './utils/bestSellerTracker';

type View = 'store' | 'checkout';

interface ProductData {
  id: string;
  title: string;
  category: string;
  image: string;
}

// Deep linking: resolve poster if landing directly on /posters/:category/:slug
function getInitialProduct(): ProductData | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname.toLowerCase();
  const match = path.match(/^\/posters\/[a-z0-9_-]+\/([a-z0-9_-]+)/);
  if (match) {
    const slug = match[1];
    const found = products.find((p) => {
      const pSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return pSlug === slug;
    });
    if (found) return found;
  }
  return null;
}

const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('store');
  const { totals } = useCart();

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

  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(getInitialProduct);
  const [cartToast, setCartToast] = useState<{ title: string; image: string; size: string } | null>(null);
  const [cartBouncing, setCartBouncing] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddedToCart = useCallback((product: ProductData, sizeLabel: string) => {
    setCartToast({ title: product.title, image: product.image, size: sizeLabel });
    setCartBouncing(true);
    setTimeout(() => setCartBouncing(false), 800);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setCartToast(null);
    }, 3200);
  }, []);

  // Sync modal state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (!path.startsWith('/posters/')) {
        setSelectedProduct(null);
      } else {
        const prod = getInitialProduct();
        if (prod) setSelectedProduct(prod);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // SMART CLICK HANDLER
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
    document.getElementById('collection-header')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const showFreeGiftBanner = totals.eligibleFreeGifts > 0 && totals.freeGiftCount < totals.eligibleFreeGifts;

  // Dynamic SEO configuration based on active category
  const activeCategorySeo = CATEGORY_SEO[selectedCategory] || CATEGORY_SEO['All'];
  const categoryCanonicalUrl =
    selectedCategory === 'All'
      ? 'https://wallifystore.in'
      : `https://wallifystore.in/category/${selectedCategory.toLowerCase()}`;

  const seoJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'WallifyStore',
        url: 'https://wallifystore.in',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://wallifystore.in/?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      ...(selectedCategory !== 'All'
        ? [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://wallifystore.in',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: `${selectedCategory} Posters`,
                  item: categoryCanonicalUrl,
                },
              ],
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <SEO 
        title={activeCategorySeo.metaTitle}
        description={activeCategorySeo.metaDescription}
        canonicalUrl={categoryCanonicalUrl}
        type="website"
        jsonLd={seoJsonLd}
      />
      <Header currentView={view} setView={handleSetView} />

      <div className={view === 'store' ? 'flex-1' : 'pt-24 flex-1'}>
        {/* CHECKOUT */}
        {view === 'checkout' && (
          <div>
            <Checkout onBack={() => handleSetView('store')} />
          </div>
        )}

        {/* STORE */}
        {view === 'store' && (
          <div>
            <Hero 
              onShopNow={scrollToCollection} 
              onExplore={scrollToCollection} 
              isMainH1={selectedCategory === 'All'}
            />

            {/* 🔥 BEST SELLERS — directly after hero */}
            <HeroBestSellers
              products={products}
              onClick={handleProductClick}
            />

            {/* Inline Reward Banner */}
            {showFreeGiftBanner && (
              <div className="px-4 mb-6 transition-all duration-300">
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight">
                      Reward Unlocked!
                    </p>
                    <p className="text-xs text-muted font-medium mt-0.5">
                      You have {totals.eligibleFreeGifts} free mystery poster{totals.eligibleFreeGifts > 1 ? 's' : ''} unlocked!{' '}
                      <button
                        onClick={() => handleSetView('checkout')}
                        className="text-primary font-bold ml-1 hover:underline"
                      >
                        View in bag →
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}

              <main className="pb-24">
                <FeaturedCategories onSelectCategory={setSelectedCategory} />

                <div id="collection-header" className="px-4 mb-3 mt-8">
                  <div className="flex items-center justify-between">
                    {selectedCategory === 'All' ? (
                      <h2 className="text-2xl sm:text-3xl font-display text-white tracking-tight">
                        {activeCategorySeo.h1}
                      </h2>
                    ) : (
                      <h1 className="text-2xl sm:text-3xl font-display text-white tracking-tight">
                        {activeCategorySeo.h1}
                      </h1>
                    )}
                    <span className="text-xs text-muted font-body font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {filteredProducts.length} poster{filteredProducts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 font-body mt-2 leading-relaxed max-w-2xl">
                    {activeCategorySeo.snippet}
                  </p>
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

              {/* SEO FAQ Section with FAQPage Schema */}
              <FAQ />
          </div>
        )}
      </div>

      {/* Toast Notification when adding to cart */}
      {cartToast && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 z-[90] flex items-center gap-3 px-4 py-3 bg-[#18181b]/95 border border-primary/30 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-toastIn max-w-[92vw]"
        >
          <div className="w-8 h-10 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
            <img src={cartToast.image} alt={cartToast.title} className="w-full h-full object-cover" />
          </div>
          <div className="text-left min-w-0 pr-1">
            <p className="text-xs font-black text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              Added to bag
            </p>
            <p className="text-[11px] text-white/80 font-medium truncate max-w-[170px] sm:max-w-[240px]">
              {cartToast.title} <span className="text-primary font-bold">({cartToast.size})</span>
            </p>
          </div>
          <button
            onClick={() => {
              setCartToast(null);
              handleSetView('checkout');
            }}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-primary text-black font-black text-xs hover:brightness-110 active:scale-95 transition-all ml-1"
          >
            View Bag →
          </button>
        </div>
      )}

      {/* Floating Cart Button */}
      {view === 'store' && totals.totalPaidItems > 0 && (
        <button
          onClick={() => handleSetView('checkout')}
          className={`fixed right-5 md:right-10 z-40 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary text-black rounded-full shadow-[0_4px_25px_rgba(255,255,255,0.25)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.4)] transition-all duration-300 ${
            cartBouncing ? 'scale-125 shadow-[0_0_35px_rgba(250,203,21,0.8)] ring-4 ring-primary/40' : 'scale-100'
          }`}
          style={{ bottom: 'max(24px, calc(env(safe-area-inset-bottom) + 16px))' }}
          aria-label="View Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
            <span 
              key={totals.totalPaidItems}
              className="absolute -top-2 -right-2 bg-black text-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-primary/20 animate-[pulse_0.4s_ease-out]"
            >
              {totals.totalPaidItems}
            </span>
          </div>
        </button>
      )}

      <BottomSheet isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <ProductPreview 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddedToCart={handleAddedToCart}
          />
        )}
      </BottomSheet>
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <CartProvider>
    <AppContent />
  </CartProvider>
);

export default App;
