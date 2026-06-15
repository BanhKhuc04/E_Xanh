function AdminUserBulkAction({
  selectedCount,
  onBulkLock,
  onBulkUnlock,
  onBulkAssignRole,
  onBulkDeactivate,
  isBusy = false,
}) {
  if (selectedCount === 0) return null

  return (
    <div className="au-bulk" role="status" aria-live="polite">
      <span className="au-bulk__count">
        Đã chọn <strong>{selectedCount}</strong> người dùng
      </span>
      <div className="au-bulk__actions">
        <button type="button" className="btn btn--ghost au-bulk__lock-btn" onClick={onBulkLock} disabled={isBusy}>
          {isBusy ? 'Đang xử lý...' : 'Khóa đã chọn'}
        </button>
        <button type="button" className="btn btn--primary" onClick={onBulkUnlock} disabled={isBusy}>
          {isBusy ? 'Đang xử lý...' : 'Mở khóa'}
        </button>
        <button type="button" className="btn btn--secondary" onClick={onBulkAssignRole} disabled={isBusy}>
          {isBusy ? 'Đang xử lý...' : 'Chuyển thành moderator'}
        </button>
        <button type="button" className="btn btn--ghost au-bulk__deactivate-btn" onClick={onBulkDeactivate} disabled={isBusy}>
          {isBusy ? 'Đang xử lý...' : 'Vô hiệu hóa'}
        </button>
      </div>
    </div>
  )
}

export default AdminUserBulkAction
