function ProfileStats({ stats }) {
  return (
    <section className="account-stats">
      {stats.map((item) => (
        <article key={item.label} className="account-stats__card">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  )
}

export default ProfileStats
