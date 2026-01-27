import { useState } from 'react'
import './App.css';
import TodoItem from './components/TodoItem';
import TodoStats from './components/TodoStats';
import TodoFilter from './components/TodoFilter';
import ClearCompleted from './components/ClearCompleted';
// test commit p5 - no duplicate todos

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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
    
    if (trimmed === '') {
      return
    }

    // Перевірка на дублікат (case-insensitive), виключаючи поточний todo
    const exists = todos.some(
      (todo) => todo.id !== id && todo.text.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      setErrorMessage('This todo already exists')
      return
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    )
    setErrorMessage('')
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
    // Apply status filter
    let matchesFilter = true
    if (filter === 'active') matchesFilter = !todo.completed
    if (filter === 'completed') matchesFilter = todo.completed

    // Apply search query filter
    const matchesSearch = searchQuery.trim() === '' || 
      todo.text.toLowerCase().includes(searchQuery.toLowerCase().trim())

    return matchesFilter && matchesSearch
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

        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

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
