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
            className={`whitespace-nowrap px-5 py-2.5 min-h-[44px] rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border inline-flex items-center justify-center no-underline ${
              isSelected
                ? 'bg-primary text-black border-primary shadow-md shadow-primary/25 ring-2 ring-primary/20'
                : 'bg-surface text-black border-black/15 hover:bg-black/5 hover:border-black/30 active:scale-95'
            }`}
          >
            <span className="text-black font-black leading-none tracking-tight">
              {category}
            </span>
          </a>
        );
      })}
    </div>
  </nav>
);
