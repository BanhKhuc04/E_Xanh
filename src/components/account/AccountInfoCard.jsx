import { Link } from 'react-router-dom'

function AccountInfoCard({ user }) {
  return (
    <section className="account-side-card">
      <h2>Thông tin cá nhân</h2>

      <div className="account-side-card__rows">
        <div>
          <span>Họ và tên</span>
          <strong>{user.name}</strong>
        </div>
        {user.bio ? (
          <div style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
            <span>Tiểu sử</span>
            <strong style={{ lineHeight: 1.5 }}>{user.bio}</strong>
          </div>
        ) : null}
        <div>
          <span>Khu vực</span>
          <strong>Chưa cập nhật</strong>
        </div>
      </div>

      <Link to="/tai-khoan/cai-dat" className="btn account-side-card__button" style={{ display: 'block', textAlign: 'center', marginTop: '16px' }}>
        Cập nhật thông tin
      </Link>
    </section>
  )
}

export default AccountInfoCard
