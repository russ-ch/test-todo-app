import { useState, useEffect } from 'react'

function PlannerItem({ event, onSave, onCancel }) {
  const [title, setTitle] = useState(event.title || '')
  const [date, setDate] = useState(event.date || '')
  const [time, setTime] = useState(event.time || '')

  useEffect(() => {
    setTitle(event.title || '')
    setDate(event.date || '')
    setTime(event.time || '')
  }, [event])

  const handleSave = () => {
    // Дефект: Перевіряємо тільки title, не перевіряємо date/time
    // Дозволяємо зберігати некоректні дані
    if (title.trim() === '') {
      return // Просто не зберігаємо, але не показуємо помилку
    }

    // Зберігаємо навіть з пустою датою/часом або некоректними даними
    onSave({
      ...event,
      title: title.trim(),
      date: date, // Може бути пустим або некоректним
      time: time, // Може бути пустим або некоректним
    })
  }

  return (
    <div className="planner-item-edit">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        // Немає валідації дати
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        // Немає валідації часу
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}

export default PlannerItem

