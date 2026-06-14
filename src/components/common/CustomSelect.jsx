import { useState, useRef, useEffect } from 'react'

function CustomSelect({
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Chọn một tùy chọn...',
  className = '',
  error = false,
  'aria-describedby': ariaDescribedBy
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)
  const displayLabel = selectedOption ? selectedOption.label : placeholder

  function handleSelect(optionValue) {
    onChange(optionValue)
    setIsOpen(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsOpen(!isOpen)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`custom-select ${className} ${error ? 'is-invalid' : ''}`}
      style={{ position: 'relative' }}
    >
      {/* Hidden native select for accessibility and form submission if needed */}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={ariaDescribedBy}
        style={{ display: 'none' }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div
        className="custom-select__trigger post-form-control"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderColor: error ? 'rgba(176, 59, 42, 0.45)' : undefined,
          backgroundImage: 'none',
          paddingRight: '16px'
        }}
      >
        <span style={{ color: value ? '#173715' : 'rgba(51, 106, 41, 0.58)' }}>
          {displayLabel}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: '#336a29'
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <ul
          className="custom-select__dropdown"
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            margin: 0,
            padding: '8px',
            listStyle: 'none',
            background: '#fff',
            border: '1px solid rgba(79, 132, 40, 0.16)',
            borderRadius: '14px',
            boxShadow: '0 12px 24px rgba(79, 132, 40, 0.15)',
            maxHeight: '220px',
            overflowY: 'auto'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isSelected ? 'rgba(193, 217, 92, 0.2)' : 'transparent',
                  color: isSelected ? '#336a29' : '#173715',
                  fontWeight: isSelected ? '700' : '400',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(234, 245, 157, 0.3)'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {opt.label}
                {isSelected && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default CustomSelect
