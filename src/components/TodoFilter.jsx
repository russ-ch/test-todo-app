function TodoFilter({ filter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ]

  return (
    <div className="todo-filter">
      {filters.map((f) => (
        <button
          key={f.id}
          className={`filter-button ${filter === f.id ? 'active' : ''}`}
          onClick={() => onFilterChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

export default TodoFilter
