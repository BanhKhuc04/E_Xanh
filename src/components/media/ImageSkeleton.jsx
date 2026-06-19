import React from 'react'

export default function ImageSkeleton({ className = '', ratio = '16/9', rounded = false }) {
  const ratioStyles = {
    '16/9': { paddingBottom: '56.25%' },
    '4/3': { paddingBottom: '75%' },
    '1/1': { paddingBottom: '100%' },
    'auto': { paddingBottom: '0' },
  }

  const baseStyle = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    width: '100%',
    ...ratioStyles[ratio],
    ...(rounded && { borderRadius: typeof rounded === 'string' ? rounded : '8px' })
  }

  return (
    <div className={`image-skeleton ${className}`} style={baseStyle}>
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear'
        }} 
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
