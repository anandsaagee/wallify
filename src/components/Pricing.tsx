import React from 'react';
import { SIZES } from '../data/config';


export const Pricing: React.FC = () => {
  return (
    <div className="px-4 py-4" id="pricing">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            Pricing
          </span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => (
            <div
              key={size.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2 text-center"
            >
              <p className="text-[9px] font-black text-primary uppercase tracking-tighter mb-0.5">
                {size.label}
              </p>
              <p className="text-sm font-black text-white">
                ₹{size.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
