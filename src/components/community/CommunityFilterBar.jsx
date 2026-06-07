function CommunityFilterBar({ filters, activeFilter, onChange }) {
  return (
    <div className="community-filter-bar" role="tablist" aria-label="Bộ lọc cộng đồng">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`community-filter-bar__chip ${activeFilter === filter ? 'is-active' : ''}`}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default CommunityFilterBar
