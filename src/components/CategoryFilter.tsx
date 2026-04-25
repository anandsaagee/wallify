import React from 'react';

const CATEGORIES = [
  'All', 'Automotive', 'Mollywood', 'Football', 'Anime', 'Aesthetic', 'Classic Cars'
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="w-full py-4 overflow-hidden max-w-full">
      <div className="flex items-center gap-2.5 px-4 overflow-x-auto">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
              selectedCategory === category
                ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
            } glass`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
