function RecentComments({ comments }) {
  return (
    <section className="account-panel">
      <div className="account-panel__header">
        <h2>Bình luận gần đây</h2>
      </div>

      <div className="account-comments">
        {comments.map((comment) => (
          <article key={comment.id} className="account-comments__item">
            <p>{comment.content}</p>
            <span>Trong bài: {comment.postTitle}</span>
            <div className="account-comments__footer">
              <small>{comment.time}</small>
              <button type="button">Xem bài viết</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentComments
