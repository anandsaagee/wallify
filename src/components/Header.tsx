import React, { useState, useEffect } from 'react';
import { ShoppingBag, Instagram } from 'lucide-react';
import { useCart } from '../hooks/useCart';

type View = 'store' | 'checkout';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [scrolled, setScrolled] = useState(false);
  const { totals } = useCart();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const elevated = scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        elevated
          ? 'bg-background/95 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
      style={{
        // Respect notch / status bar on iOS with viewport-fit=cover
        paddingTop: `max(${elevated ? '12px' : '16px'}, env(safe-area-inset-top))`,
        paddingBottom: elevated ? '12px' : '16px',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setView('store')}
          aria-label="Go to store"
          className="text-2xl font-black tracking-tighter text-white hover:scale-105 transition-transform duration-150"
        >
          Wallify<span className="text-primary">.</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <button
            onClick={() => setView('store')}
            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-200 hover:text-primary ${
              currentView === 'store' ? 'text-primary' : 'text-muted'
            }`}
          >
            Store
          </button>
          
          <a
            href="https://www.instagram.com/wallifystore.india?stkn=djZzaWU1bnk1MW45"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors duration-200"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
        </nav>

        {/* Cart button — 44px min tap target */}
        <button
          onClick={() => setView('checkout')}
          aria-label={`View cart — ${totals.totalPaidItems} items, ₹${totals.finalTotal}`}
          className="group relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 min-h-[44px] hover:bg-white/10 transition-all duration-200 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag
              size={20}
              className="text-white group-hover:text-primary transition-colors duration-200"
            />
            {totals.totalPaidItems > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
              >
                {totals.totalPaidItems > 99 ? '99+' : totals.totalPaidItems}
              </span>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[8px] font-black uppercase tracking-widest text-muted leading-none">
              Bag
            </p>
            <p className="text-xs font-black text-white mt-0.5 tracking-tight group-hover:text-primary transition-colors duration-200">
              ₹{totals.finalTotal}
            </p>
          </div>
        </button>
      </div>

    </header>
  );
};
