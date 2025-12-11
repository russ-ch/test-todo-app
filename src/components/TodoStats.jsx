function TodoStats({ todos }) {
  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="stats">
      <span>
        {completedCount} of {totalCount} completed
      </span>
      {totalCount > 0 && (
        <span className="stats-percentage">
          ({percentage}%)
        </span>
      )}
    </div>
  )
}

export default TodoStats

