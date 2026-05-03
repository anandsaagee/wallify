import React from 'react';
import { SIZES } from '../data/config';
import { motion } from 'framer-motion';

export const Pricing: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4" id="pricing">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            Unbeatable Prices
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-3">
            Premium Single Posters
          </h2>
        </div>

        {/* Price grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {SIZES.map((size, index) => (
            <motion.div
              key={size.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8 text-center hover:border-primary/20 hover:bg-white/[0.05] transition-all duration-300"
            >
              {/* Size label */}
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                {size.label}
              </span>

              {/* Price */}
              <div className="mt-4 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  ₹{size.price}
                </span>
              </div>

              {/* Dimensions */}
              <p className="text-xs text-muted font-medium">{size.dim}</p>

              {/* Hover accent */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: '0 0 40px rgba(250,203,21,0.05)',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-[11px] text-muted mt-8 font-medium">
          Prices are fixed. No hidden charges. Bulk offers available below.
        </p>
      </div>
    </section>
  );
};
