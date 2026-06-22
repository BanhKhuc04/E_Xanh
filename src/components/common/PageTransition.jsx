import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0], // smooth cubic-bezier
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.25,
      ease: 'easeInOut',
    },
  },
}

export default function PageTransition({ children, className = '' }) {
  const location = useLocation()

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={className}
      style={{ minHeight: '100%' }} // Ensure it stretches fully
    >
      {children}
    </motion.div>
  )
}
