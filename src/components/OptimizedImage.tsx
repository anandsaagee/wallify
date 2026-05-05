import React, { useState } from 'react';
import { useReducedMotion } from '../utils/optimizations';
import { LoadingSkeleton } from './LoadingSkeleton';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  containerClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps & { priority?: boolean }> = ({
  src,
  alt,
  width = 600,
  height = 800,
  className = '',
  containerClassName = '',
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Premium shimmer effect for placeholders
  const shimmerClass = "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent";

  return (
    <div 
      className={`relative overflow-hidden bg-[#121212] ${containerClassName} ${!isLoaded ? shimmerClass : ''}`} 
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSkeleton className="w-full h-full" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        // @ts-ignore
        fetchpriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`
          absolute inset-0 w-full h-full object-cover
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
          ${!prefersReducedMotion ? 'transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)' : ''}
          ${className}
        `}
        {...props}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-white/5 flex flex-col items-center justify-center text-muted text-[10px] text-center p-4">
          <span className="text-xl mb-2">🖼️</span>
          Image Unavailable
        </div>
      )}
    </div>
  );
};
