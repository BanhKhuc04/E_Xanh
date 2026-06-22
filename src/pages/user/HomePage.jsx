import SEO from '../../components/SEO'
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
const OG_IMAGE = `${SITE_URL}/og-image-v2.png`

import FadeInUp from '../../components/common/FadeInUp'

function HomePage() {
  const { pathname } = useLocation()
  const canonicalUrl = `${SITE_URL}${pathname}`

  return (
    <div className="home-page">
      <SEO title="Sử dụng điện thông minh, tiết kiệm điện" description="E-XANH là nền tảng giúp sinh viên và người trẻ sử dụng điện thông minh, tiết kiệm chi phí và lan tỏa lối sống xanh. Khám phá mẹo tiết kiệm điện và công cụ kiểm tra tiền điện miễn phí." url={canonicalUrl} />
      
      <FadeInUp duration={0.6}>
        <HeroSection />
      </FadeInUp>

      <FadeInUp delay={0.2}>
        <section className="home-section">
          <div className="home-feature-grid">
            {homeFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>
      </FadeInUp>

      <FadeInUp>
        <ElectricityPreview />
      </FadeInUp>
      
      <FadeInUp>
        <FeaturedPosts />
      </FadeInUp>
      
      <FadeInUp>
        <CommunityPreview />
      </FadeInUp>
      
      <FadeInUp>
        <HomeCTA />
      </FadeInUp>
    </div>
  )
}

export default HomePage
