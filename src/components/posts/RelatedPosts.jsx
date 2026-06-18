import { Link } from 'react-router-dom'
import heroImage from '../../assets/hero.png'
import PostImage from '../common/PostImage'

function RelatedPosts({ title, posts, compact = false }) {
  return (
    <section className={`related-posts${compact ? ' related-posts--compact' : ''}`}>
      <h2>{title}</h2>
      <div className="related-posts__list">
        {posts.map((post) => (
          <Link key={post.id} to={`/meo-tiet-kiem/${post.slug || post.id}`} className="related-posts__item">
            <PostImage
              src={post.image || heroImage}
              alt={post.title}
              variant="thumbnail"
              aspect="1:1"
            />
            <div>
              <h3>{post.title}</h3>
              {compact ? <span>{post.date}</span> : <p>{post.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
