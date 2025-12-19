import { useState } from 'react'
import PlannerItem from './PlannerItem'

function Planner({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleAddEvent = () => {
    const trimmedTitle = title.trim()
    const trimmedDate = date.trim()
    const trimmedTime = time.trim()

    if (trimmedTitle === '') {
      setErrorMessage('Event title cannot be empty')
      return
    }

    if (trimmedDate === '') {
      setErrorMessage('Date is required')
      return
    }

    if (trimmedTime === '') {
      setErrorMessage('Time is required')
      return
    }

    // Check for duplicate events (same title, date, and time)
    const exists = events.some(
      (event) =>
        event.title.toLowerCase() === trimmedTitle.toLowerCase() &&
        event.date === trimmedDate &&
        event.time === trimmedTime
    )

    if (exists) {
      setErrorMessage('This event already exists')
      return
    }

    onAddEvent({
      id: Date.now(),
      title: trimmedTitle,
      date: trimmedDate,
      time: trimmedTime,
    })

    setTitle('')
    setDate('')
    setTime('')
    setErrorMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddEvent()
    }
  }

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = []
    }
    acc[event.date].push(event)
    return acc
  }, {})

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(a) - new Date(b)
  })

  // Sort events within each date by time
  sortedDates.forEach((date) => {
    groupedEvents[date].sort((a, b) => {
      return a.time.localeCompare(b.time)
    })
  })

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(date)
    eventDate.setHours(0, 0, 0, 0)

    if (eventDate.getTime() === today.getTime()) {
      return 'Today'
    }

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (eventDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow'
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="planner-container">
      <h2 className="planner-title">Planner</h2>

      <div className="planner-input-section">
        <input
          type="text"
          className="planner-input"
          placeholder="Event title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errorMessage) {
              setErrorMessage('')
            }
          }}
          onKeyPress={handleKeyPress}
        />
        <input
          type="date"
          className="planner-input planner-date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            if (errorMessage) {
              setErrorMessage('')
            }
          }}
        />
        <input
          type="time"
          className="planner-input planner-time"
          value={time}
          onChange={(e) => {
            setTime(e.target.value)
            if (errorMessage) {
              setErrorMessage('')
            }
          }}
        />
        <button className="add-button" onClick={handleAddEvent}>
          Add Event
        </button>
      </div>

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      <div className="planner-events">
        {sortedDates.length === 0 ? (
          <div className="empty-state">
            <p>No events planned. Add one above!</p>
          </div>
        ) : (
          sortedDates.map((dateKey) => (
            <div key={dateKey} className="planner-date-group">
              <h3 className="planner-date-header">{formatDate(dateKey)}</h3>
              <div className="planner-date-events">
                {groupedEvents[dateKey].map((event) => (
                  <PlannerItem
                    key={event.id}
                    event={event}
                    onUpdate={onUpdateEvent}
                    onDelete={onDeleteEvent}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Planner

