import { motion } from 'framer-motion'
import { Award, Leaf, Zap, Star } from 'lucide-react'
import './UserBadges.css'

const BADGES_DB = {
  pioneer: {
    id: 'pioneer',
    label: 'Tiên phong Sống Xanh',
    description: 'Thành viên thế hệ đầu tiên của nền tảng.',
    icon: <Leaf size={20} />,
    color: 'emerald'
  },
  active: {
    id: 'active',
    label: 'Thành viên Tích cực',
    description: 'Chia sẻ nhiều bài viết hữu ích.',
    icon: <Star size={20} />,
    color: 'amber'
  },
  energy: {
    id: 'energy',
    label: 'Bậc thầy Tiết kiệm',
    description: 'Sử dụng công cụ tính toán điện thường xuyên.',
    icon: <Zap size={20} />,
    color: 'blue'
  },
  influencer: {
    id: 'influencer',
    label: 'Người truyền cảm hứng',
    description: 'Được nhiều người theo dõi.',
    icon: <Award size={20} />,
    color: 'purple'
  }
}

// In a real app, this would be computed from user stats or fetched from DB
function getBadgesForUser(profile) {
  const badges = []
  
  // Dựa vào DB
  if (profile?.badges && Array.isArray(profile.badges)) {
    profile.badges.forEach(bId => {
      if (BADGES_DB[bId]) badges.push(BADGES_DB[bId])
    })
  }

  // Tự động gán huy hiệu dựa theo points
  if (profile?.points > 50 && !badges.includes(BADGES_DB.active)) {
    badges.push(BADGES_DB.active)
  }
  if (profile?.points > 200 && !badges.includes(BADGES_DB.energy)) {
    badges.push(BADGES_DB.energy)
  }

  // Fallback demo
  if (badges.length === 0) {
    badges.push(BADGES_DB.pioneer)
    if (profile?.role === 'admin' || profile?.role === 'moderator') {
      badges.push(BADGES_DB.influencer)
    }
  }

  return badges
}

export default function UserBadges({ profile }) {
  const badges = getBadgesForUser(profile)

  if (!badges.length) return null

  return (
    <div className="user-badges">
      <h3 className="user-badges__title">Thành tựu</h3>
      <div className="user-badges__list">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            className={`user-badge user-badge--${badge.color}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            title={badge.description}
          >
            <div className="user-badge__icon">
              {badge.icon}
            </div>
            <span className="user-badge__label">{badge.label}</span>
            <div className="user-badge__shimmer"></div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
