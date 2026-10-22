import React from 'react';
import { SIZES } from '../data/config';


export const Pricing: React.FC = () => {
  return (
    <div className="px-4 py-4" id="pricing">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black text-black bg-primary px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            Pricing
          </span>
          <div className="h-[1px] flex-1 bg-black/10" />
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => (
            <div
              key={size.id}
              className="bg-surface border border-black/8 rounded-xl p-2 text-center shadow-sm"
            >
              <p className="text-[9px] font-black text-black uppercase tracking-tighter mb-0.5">
                {size.label}
              </p>
              <div className="flex items-center justify-center gap-1">
                <p className="text-sm font-black text-black">
                  ₹{size.price}
                </p>
                {size.strikePrice && (
                  <p className="text-[10px] font-semibold text-black/40 line-through">
                    ₹{size.strikePrice}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
