import { useState } from 'react'
import './App.css';
import TodoItem from './components/TodoItem';
import TodoStats from './components/TodoStats';
import TodoFilter from './components/TodoFilter';
import ClearCompleted from './components/ClearCompleted';
import Planner from './components/Planner';
// test commit p5 - no duplicate todos

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [filter, setFilter] = useState('all')
  const [events, setEvents] = useState([])

  const addTodo = () => {
    const trimmed = inputValue.trim()

    // Нічого не вводили
    if (trimmed === '') {
      setErrorMessage('Todo text cannot be empty')
      return
    }

    // Перевірка на дублікат (case-insensitive)
    const exists = todos.some(
      (todo) => todo.text.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      setErrorMessage('This todo already exists')
      return
    }

    // Ок — додаємо todo
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: trimmed,
        completed: false,
      },
    ])

    setInputValue('')
    setErrorMessage('')
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  // Planner functions
  const handleAddEvent = (event) => {
    setEvents([...events, event])
  }

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  // Дефект 3: handleUpdateEvent приймає часткові або невалідні дані
  // Не перевіряємо валідність даних перед оновленням
  const handleUpdateEvent = (updatedEvent) => {
    // Дозволяємо оновлення навіть з порожнім title або невалідними даними
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id
          ? {
              ...event,
              ...updatedEvent, // Може містити невалідні дані
            }
          : event
      )
    )
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter((todo) => todo.completed).length

  console.log('todos', todos)

  return (
    <div className="app">
      <div className="todo-container">
        <h1 className="todo-title">Todo App</h1>

        <div className="input-section">
          <input
            type="text"
            className="todo-input"
            placeholder="Add a new todo..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              if (errorMessage) {
                setErrorMessage('')
              }
            }}
            onKeyPress={handleKeyPress}
          />
          <button className="add-button" onClick={addTodo}>
            Add
          </button>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <TodoStats todos={todos} />

        <TodoFilter filter={filter} onFilterChange={handleFilterChange} />

        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p>
                {todos.length === 0
                  ? 'No todos yet. Add one above!'
                  : `No ${filter} todos.`}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        <ClearCompleted
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />

        <Planner
          events={events}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
    </div>
  )
}

export default App
