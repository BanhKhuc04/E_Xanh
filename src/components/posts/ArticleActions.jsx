
import { AlertTriangle, Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { triggerLikeBurst } from '../../utils/animations'

function ArticleActions({ post, onToggleLike, onToggleSave, onReport, onScrollToComments, onShare }) {
  return (
    <div className="article-actions">
      <motion.button 
        type="button" 
        whileTap={{ scale: 0.85 }}
        className={`article-actions__button${post.isLiked ? ' is-accent' : ''}`}
        onClick={(e) => {
          if (!post.isLiked) triggerLikeBurst(e);
          if (onToggleLike) onToggleLike();
        }}
      >
        <Heart size={18} strokeWidth={2.1} fill={post.isLiked ? "currentColor" : "none"} />
        <span>{post.isLiked ? 'Đã thích' : 'Thích'}</span>
      </motion.button>
      <motion.button type="button" whileTap={{ scale: 0.9 }} className="article-actions__button" onClick={onScrollToComments}>
        <MessageCircle size={18} strokeWidth={2.1} />
        <span>Bình luận</span>
      </motion.button>
      <motion.button 
        type="button" 
        whileTap={{ scale: 0.9 }}
        className={`article-actions__button${post.isSaved ? ' is-accent' : ''}`}
        onClick={onToggleSave}
      >
        <Bookmark size={18} strokeWidth={2.1} fill={post.isSaved ? "currentColor" : "none"} />
        <span>{post.isSaved ? 'Đã lưu' : 'Lưu bài'}</span>
      </motion.button>
      <motion.button type="button" whileTap={{ scale: 0.9 }} className="article-actions__button" onClick={onShare}>
        <Share2 size={18} strokeWidth={2.1} />
        <span>Chia sẻ</span>
      </motion.button>
      {onReport && (
        <motion.button 
          type="button" 
          whileTap={{ scale: 0.9 }}
          className="article-actions__button"
          onClick={onReport}
          style={{ color: '#e53935' }}
        >
          <AlertTriangle size={18} strokeWidth={2.1} />
          <span>Báo cáo</span>
        </motion.button>
      )}
    </div>
  )
}

export default ArticleActions
