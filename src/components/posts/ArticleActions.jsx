

function ArticleActions({ post, onToggleLike, onToggleSave }) {
  return (
    <div className="article-actions">
      <button 
        type="button" 
        className={`article-actions__button${post.isLiked ? ' is-accent' : ''}`}
        onClick={onToggleLike}
      >
        {post.isLiked ? 'Đã thích' : 'Thích'}
      </button>
      <button type="button" className="article-actions__button">Bình luận</button>
      <button 
        type="button" 
        className={`article-actions__button${post.isSaved ? ' is-accent' : ''}`}
        onClick={onToggleSave}
      >
        {post.isSaved ? 'Đã lưu' : 'Lưu bài'}
      </button>
      <button type="button" className="article-actions__button">Chia sẻ</button>
    </div>
  )
}

export default ArticleActions
