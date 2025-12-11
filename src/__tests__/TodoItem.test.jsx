import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TodoItem from '../components/TodoItem'

describe('TodoItem component', () => {
  const todo = { id: 1, text: 'Test Todo', completed: false }
  const onToggle = jest.fn()
  const onDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders todo text and checkbox', () => {
    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />)

    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox.checked).toBe(false)
  })

  test('checkbox reflects completed status', () => {
    const completedTodo = { ...todo, completed: true }
    render(<TodoItem todo={completedTodo} onToggle={onToggle} onDelete={onDelete} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox.checked).toBe(true)
  })

  test('calls onToggle with todo id when checkbox is clicked', () => {
    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith(todo.id)
  })

  test('calls onDelete with todo id when delete button is clicked', () => {
    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />)

    const deleteButton = screen.getByRole('button', { name: /delete todo/i })
    fireEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(todo.id)
  })

  test('has completed class when todo.completed is true', () => {
    const completedTodo = { ...todo, completed: true }
    const { container } = render(
      <TodoItem todo={completedTodo} onToggle={onToggle} onDelete={onDelete} />
    )

    expect(container.firstChild).toHaveClass('completed')
  })

  test('does not have completed class when todo.completed is false', () => {
    const { container } = render(
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    )

    expect(container.firstChild).not.toHaveClass('completed')
  })
})