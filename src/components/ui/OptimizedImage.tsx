import { useState, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
  /** Source URL */
  src: string;
  /** Alt text (required for a11y) */
  alt: string;
  /** Explicit width for CLS prevention */
  width?: number | string;
  /** Explicit height for CLS prevention */
  height?: number | string;
  /** Aspect ratio CSS value, used when width/height aren't set (e.g. "4/3", "1/1", "16/9") */
  aspectRatio?: string;
  /** Whether the image is above the fold — disables lazy loading */
  priority?: boolean;
  /** Optional fallback when the image fails to load */
  fallback?: string;
  /** Additional wrapper className (only used when aspectRatio is set) */
  wrapperClassName?: string;
}

/**
 * Optimized image component with:
 * - Lazy loading by default (unless priority)
 * - Width/height or aspect-ratio for CLS prevention
 * - Responsive max-width: 100% + height: auto
 * - Error fallback
 * - Modern format hints via fetchpriority
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  priority = false,
  fallback = '/placeholder.svg',
  className,
  wrapperClassName,
  style,
  ...rest
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallback) {
      setImgSrc(fallback);
      setHasError(true);
    }
  };

  const imgElement = (
    <img
      src={imgSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      {...(width ? { width: Number(width) } : {})}
      {...(height ? { height: Number(height) } : {})}
      onError={handleError}
      className={cn('max-w-full h-auto', className)}
      style={style}
      {...rest}
    />
  );

  // If aspectRatio is provided and no explicit width/height, wrap in a container
  if (aspectRatio && !width && !height) {
    return (
      <div
        className={cn('overflow-hidden', wrapperClassName)}
        style={{ aspectRatio }}
      >
        {imgElement}
      </div>
    );
  }

  return imgElement;
}
