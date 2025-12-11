import React from 'react'
import { render, screen } from '@testing-library/react'
import TodoStats from '../components/TodoStats'

describe('TodoStats component', () => {
  test('displays 0 of 0 completed when given empty todos array', () => {
    render(<TodoStats todos={[]} />)

    expect(screen.getByText(/0 of 0 completed/i)).toBeInTheDocument()
    expect(screen.queryByText(/\(\d+%\)/)).not.toBeInTheDocument()
  })

  test('displays correct completed count and total count', () => {
    const todos = [
      { id: 1, text: 'Task 1', completed: true },
      { id: 2, text: 'Task 2', completed: false },
      { id: 3, text: 'Task 3', completed: true }
    ]

    render(<TodoStats todos={todos} />)

    expect(screen.getByText(/2 of 3 completed/i)).toBeInTheDocument()
  })

  test('displays correct completion percentage', () => {
    const todos = [
      { id: 1, text: 'Task 1', completed: true },
      { id: 2, text: 'Task 2', completed: false },
      { id: 3, text: 'Task 3', completed: true },
      { id: 4, text: 'Task 4', completed: false }
    ]

    render(<TodoStats todos={todos} />)

    const percentElement = screen.getByText(/\(50%\)/)
    expect(percentElement).toBeInTheDocument()
  })

  test('does not display percentage when totalCount is zero', () => {
    render(<TodoStats todos={[]} />)

    expect(screen.queryByText(/\(\d+%\)/)).not.toBeInTheDocument()
  })
})