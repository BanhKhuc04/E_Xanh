import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Globe2, Mail, Phone, Sparkles, Target, Users } from 'lucide-react'
import '../../styles/static-pages.css'
import BrandLogo from '../../components/common/BrandLogo'
import PageHero from '../../components/common/PageHero'
import { pageHeroContent } from '../../data/pageHeroes'

const teamMembers = [
  // Thêm ảnh tại public/images/team/ rồi cập nhật đúng tên file ở trường image bên dưới.
  { name: 'Vũ Thị Thu Trang', role: 'Trưởng dự án', image: '/images/team/thu-trang.jpg', bio: 'Điều phối định hướng nội dung và kết nối các đầu việc của dự án E-XANH.' },
  { name: 'Vũ Ngọc Hải', role: 'Designer', image: '/images/team/ngoc-hai.jpg', bio: 'Thiết kế nhận diện trực quan và xây dựng trải nghiệm thương hiệu nhất quán.' },
  { name: 'Trần Mạnh Tuấn', role: 'Media', image: '/images/team/manh-tuan.jpg', bio: 'Phụ trách media, hỗ trợ kể câu chuyện E-XANH qua hình ảnh và video.' },
  { name: 'Trịnh Thị Ngọc Ánh', role: 'Content', image: '/images/team/ngoc-anh.jpg', bio: 'Phát triển nội dung truyền thông gần gũi với sinh viên và Gen Z.' },
  { name: 'Đỗ Yến Nhi', role: 'Content', image: '/images/team/yen-nhi.jpg', bio: 'Chắt lọc thông điệp thực tế để lan tỏa thói quen sử dụng điện tiết kiệm hơn.' },
  { name: 'Khúc Việt Anh', role: 'Web Developer', image: '/images/team/viet-anh.jpg', bio: 'Phát triển website và hoàn thiện các tính năng số cho hệ sinh thái E-XANH.' },
]

const missionHighlights = [
  {
    icon: Sparkles,
    title: 'Lan tỏa nhận thức',
    description: 'Biến kiến thức tiết kiệm điện thành thông điệp dễ hiểu, gần gũi và phù hợp với sinh viên FPT Hà Nội cùng Gen Z.',
  },
  {
    icon: Target,
    title: 'Khuyến khích hành động',
    description: 'Giúp người dùng bắt đầu từ những thay đổi nhỏ nhưng bền vững trong sinh hoạt, học tập và đời sống hằng ngày.',
  },
  {
    icon: Users,
    title: 'Kết nối cộng đồng',
    description: 'Tạo không gian để mọi người chia sẻ kinh nghiệm, câu hỏi và cảm hứng sống xanh một cách tự nhiên hơn.',
  },
]

const contactItems = [
  { label: 'Facebook', value: 'facebook.com/exanhh', href: 'https://www.facebook.com/exanhh', icon: Globe2 },
  { label: 'TikTok', value: '@exanh6', href: 'https://www.tiktok.com/@exanh6', icon: Sparkles },
  { label: 'Email', value: 'exanh.official@gmail.com', href: 'mailto:exanh.official@gmail.com', icon: Mail },
  { label: 'Điện thoại', value: '0971381612', href: 'tel:0971381612', icon: Phone },
]

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

function TeamMemberAvatar({ name, image }) {
  const [hasError, setHasError] = useState(false)

  return (
    <div className="about-page__member-avatar" data-has-image={String(Boolean(image && !hasError))}>
      {image && !hasError ? (
        <img src={image} alt={`Ảnh thành viên ${name}`} loading="lazy" onError={() => setHasError(true)} />
      ) : null}
      <span aria-hidden={image && !hasError ? 'true' : 'false'}>{getInitials(name)}</span>
    </div>
  )
}

function AboutPage() {
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const OG_IMAGE = 'https://e-xanh.vercel.app/og-image-v2.png'

  return (
    <div className="static-page about-page">
      <Helmet>
        <title>Về chúng tôi — E-XANH</title>
        <meta
          name="description"
          content="Tìm hiểu về dự án E-XANH, đội ngũ thực hiện và sứ mệnh nâng cao nhận thức sử dụng điện tiết kiệm hơn cho sinh viên FPT Hà Nội và Gen Z."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Về chúng tôi — E-XANH" />
        <meta
          property="og:description"
          content="Dự án truyền thông giúp sinh viên và Gen Z hình thành thói quen sử dụng điện tiết kiệm, thông minh và bền vững hơn."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="static-page__breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>{'>'}</span>
        <span>Về chúng tôi</span>
      </div>

      <PageHero
        {...pageHeroContent.about}
        actions={(
          <>
            <Link className="btn btn--primary" to="/cong-dong">
              Ghé thăm cộng đồng
            </Link>
            <Link className="btn btn--secondary" to="/meo-tiet-kiem">
              Khám phá mẹo tiết kiệm
            </Link>
          </>
        )}
      >
        <div style={{ marginBottom: '4px' }}>
          <BrandLogo to="/" size="large" />
        </div>
      </PageHero>

      <section className="about-page__intro">
        <div className="about-page__intro-copy">
          <span className="about-page__eyebrow">Dự án E-XANH</span>
          <h2>Tiết kiệm điện là một thói quen có thể bắt đầu ngay từ đời sống sinh viên.</h2>
          <p>
            Dự án truyền thông nhằm nâng cao nhận thức và khuyến khích hình thành thói quen sử dụng điện tiết kiệm hơn dành cho sinh viên Trường Đại học FPT Hà Nội và Gen Z.
          </p>
        </div>

        <div className="about-page__intro-panel">
          <div className="about-page__intro-badge">Sống xanh từ những thay đổi nhỏ</div>
          <p>
            E-XANH tập trung vào nội dung dễ áp dụng, ngôn ngữ gần gũi và trải nghiệm số thân thiện để giúp việc tiết kiệm điện trở nên thực tế hơn mỗi ngày.
          </p>
        </div>
      </section>

      <section className="static-page__section">
        <div className="static-page__section-header">
          <h2>Sứ mệnh / Mục tiêu</h2>
        </div>

        <div className="about-page__highlight-grid">
          {missionHighlights.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="about-page__highlight-card">
                <div className="about-page__highlight-icon">
                  <Icon size={20} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="static-page__section">
        <div className="static-page__section-header">
          <h2>Đội ngũ thực hiện</h2>
        </div>

        <div className="about-page__team-grid">
          {teamMembers.map((member) => (
            <article key={member.name} className="about-page__team-card">
              <TeamMemberAvatar name={member.name} image={member.image} />
              <div className="about-page__team-body">
                <span className="about-page__team-role">{member.role}</span>
                <h3>{member.name}</h3>
                <p>{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="static-page__section">
        <div className="static-page__section-header">
          <h2>Liên hệ</h2>
        </div>

        <div className="about-page__contact-grid">
          {contactItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.label}
                className="about-page__contact-card"
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                <span className="about-page__contact-icon">
                  <Icon size={18} />
                </span>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
