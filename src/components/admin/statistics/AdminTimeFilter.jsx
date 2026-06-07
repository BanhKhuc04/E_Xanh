import { timeFilterOptions } from '../../../data/adminStatistics'

function AdminTimeFilter({ active, onChange }) {
  return (
    <div className="as-time-filter" aria-label="Bộ lọc thời gian">
      {timeFilterOptions.map((option) => (
        <button
          key={option}
          type="button"
          className={`as-time-filter__btn${active === option ? ' is-active' : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default AdminTimeFilter
