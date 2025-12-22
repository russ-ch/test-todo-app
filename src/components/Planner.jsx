import { useState } from 'react'
import PlannerItem from './PlannerItem'

function Planner({ events, onAddEvent, onUpdateEvent, onDeleteEvent, updateError, onClearUpdateError }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingId, setEditingId] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation: Check title
    if (title.trim() === '') {
      setErrorMessage('Event title cannot be empty')
      return
    }

    // Validation: Check date and time are provided
    if (!date || date.trim() === '') {
      setErrorMessage('Date is required')
      return
    }

    if (!time || time.trim() === '') {
      setErrorMessage('Time is required')
      return
    }

    // Validation: Check for duplicate events (same title, date, and time)
    // Normalize inputs: trim and normalize date/time for consistent comparison
    const trimmedTitle = title.trim()
    const normalizedDate = date.trim()
    const normalizedTime = time.trim()
    
    const duplicateExists = events.some(
      (event) => {
        const eventTitle = (event.title || '').trim().toLowerCase()
        const eventDate = (event.date || '').trim()
        const eventTime = (event.time || '').trim()
        
        return (
          eventTitle === trimmedTitle.toLowerCase() &&
          eventDate === normalizedDate &&
          eventTime === normalizedTime
        )
      }
    )

    if (duplicateExists) {
      setErrorMessage('An event with the same title, date, and time already exists')
      return
    }

    // Validation: Check date format is valid
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      setErrorMessage('Invalid date format')
      return
    }

    // Validation: Check time format is valid (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(time)) {
      setErrorMessage('Invalid time format. Please use HH:MM format')
      return
    }

    // All validations passed - add event
    const newEvent = {
      id: Date.now(),
      title: trimmedTitle,
      date: date,
      time: time,
    }

    onAddEvent(newEvent)
    
    // Clear error message and form fields
    setErrorMessage('')
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
              // Clear error message when user starts typing
              if (errorMessage) {
                setErrorMessage('')
              }
            }}
          />
        </div>
        <div className="input-group">
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              // Clear error message when user changes date
              if (errorMessage) {
                setErrorMessage('')
              }
            }}
          />
        </div>
        <div className="input-group">
          <input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value)
              // Clear error message when user changes time
              if (errorMessage) {
                setErrorMessage('')
              }
            }}
          />
        </div>
        <button type="submit">Add Event</button>
      </form>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      {updateError && (
        <div className="error-message">
          {updateError}
        </div>
      )}

      <div className="events-list">
        {events.map((event) => (
          editingId === event.id ? (
            <PlannerItem
              key={event.id}
              event={event}
              onSave={(updatedEvent) => {
                const success = onUpdateEvent(updatedEvent)
                if (success) {
                  setEditingId(null)
                  if (onClearUpdateError) {
                    onClearUpdateError()
                  }
                }
              }}
              onCancel={() => {
                setEditingId(null)
                if (onClearUpdateError) {
                  onClearUpdateError()
                }
              }}
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

