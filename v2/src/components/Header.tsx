import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md py-2 border-b border-white/5' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-white cursor-pointer hover:opacity-70" />
          <h1 className="text-xl font-black tracking-tighter text-white">
            Wallify<span className="text-primary">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative hidden md:block group">
            <input 
              type="text" 
              placeholder="Search posters..." 
              className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary/50 transition-colors w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus:text-primary transition-colors" />
          </div>
          
          <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
            <ShoppingBag className="w-6 h-6 text-white" />
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
