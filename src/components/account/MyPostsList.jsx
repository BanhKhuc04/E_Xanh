import { useNavigate } from 'react-router-dom'

function MyPostsList({ posts, isPublicView = false }) {
  const navigate = useNavigate()

  function handleView(post) {
    if (post.type === 'community') {
      navigate(`/cong-dong/${post.id}`)
    } else {
      navigate(`/meo-tiet-kiem/${post.slug || post.id}`)
    }
  }

  function handleEdit() {
    // alert('Tính năng chỉnh sửa bài viết đang phát triển!')
  }

  return (
    <section className="account-panel">
      <div className="account-panel__header">
        <h2>{isPublicView ? 'Bài viết đã đăng' : 'Bài viết của tôi'}</h2>
      </div>

      <div className="account-my-posts">
        {posts.map((post) => (
          <article key={post.id || post.title} className="account-my-posts__item">
            <div className="account-my-posts__content">
              <div className="account-my-posts__top">
                <h3>{post.title}</h3>
                {!isPublicView && (
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
                )}
              </div>

              {post.status === 'rejected' && post.rejection_reason && !isPublicView && (
                <div style={{ background: '#f8d7da', color: '#721c24', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <strong>Lý do:</strong> {post.rejection_reason}
                </div>
              )}

              {post.status === 'rejected' && (post.rejection_count || 1) >= 3 && !isPublicView && (
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
              <button type="button" onClick={() => handleView(post)}>Xem</button>
              {!isPublicView && post.status === 'rejected' && (post.rejection_count || 1) < 3 && (
                <button className="btn btn--secondary btn--small" disabled title="Tính năng đang phát triển" aria-disabled="true">Chỉnh sửa/Nộp lại</button>
              )}
              {!isPublicView && post.status !== 'rejected' && (
                <button className="btn btn--secondary btn--small" disabled title="Tính năng đang phát triển" aria-disabled="true">Chỉnh sửa</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyPostsList
