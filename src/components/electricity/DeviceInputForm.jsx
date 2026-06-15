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
          <select
            value={deviceOptions.some(opt => opt.value === form.name) ? form.name : (form.name ? 'Khác' : '')}
            onChange={(event) => onSelectDevice(event.target.value)}
            style={{ colorScheme: 'light' }}
          >
            <option value="" disabled hidden>Chọn thiết bị...</option>
            {deviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {(!deviceOptions.some(opt => opt.value === form.name) && form.name !== '') || form.showCustomInput ? (
            <input
              type="text"
              value={form.name === 'Khác' ? '' : form.name}
              onChange={(event) => onChange('name', event.target.value)}
              placeholder="Nhập tên thiết bị..."
              style={{ marginTop: '8px' }}
              autoFocus
            />
          ) : null}
          {form.errors?.name && <span style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{form.errors.name}</span>}
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
          {form.errors?.power && <span style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{form.errors.power}</span>}
        </label>

        <label>
          <span>Giờ dùng / Ngày</span>
          <input
            type="number"
            min="1"
            max="24"
            value={form.hoursPerDay}
            onChange={(event) => onChange('hoursPerDay', event.target.value)}
            placeholder="Ví dụ: 8"
          />
          {form.errors?.hours && <span style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{form.errors.hours}</span>}
        </label>

        <label>
          <span>Ngày dùng / Tháng</span>
          <input
            type="number"
            min="1"
            max="31"
            value={form.daysPerMonth}
            onChange={(event) => onChange('daysPerMonth', event.target.value)}
            placeholder="Ví dụ: 30"
          />
          {form.errors?.days && <span style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{form.errors.days}</span>}
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
