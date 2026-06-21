import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, MessageCircle, UserRound } from 'lucide-react'
import PostAuthorAvatar from '../posts/PostAuthorAvatar'
import heroImage from '../../assets/hero.png'
import OptimizedImage from '../common/OptimizedImage'

function FeaturedPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const { getFeaturedPosts } = await import('../../services/postService')
        const { data, error } = await getFeaturedPosts()
        if (error) throw error
        
        if (data) {
          setPosts(data)
        }
      } catch (err) {
        console.error('Lỗi lấy bài viết nổi bật:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function getTypeLabel(type) {
    switch (type) {
      case 'tip': return 'Mẹo tiết kiệm'
      case 'community': return 'Cộng đồng'
      case 'qa': return 'Hỏi đáp'
      case 'review': return 'Review'
      default: return 'Bài viết'
    }
  }

  function handlePostClick(post) {
    if (post.type === 'community') {
      navigate(`/cong-dong/${post.id}`)
    } else {
      navigate(`/meo-tiet-kiem/${post.slug || post.id}`)
    }
  }

  const DEFAULT_IMAGE = heroImage

  return (
    <section className="home-section">
      <div className="home-section__header">
        <div>
          <h2>Bài viết nổi bật</h2>
          <p>Những mẹo hay được cộng đồng quan tâm nhất</p>
        </div>

        <Link className="home-section__link" to="/meo-tiet-kiem">
          Xem tất cả
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
          Đang tải bài viết...
        </div>
      ) : posts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: 'rgba(234, 245, 157, 0.3)', 
          borderRadius: '24px',
          border: '1px dashed rgba(79, 132, 40, 0.3)',
          width: '100%'
        }}>
          <h3 style={{ color: 'var(--color-primary-500)', fontSize: '1.2rem', marginBottom: '8px' }}>Chưa có bài viết nổi bật</h3>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Các bài viết được duyệt sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="home-post-grid">
          {posts.map((post) => {
            const authorName = post.profiles?.name || 'Thành viên E-XANH'
            const authorHref = post.author_id ? `/nguoi-dung/${post.author_id}` : null
            return (
              <article 
                key={post.id} 
                className="home-post-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => handlePostClick(post)}
              >
                <div className="home-post-card__media">
                  <OptimizedImage
                    src={post.cover_card_url || post.cover_url || post.image_url || DEFAULT_IMAGE}
                    variants={{
                      card: post.cover_card_url,
                      thumb: post.cover_thumb_url
                    }}
                    alt={`${post.title} - mẹo tiết kiệm điện`}
                    ratio="16/9"
                  />
                  <span className="home-post-card__tag">{getTypeLabel(post.type)}</span>
                  <button 
                    className="fp-card__save-btn" 
                    title="Lưu bài viết"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Vui lòng vào xem chi tiết bài viết để lưu nhé!');
                    }}
                  >
                    <Bookmark size={18} strokeWidth={2.1} />
                  </button>
                </div>

                <div className="home-post-card__body">
                  <h3>{post.title}</h3>
                  <p className="home-post-card__excerpt">
                    {post.description || 'Khám phá mẹo tiết kiệm điện thực tế, dễ áp dụng mỗi ngày cùng E-XANH.'}
                  </p>

                  <div className="home-post-card__stats">
                    <span>{post.likes_count || 0} lượt thích</span>
                    <span>{post.saved_count || 0} lượt lưu</span>
                    <span>
                      <MessageCircle size={14} strokeWidth={2.1} />
                      {post.comments_count || 0} bình luận
                    </span>
                  </div>

                  <div className="home-post-card__meta">
                    <Link
                      to={authorHref || '#'}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!authorHref) e.preventDefault()
                      }}
                      className={`home-post-card__author-link${authorHref ? '' : ' is-disabled'}`}
                      aria-disabled={authorHref ? undefined : 'true'}
                    >
                      <PostAuthorAvatar
                        src={post.profiles?.avatar_url}
                        name={authorName}
                        size="sm"
                      />
                      <span className="home-post-card__author-copy">
                        <strong>{authorName}</strong>
                        <small>
                          <UserRound size={12} strokeWidth={2} />
                          Thành viên E-XANH
                        </small>
                      </span>
                    </Link>
                    <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default FeaturedPosts
