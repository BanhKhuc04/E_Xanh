function PostFilterBar({
  searchValue,
  selectedCategory,
  sortValue,
  categories,
  sortOptions,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}) {
  return (
    <section className="tips-filter-bar">
      <label className="tips-filter-bar__search">
        <span>Tìm kiếm</span>
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm mẹo tiết kiệm..."
        />
      </label>

      <div className="tips-filter-bar__chips" aria-label="Lọc theo chủ đề">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`tips-filter-chip${selectedCategory === category ? ' is-active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <label className="tips-filter-bar__sort">
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

export default PostFilterBar
