function AdminDeviceBulkAction({
  selectedCount,
  onBulkHide,
  onBulkShow,
  onBulkDelete,
}) {
  if (selectedCount === 0) return null

  return (
    <div className="ad-bulk" role="status" aria-live="polite">
      <span className="ad-bulk__count">
        Đã chọn <strong>{selectedCount}</strong> thiết bị
      </span>
      <div className="ad-bulk__actions">
        <button type="button" className="btn btn--ghost" onClick={onBulkHide}>
          Ẩn đã chọn
        </button>
        <button type="button" className="btn btn--primary" onClick={onBulkShow}>
          Hiện lại
        </button>
        <button
          type="button"
          className="btn btn--ghost ad-bulk__delete-btn"
          onClick={onBulkDelete}
        >
          Xóa khỏi danh sách
        </button>
      </div>
    </div>
  )
}

export default AdminDeviceBulkAction
