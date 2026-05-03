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

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Try to determine AVIF/WebP paths if the src is a local asset or standard path
  // Since we might not have them generated yet, we'll just use the original src for now
  // but wrap it in a way that provides skeleton loading and lazy loading.

  return (
    <div 
      className={`relative overflow-hidden ${containerClassName}`} 
      style={{ width, height }}
    >
      {!isLoaded && !hasError && (
        <LoadingSkeleton className="absolute inset-0 w-full h-full" />
      )}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`
          w-full h-full object-cover
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${!prefersReducedMotion ? 'transition-opacity duration-300 ease-in-out' : ''}
          ${className}
        `}
        {...props}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-muted text-xs text-center p-2">
          Failed to load image
        </div>
      )}
    </div>
  );
};
