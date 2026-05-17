import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const Hero: React.FC<{ onShopNow: () => void; onExplore: () => void }> = ({
  onShopNow,
  onExplore,
}) => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-[85vh] sm:min-h-[90vh]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-surface" />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #FACB15 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Content — staggered entrance */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6 sm:gap-8"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-[0.15em]">
            Premium Poster Store
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.95] tracking-tight"
        >
          Transform Your Walls{' '}
          <br className="hidden sm:block" />
          with{' '}
          <span className="relative">
            <span className="text-primary">Wallify</span>
            <span className="text-primary">.</span>
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-muted text-base sm:text-lg md:text-xl max-w-xl font-medium leading-relaxed"
        >
          Premium posters at unbeatable prices.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2"
        >
          <button
            onClick={onShopNow}
            className="px-8 py-4 bg-primary text-black font-black text-sm sm:text-base rounded-full transition-all duration-200 active:scale-95 hover:brightness-110 shadow-[0_8px_32px_rgba(250,203,21,0.25)]"
          >
            Shop Now
          </button>
          <button
            onClick={onExplore}
            className="px-8 py-4 font-bold text-white rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/10 active:scale-95 transition-all duration-200 text-sm sm:text-base"
          >
            Explore Collection
          </button>
        </motion.div>

        {/* WhatsApp Custom Order CTA */}
        <motion.a
          variants={fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          href="https://wa.me/917736497186?text=Hi!%20I%27d%20like%20to%20customize%20my%20own%20car%20poster%20or%20frame%20%F0%9F%9A%97%F0%9F%96%BC%EF%B8%8F"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 active:scale-95 transition-all duration-200 group"
        >
          {/* Official WhatsApp SVG icon in green */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5 shrink-0"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="24" fill="#25D366" />
            <path
              fill="#fff"
              d="M34.6 13.4A14.9 14.9 0 0 0 24 9C16.3 9 10 15.3 10 23c0 2.5.7 4.9 1.9 7L10 39l9.3-1.9a15 15 0 0 0 4.7.8C31.7 38 38 31.7 38 24c0-4-1.6-7.8-3.4-10.6zM24 35.7c-2.1 0-4.2-.6-6-1.6l-.4-.3-4.4.9.9-4.3-.3-.5A12.1 12.1 0 0 1 12 23c0-6.6 5.4-12 12-12 3.2 0 6.2 1.2 8.5 3.5A11.9 11.9 0 0 1 36 23c0 6.6-5.4 12-12 12zm6.6-9c-.4-.2-2.1-1-2.4-1.1-.3-.1-.6-.2-.8.2-.3.4-1 1.1-1.2 1.3-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6z"
            />
          </svg>
          <span className="text-[#25D366] font-bold text-sm group-hover:text-white transition-colors duration-200">
            Customize your car poster or frame
          </span>
        </motion.a>

        {/* Trust indicators */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center gap-6 sm:gap-8 mt-4 text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-[1px] bg-white/10" />
            <span>Free Posters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-[1px] bg-white/10" />
            <span>Premium Quality</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-[1px] bg-white/10" />
            <span>Fast Delivery</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
