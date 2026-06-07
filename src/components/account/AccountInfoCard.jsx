function AccountInfoCard({ user }) {
  return (
    <section className="account-side-card">
      <h2>Thông tin cá nhân</h2>

      <div className="account-side-card__rows">
        <div>
          <span>Họ và tên</span>
          <strong>{user.name}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>
        <div>
          <span>Số điện thoại</span>
          <strong>Chưa cập nhật</strong>
        </div>
        <div>
          <span>Khu vực</span>
          <strong>Hà Nội</strong>
        </div>
        <div>
          <span>Vai trò</span>
          <strong>Người dùng</strong>
        </div>
        <div>
          <span>Trạng thái</span>
          <strong>Đang hoạt động</strong>
        </div>
      </div>

      <button type="button" className="btn account-side-card__button">
        Cập nhật thông tin
      </button>
    </section>
  )
}

export default AccountInfoCard
