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

        {/* SEO Content Block */}
        <div className="max-w-2xl text-center px-4 mt-4 mb-4">
          <p className="text-[11px] sm:text-xs text-muted/70 leading-relaxed font-medium">
            Looking for the perfect aesthetic wall posters to elevate your bedroom or hostel setup? You've come to the right place. At Wallify Store, we know that generic, flimsy prints just don't cut it when you want to build a space that truly reflects your vibe. Whether you're hunting for a high-octane JDM poster for your garage, a cult classic Malayalam movie poster, or the ultimate anime poster combo set, we deliver museum-quality, HD wall posters straight to your door across Kerala and all of India. Dive in to discover how our premium, fade-resistant prints can instantly upgrade your room aesthetic!
          </p>
        </div>

        {/* SEO Internal Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2 max-w-3xl px-4 text-[11px] font-semibold text-muted/60">
          <span className="text-muted/40">Explore more:</span>
          <a href="/anime-wall-posters" className="hover:text-primary transition-colors hover:underline">Premium Anime Posters</a>
          <span className="text-white/10">•</span>
          <a href="/film-wall-posters" className="hover:text-primary transition-colors hover:underline">Cult Classic Movie Posters</a>
          <span className="text-white/10">•</span>
          <a href="/car-wall-posters" className="hover:text-primary transition-colors hover:underline">JDM & Supercar Posters</a>
          <span className="text-white/10">•</span>
          <a href="/custom-wall-posters" className="hover:text-primary transition-colors hover:underline">Custom Poster Printing Kerala</a>
        </div>

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
