import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFeaturedPosts } from '../../services/postService'

function FeaturedPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await getFeaturedPosts()
        if (error) throw error
        
        console.log('--- DEBUG getFeaturedPosts ---')
        console.log('Total returned:', data?.length)
        data?.forEach(p => {
          console.log(`[${p.id}] ${p.title} | Status: ${p.status} | Image: ${p.image_url ? 'YES' : 'NO'}`)
        })
        console.log('------------------------------')

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

  function getInitials(name) {
    if (!name) return 'U'
    return name.charAt(0).toUpperCase()
  }

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
      navigate(`/meo-tiet-kiem/${post.slug}`)
    }
  }

  const DEFAULT_IMAGE = 'https://placehold.co/600x400/eaf7df/4f8428?text=E-XANH'

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
            const authorName = post.profiles?.name || 'Ẩn danh'
            return (
              <article 
                key={post.id} 
                className="home-post-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => handlePostClick(post)}
              >
                <div className="home-post-card__media">
                  <img src={post.image_url || DEFAULT_IMAGE} alt={post.title} />
                  <span className="home-post-card__tag">{getTypeLabel(post.type)}</span>
                  <button type="button" aria-label={`Lưu bài viết ${post.title}`} onClick={(e) => {
                    e.stopPropagation();
                    alert('Chức năng lưu bài viết đang phát triển!');
                  }}>
                    Lưu
                  </button>
                </div>

                <div className="home-post-card__body">
                  <h3>{post.title}</h3>

                  <div className="home-post-card__meta">
                    <span className="home-avatar home-avatar--primary">
                      {getInitials(authorName)}
                    </span>
                    <strong>{authorName}</strong>
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
