import { useNavigate } from 'react-router-dom'
import PostImage from '../common/PostImage'
import './MyPostsList.css'

function MyPostsList({ posts, isPublicView = false }) {
  const navigate = useNavigate()

  const displayPosts = isPublicView ? posts.filter(p => p.status === 'approved') : posts

  function handleView(post) {
    if (post.type === 'community') {
      navigate(`/cong-dong/${post.id}`)
    } else {
      navigate(`/meo-tiet-kiem/${post.slug || post.id}`)
    }
  }

  if (displayPosts.length === 0) {
    return (
      <section className="account-panel">
        <div className="account-panel__header">
          <h2>{isPublicView ? 'Bài viết đã đăng' : 'Bài viết của tôi'}</h2>
        </div>
        <p style={{ color: '#666' }}>Chưa có bài viết nào.</p>
      </section>
    )
  }

  return (
    <section className="account-panel">
      <div className="account-panel__header">
        <h2>{isPublicView ? 'Bài viết đã đăng' : 'Bài viết của tôi'}</h2>
      </div>

      <div className={isPublicView ? "public-posts-list" : "account-my-posts"}>
        {displayPosts.map((post) => (
          <article key={post.id || post.title} className={isPublicView ? "public-post-card" : "account-my-posts__item"}>
            {isPublicView ? (
              // PUBLIC VIEW (HORIZONTAL DESKTOP, VERTICAL MOBILE)
              <>
                <div className="public-post-card__content">
                  <div className="public-post-card__top">
                    <h3>{post.title}</h3>
                    {post.excerpt && <p className="public-post-card__excerpt">{post.excerpt}</p>}
                  </div>
                  <div className="public-post-card__meta">
                    <span>{post.likes_count || post.likes || 0} thích</span>
                    <span>{post.comments_count || post.comments || 0} bình luận</span>
                  </div>
                  <div className="public-post-card__actions">
                    <button type="button" className="btn btn--primary btn--small" onClick={() => handleView(post)}>Xem bài viết</button>
                  </div>
                </div>
                <div className="public-post-card__thumbnail" onClick={() => handleView(post)}>
                  <PostImage src={post.image_url || post.image} alt={post.title} width={300} height={200} variant="thumbnail" />
                </div>
              </>
            ) : (
              // PRIVATE VIEW
              <>
                <div className="account-my-posts__content">
                  <div className="account-my-posts__top">
                    <h3>{post.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span
                        className={`account-my-posts__status ${
                          post.status === 'Đã duyệt' || post.status === 'approved' ? 'is-approved' : 
                          post.status === 'rejected' ? 'is-rejected' : 'is-pending'
                        }`}
                      >
                        {post.status === 'approved' ? 'Đã duyệt' : (post.status === 'pending' ? 'Chờ duyệt' : post.status === 'rejected' ? 'Bị từ chối' : post.status)}
                      </span>
                      {post.status === 'rejected' && (
                        <span style={{ fontSize: '0.8rem', color: '#721c24' }}>
                          Bị từ chối: {post.rejection_count || 1}/3
                        </span>
                      )}
                    </div>
                  </div>

                  {post.status === 'rejected' && post.rejection_reason && (
                    <div style={{ background: '#f8d7da', color: '#721c24', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                      <strong>Lý do:</strong> {post.rejection_reason}
                    </div>
                  )}

                  {post.status === 'rejected' && (post.rejection_count || 1) >= 3 && (
                    <div style={{ color: '#d32f2f', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px' }}>
                      Bài viết đã bị từ chối quá 3 lần và không thể nộp lại.
                    </div>
                  )}

                  <div className="account-my-posts__meta">
                    <span>{post.likes_count || post.likes || 0} thích</span>
                    <span>{post.comments_count || post.comments || 0} bình luận</span>
                  </div>
                </div>

                <div className="account-my-posts__actions">
                  <button type="button" className="btn btn--primary btn--small" onClick={() => handleView(post)}>Xem bài viết</button>
                  {post.status === 'rejected' && (post.rejection_count || 1) < 3 && (
                    <button className="btn btn--secondary btn--small" disabled title="Tính năng đang phát triển" aria-disabled="true">Chỉnh sửa/Nộp lại</button>
                  )}
                  {post.status !== 'rejected' && (
                    <button className="btn btn--secondary btn--small" disabled title="Tính năng đang phát triển" aria-disabled="true">Chỉnh sửa</button>
                  )}
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyPostsList
