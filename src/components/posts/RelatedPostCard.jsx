import { Link } from 'react-router-dom'
import { Clock3, MessageCircle, Heart } from 'lucide-react'
import SmartImage from '../media/SmartImage'
import heroImage from '../../assets/hero.png'

function RelatedPostCard({ post }) {
  if (!post) return null
  
  const postUrl = `/meo-tiet-kiem/${post.slug || post.id}`
  const imageUrl = post.image || heroImage
  
  return (
    <Link to={postUrl} className="exanh-related-card">
      <div className="exanh-related-card__imageWrap">
        <SmartImage
          src={imageUrl}
          alt={post.title || 'Bài viết E-XANH'}
          ratio="16/9"
          className="exanh-related-card__image"
          priority={false}
        />
      </div>
      
      <div className="exanh-related-card__body">
        <h3 className="exanh-related-card__title">{post.title}</h3>
        
        {post.description && (
          <p className="exanh-related-card__excerpt">{post.description}</p>
        )}
        
        <div className="exanh-related-card__meta">
          <span className="exanh-related-card__category">{post.category || 'Mẹo tiết kiệm'}</span>
          
          {post.date && (
            <span className="exanh-related-card__metaItem">
              <Clock3 size={12} strokeWidth={2.5} />
              {post.date}
            </span>
          )}
          
          {(post.likes > 0 || post.comments > 0) && (
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              {post.likes > 0 && (
                <span className="exanh-related-card__metaItem">
                  <Heart size={12} strokeWidth={2.5} />
                  {post.likes}
                </span>
              )}
              {post.comments > 0 && (
                <span className="exanh-related-card__metaItem">
                  <MessageCircle size={12} strokeWidth={2.5} />
                  {post.comments}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default RelatedPostCard
