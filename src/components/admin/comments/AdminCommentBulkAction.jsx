function AdminCommentBulkAction({
  selectedCount,
  onBulkHide,
  onBulkSpam,
  onBulkRestore,
  onBulkDelete,
  isBusy,
}) {
  if (selectedCount === 0) return null

  return (
    <div className="ac-bulk" role="status" aria-live="polite">
      <span className="ac-bulk__count">
        Đã chọn <strong>{selectedCount}</strong> bình luận
      </span>
      <div className="ac-bulk__actions">
        <button type="button" className="btn btn--ghost" onClick={onBulkHide} disabled={isBusy}>
          Ẩn đã chọn
        </button>
        <button type="button" className="btn btn--ghost" onClick={onBulkSpam} disabled={isBusy}>
          Đánh dấu spam
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onBulkRestore}
          disabled={isBusy}
        >
          Khôi phục
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onBulkDelete}
          disabled={isBusy}
          style={{ color: '#c0392b' }}
        >
          Xóa mềm
        </button>
      </div>
    </div>
  )
}

export default AdminCommentBulkAction
