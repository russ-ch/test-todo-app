import { useState } from 'react'

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  console.log('TodoItem render')

  const handleDoubleClick = () => {
    if (!todo.completed) {
      setIsEditing(true)
      setEditText(todo.text)
    }
  }

  const handleSave = () => {
    if (editText.trim() !== '' && editText.trim() !== todo.text) {
      onEdit(todo.id, editText.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {isEditing ? (
        <input
          type="text"
          className="todo-edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span 
          className="todo-text" 
          onDoubleClick={handleDoubleClick}
          style={{ cursor: todo.completed ? 'default' : 'pointer' }}
        >
          {todo.text}
        </span>
      )}
      <button
        className="delete-button"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        ×
      </button>
    </div>
  )
}

export default TodoItem

