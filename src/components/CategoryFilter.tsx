import React from 'react';

const CATEGORIES = [
  'All',
  'Automotive',
  'Mollywood',
  'Football',
  'Anime',
  'Aesthetic',
  'Classic Cars',
] as const;

type Category = (typeof CATEGORIES)[number];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => (
  <div
    className="w-full py-4 overflow-hidden"
    role="group"
    aria-label="Filter by category"
  >
    <div className="flex items-center gap-2.5 px-4 overflow-x-auto pb-1 hide-scrollbar">
      {CATEGORIES.map((category: Category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            aria-pressed={isSelected}
            aria-label={`Filter by ${category}`}
            className={`
              whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold
              transition-all duration-200 border
              ${
                isSelected
                  ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20 scale-105'
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  </div>
);
