import React from 'react';
import { SIZES } from '../data/config';

interface SizeFilterProps {
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export const SizeFilter: React.FC<SizeFilterProps> = ({ selectedSize, onSelectSize }) => (
  <div className="w-full py-2 overflow-hidden" role="group" aria-label="Filter by size">
    <div className="flex items-center gap-2 px-4 overflow-x-auto pb-1 hide-scrollbar">
      <button
        onClick={() => onSelectSize('All')}
        aria-pressed={selectedSize === 'All'}
        className={`whitespace-nowrap px-4 py-2 min-h-[44px] rounded-full text-[11px] font-bold transition-all duration-200 border ${
          selectedSize === 'All'
            ? 'bg-white/10 text-white border-white/20'
            : 'bg-white/[0.03] text-muted border-white/[0.06] hover:bg-white/5'
        }`}
      >
        All Sizes
      </button>
      {SIZES.map((size) => {
        const isSelected = selectedSize === size.id;
        return (
          <button
            key={size.id}
            onClick={() => onSelectSize(size.id)}
            aria-pressed={isSelected}
            className={`whitespace-nowrap px-4 py-2 min-h-[44px] rounded-full text-[11px] font-bold transition-all duration-200 border flex items-center gap-1.5 ${
              isSelected
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-white/[0.03] text-muted border-white/[0.06] hover:bg-white/5'
            }`}
          >
            <span>{size.label}</span>
            <span className="text-[10px] opacity-60">₹{size.price}</span>
          </button>
        );
      })}
    </div>
  </div>
);
