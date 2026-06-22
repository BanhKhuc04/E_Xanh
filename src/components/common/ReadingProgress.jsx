import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setIsVisible(latest > 0.05 && latest < 0.95)
    })
  }, [scrollYProgress])

  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        transformOrigin: '0%',
        background: 'linear-gradient(90deg, var(--color-primary-300), var(--color-primary-500))',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    />
  )
}

export default ReadingProgress
