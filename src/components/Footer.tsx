import React from 'react';
import { Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-background/95 border-t border-white/5 mt-auto">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center gap-6">
        <h3 className="text-2xl font-black tracking-tighter text-white">
          Wallify<span className="text-primary">.</span>
        </h3>
        
        <p className="text-sm text-muted max-w-sm text-center">
          Premium posters at unbeatable prices. Transform your walls today.
        </p>

        <div className="flex items-center gap-4 mt-2">
          <a
            href="https://www.instagram.com/wallifystore.india?stkn=djZzaWU1bnk1MW45"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group shadow-sm hover:shadow-md"
          >
            <Instagram size={20} className="text-muted group-hover:text-primary transition-colors" />
            <span className="text-sm font-bold text-muted group-hover:text-white transition-colors">
              @wallifystore.india
            </span>
          </a>
        </div>
        
        <p className="text-xs text-muted/50 mt-6 text-center">
          © {new Date().getFullYear()} Wallify Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
