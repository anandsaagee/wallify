import React from 'react';
import { BULK_OFFERS } from '../data/config';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

export const BulkOffers: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-surface/50" id="offers">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            Save More with Bulk
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-3">
            Bulk Offers
          </h2>
          <p className="text-sm text-muted mt-3 font-medium">
            No Hidden Discounts — Free posters are completely independent and selectable by you.
          </p>
        </div>

        {/* Offers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {BULK_OFFERS.map((offer, index) => (
            <motion.div
              key={offer.buy}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8 hover:border-primary/20 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      Buy {offer.buy}
                    </span>
                    <span className="text-sm font-bold text-muted">→</span>
                    <span className="text-2xl sm:text-3xl font-black text-primary">
                      Get {offer.getFree} FREE
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-2 font-medium">
                    Choose any {offer.getFree} poster{offer.getFree > 1 ? 's' : ''} absolutely free. No price changes.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rules */}
        <div className="mt-10 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
          <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4">
            Offer Rules
          </h3>
          <ul className="space-y-2 text-xs text-muted font-medium">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Free posters are completely independent — you choose which ones.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              No price discounts under any condition — pricing always remains fixed.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Offers only increase quantity, never reduce price.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
