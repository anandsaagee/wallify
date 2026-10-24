import React from 'react';
import { CATEGORIES, Category } from '../data/config';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => (
  <nav className="w-full py-2.5" aria-label="Filter posters by category">
    <div
      className="flex items-center gap-2 px-4 overflow-x-auto py-1 hide-scrollbar scroll-momentum overscroll-contain"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {CATEGORIES.map((category: Category) => {
        const isSelected = selectedCategory === category;
        const href = category === 'All' ? '/' : `/category/${category.toLowerCase()}`;
        return (
          <a
            key={category}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory(category);
            }}
            aria-pressed={isSelected}
            className={`whitespace-nowrap px-5 py-2.5 min-h-[44px] rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border inline-flex items-center justify-center no-underline shrink-0 select-none active:scale-95 ${
              isSelected
                ? 'bg-primary text-black border-primary shadow-md shadow-primary/25 ring-2 ring-primary/20'
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {category}
          </a>
        );
      })}
    </div>
  </nav>
);
