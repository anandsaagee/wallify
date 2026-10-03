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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
      style={{
        paddingTop:    `max(${scrolled ? '10px' : '14px'}, env(safe-area-inset-top))`,
        paddingBottom: scrolled ? '10px' : '14px',
        paddingLeft:   'env(safe-area-inset-left)',
        paddingRight:  'env(safe-area-inset-right)',
      }}
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 flex items-center justify-between relative">

        {/* Left: Instagram */}
        <a
          href="https://www.instagram.com/wallifystore.india?stkn=djZzaWU1bnk1MW45"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors duration-200 text-muted hover:text-primary"
          aria-label="Follow on Instagram"
        >
          <Instagram size={18} />
        </a>

        {/* Center: Brand — DM Serif Display */}
        <button
          onClick={() => setView('store')}
          aria-label="Go to store"
          className="absolute left-1/2 -translate-x-1/2 font-display text-white hover:text-primary transition-colors duration-150 whitespace-nowrap leading-none"
          style={{ fontSize: 'clamp(18px, 4vw, 26px)' }}
        >
          WallifyStore<span className="text-primary">.</span>
        </button>

        {/* Right: Cart */}
        <button
          onClick={() => setView('checkout')}
          aria-label={`View cart — ${totals.totalPaidItems} items, ₹${totals.finalTotal}`}
          className="group relative flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 sm:px-4 min-h-[44px] hover:bg-white/10 transition-all duration-200 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag size={18} className="text-white group-hover:text-primary transition-colors duration-200" />
            {totals.totalPaidItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-body font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totals.totalPaidItems > 99 ? '99+' : totals.totalPaidItems}
              </span>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="font-body text-[8px] font-bold uppercase tracking-widest text-muted leading-none">Bag</p>
            <p className="font-body text-xs font-bold text-white mt-0.5 group-hover:text-primary transition-colors duration-200">
              ₹{totals.finalTotal}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
