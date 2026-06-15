import { commentStatusMap } from '../../../data/mock/adminComments'

function formatTime(isoString) {
  const date = new Date(isoString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const mins = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${mins}`
}

function AdminCommentList({
  comments,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onViewDetail,
  onQuickHide,
  onQuickSpam,
  onQuickRestore,
}) {
  const allSelected =
    comments.length > 0 && comments.every((c) => selectedIds.includes(c.id))

  return (
    <div className="ac-list">
      <div className="ac-list__header">
        <label className="ac-list__check-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            aria-label="Chọn tất cả bình luận"
          />
          <span>Chọn tất cả</span>
        </label>
        <span className="ac-list__total">{comments.length} bình luận</span>
      </div>

      {comments.length === 0 && (
        <div className="ac-list__empty">
          <p>Không tìm thấy bình luận phù hợp.</p>
        </div>
      )}

      <div className="ac-list__items">
        {comments.map((comment) => {
          const statusInfo =
            commentStatusMap[comment.status] ?? commentStatusMap.visible
          const isHiddenOrSpam = ['hidden', 'spam', 'deleted'].includes(comment.status)

          return (
            <article key={comment.id} className="ac-list__card">
              <div className="ac-list__card-top">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(comment.id)}
                  onChange={() => onToggleSelect(comment.id)}
                  aria-label={`Chọn bình luận của ${comment.userName}`}
                  className="ac-list__checkbox"
                />

                <span className="ac-list__avatar">{comment.avatar}</span>

                <div className="ac-list__user">
                  <strong>{comment.userName}</strong>
                </div>

                <span className="ac-list__time">
                  {formatTime(comment.createdAt)}
                </span>

                <span className={`ac-badge ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
              </div>

              <p className="ac-list__content">{comment.content}</p>

              <div className="ac-list__card-bottom">
                <span className="ac-list__post">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 4h10l4 4v12H5z" />
                  </svg>
                  {comment.postTitle}
                </span>

                {comment.reports > 0 && (
                  <span className="ac-list__reports">
                    {comment.reports} báo cáo
                  </span>
                )}

                <div className="ac-list__actions">
                  <button
                    type="button"
                    className="ac-list__action-btn"
                    onClick={() => onViewDetail(comment.id)}
                  >
                    Xem chi tiết
                  </button>

                  {isHiddenOrSpam ? (
                    <button
                      type="button"
                      className="ac-list__action-btn ac-list__action-btn--restore"
                      onClick={() => onQuickRestore(comment.id)}
                    >
                      Khôi phục
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="ac-list__action-btn ac-list__action-btn--subtle"
                        onClick={() => onQuickHide(comment.id)}
                      >
                        Ẩn
                      </button>
                      <button
                        type="button"
                        className="ac-list__action-btn ac-list__action-btn--subtle"
                        onClick={() => onQuickSpam(comment.id)}
                      >
                        Spam
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default AdminCommentList
