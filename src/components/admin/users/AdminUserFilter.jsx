import {
  userRoleOptions,
  userStatusOptions,
  userDateOptions,
} from '../../../data/mock/adminUsers'

function AdminUserFilter({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onFilter,
  onReset,
}) {
  return (
    <section className="au-filter" aria-label="Bộ lọc người dùng">
      <div className="au-filter__row">
        <label className="au-filter__search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM19 19l-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc username..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>

        <select
          className="au-filter__select"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          aria-label="Vai trò"
        >
          {userRoleOptions.map((r) => (
            <option key={r} value={r}>
              {r === 'Tất cả' ? 'Vai trò: Tất cả' : r}
            </option>
          ))}
        </select>

        <select
          className="au-filter__select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Trạng thái"
        >
          {userStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'Tất cả' ? 'Trạng thái: Tất cả' : s}
            </option>
          ))}
        </select>

        <select
          className="au-filter__select"
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          aria-label="Hoạt động"
        >
          {userDateOptions.map((d) => (
            <option key={d} value={d}>
              {d === 'Tất cả' ? 'Hoạt động: Tất cả' : d}
            </option>
          ))}
        </select>
      </div>

      <div className="au-filter__actions">
        <button type="button" className="btn btn--primary" onClick={onFilter}>
          Lọc người dùng
        </button>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Làm mới
        </button>
      </div>
    </section>
  )
}

export default AdminUserFilter
