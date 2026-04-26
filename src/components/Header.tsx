import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Menu, X, Sparkles, Store } from 'lucide-react';
import { useCart } from '../hooks/useCart';

type View = 'store' | 'customize' | 'checkout';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const NAV_ITEMS: { id: View; label: string; Icon: React.ElementType }[] = [
  { id: 'store', label: 'Store', Icon: Store },
  { id: 'customize', label: 'Customize', Icon: Sparkles },
];

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totals } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when view changes
  useEffect(() => {
    setMenuOpen(false);
  }, [currentView]);

  const navigateTo = useCallback(
    (view: View) => {
      setView(view);
      setMenuOpen(false);
    },
    [setView]
  );

  const elevated = scrolled || menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        elevated
          ? 'bg-background/95 backdrop-blur-md py-3 border-b border-white/5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left: hamburger + logo + desktop nav */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="lg:hidden p-1 -ml-1 text-white hover:opacity-70 transition-opacity duration-150"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button
            onClick={() => navigateTo('store')}
            aria-label="Go to store"
            className="text-2xl font-black tracking-tighter text-white hover:scale-105 transition-transform duration-150"
          >
            Wallify<span className="text-primary">.</span>
          </button>

          <nav className="hidden lg:flex items-center ml-8 gap-8" aria-label="Main navigation">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => navigateTo(id)}
                aria-current={currentView === id ? 'page' : undefined}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-200 hover:text-primary ${
                  currentView === id ? 'text-primary' : 'text-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: cart */}
        <button
          onClick={() => navigateTo('checkout')}
          aria-label={`View cart — ${totals.totalItems} item${totals.totalItems !== 1 ? 's' : ''}, ₹${totals.finalTotal}`}
          className="group relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/10 transition-all duration-200 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag
              size={20}
              className="text-white group-hover:text-primary transition-colors duration-200"
            />
            {totals.totalItems > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                aria-hidden="true"
              >
                {totals.totalItems > 99 ? '99+' : totals.totalItems}
              </span>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[8px] font-black uppercase tracking-widest text-muted leading-none">
              Bag Total
            </p>
            <p className="text-xs font-black text-white mt-0.5 tracking-tight group-hover:text-primary transition-colors duration-200">
              ₹{totals.finalTotal}
            </p>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          {/* Backdrop dimmer */}
          <div
            className="lg:hidden fixed inset-0 top-[57px] bg-black/30 z-30"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />

          <nav
            className="lg:hidden fixed inset-x-0 top-[57px] bg-background/98 backdrop-blur-xl z-40 border-t border-white/5"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col p-6 gap-6">
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => navigateTo(id)}
                  aria-current={currentView === id ? 'page' : undefined}
                  className={`flex items-center gap-4 text-xl font-black tracking-tighter uppercase transition-colors duration-200 ${
                    currentView === id ? 'text-primary' : 'text-white'
                  }`}
                >
                  <Icon
                    size={24}
                    className={currentView === id ? 'text-primary' : 'text-muted'}
                    aria-hidden="true"
                  />
                  {label}
                </button>
              ))}
            </div>

            <div className="px-6 py-8 border-t border-white/5 text-center">
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">
                Premium Poster Store
              </p>
              <div className="flex justify-center gap-4 mt-4 opacity-25" aria-hidden="true">
                <Sparkles size={16} />
                <Sparkles size={16} />
                <Sparkles size={16} />
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
