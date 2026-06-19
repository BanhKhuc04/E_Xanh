import React, { useRef, useState } from 'react'
import { useIntersectionLoad } from '../../hooks/useIntersectionLoad'
import { Video } from 'lucide-react'

export default function SmartVideo({
  src,
  poster,
  className = '',
  ratio = '16/9',
  controls = true,
  muted = false,
  autoPlay = false,
  priority = false,
  rounded = false,
}) {
  const [ref, isIntersecting] = useIntersectionLoad({ rootMargin: '300px' })
  const [hasError, setHasError] = useState(false)

  const shouldLoad = priority || isIntersecting

  const ratioStyles = {
    '16/9': { paddingBottom: '56.25%' },
    '4/3': { paddingBottom: '75%' },
    '1/1': { paddingBottom: '100%' },
    'auto': { paddingBottom: '0' },
  }

  const containerStyle = {
    position: 'relative',
    width: '100%',
    ...ratioStyles[ratio],
    ...(rounded && { borderRadius: typeof rounded === 'string' ? rounded : '8px', overflow: 'hidden' }),
    backgroundColor: '#0f172a',
  }

  const videoStyle = {
    position: ratio === 'auto' ? 'relative' : 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  }

  if (hasError) {
    return (
      <div className={`smart-video-container ${className}`} style={containerStyle}>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', color: '#94a3b8'
        }}>
          <Video size={32} opacity={0.5} />
          <span style={{ fontSize: '12px', marginTop: '8px' }}>Không thể tải video</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={`smart-video-container ${className}`} style={containerStyle}>
      {!shouldLoad && poster && (
        <img 
          src={poster} 
          alt="Video thumbnail" 
          style={{ ...videoStyle, objectFit: 'cover' }} 
          loading="lazy"
        />
      )}
      
      {shouldLoad && src && (
        <video
          src={src}
          poster={poster}
          className="smart-video-element"
          style={videoStyle}
          controls={controls}
          muted={muted}
          autoPlay={autoPlay}
          playsInline
          preload="metadata"
          onError={() => setHasError(true)}
        >
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      )}
    </div>
  )
}
