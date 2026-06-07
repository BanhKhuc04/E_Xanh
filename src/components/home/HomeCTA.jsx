import { Link } from 'react-router-dom'

function HomeCTA() {
  return (
    <section className="home-section home-section--last">
      <div className="home-final-cta">
        <span className="home-final-cta__icon" aria-hidden="true">
          ✦
        </span>
        <h2>Bắt đầu sống xanh từ những thói quen nhỏ</h2>
        <p>
          Tham gia E-XANH ngay hôm nay để chia sẻ hành trình tiết kiệm điện và góp
          phần bảo vệ môi trường.
        </p>
        <Link className="btn btn--primary home-final-cta__button" to="/cong-dong">
          Tham gia cộng đồng
        </Link>
      </div>
    </section>
  )
}

export default HomeCTA
