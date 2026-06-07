function AdminBackupCard({ backup, onBackup }) {
  return (
    <div className="st-card">
      <h3 className="st-card__title">Sao lưu dữ liệu</h3>
      <div className="st-backup-grid">
        <div className="st-backup-grid__item">
          <span>Lần sao lưu gần nhất</span>
          <strong>{backup.lastBackup}</strong>
        </div>
        <div className="st-backup-grid__item">
          <span>Dung lượng dữ liệu</span>
          <strong>{backup.dataSize}</strong>
        </div>
        <div className="st-backup-grid__item">
          <span>Số bài viết</span>
          <strong>{backup.totalPosts}</strong>
        </div>
        <div className="st-backup-grid__item">
          <span>Số người dùng</span>
          <strong>{backup.totalUsers}</strong>
        </div>
      </div>
      <div className="st-card__actions">
        <button type="button" className="btn btn--primary" onClick={onBackup}>
          Sao lưu ngay
        </button>
        <button type="button" className="btn btn--ghost">
          Tải bản sao lưu
        </button>
      </div>
    </div>
  )
}

export default AdminBackupCard
