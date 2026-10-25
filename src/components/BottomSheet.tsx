import React, { useEffect, useRef, useCallback, useState } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isActive, setIsActive] = useState(false);
  const cachedChildren = useRef<React.ReactNode>(children);
  const scrollYRef = useRef<number>(0);

  if (children) {
    cachedChildren.current = children;
  }

  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;

      const prevOverflow = document.body.style.overflow;
      const prevOverscroll = document.body.style.overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';

      setIsMounted(true);
      const rAF = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsActive(true);
        });
      });

      return () => {
        cancelAnimationFrame(rAF);
        document.body.style.overflow = prevOverflow;
        document.body.style.overscrollBehavior = prevOverscroll;
        if (Math.abs(window.scrollY - scrollYRef.current) > 2) {
          window.scrollTo({ top: scrollYRef.current, behavior: 'instant' });
        }
      };
    } else {
      setIsActive(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isMounted) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, handleKeyDown]);

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop — stays dark for modal readability */}
      <div
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
        className="fixed inset-0 z-[100] transition-opacity duration-300 ease-out"
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? 'auto' : 'none',
        }}
      />

      {/* Sheet — white surface, dark text */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Product details"
        className="fixed bottom-0 left-0 right-0 mx-auto z-[110] flex flex-col max-h-[85dvh] sm:max-h-[80vh] sm:max-w-[440px] bg-white rounded-t-3xl border-t border-black/10 shadow-[0_-16px_80px_rgba(0,0,0,0.18)] overflow-hidden will-change-transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isActive ? 'translateY(0)' : 'translateY(100%)',
          opacity: isActive ? 1 : 0.2,
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <div className="shrink-0 relative">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-black/15" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-4 z-30 w-10 h-10 rounded-full bg-black/[0.06] flex items-center justify-center transition-transform duration-150 active:scale-90 hover:bg-black/10"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        {children || cachedChildren.current}
      </div>
    </>
  );
};
