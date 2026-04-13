import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '10%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 h-[90vh] bg-surface rounded-t-[32px] border-t border-white/10 z-[110] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Grab handle */}
            <div className="w-full flex justify-center py-3">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 glass rounded-full z-20 active:scale-95"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
