import React, { useState, useEffect } from 'react';
import { ShoppingBag, Instagram } from 'lucide-react';
import { useCart } from '../hooks/useCart';

type View = 'store' | 'checkout';

interface HeaderProps {
  setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ setView }) => {
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
          ? 'bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
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
          href="https://www.instagram.com/wallifystore.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors duration-200 text-gray-500 hover:text-primary"
          aria-label="Follow on Instagram"
        >
          <Instagram size={18} />
        </a>

        {/* Center: Brand — logo + DM Serif Display name */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setView('store');
          }}
          aria-label="Go to store homepage"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 hover:opacity-80 transition-opacity duration-150 no-underline"
        >
          <img
            src="/wallify-logo.jpg"
            alt="Wallify Store logo"
            className="w-10 h-10 rounded-xl object-cover shadow-sm"
          />
          <span
            className="font-display text-gray-900 whitespace-nowrap leading-none"
            style={{ fontSize: 'clamp(20px, 4.5vw, 30px)' }}
          >
            WallifyStore<span className="text-primary">.</span>
          </span>
        </a>

        {/* Right: Cart */}
        <button
          onClick={() => setView('checkout')}
          aria-label={`View cart — ${totals.totalPaidItems} items, ₹${totals.finalTotal}`}
          className="group relative flex items-center gap-2 bg-black/5 border border-black/10 rounded-2xl px-3 sm:px-4 min-h-[44px] hover:bg-black/10 transition-all duration-200 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag size={18} className="text-gray-700 group-hover:text-primary transition-colors duration-200" />
            {totals.totalPaidItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-body font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totals.totalPaidItems > 99 ? '99+' : totals.totalPaidItems}
              </span>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="font-body text-[8px] font-bold uppercase tracking-widest text-gray-400 leading-none">Bag</p>
            <p className="font-body text-xs font-bold text-gray-900 mt-0.5 group-hover:text-primary transition-colors duration-200">
              ₹{totals.finalTotal}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
