function AdminCommentBulkAction({
  selectedCount,
  onBulkHide,
  onBulkSpam,
  onBulkRestore,
}) {
  if (selectedCount === 0) return null

  return (
    <div className="ac-bulk" role="status" aria-live="polite">
      <span className="ac-bulk__count">
        Đã chọn <strong>{selectedCount}</strong> bình luận
      </span>
      <div className="ac-bulk__actions">
        <button type="button" className="btn btn--ghost" onClick={onBulkHide}>
          Ẩn đã chọn
        </button>
        <button type="button" className="btn btn--ghost" onClick={onBulkSpam}>
          Đánh dấu spam
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onBulkRestore}
        >
          Khôi phục
        </button>
      </div>
    </div>
  )
}

export default AdminCommentBulkAction
