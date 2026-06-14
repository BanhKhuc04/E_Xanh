import { Link } from 'react-router-dom'

function RecentComments({ comments }) {
  return (
    <section className="account-panel">
      <div className="account-panel__header">
        <h2>Bình luận gần đây</h2>
      </div>

      <div className="account-comments">
        {comments.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Bạn chưa có bình luận nào.</p>
        ) : comments.map((comment) => (
          <article key={comment.id} className="account-comments__item">
            <p>{comment.content}</p>
            <span>Trong bài: {comment.postTitle}</span>
            <div className="account-comments__footer">
              <small>{comment.time}</small>
              <Link to={`/meo-tiet-kiem/${comment.postSlug || comment.postId}`} className="btn btn--secondary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Xem bài viết</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentComments
