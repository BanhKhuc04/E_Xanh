function AdminUserBulkAction({
  selectedCount,
  onBulkLock,
  onBulkUnlock,
  onBulkAssignRole,
}) {
  if (selectedCount === 0) return null

  return (
    <div className="au-bulk" role="status" aria-live="polite">
      <span className="au-bulk__count">
        Đã chọn <strong>{selectedCount}</strong> người dùng
      </span>
      <div className="au-bulk__actions">
        <button type="button" className="btn btn--ghost au-bulk__lock-btn" onClick={onBulkLock}>
          Khóa đã chọn
        </button>
        <button type="button" className="btn btn--primary" onClick={onBulkUnlock}>
          Mở khóa
        </button>
        <button type="button" className="btn btn--secondary" onClick={onBulkAssignRole}>
          Gán vai trò
        </button>
      </div>
    </div>
  )
}

export default AdminUserBulkAction
