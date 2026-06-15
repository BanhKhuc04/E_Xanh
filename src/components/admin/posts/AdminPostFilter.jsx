import {
  postCategories,
  postStatusOptions,
  postDateOptions,
} from '../../../data/mock/adminPosts'

function AdminPostFilter({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onFilter,
  onReset,
}) {
  return (
    <section className="ap-filter" aria-label="Bộ lọc bài viết">
      <div className="ap-filter__row">
        <label className="ap-filter__search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM19 19l-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc tác giả..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>

        <select
          className="ap-filter__select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Loại bài"
        >
          {postCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'Tất cả' ? 'Loại bài: Tất cả' : cat}
            </option>
          ))}
        </select>

        <select
          className="ap-filter__select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Trạng thái"
        >
          {postStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'Tất cả' ? 'Trạng thái: Tất cả' : s}
            </option>
          ))}
        </select>

        <select
          className="ap-filter__select"
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          aria-label="Ngày gửi"
        >
          {postDateOptions.map((d) => (
            <option key={d} value={d}>
              {d === 'Tất cả' ? 'Ngày gửi: Tất cả' : d}
            </option>
          ))}
        </select>
      </div>

      <div className="ap-filter__actions">
        <button type="button" className="btn btn--primary" onClick={onFilter}>
          Lọc bài
        </button>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Làm mới
        </button>
      </div>
    </section>
  )
}

export default AdminPostFilter
