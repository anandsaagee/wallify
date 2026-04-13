import React, { useState } from 'react';

const SIZES = [
  { id: 'A6', label: 'A6', price: 17, strikePrice: 33 },
  { id: 'A5', label: 'A5', price: 33, strikePrice: 49 },
  { id: 'A4', label: 'A4', price: 49, strikePrice: 99 },
  { id: 'A3', label: 'A3', price: 99, strikePrice: 149 }
];

interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface ProductPreviewProps {
  product: Product;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('A5');

  return (
    <div className="flex flex-col">
      {/* Image Section */}
      <div className="px-4">
        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-white/5 relative shadow-2xl">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="px-6 pt-6 flex flex-col gap-6">
        <div>
          <span className="text-xs text-primary font-black uppercase tracking-widest">{product.category}</span>
          <h2 className="text-2xl font-black text-white mt-1 leading-tight">{product.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-black text-primary">₹33</span>
            <span className="text-sm text-muted line-through opacity-50">₹49</span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-white/60">Select Size <span className="text-primary">*</span></label>
          <div className="grid grid-cols-2 gap-3">
            {SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  selectedSize === size.id
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-white/5 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-sm font-black">{size.label}</span>
                <span className="text-[10px] font-bold opacity-70">₹{size.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Offers Section (Minimal) */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-2">
          <span className="text-xs font-black text-primary flex items-center gap-2">
            🎁 BUNDLE OFFERS
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-[10px] font-bold text-white/60 bg-white/5 p-2 rounded-lg">Buy 5 → 1 Free</div>
            <div className="text-[10px] font-bold text-white/60 bg-white/5 p-2 rounded-lg">Buy 10 → 3 Free</div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 glass border-t border-white/5 bg-background/80">
        <button className="w-full py-4 btn-primary text-base">
          Add to Bag — ₹33
        </button>
      </div>
    </div>
  );
};
