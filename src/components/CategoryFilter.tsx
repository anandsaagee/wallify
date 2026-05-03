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
    <div className="flex items-center gap-2 px-4 overflow-x-auto pb-1 hide-scrollbar">
      {CATEGORIES.map((category: Category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            aria-pressed={isSelected}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-200 border ${
              isSelected
                ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  </div>
);
