import { useState } from 'react'
import PlannerItem from './PlannerItem'

function Planner({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingId, setEditingId] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Дефект 1: Не перевіряємо дату та час - дозволяємо пусті значення
    // Дефект 2: Не перевіряємо дублікати подій
    // Дефект 3: Не очищаємо error-message після успішного додавання

    if (title.trim() === '') {
      setErrorMessage('Event title cannot be empty')
      return
    }

    // Додаємо подію навіть з пустою датою/часом
    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      date: date || '', // Дозволяємо пусту дату
      time: time || '', // Дозволяємо пустий час
    }

    onAddEvent(newEvent)
    
    // Не очищаємо error-message навмисно
    // setErrorMessage('')
    setTitle('')
    setDate('')
    setTime('')
  }

  return (
    <div className="planner-section">
      <h2>Event Planner</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Event title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              // Не очищаємо error-message при зміні вводу
            }}
          />
        </div>
        <div className="input-group">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <button type="submit">Add Event</button>
      </form>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <div className="events-list">
        {events.map((event) => (
          editingId === event.id ? (
            <PlannerItem
              key={event.id}
              event={event}
              onSave={(updatedEvent) => {
                onUpdateEvent(updatedEvent)
                setEditingId(null)
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={event.id} className="event-item">
              <span>{event.title}</span>
              <span>{event.date} {event.time}</span>
              <button onClick={() => setEditingId(event.id)}>Edit</button>
              <button onClick={() => onDeleteEvent(event.id)}>Delete</button>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default Planner

