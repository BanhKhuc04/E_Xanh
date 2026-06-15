function AdminToggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <label className="st-toggle">
      <div className="st-toggle__text">
        <span className="st-toggle__label">{label}</span>
        {description && (
          <span className="st-toggle__desc">{description}</span>
        )}
      </div>
      <span className={`st-toggle__switch${checked ? ' is-on' : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="st-toggle__input"
          disabled={disabled}
        />
        <span className="st-toggle__track">
          <span className="st-toggle__thumb" />
        </span>
      </span>
    </label>
  )
}

export default AdminToggle
