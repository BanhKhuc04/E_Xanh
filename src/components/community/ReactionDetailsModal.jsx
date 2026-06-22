import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPostReactionsDetails } from '../../services/interactionService'
import { followUser, unfollowUser } from '../../services/followService'
import { REACTIONS } from './ReactionPopover'

export default function ReactionDetailsModal({ postId, onClose }) {
  const [loading, setLoading] = useState(true)
  const [reactions, setReactions] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    async function load() {
      const { data } = await getPostReactionsDetails(postId)
      setReactions(data || [])
      setLoading(false)
    }
    load()
  }, [postId])

  const counts = { all: reactions.length }
  REACTIONS.forEach(r => {
    counts[r.type] = reactions.filter(x => x.reactionType === r.type).length
  })

  const availableTabs = ['all', ...REACTIONS.map(r => r.type).filter(type => counts[type] > 0)]

  const filteredReactions = activeTab === 'all' 
    ? reactions 
    : reactions.filter(r => r.reactionType === activeTab)

  const handleToggleFollow = async (userId, isFollowing) => {
    setReactions(prev => prev.map(r => 
      r.userId === userId ? { ...r, isFollowing: !isFollowing } : r
    ))

    if (isFollowing) {
      await unfollowUser(userId)
    } else {
      await followUser(userId)
    }
  }

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--color-surface, #fff)',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Lượt tương tác</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)', overflowX: 'auto' }}>
            {availableTabs.map(tab => {
              const rObj = tab === 'all' ? null : REACTIONS.find(r => r.type === tab)
              const label = tab === 'all' ? 'Tất cả' : rObj.icon
              const count = counts[tab]
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    fontSize: '1rem',
                    fontWeight: activeTab === tab ? '600' : '400',
                    color: activeTab === tab ? 'var(--color-primary-600, #4f8428)' : 'var(--color-text-muted, #64748b)',
                    borderBottom: activeTab === tab ? '2px solid var(--color-primary-600, #4f8428)' : '2px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {label} {count}
                </button>
              )
            })}
          </div>

          <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>Đang tải...</div>
            ) : filteredReactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>Chưa có tương tác nào.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredReactions.map(r => {
                  const rObj = REACTIONS.find(x => x.type === r.reactionType)
                  return (
                    <div key={r.userId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Link to={`/nguoi-dung/${r.userId}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ position: 'relative' }}>
                          <img loading="lazy" src={r.avatar || `https://ui-avatars.com/api/?name=${r.name}&background=c1d95c&color=fff`} alt={r.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', fontSize: '14px', background: '#fff', borderRadius: '50%', border: '1px solid #fff', lineHeight: 1 }}>
                            {rObj?.icon || '👍'}
                          </span>
                        </div>
                        <span style={{ fontWeight: '500' }}>{r.name}</span>
                      </Link>

                      {!r.isCurrentUser && (
                        <button
                          onClick={() => handleToggleFollow(r.userId, r.isFollowing)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 12px', borderRadius: '20px',
                            border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500',
                            background: r.isFollowing ? 'rgba(0,0,0,0.05)' : 'var(--color-primary-500, #4f8428)',
                            color: r.isFollowing ? 'var(--color-text-main, #1e293b)' : '#fff'
                          }}
                        >
                          {r.isFollowing ? <><Check size={14}/> Đang theo dõi</> : <><UserPlus size={14}/> Theo dõi</>}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
