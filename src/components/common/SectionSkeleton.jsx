import '../../styles/loading.css'

function SectionSkeleton({ 
  count = 3, 
  height = '120px', 
  radius = '16px', 
  gap = '20px',
  className = ''
}) {
  return (
    <div 
      className={`section-skeleton ${className}`}
      style={{
        '--skeleton-gap': gap,
        '--skeleton-height': height,
        '--skeleton-radius': radius
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="section-skeleton__item"></div>
      ))}
    </div>
  )
}

export default SectionSkeleton
