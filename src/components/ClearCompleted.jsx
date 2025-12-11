function ClearCompleted({ completedCount, onClearCompleted }) {
  if (completedCount === 0) {
    return null
  }

  return (
    <button className="clear-completed-button" onClick={onClearCompleted}>
      Clear Completed ({completedCount})
    </button>
  )
}

export default ClearCompleted
