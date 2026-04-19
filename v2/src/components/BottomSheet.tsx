import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            style={{ WebkitBackdropFilter: 'blur(4px)' }}
          />

          {/* Sheet — slides up to fill most of screen */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.05}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 500) onClose();
            }}
            className="fixed left-0 right-0 bottom-0 z-[110] flex flex-col"
            style={{
              height: '92dvh',
              maxHeight: '92dvh',
              background: '#111111',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
              willChange: 'transform',
            }}
          >
            {/* Grab handle */}
            <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 p-2 rounded-full z-20 active:scale-90 transition-transform"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Scrollable Content */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
              }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
