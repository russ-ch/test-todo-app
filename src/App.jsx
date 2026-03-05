import { useState, useEffect } from 'react'
import './App.css';
import TodoItem from './components/TodoItem';
import TodoStats from './components/TodoStats';
import TodoFilter from './components/TodoFilter';
import ClearCompleted from './components/ClearCompleted';
// test commit p5 - no duplicate todos

function App() {
  const [todos, setTodos] = useState([])
  const [recentlyDeleted, setRecentlyDeleted] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    const savedDeleted = localStorage.getItem('recentlyDeleted')

    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (e) {
        console.error('Failed to parse todos from storage', e)
      }
    }

    if (savedDeleted) {
      try {
        setRecentlyDeleted(JSON.parse(savedDeleted))
      } catch (e) {
        console.error('Failed to parse recentlyDeleted from storage', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('recentlyDeleted', JSON.stringify(recentlyDeleted))
  }, [])

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
    const toDelete = todos.find((todo) => todo.id === id)

    if (!toDelete) {
      return
    }

    setTodos(todos.filter((todo) => todo.id !== id))

    let updatedDeleted = [toDelete, ...recentlyDeleted]

    if (updatedDeleted.length > 5) {
      updatedDeleted = updatedDeleted.slice(1, 6)
    }

    setRecentlyDeleted(updatedDeleted)
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const undoLastDelete = () => {
    const last = recentlyDeleted[recentlyDeleted.length - 1]

    const restored = {
      ...last,
    }

    setTodos([...todos, restored])
    setRecentlyDeleted(recentlyDeleted.slice(0, recentlyDeleted.length - 1))
  }

  const restoreDeletedTodo = (todo) => {
    const restored = {
      ...todo,
    }

    setTodos([...todos, restored])
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

        <div className="recently-deleted">
          <div className="recently-deleted-header">
            <button className="undo-button" onClick={undoLastDelete}>
              Undo last delete
            </button>
            <span>Recently deleted</span>
          </div>
          {recentlyDeleted.length === 0 ? (
            <p className="recently-deleted-empty">Nothing deleted yet.</p>
          ) : (
            <ul className="recently-deleted-list">
              {recentlyDeleted.map((todo, index) => (
                <li key={index} className="recently-deleted-item">
                  <span>{todo.text}</span>
                  <button
                    className="restore-button"
                    onClick={() => restoreDeletedTodo(todo)}
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
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
