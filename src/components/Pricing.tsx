import React from 'react';
import { SIZES } from '../data/config';

export const Pricing: React.FC = () => {
  return (
    <div className="px-4 py-4" id="pricing">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-black text-primary uppercase tracking-widest">
            Pricing
          </span>
          <div className="h-[1px] flex-1 bg-black/10" />
        </div>
        
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {SIZES.map((size) => (
            <div
              key={size.id}
              className="bg-black/[0.03] border border-black/[0.08] rounded-xl p-2.5 sm:p-3 text-center"
            >
              <p className="text-[11px] sm:text-xs font-black text-primary uppercase tracking-tighter mb-1">
                {size.label}
              </p>
              <div className="flex items-center justify-center gap-1 flex-wrap">
                <p className="text-sm sm:text-base font-black text-gray-900">
                  ₹{size.price}
                </p>
                {size.strikePrice && (
                  <p className="text-[11px] font-semibold text-gray-400 line-through">
                    ₹{size.strikePrice}
                  </p>
                )}
              </div>
              {size.dim && (
                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 font-medium">
                  {size.dim}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
