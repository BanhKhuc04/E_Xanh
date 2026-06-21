export default function ToggleRow({
  label,
  description,
  checked,
  disabled = false,
  onChange,
  badge = '',
}) {
  return (
    <button
      type="button"
      className={`settings-switch-row${disabled ? ' is-disabled' : ''}`}
      onClick={onChange}
      disabled={disabled}
    >
      <div className="settings-switch-row__copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>
      <div className="settings-switch-row__meta">
        {badge ? <span className="settings-badge settings-badge--muted">{badge}</span> : null}
        <span className={`account-toggle${checked ? ' is-on' : ''}`}></span>
      </div>
    </button>
  )
}
