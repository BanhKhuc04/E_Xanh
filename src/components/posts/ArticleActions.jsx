
import { AlertTriangle, Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react'

function ArticleActions({ post, onToggleLike, onToggleSave, onReport, onScrollToComments, onShare }) {
  return (
    <div className="article-actions">
      <button 
        type="button" 
        className={`article-actions__button${post.isLiked ? ' is-accent' : ''}`}
        onClick={onToggleLike}
      >
        <Heart size={18} strokeWidth={2.1} fill={post.isLiked ? "currentColor" : "none"} />
        <span>{post.isLiked ? 'Đã thích' : 'Thích'}</span>
      </button>
      <button type="button" className="article-actions__button" onClick={onScrollToComments}>
        <MessageCircle size={18} strokeWidth={2.1} />
        <span>Bình luận</span>
      </button>
      <button 
        type="button" 
        className={`article-actions__button${post.isSaved ? ' is-accent' : ''}`}
        onClick={onToggleSave}
      >
        <Bookmark size={18} strokeWidth={2.1} fill={post.isSaved ? "currentColor" : "none"} />
        <span>{post.isSaved ? 'Đã lưu' : 'Lưu bài'}</span>
      </button>
      <button type="button" className="article-actions__button" onClick={onShare}>
        <Share2 size={18} strokeWidth={2.1} />
        <span>Chia sẻ</span>
      </button>
      {onReport && (
        <button 
          type="button" 
          className="article-actions__button"
          onClick={onReport}
          style={{ color: '#e53935' }}
        >
          <AlertTriangle size={18} strokeWidth={2.1} />
          <span>Báo cáo</span>
        </button>
      )}
    </div>
  )
}

export default ArticleActions
