import { useState } from 'react';
import { CameraOff } from 'lucide-react';
import './OptimizedImage.css';

const RATIO_MAP = {
  '1/1': 'aspect-square',
  '16/9': 'aspect-video',
  '4/3': 'aspect-4-3',
  '3/4': 'aspect-3-4',
  'auto': 'aspect-auto'
};

const OptimizedImage = ({
  src,
  variants,
  alt = 'Image',
  ratio = 'auto',
  objectFit = 'cover',
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes,
  className = '',
  fallbackText = 'Không có ảnh',
  showFallbackWhenEmpty = true,
  ...props
}) => {
  const [status, setStatus] = useState('loading');

  const defaultSrc = variants?.detail || variants?.card || variants?.thumb || src;

  const [prevDefaultSrc, setPrevDefaultSrc] = useState(defaultSrc);

  if (defaultSrc !== prevDefaultSrc) {
    setPrevDefaultSrc(defaultSrc);
    setStatus(!defaultSrc ? 'empty' : 'loading');
  }

  const generateSrcSet = () => {
    if (!variants) return undefined;
    const parts = [];
    if (variants.thumb) parts.push(`${variants.thumb} 360w`);
    if (variants.card) parts.push(`${variants.card} 900w`);
    if (variants.detail) parts.push(`${variants.detail} 1440w`);
    return parts.length > 0 ? parts.join(', ') : undefined;
  };

  const srcSet = generateSrcSet();
  const defaultSizes = sizes || (variants ? '(max-width: 640px) 360px, (max-width: 1024px) 900px, 1440px' : undefined);

  const aspectClass = RATIO_MAP[ratio] || RATIO_MAP['auto'];
  const objectFitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  if (status === 'empty' && !showFallbackWhenEmpty) {
    return null;
  }

  return (
    <div className={`optimized-image-wrapper ${aspectClass} ${className}`}>
      {(status === 'empty' || status === 'error') && (
        <div className="optimized-image-fallback">
          <CameraOff />
          <span>{fallbackText}</span>
        </div>
      )}

      {status === 'loading' && defaultSrc && (
        <div className="optimized-image-skeleton" />
      )}

      {defaultSrc && status !== 'empty' && (
        <img
          src={defaultSrc}
          srcSet={srcSet}
          sizes={defaultSizes}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          className={`optimized-image-img ${objectFitClass} ${status === 'success' ? 'is-loaded' : ''}`}
          onLoad={() => setStatus('success')}
          onError={() => setStatus('error')}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
