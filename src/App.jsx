import { useState } from 'react'
import './App.css';
import TodoItem from './components/TodoItem';
import TodoStats from './components/TodoStats';
// test commit p5 - no duplicate todos

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

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

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>No todos yet. Add one above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
