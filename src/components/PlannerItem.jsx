import { useState, useEffect } from 'react'

function PlannerItem({ event, onSave, onCancel }) {
  const [title, setTitle] = useState(event.title || '')
  const [date, setDate] = useState(event.date || '')
  const [time, setTime] = useState(event.time || '')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setTitle(event.title || '')
    setDate(event.date || '')
    setTime(event.time || '')
  }, [event])

  const handleSave = () => {
    // Validation: Check title
    if (title.trim() === '') {
      setErrorMessage('Event title cannot be empty')
      return
    }

    // Validation: Check date is provided
    if (!date || date.trim() === '') {
      setErrorMessage('Date is required')
      return
    }

    // Validation: Check time is provided
    if (!time || time.trim() === '') {
      setErrorMessage('Time is required')
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

    // All validations passed - save event
    setErrorMessage('')
    onSave({
      ...event,
      title: title.trim(),
      date: date,
      time: time,
    })
  }

  return (
    <div className="planner-item-edit">
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          if (errorMessage) {
            setErrorMessage('')
          }
        }}
        placeholder="Event title"
      />
      <input
        type="date"
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
        value={time}
        onChange={(e) => {
          setTime(e.target.value)
          if (errorMessage) {
            setErrorMessage('')
          }
        }}
      />
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}

export default PlannerItem

