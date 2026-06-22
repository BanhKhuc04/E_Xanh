import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ThumbsUp } from 'lucide-react'
import { triggerReactionBurst } from '../../utils/animations'

export const REACTIONS = [
  { type: 'like', icon: '👍', label: 'Thích', color: '#1877F2' },
  { type: 'love', icon: '❤️', label: 'Yêu thích', color: '#F33E58' },
  { type: 'haha', icon: '😂', label: 'Haha', color: '#F7B125' },
  { type: 'wow', icon: '😮', label: 'Wow', color: '#F7B125' },
  { type: 'sad', icon: '😢', label: 'Buồn', color: '#F7B125' },
  { type: 'angry', icon: '😡', label: 'Phẫn nộ', color: '#E9710F' },
]

export default function ReactionPopover({ currentReaction, onSelectReaction, onToggleLike, disabled }) {
  const [showPopover, setShowPopover] = useState(false)
  const hoverTimeoutRef = useRef(null)
  const pressTimeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (disabled) return
    clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => setShowPopover(true), 400)
  }

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => setShowPopover(false), 300)
  }

  const handleTouchStart = () => {
    if (disabled) return
    clearTimeout(pressTimeoutRef.current)
    pressTimeoutRef.current = setTimeout(() => setShowPopover(true), 400)
  }

  const handleTouchEnd = () => {
    clearTimeout(pressTimeoutRef.current)
  }

  const handleClickReaction = (e, reaction) => {
    e.stopPropagation()
    setShowPopover(false)
    if (currentReaction === reaction.type) {
      // Nhấn lại cảm xúc đang chọn => Unlike
      onToggleLike(e, null)
    } else {
      onSelectReaction(e, reaction.type)
      triggerReactionBurst(e, reaction.type)
    }
  }

  const handleClickDefault = (e) => {
    e.stopPropagation()
    if (showPopover) {
      setShowPopover(false)
      return
    }
    // Nếu chưa có cảm xúc thì like, nếu có rồi thì bỏ like
    if (!currentReaction) {
      onSelectReaction(e, 'like')
      triggerReactionBurst(e, 'like')
    } else {
      onToggleLike(e, null)
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutRef.current)
      clearTimeout(pressTimeoutRef.current)
    }
  }, [])

  const activeReactionObj = currentReaction ? REACTIONS.find(r => r.type === currentReaction) : null

  return (
    <div 
      className="reaction-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <AnimatePresence>
        {showPopover && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.15 } }}
            className="reaction-popover"
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '10px',
              backgroundColor: '#fff',
              borderRadius: '30px',
              padding: '6px 10px',
              display: 'flex',
              gap: '6px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zIndex: 50,
              pointerEvents: 'auto'
            }}
          >
            {REACTIONS.map((reaction, index) => (
              <motion.button
                key={reaction.type}
                type="button"
                whileHover={{ scale: 1.3, originY: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleClickReaction(e, reaction)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
                title={reaction.label}
              >
                {reaction.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`post-action-btn ${currentReaction ? 'is-active' : ''}`}
        onClick={handleClickDefault}
        disabled={disabled}
        whileTap={{ scale: 0.9 }}
        style={{
          color: activeReactionObj ? activeReactionObj.color : 'inherit',
          gap: '6px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {activeReactionObj ? (
          <span style={{ fontSize: '18px', lineHeight: 1 }}>{activeReactionObj.icon}</span>
        ) : (
          <Heart size={18} />
        )}
        <span>{activeReactionObj ? activeReactionObj.label : 'Thích'}</span>
      </motion.button>
    </div>
  )
}
