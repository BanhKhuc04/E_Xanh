function CommunityPostCard({ post, onToggleLike, onToggleSave }) {
  return (
    <article className="community-post-card">
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
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
      </div>

      {post.image ? (
        <div className="community-post-card__media">
          <img src={post.image} alt={post.title} />
        </div>
      ) : null}

      {post.previewComments.length > 0 ? (
        <div className="community-post-card__comments">
          {post.previewComments.slice(0, 2).map((comment) => (
            <div key={comment.id} className="community-post-card__comment">
              <img src={comment.avatar} alt={comment.author} />
              <div>
                <strong>{comment.author}</strong>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="community-post-card__actions">
        <button
          type="button"
          className={post.isLiked ? 'is-active' : ''}
          onClick={() => onToggleLike(post.id)}
        >
          Thích {post.likes}
        </button>
        <button type="button">Bình luận {post.commentsCount}</button>
        <button
          type="button"
          className={post.isSaved ? 'is-active' : ''}
          onClick={() => onToggleSave(post.id)}
        >
          {post.isSaved ? 'Đã lưu' : 'Lưu bài'} {post.savedCount}
        </button>
        <button type="button">Chia sẻ {post.shares}</button>
      </div>
    </article>
  )
}

export default CommunityPostCard
