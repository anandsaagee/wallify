import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Sparkles, Store } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  currentView: 'store' | 'customize' | 'checkout';
  setView: (view: 'store' | 'customize' | 'checkout') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totals } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'store', label: 'Store', icon: Store },
    { id: 'customize', label: 'Customize', icon: Sparkles },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-background/95 backdrop-blur-md py-3 border-b border-white/5' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-1 -ml-1 text-white hover:opacity-70 transition-opacity"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <button 
            onClick={() => { setView('store'); setMenuOpen(false); }}
            className="text-2xl font-black tracking-tighter text-white hover:scale-105 transition-transform"
          >
            Wallify<span className="text-primary">.</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center ml-8 gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${
                  currentView === item.id ? 'text-primary' : 'text-muted'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('checkout')}
            className="group relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/10 transition-all active:scale-95"
          >
            <div className="relative">
              <ShoppingBag size={20} className="text-white group-hover:text-primary transition-colors" />
              {totals.totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                  {totals.totalItems}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted leading-none">Bag Total</p>
              <p className="text-xs font-black text-white mt-0.5 tracking-tight group-hover:text-primary transition-colors">₹{totals.finalTotal}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-background/95 backdrop-blur-xl z-40 animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col p-6 gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setView(item.id as any); setMenuOpen(false); }}
                className={`flex items-center gap-4 text-xl font-black tracking-tighter uppercase transition-colors ${
                  currentView === item.id ? 'text-primary' : 'text-white'
                }`}
              >
                <item.icon size={24} className={currentView === item.id ? 'text-primary' : 'text-muted'} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="absolute bottom-10 left-0 right-0 p-6 flex flex-col gap-4 border-t border-white/5 pt-10">
             <div className="text-center">
                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Premium Poster Store</p>
                <div className="flex justify-center gap-4 mt-4 opacity-30 grayscale">
                    <Sparkles size={20} />
                    <Sparkles size={20} />
                    <Sparkles size={20} />
                </div>
             </div>
          </div>
        </div>
      )}
    </header>
  );
};
