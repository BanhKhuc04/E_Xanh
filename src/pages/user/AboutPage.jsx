import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import '../../styles/static-pages.css'
import BrandLogo from '../../components/common/BrandLogo'

const featureCards = [
  {
    title: 'Đọc mẹo tiết kiệm điện',
    description: 'Cập nhật những cách sử dụng điện hiệu quả, tiết kiệm chi phí mỗi ngày.',
  },
  {
    title: 'Kiểm tra tiền điện',
    description: 'Công cụ tính toán và dự báo chi phí điện dựa trên thói quen sử dụng của bạn.',
  },
  {
    title: 'Chia sẻ kinh nghiệm',
    description: 'Kết nối với cộng đồng, lan tỏa những câu chuyện sống xanh thiết thực.',
  },
  {
    title: 'Lưu nội dung hữu ích',
    description: 'Dễ dàng lưu trữ và tìm lại những bài viết, mẹo vặt hữu ích khi cần.',
  },
]

const values = ['Thông minh', 'Tiết kiệm', 'Bền vững']

function AboutPage() {
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const OG_IMAGE = 'https://e-xanh.vercel.app/og-image-v2.png'

  return (
    <div className="static-page">
      <Helmet>
        <title>Về chúng tôi — E-XANH</title>
        <meta name="description" content="E-XANH là nền tảng giúp người trẻ sử dụng điện thông minh hơn, tiết kiệm chi phí và lan tỏa lối sống xanh trong cộng đồng sinh viên." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Về chúng tôi — E-XANH" />
        <meta property="og:description" content="Tìm hiểu về dự án E-XANH, sứ mệnh giúp sinh viên sử dụng điện thông minh và lan tỏa lối sống bền vững." />
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

      <section className="static-page__hero static-page__hero--about">
        <div className="static-page__hero-content">
          <div style={{ marginBottom: '16px' }}>
            <BrandLogo to="/" size="large" />
          </div>
          <h1>E-XANH là gì?</h1>
          <p>
            E-XANH là nền tảng giúp người trẻ sử dụng điện thông minh hơn, tiết kiệm chi phí hằng tháng và lan tỏa lối sống xanh trong cộng đồng.
          </p>
          <Link className="btn btn--primary" to="/meo-tiet-kiem">
            Khám phá mẹo tiết kiệm
          </Link>
        </div>

        <div className="static-page__hero-visual">
          <img
            src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1400&q=80"
            alt="Minh họa nền tảng E-XANH"
            width="700"
            height="400"
            loading="lazy"
          />
        </div>
      </section>

      <section className="static-page__mission">
        <h2>Sứ mệnh của E-XANH</h2>
        <p>
          Chúng tôi mong muốn biến việc tiết kiệm điện trở thành một thói quen đơn giản, dễ thực hiện và gần gũi với đời sống hằng ngày.
        </p>
      </section>

      <section className="static-page__section">
        <div className="static-page__section-header">
          <h2>E-XANH giúp bạn làm gì?</h2>
        </div>

        <div className="static-page__grid static-page__grid--four">
          {featureCards.map((item) => (
            <article key={item.title} className="static-page__card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="static-page__section">
        <div className="static-page__section-header">
          <h2>Giá trị cốt lõi</h2>
        </div>

        <div className="static-page__grid static-page__grid--three">
          {values.map((value) => (
            <article key={value} className="static-page__value-card">
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="static-page__cta">
        <h2>Bắt đầu sống xanh từ những thay đổi nhỏ</h2>
        <div className="static-page__cta-actions">
          <Link className="btn btn--primary" to="/meo-tiet-kiem">
            Khám phá mẹo tiết kiệm
          </Link>
          <Link className="btn btn--secondary" to="/kiem-tra-tien-dien">
            Kiểm tra tiền điện ngay
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
