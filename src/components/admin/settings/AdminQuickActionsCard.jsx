function AdminQuickActionsCard({ actions, onAction }) {
  return (
    <div className="st-card">
      <h3 className="st-card__title">Thao tác nhanh</h3>
      <div className="st-quick-actions">
        {actions.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`st-quick-actions__btn${item.style === 'warning' ? ' st-quick-actions__btn--warning' : ''}`}
            onClick={() => onAction(item.label)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AdminQuickActionsCard
