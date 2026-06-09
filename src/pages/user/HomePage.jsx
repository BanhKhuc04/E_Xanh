import HeroSection from '../../components/home/HeroSection'
import FeatureCard from '../../components/home/FeatureCard'
import FeaturedPosts from '../../components/home/FeaturedPosts'
import ElectricityPreview from '../../components/home/ElectricityPreview'
import CommunityPreview from '../../components/home/CommunityPreview'
import HomeCTA from '../../components/home/HomeCTA'
import { homeFeatures } from '../../data/home'
import '../../styles/home.css'

function HomePage() {
  return (
    <div className="home-page">
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
