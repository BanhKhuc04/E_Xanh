import { useEffect, useRef } from 'react'

function revealNode(node) {
  if (!node) return
  node.classList.add('is-visible')
}

function AuthLayout({ hero, form, pageClassName = '' }) {
  const heroRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver !== 'function') {
      revealNode(heroRef.current)
      revealNode(formRef.current)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealNode(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    if (heroRef.current) observer.observe(heroRef.current)
    if (formRef.current) observer.observe(formRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className={`auth-page ${pageClassName}`.trim()}>
      <div className="auth-shell">
        <div className="auth-grid">
          <div ref={heroRef} className="auth-grid__hero reveal-on-scroll">
            {hero}
          </div>
          <div ref={formRef} className="auth-grid__form reveal-on-scroll auth-grid__form--delayed">
            {form}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
