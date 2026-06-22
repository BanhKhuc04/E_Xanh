import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (latest > 0.02 && !isVisible) {
        setIsVisible(true)
      } else if (latest <= 0.02 && isVisible) {
        setIsVisible(false)
      }
    })
  }, [scrollYProgress, isVisible])

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ 
        scaleX,
        opacity: isVisible ? 1 : 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'var(--color-primary, #4f8428)', // Fallback green
        transformOrigin: '0%',
        zIndex: 9999,
        transition: 'opacity 0.3s ease'
      }}
    />
  )
}
