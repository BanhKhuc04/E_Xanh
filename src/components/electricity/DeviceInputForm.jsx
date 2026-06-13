function DeviceInputForm({
  form,
  deviceOptions,
  onChange,
  onSelectDevice,
  onSubmit,
}) {
  return (
    <form className="electricity-form" onSubmit={onSubmit}>
      <h2>Thiết bị của bạn</h2>
      <p>Thêm các thiết bị điện bạn dùng thường xuyên để E-XANH ước tính chi phí.</p>

      <div className="electricity-form__grid">
        <label>
          <span>Loại thiết bị</span>
          <select value={form.name} onChange={(event) => onSelectDevice(event.target.value)}>
            {deviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Công suất (W)</span>
          <input
            type="number"
            min="1"
            value={form.power}
            onChange={(event) => onChange('power', event.target.value)}
            placeholder="Ví dụ: 1000"
          />
        </label>

        <label>
          <span>Giờ dùng / Ngày</span>
          <input
            type="number"
            min="1"
            value={form.hoursPerDay}
            onChange={(event) => onChange('hoursPerDay', event.target.value)}
            placeholder="Ví dụ: 8"
          />
        </label>

        <label>
          <span>Ngày dùng / Tháng</span>
          <input
            type="number"
            min="1"
            value={form.daysPerMonth}
            onChange={(event) => onChange('daysPerMonth', event.target.value)}
            placeholder="Ví dụ: 30"
          />
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        {form.error && (
          <span style={{ color: '#e53935', fontSize: '0.9rem', fontWeight: 'bold' }}>{form.error}</span>
        )}
        <button type="submit" className="electricity-form__add">
          Thêm thiết bị
        </button>
      </div>
    </form>
  )
}

export default DeviceInputForm
