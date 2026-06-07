function SavingSuggestions({ suggestions }) {
  return (
    <section className="electricity-section">
      <div className="electricity-section__header">
        <div>
          <h2>Gợi ý tiết kiệm dành cho bạn</h2>
          <p>Dựa trên các thiết bị bạn đang sử dụng</p>
        </div>
      </div>

      <div className="saving-suggestions">
        {suggestions.map((item) => (
          <article key={item.title} className="saving-suggestion-card">
            <span className="saving-suggestion-card__icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SavingSuggestions
