function SavedPostsFilter({
  searchValue,
  selectedFilter,
  sortValue,
  filters,
  sortOptions,
  onSearchChange,
  onFilterChange,
  onSortChange,
}) {
  return (
    <section className="saved-posts-filter">
      <label className="saved-posts-filter__search">
        <span>Tìm kiếm</span>
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm trong bài đã lưu..."
        />
      </label>

      <div className="saved-posts-filter__chips" aria-label="Bộ lọc bài lưu">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`saved-posts-filter__chip${selectedFilter === filter ? ' is-active' : ''}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <label className="saved-posts-filter__sort">
        <span>Sắp xếp</span>
        <select value={sortValue} onChange={(event) => onSortChange(event.target.value)}>
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}

export default SavedPostsFilter
