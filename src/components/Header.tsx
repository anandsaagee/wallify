import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';

type View = 'store' | 'checkout';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totals } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigateTo('store')}
          aria-label="Go to store"
          className="text-2xl font-black tracking-tighter text-white hover:scale-105 transition-transform duration-150"
        >
          Wallify<span className="text-primary">.</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {['store'].map((id) => (
            <button
              key={id}
              onClick={() => navigateTo(id as View)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-200 hover:text-primary ${
                currentView === id ? 'text-primary' : 'text-muted'
              }`}
            >
              Store
            </button>
          ))}
        </nav>

        {/* Cart button */}
        <button
          onClick={() => navigateTo('checkout')}
          aria-label={`View cart — ${totals.totalPaidItems} items, ₹${totals.finalTotal}`}
          className="group relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/10 transition-all duration-200 active:scale-95"
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

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-[53px] bg-black/30 z-30"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="md:hidden fixed inset-x-0 top-[53px] bg-background/98 backdrop-blur-xl z-40 border-t border-white/5">
            <div className="flex flex-col p-6 gap-6">
              <button
                onClick={() => navigateTo('store')}
                className="flex items-center gap-4 text-xl font-black tracking-tighter text-white"
              >
                <ShoppingBag size={24} className="text-primary" />
                Store
              </button>
              <button
                onClick={() => navigateTo('checkout')}
                className="flex items-center gap-4 text-xl font-black tracking-tighter text-white"
              >
                <ShoppingBag size={24} className="text-muted" />
                Your Bag ({totals.totalPaidItems})
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
