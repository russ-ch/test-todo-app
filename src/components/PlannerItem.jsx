import { useState } from 'react'

function PlannerItem({ event, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(event.title)
  const [editedDate, setEditedDate] = useState(event.date)
  const [editedTime, setEditedTime] = useState(event.time)

  const handleSave = () => {
    if (editedTitle.trim() === '') {
      return
    }

    onUpdate(event.id, {
      title: editedTitle.trim(),
      date: editedDate,
      time: editedTime,
    })

    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTitle(event.title)
    setEditedDate(event.date)
    setEditedTime(event.time)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="planner-item planner-item-editing">
        <input
          type="text"
          className="planner-item-input"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <input
          type="date"
          className="planner-item-date"
          value={editedDate}
          onChange={(e) => setEditedDate(e.target.value)}
        />
        <input
          type="time"
          className="planner-item-time"
          value={editedTime}
          onChange={(e) => setEditedTime(e.target.value)}
        />
        <button
          className="planner-item-button planner-item-save"
          onClick={handleSave}
          aria-label="Save"
        >
          ✓
        </button>
        <button
          className="planner-item-button planner-item-cancel"
          onClick={handleCancel}
          aria-label="Cancel"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div className="planner-item">
      <div className="planner-item-content">
        <span className="planner-item-time-display">{event.time}</span>
        <span className="planner-item-title">{event.title}</span>
      </div>
      <div className="planner-item-actions">
        <button
          className="planner-item-button planner-item-edit"
          onClick={() => setIsEditing(true)}
          aria-label="Edit event"
        >
          ✎
        </button>
        <button
          className="planner-item-button planner-item-delete"
          onClick={() => onDelete(event.id)}
          aria-label="Delete event"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default PlannerItem

