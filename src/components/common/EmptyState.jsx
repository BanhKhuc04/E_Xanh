function EmptyState({ 
  icon = '⌘', 
  title = 'Chưa có dữ liệu', 
  message = 'Hiện tại không có dữ liệu để hiển thị.',
  action = null,
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`}>
      <span className="empty-state__icon">{icon}</span>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div style={{ marginTop: '20px' }}>{action}</div>}
    </div>
  )
}

export default EmptyState
