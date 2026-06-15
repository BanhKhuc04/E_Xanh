import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'e-xanh-composer-split-ratio'
const DEFAULT_RATIO = 52
const MIN_LEFT_WIDTH = 480
const MIN_RIGHT_WIDTH = 420
const HANDLE_WIDTH = 16

function readStoredRatio() {
  if (typeof window === 'undefined') {
    return DEFAULT_RATIO
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    return DEFAULT_RATIO
  }

  const parsed = Number.parseFloat(saved)
  if (Number.isNaN(parsed) || parsed < 30 || parsed > 70) {
    return DEFAULT_RATIO
  }

  return parsed
}

function persistRatio(nextRatio) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, String(nextRatio))
}

function ComposerSplitLayout({ leftPane, rightPane }) {
  const containerRef = useRef(null)
  const [ratio, setRatio] = useState(readStoredRatio)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function syncViewport() {
      setIsMobile(window.innerWidth < 960)
    }

    syncViewport()
    window.addEventListener('resize', syncViewport)

    return () => {
      window.removeEventListener('resize', syncViewport)
    }
  }, [])

  const handlePointerMove = useCallback((event) => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const usableWidth = containerRect.width - HANDLE_WIDTH

    let nextLeftWidth = event.clientX - containerRect.left
    nextLeftWidth = Math.max(MIN_LEFT_WIDTH, nextLeftWidth)
    nextLeftWidth = Math.min(nextLeftWidth, usableWidth - MIN_RIGHT_WIDTH)

    const nextRatio = (nextLeftWidth / usableWidth) * 100
    setRatio(Number(nextRatio.toFixed(2)))
  }, [])

  const stopDragging = useCallback(() => {
    setIsDragging(false)
    persistRatio(ratio)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [ratio])

  useEffect(() => {
    if (!isDragging) {
      return undefined
    }

    function handleWindowMove(event) {
      handlePointerMove(event)
    }

    function handleWindowUp() {
      stopDragging()
    }

    window.addEventListener('pointermove', handleWindowMove)
    window.addEventListener('pointerup', handleWindowUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      window.removeEventListener('pointermove', handleWindowMove)
      window.removeEventListener('pointerup', handleWindowUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [handlePointerMove, isDragging, stopDragging])

  function handlePointerDown(event) {
    if (isMobile) return
    setIsDragging(true)
    event.preventDefault()
  }

  function handleResetRatio() {
    setRatio(DEFAULT_RATIO)
    persistRatio(DEFAULT_RATIO)
  }

  if (isMobile) {
    return (
      <div className="composer-split-layout composer-split-layout--mobile">
        <section className="composer-split-pane composer-split-pane--left">
          {leftPane}
        </section>
        <section className="composer-split-pane composer-split-pane--right">
          {rightPane}
        </section>
      </div>
    )
  }

  return (
    <div className="composer-split-layout" ref={containerRef}>
      <section
        className="composer-split-pane composer-split-pane--left"
        style={{
          width: `${ratio}%`,
          minWidth: `${MIN_LEFT_WIDTH}px`,
        }}
      >
        {leftPane}
      </section>

      <button
        type="button"
        className={`composer-split-handle${isDragging ? ' is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleResetRatio}
        title="Kéo để thay đổi kích thước. Double click để đưa về 52/48."
        aria-label="Thanh kéo thay đổi kích thước hai cột"
      >
        <span className="composer-split-handle-indicator" />
      </button>

      <section
        className="composer-split-pane composer-split-pane--right"
        style={{
          width: `${100 - ratio}%`,
          minWidth: `${MIN_RIGHT_WIDTH}px`,
        }}
      >
        {rightPane}
      </section>
    </div>
  )
}

export default ComposerSplitLayout
