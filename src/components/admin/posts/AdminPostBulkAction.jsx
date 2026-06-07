function AdminPostBulkAction({ selectedCount, onBulkApprove, onBulkReject }) {
  if (selectedCount === 0) return null

  return (
    <div className="ap-bulk" role="status" aria-live="polite">
      <span className="ap-bulk__count">
        Đã chọn <strong>{selectedCount}</strong> bài
      </span>
      <div className="ap-bulk__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={onBulkApprove}
        >
          Duyệt đã chọn
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onBulkReject}
        >
          Từ chối đã chọn
        </button>
      </div>
    </div>
  )
}

export default AdminPostBulkAction
