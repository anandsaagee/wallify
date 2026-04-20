import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (top) window.scrollTo(0, parseInt(top) * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100]"
            style={{
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* ── Bottom Sheet ── */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340, mass: 0.7 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 400) onClose();
            }}
            className="fixed left-0 right-0 mx-auto sm:max-w-[440px] bottom-0 z-[110] flex flex-col max-h-[85dvh] sm:max-h-[80vh] h-auto bg-[#111111] rounded-t-3xl border-t border-white/5 shadow-[0_-16px_80px_rgba(0,0,0,0.7)] overflow-hidden will-change-transform"
            role="dialog"
            aria-modal="true"
          >
            {/* ── Fixed Header: grab handle + close ── */}
            <div className="shrink-0 relative">
              {/* Grab handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 100,
                    background: 'rgba(255,255,255,0.2)',
                  }}
                />
              </div>

              {/* Close button — large, thumb-friendly, spaced from edge */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute z-30 active:scale-90 transition-transform"
                style={{
                  top: 14,
                  right: 16,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X style={{ width: 20, height: 20, color: '#fff' }} />
              </button>
            </div>

            {/* ── Scrollable Content Area ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain hide-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
