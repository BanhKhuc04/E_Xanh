import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import HeroSection from '../../components/home/HeroSection'
import FeatureCard from '../../components/home/FeatureCard'
import FeaturedPosts from '../../components/home/FeaturedPosts'
import ElectricityPreview from '../../components/home/ElectricityPreview'
import CommunityPreview from '../../components/home/CommunityPreview'
import HomeCTA from '../../components/home/HomeCTA'
import { homeFeatures } from '../../data/home'
import '../../styles/home.css'

const SITE_URL = 'https://e-xanh.vercel.app'
const OG_IMAGE = `${SITE_URL}/og-image.svg`

function HomePage() {
  const { pathname } = useLocation()
  const canonicalUrl = `${SITE_URL}${pathname}`

  return (
    <div className="home-page">
      <Helmet>
        <title>E-XANH — Sử dụng điện thông minh, tiết kiệm điện</title>
        <meta name="description" content="E-XANH là nền tảng giúp sinh viên và người trẻ sử dụng điện thông minh, tiết kiệm chi phí và lan tỏa lối sống xanh. Khám phá mẹo tiết kiệm điện và công cụ kiểm tra tiền điện miễn phí." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="E-XANH — Sử dụng điện thông minh, tiết kiệm điện" />
        <meta property="og:description" content="Nền tảng hỗ trợ sinh viên sử dụng điện thông minh và tiết kiệm điện. Khám phá mẹo, kiểm tra tiền điện, chia sẻ kinh nghiệm." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <HeroSection />

      <section className="home-section">
        <div className="home-feature-grid">
          {homeFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <ElectricityPreview />
      <FeaturedPosts />
      <CommunityPreview />
      <HomeCTA />
    </div>
  )
}

export default HomePage
