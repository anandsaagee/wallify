import React from 'react';
import { Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-background/95 border-t border-black/8 mt-auto">
      <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center gap-5">

        {/* Brand with logo */}
        <div className="flex items-center gap-3">
          <img
            src="/wallify-logo.jpg"
            alt="Wallify logo"
            className="w-9 h-9 rounded-xl object-cover"
          />
          <h3 className="font-display text-2xl sm:text-3xl text-black">
            WallifyStore<span className="text-primary">.</span>
          </h3>
        </div>

        <p className="font-body text-sm text-black/80 max-w-sm text-center leading-relaxed font-medium">
          Premium posters at unbeatable prices. Transform your walls today.
        </p>

        {/* SEO Content Block */}
        <div className="max-w-2xl text-center px-2">
          <p className="font-body text-xs text-muted/70 leading-relaxed">
            Looking for premium aesthetic wall posters to elevate your bedroom or hostel setup?
            At Wallify Store, we deliver museum-quality, HD wall posters across Kerala and all of India.
            Anime, JDM, movie, and custom posters on fade-resistant thick paper with vibrant colours and fast delivery.
          </p>
        </div>

        {/* SEO Internal Links */}
        <nav
          aria-label="Category navigation"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-2xl px-4 font-body text-xs font-semibold text-muted/70"
        >
          <span className="text-muted/40">Explore:</span>
          <a href="/category/anime" className="hover:text-primary transition-colors hover:underline">Anime Posters</a>
          <span className="text-white/10">•</span>
          <a href="/category/hollywood" className="hover:text-primary transition-colors hover:underline">Cinema &amp; Hollywood</a>
          <span className="text-white/10">•</span>
          <a href="/category/automotive" className="hover:text-primary transition-colors hover:underline">JDM &amp; Supercars</a>
          <span className="text-white/10">•</span>
          <a href="/category/mollywood" className="hover:text-primary transition-colors hover:underline">Malayalam Posters</a>
          <span className="text-white/10">•</span>
          <a href="/category/football" className="hover:text-primary transition-colors hover:underline">Football Art</a>
          <span className="text-white/10">•</span>
          <a href="/category/quotes" className="hover:text-primary transition-colors hover:underline">Motivational Quotes</a>
        </nav>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/wallifystore.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-full border border-black/15 bg-black/5 hover:bg-black/10 transition-colors group shadow-sm hover:shadow-md min-h-[44px]"
        >
          <Instagram size={18} className="text-black group-hover:text-black transition-colors" />
          <span className="font-body text-sm font-bold text-black transition-colors">
            @wallifystore.in
          </span>
        </a>

        <p className="font-body text-xs text-muted/50 text-center">
          © {new Date().getFullYear()} WallifyStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
