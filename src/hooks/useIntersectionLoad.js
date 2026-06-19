import { useState, useEffect, useRef } from 'react'

export function useIntersectionLoad(options = {}) {
  const { root = null, rootMargin = '50px', threshold = 0.01 } = options
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    let observer
    const element = elementRef.current

    if (element) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true)
            // Once it's intersecting, we can stop observing if we only want to load once
            if (observer) {
              observer.unobserve(element)
            }
          }
        },
        { root, rootMargin, threshold }
      )
      observer.observe(element)
    }

    return () => {
      if (observer && element) {
        observer.unobserve(element)
      }
    }
  }, [root, rootMargin, threshold])

  return [elementRef, isIntersecting]
}
