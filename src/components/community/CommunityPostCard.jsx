import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const HeartIcon = ({ isLiked }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
  </svg>
)

const CommentIcon = ({ isActive }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const SaveIcon = ({ isSaved }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

function CommunityPostCard({
  post,
  onToggleLike,
  onToggleSave,
  onToggleComment,
  onToggleShare,
  onAddComment,
  isCommentActive,
  isShareActive,
  postComments,
  currentUser
}) {
  const [commentText, setCommentText] = useState('')
  const [toast, setToast] = useState('')
  const shareRef = useRef(null)
  const commentRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (isShareActive && shareRef.current && !shareRef.current.contains(event.target)) {
        onToggleShare(null) // Đóng khi click ngoài
      }
      
      // Close comments if clicking outside the comment area and not on the comment toggle button itself
      if (isCommentActive && commentRef.current && !commentRef.current.contains(event.target)) {
        // Find if they clicked the comment toggle button by checking closest
        const isCommentButton = event.target.closest('.comment-toggle-btn');
        if (!isCommentButton) {
          onToggleComment(post.id) // This will toggle it off
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isShareActive, isCommentActive, onToggleShare, onToggleComment, post.id])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const shareUrl = `${window.location.origin}/cong-dong/${post.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      showToast('Đã sao chép liên kết bài viết')
    } catch {
      showToast('Lỗi khi sao chép liên kết')
    }
    onToggleShare(null)
  }

  const handleSubmitComment = () => {
    if (!commentText.trim()) return
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để bình luận')
      return
    }
    const success = onAddComment(post.id, commentText)
    if (success) {
      setCommentText('')
    }
  }



  return (
    <article className="community-post-card" id={post.id}>
      <div className="community-post-card__header">
        <div className="community-post-card__author">
          <img src={post.avatar} alt={post.author} />
          <div>
            <strong>{post.author}</strong>
            <span>
              {post.time} {post.role ? `• ${post.role}` : ''}
            </span>
          </div>
        </div>
        <span className="community-post-card__menu">...</span>
      </div>

      <div className="community-post-card__tags">
        <span className="community-post-card__tag community-post-card__tag--primary">{post.topic}</span>
        <span className="community-post-card__tag">{post.category}</span>
      </div>

      <div className="community-post-card__body">
        <Link to={`/cong-dong/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </Link>
      </div>

      {post.image ? (
        <div className="community-post-card__media">
          <Link to={`/cong-dong/${post.id}`}>
            <img src={post.image} alt={post.title} />
          </Link>
        </div>
      ) : null}

      {/* Buttons */}
      <div className="community-post-card__actions" style={{ position: 'relative' }}>
        <button
          type="button"
          className={post.isLiked ? 'is-active' : ''}
          onClick={() => onToggleLike(post.id)}
        >
          <HeartIcon isLiked={post.isLiked} /> Thích {post.likes}
        </button>
        <button
          type="button"
          className={`comment-toggle-btn ${isCommentActive ? 'is-active' : ''}`}
          onClick={() => onToggleComment(post.id)}
        >
          <CommentIcon isActive={isCommentActive} /> Bình luận {post.commentsCount}
        </button>
        <button
          type="button"
          className={post.isSaved ? 'is-active' : ''}
          onClick={() => onToggleSave(post.id)}
        >
          <SaveIcon isSaved={post.isSaved} /> {post.isSaved ? 'Đã lưu' : 'Lưu bài'} {post.savedCount}
        </button>
        <div style={{ position: 'relative' }} ref={shareRef}>
          <button type="button" className={isShareActive ? 'is-active' : ''} onClick={() => onToggleShare(post.id)}>
            <ShareIcon /> Chia sẻ {post.shares}
          </button>
          
          {isShareActive && (
            <div className="community-post-card__share-modal" style={{ padding: '12px', minWidth: '300px', cursor: 'default' }}>
              <div style={{ fontSize: '0.85rem', marginBottom: '8px', color: '#555', textAlign: 'left' }}>Liên kết bài viết:</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  onClick={(e) => e.target.select()}
                  style={{ flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', outline: 'none', backgroundColor: '#f9f9f9', color: '#333' }} 
                />
                <button 
                  className="btn btn--primary" 
                  onClick={handleCopyLink} 
                  style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '4px', whiteSpace: 'nowrap' }}
                >
                  Sao chép
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Comments */}
      {isCommentActive && (
        <div ref={commentRef} style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(79, 132, 40, 0.1)' }}>
          <div className="community-post-card__comments">
            {postComments && postComments.length > 0 ? (
              postComments.map((comment) => (
                <div key={comment.id} className="community-post-card__comment" style={{ background: 'transparent', padding: '8px 0' }}>
                  <img src={comment.avatar} alt={comment.author} />
                  <div style={{ background: 'rgba(234, 245, 157, 0.16)', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(79, 132, 40, 0.05)' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#173715' }}>{comment.author}</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '0.95rem', color: '#333' }}>{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#888', textAlign: 'center', fontSize: '0.9rem' }}>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
            )}
          </div>
          
          <div className="community-post-card__comment-input-area">
            <img 
              src={currentUser?.avatar_url || `https://ui-avatars.com/api/?name=${currentUser?.name || 'G'}&background=c1d95c&color=fff`} 
              alt="Bạn" 
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea 
                rows="2" 
                placeholder="Viết bình luận..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmitComment()
                  }
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
                {!currentUser && <span style={{ color: '#e53935', fontSize: '0.85rem' }}>Vui lòng đăng nhập để bình luận</span>}
                <button 
                  className="btn btn--primary" 
                  style={{ padding: '6px 16px', fontSize: '0.85rem', opacity: !commentText.trim() ? 0.5 : 1 }}
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Fallback old preview when comments are NOT expanded */}
      {!isCommentActive && post.previewComments && post.previewComments.length > 0 && (
        <div className="community-post-card__comments" style={{ marginTop: '16px' }}>
          {post.previewComments.slice(0, 1).map((comment) => (
            <div key={comment.id} className="community-post-card__comment">
              <img src={comment.avatar} alt={comment.author} />
              <div>
                <strong>{comment.author}</strong>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="au-toast" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, background: '#333', color: '#fff', padding: '12px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          {toast}
        </div>
      )}
    </article>
  )
}

export default CommunityPostCard
