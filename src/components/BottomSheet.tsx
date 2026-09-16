import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {isOpen && (
        <>
          <div
            onClick={onClose}
            className="fixed inset-0 z-[100] transition-opacity duration-200"
            style={{
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product details"
            className="fixed bottom-0 left-0 right-0 mx-auto z-[110] flex flex-col max-h-[85dvh] sm:max-h-[80vh] sm:max-w-[440px] bg-surface rounded-t-3xl border-t border-white/5 shadow-[0_-16px_80px_rgba(0,0,0,0.7)] overflow-hidden will-change-transform"
            style={{
              WebkitOverflowScrolling: 'touch',
              // Ensure dialog clears home indicator & notch sides in landscape
              paddingBottom: 'env(safe-area-inset-bottom)',
              paddingLeft: 'env(safe-area-inset-left)',
              paddingRight: 'env(safe-area-inset-right)',
            }}
          >
            <div className="shrink-0 relative">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3.5 right-4 z-30 w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center transition-transform duration-150 active:scale-90 hover:bg-white/15"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {children}
          </div>
        </>
      )}
    </>
  );
};
