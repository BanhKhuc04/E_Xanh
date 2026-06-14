import { useState, useEffect } from 'react'

function CommentSection({ comments: mockComments, post }) {
  const [comments, setComments] = useState(mockComments || [])
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function init() {
      const { getCurrentSession } = await import('../../services/authService')
      const session = await getCurrentSession()
      setUser(session?.user || null)
      
      if (post?.id && String(post.id).length > 30) {
        const { getCommentsByPostId } = await import('../../services/interactionService')
        const { data } = await getCommentsByPostId(post.id)
        if (data) {
          setComments(data.map(c => ({
            id: c.id,
            author: c.profiles?.name || c.profiles?.email || 'Người dùng ẩn danh',
            time: new Date(c.created_at).toLocaleDateString('vi-VN'),
            content: c.content,
            likes: c.likes_count || 0
          })))
        }
      } else {
        setComments(mockComments || [])
      }
    }
    init()
  }, [post?.id, mockComments])

  async function handleSubmit() {
    const trimmedContent = content.trim()
    if (!trimmedContent || isSubmitting) return
    if (trimmedContent.length > 1000) {
      alert('Bình luận tối đa 1000 ký tự.')
      return
    }
    if (!user) {
      alert('Bạn cần đăng nhập để bình luận.')
      return
    }
    if (!post?.id || String(post.id).length < 30) {
      alert('Không thể bình luận trên bài viết mẫu.')
      return
    }

    setIsSubmitting(true)
    const { addComment } = await import('../../services/interactionService')
    const { data, error } = await addComment(post.id, trimmedContent)
    if (error) {
      alert(error.message)
    } else if (data) {
      setContent('')
      setComments(prev => [...prev, {
        id: data.id,
        author: data.profiles?.name || data.profiles?.email || 'Bạn',
        time: 'Vừa xong',
        content: data.content,
        likes: 0
      }])
    }
    setIsSubmitting(false)
  }

  return (
    <section className="comment-section">
      <h2>Bình luận</h2>

      <div className="comment-section__composer">
        <span className="comment-section__avatar">
          {user ? (user.user_metadata?.name?.[0] || user.email?.[0] || 'U').toUpperCase() : '?'}
        </span>
        <div className="comment-section__form">
          <textarea 
            placeholder={user ? "Chia sẻ suy nghĩ của bạn..." : "Bạn cần đăng nhập để bình luận"} 
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!user}
            maxLength={1000}
          ></textarea>
          <div className="comment-section__actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: content.length > 1000 ? '#e53935' : content.length > 900 ? '#f57c00' : '#888' }}>
              {content.length}/1000 ký tự
            </span>
            <button 
              type="button" 
              className="btn btn--primary" 
              onClick={handleSubmit} 
              disabled={isSubmitting || !user || !content.trim() || content.length > 1000}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        </div>
      </div>

      <div className="comment-section__list">
        {comments.map((comment) => (
          <article key={comment.id} className="comment-item">
            <span className="comment-item__avatar">
              {comment.author
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')
                .toUpperCase()}
            </span>
            <div className="comment-item__body">
              <div className="comment-item__meta">
                <strong>{comment.author}</strong>
                <span>{comment.time}</span>
              </div>
              <p>{comment.content}</p>
              <div className="comment-item__footer">
                <span>{comment.likes} thích</span>
                <button type="button">Trả lời</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CommentSection
