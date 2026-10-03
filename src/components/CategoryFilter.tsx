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
  <div className="w-full py-3 overflow-hidden" role="group" aria-label="Filter by category">
    <div
      className="flex items-center gap-2 px-4 overflow-x-auto pb-1 hide-scrollbar scroll-momentum"
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
            className={`whitespace-nowrap px-5 py-2.5 min-h-[44px] rounded-full text-[11px] font-bold transition-all duration-200 border inline-flex items-center justify-center no-underline ${
              isSelected
                ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {category}
          </a>
        );
      })}
    </div>
  </div>
);
