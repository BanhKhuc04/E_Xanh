import { commentStatusOptions, commentDateOptions } from '../../../data/adminComments'

function AdminCommentFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  postFilter,
  onPostFilterChange,
  dateRange,
  onDateRangeChange,
  postTitles,
  onReset,
  onRefresh,
}) {
  return (
    <section className="ac-filter" aria-label="Bộ lọc bình luận">
      <div className="ac-filter__row">
        <label className="ac-filter__search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM19 19l-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo nội dung, người bình luận, bài viết..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>

        <select
          className="ac-filter__select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Trạng thái"
        >
          {commentStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'Tất cả' ? 'Trạng thái: Tất cả' : s}
            </option>
          ))}
        </select>

        <select
          className="ac-filter__select"
          value={postFilter}
          onChange={(e) => onPostFilterChange(e.target.value)}
          aria-label="Bài viết"
        >
          <option value="Tất cả">Tất cả bài viết</option>
          {postTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>

        <select
          className="ac-filter__select"
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          aria-label="Thời gian"
        >
          {commentDateOptions.map((d) => (
            <option key={d} value={d}>
              {d === 'Tất cả' ? 'Thời gian: Tất cả' : d}
            </option>
          ))}
        </select>
      </div>

      <div className="ac-filter__actions">
        <button type="button" className="btn btn--primary" onClick={onRefresh}>
          Làm mới dữ liệu
        </button>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Đặt lại bộ lọc
        </button>
      </div>
    </section>
  )
}

export default AdminCommentFilter
