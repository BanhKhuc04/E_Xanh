import {
  deviceGroupOptions,
  deviceLevelOptions,
  deviceStatusOptions,
} from '../../../data/adminDevices'

function AdminDeviceFilter({
  search,
  onSearchChange,
  group,
  onGroupChange,
  level,
  onLevelChange,
  status,
  onStatusChange,
  onFilter,
  onReset,
}) {
  return (
    <section className="ad-filter" aria-label="Bộ lọc thiết bị">
      <div className="ad-filter__row">
        <label className="ad-filter__search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM19 19l-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tên thiết bị..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>

        <select
          className="ad-filter__select"
          value={group}
          onChange={(e) => onGroupChange(e.target.value)}
          aria-label="Nhóm thiết bị"
        >
          {deviceGroupOptions.map((g) => (
            <option key={g} value={g}>
              {g === 'Tất cả' ? 'Nhóm: Tất cả' : g}
            </option>
          ))}
        </select>

        <select
          className="ad-filter__select"
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          aria-label="Mức tiêu thụ"
        >
          {deviceLevelOptions.map((l) => (
            <option key={l} value={l}>
              {l === 'Tất cả' ? 'Mức tiêu thụ: Tất cả' : l}
            </option>
          ))}
        </select>

        <select
          className="ad-filter__select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Trạng thái"
        >
          {deviceStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'Tất cả' ? 'Trạng thái: Tất cả' : s}
            </option>
          ))}
        </select>
      </div>

      <div className="ad-filter__actions">
        <button type="button" className="btn btn--primary" onClick={onFilter}>
          Lọc thiết bị
        </button>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Làm mới
        </button>
      </div>
    </section>
  )
}

export default AdminDeviceFilter
