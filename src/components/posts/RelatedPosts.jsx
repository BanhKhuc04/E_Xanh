import { Link } from 'react-router-dom'
import heroImage from '../../assets/hero.png'
import SmartImage from '../media/SmartImage'
import { Clock3 } from 'lucide-react'

function RelatedPosts({ title, posts, compact = false }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className={`related-posts${compact ? ' related-posts--compact' : ''}`}>
      <h2>{title}</h2>
      <div className="related-posts__list">
        {posts.map((post) => (
          <Link key={post.id} to={`/meo-tiet-kiem/${post.slug || post.id}`} className="related-posts__item">
            <div className="related-posts__item-media">
              <SmartImage
                src={post.image || heroImage}
                alt={post.title}
                ratio="4/3"
              />
            </div>
            <div className="related-posts__item-body">
              <h3 className="related-posts__item-title">{post.title}</h3>
              <div className="related-posts__item-meta">
                <span className="related-posts__item-category">{post.category || 'Mẹo tiết kiệm'}</span>
                {post.date && (
                  <span className="related-posts__item-date">
                    <Clock3 size={10} strokeWidth={2.5} style={{marginRight: '3px', verticalAlign: '-1px'}} />
                    {post.date}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
