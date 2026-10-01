import React, { useState, useMemo } from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { getImageUrl } from '../utils/imageUrl';

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

  // Transform local paths to Cloudinary CDN URLs
  const cloudinarySrc = useMemo(
    () => getImageUrl(src, { width: typeof width === 'number' ? width : undefined }),
    [src, width]
  );

  return (
    <div
      className={`relative overflow-hidden bg-[#121212] ${containerClassName}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSkeleton className="w-full h-full" />
        </div>
      )}

      <img
        src={cloudinarySrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-expect-error: fetchpriority is not yet in React types
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
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
