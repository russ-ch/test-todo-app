import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App component', () => {
  test('adds a todo when input is valid and not a duplicate', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    fireEvent.change(input, { target: { value: 'New Task' } })
    fireEvent.click(addButton)

    expect(screen.getByText('New Task')).toBeInTheDocument()
    expect(input.value).toBe('')
    expect(screen.queryByText(/cannot be empty/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/already exists/i)).not.toBeInTheDocument()
  })

  test('shows error when trying to add empty todo', () => {
    render(<App />)

    const addButton = screen.getByText(/add/i)

    fireEvent.click(addButton)

    expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument()
  })

  test('does not add duplicate todos (case-insensitive) and shows error', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add initial todo
    fireEvent.change(input, { target: { value: 'Task' } })
    fireEvent.click(addButton)

    // Try to add duplicate with same casing
    fireEvent.change(input, { target: { value: 'Task' } })
    fireEvent.click(addButton)

    expect(screen.getByText(/this todo already exists/i)).toBeInTheDocument()
    expect(screen.getAllByText('Task')).toHaveLength(1)

    // Try to add duplicate with different casing
    fireEvent.change(input, { target: { value: 'task' } })
    fireEvent.click(addButton)

    expect(screen.getByText(/this todo already exists/i)).toBeInTheDocument()
    expect(screen.getAllByText('Task')).toHaveLength(1)
  })

  test('clears error message when input changes', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Trigger error by adding empty todo
    fireEvent.click(addButton)
    expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'Some input' } })
    expect(screen.queryByText(/todo text cannot be empty/i)).not.toBeInTheDocument()

    // Add a todo
    fireEvent.click(addButton)

    // Add duplicate todo to trigger duplicate error
    fireEvent.change(input, { target: { value: 'Some input' } })
    fireEvent.click(addButton)
    expect(screen.getByText(/this todo already exists/i)).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'Different' } })
    expect(screen.queryByText(/this todo already exists/i)).not.toBeInTheDocument()
  })
})