import { useState, useEffect } from 'react'
import './App.css';
import TodoItem from './components/TodoItem';
import TodoStats from './components/TodoStats';
import TodoFilter from './components/TodoFilter';
import ClearCompleted from './components/ClearCompleted';

const STORAGE_KEY = 'test-todo-app-todos'

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn('Failed to load todos from localStorage', e)
  }
  return []
}

function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

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

  const editTodo = (id, newText) => {
    const trimmed = newText.trim()
    if (trimmed === '') return
    const exists = todos.some(
      (todo) => todo.id !== id && todo.text.toLowerCase() === trimmed.toLowerCase()
    )
    if (exists) return
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    )
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

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter((todo) => todo.completed).length

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
                onEdit={editTodo}
              />
            ))
          )}
        </div>

        <ClearCompleted
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      </div>
    </div>
  )
}

export default App
