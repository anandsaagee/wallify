import React from 'react';
import { BULK_OFFERS } from '../data/config';
import { Gift } from 'lucide-react';

export const BulkOffers: React.FC = () => {
  return (
    <div className="px-4 py-4" id="offers">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black text-black bg-primary px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            Bulk Offers
          </span>
          <div className="h-[1px] flex-1 bg-black/10" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {BULK_OFFERS.map((offer) => (
            <div
              key={offer.buy}
              className="shrink-0 bg-black/[0.03] border border-black/[0.06] rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Gift className="w-4 h-4 text-black" />
              </div>
              <div className="whitespace-nowrap">
                <p className="text-[10px] font-black text-black">
                  Buy {offer.buy} <span className="bg-primary/30 text-black px-1.5 py-0.5 rounded font-black">+ Get {offer.getFree} Free</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
