const deviceLevelMap = {
  low: { label: 'Thấp', className: 'is-low' },
  medium: { label: 'Trung bình', className: 'is-medium' },
  high: { label: 'Cao', className: 'is-high' },
}

const deviceStatusMap = {
  active: { label: 'Đang dùng', className: 'is-active' },
  hidden: { label: 'Đã ẩn', className: 'is-hidden' },
}

function AdminDeviceList({
  devices,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onEdit,
  onQuickToggleStatus,
  onAddDevice,
}) {
  const allSelected =
    devices.length > 0 && devices.every((d) => selectedIds.includes(d.id))

  return (
    <div className="ad-list">
      <div className="ad-list__header">
        <div className="ad-list__header-left">
          <label className="ad-list__check-all">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onSelectAll}
              aria-label="Chọn tất cả thiết bị"
            />
            <span>Chọn tất cả</span>
          </label>
          <span className="ad-list__total">{devices.length} thiết bị</span>
        </div>
        <button
          type="button"
          className="btn btn--primary ad-list__add-btn"
          onClick={onAddDevice}
        >
          + Thêm thiết bị
        </button>
      </div>

      {devices.length === 0 && (
        <div className="ad-list__empty">
          <p>Không tìm thấy thiết bị phù hợp.</p>
        </div>
      )}

      <div className="ad-list__items">
        {devices.map((device) => {
          let levelKey = 'low'
          if (device.default_power > 800) levelKey = 'high'
          else if (device.default_power > 100) levelKey = 'medium'
          
          const levelInfo = deviceLevelMap[levelKey]
          const isHidden = !device.is_visible
          const statusInfo = isHidden ? deviceStatusMap.hidden : deviceStatusMap.active

          return (
            <article key={device.id} className="ad-list__card">
              <div className="ad-list__card-top">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(device.id)}
                  onChange={() => onToggleSelect(device.id)}
                  aria-label={`Chọn ${device.name}`}
                  className="ad-list__checkbox"
                />

                <span className="ad-list__icon" aria-hidden="true">
                  {device.icon}
                </span>

                <div className="ad-list__info">
                  <strong>{device.name}</strong>
                  <span className="ad-list__group">{device.category}</span>
                </div>

                <span className="ad-list__power">{device.default_power}W</span>

                <span className={`ad-level-badge ${levelInfo.className}`}>
                  {levelInfo.label}
                </span>

                <span className={`ad-status-badge ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="ad-list__card-bottom">
                <p className="ad-list__tip">{device.tips}</p>

                <div className="ad-list__actions">
                  <button
                    type="button"
                    className="ad-list__action-btn"
                    onClick={() => onEdit(device.id)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    className={`ad-list__action-btn ad-list__action-btn--subtle${isHidden ? ' ad-list__action-btn--show' : ''}`}
                    onClick={() => onQuickToggleStatus(device.id)}
                  >
                    {isHidden ? 'Hiện lại' : 'Ẩn'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default AdminDeviceList
