function CommunityFilterBar({ filters, activeFilter, onChange, totalPosts }) {
  return (
    <nav className="community-filter-bar" aria-label="Bộ lọc cộng đồng">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`community-filter-bar__chip ${activeFilter === filter ? 'is-active' : ''}`}
          onClick={() => onChange(filter)}
          aria-pressed={activeFilter === filter}
          aria-current={activeFilter === filter ? 'true' : undefined}
        >
          {filter}
          {activeFilter === filter ? (
            <span className="community-filter-bar__count">{totalPosts}</span>
          ) : null}
        </button>
      ))}
    </nav>
  )
}

export default CommunityFilterBar
