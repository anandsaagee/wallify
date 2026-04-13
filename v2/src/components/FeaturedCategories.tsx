import React, { useMemo } from 'react';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: string) => void;
}

const FEATURED = [
  { name: 'Automotive', sub: 'High-Octane Art' },
  { name: 'Aesthetic', sub: 'Vibrant Modern Vibes' },
  { name: 'Mollywood', sub: 'Cinematic Legends' }
];

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const getThumbnail = (category: string) => {
    const catProducts = products.filter(p => p.category === category);
    return catProducts[Math.floor(Math.random() * catProducts.length)]?.image;
  };

  return (
    <section className="px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURED.map((cat) => (
          <div 
            key={cat.name}
            onClick={() => {
              onSelectCategory(cat.name);
              const filterEl = document.getElementById('category-filter-section');
              if (filterEl) filterEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative h-[350px] rounded-premium overflow-hidden border border-white/10 cursor-pointer"
          >
            {/* Tag */}
            <div className="absolute top-4 left-4 z-20 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
              Featured
            </div>

            {/* Image */}
            <img 
              src={getThumbnail(cat.name)} 
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                {cat.name}
              </h3>
              <div className="flex items-center gap-2 text-primary font-bold text-sm mt-2 opacity-80 group-hover:opacity-100 transition-all">
                {cat.sub} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
