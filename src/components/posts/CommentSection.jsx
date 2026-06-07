function CommentSection({ comments }) {
  return (
    <section className="comment-section">
      <h2>Bình luận</h2>

      <div className="comment-section__composer">
        <span className="comment-section__avatar">B</span>
        <div className="comment-section__form">
          <textarea placeholder="Chia sẻ suy nghĩ của bạn..." rows="4"></textarea>
          <div className="comment-section__actions">
            <button type="button" className="btn btn--primary">
              Gửi bình luận
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
