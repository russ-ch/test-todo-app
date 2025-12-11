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

  test('renders TodoStats component with correct counts', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add multiple todos
    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(addButton)

    expect(screen.getByText(/0 of 2 completed/i)).toBeInTheDocument()

    // Toggle first todo to complete
    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(firstCheckbox)

    expect(screen.getByText(/1 of 2 completed/i)).toBeInTheDocument()
  })

  test('renders TodoItem components for each todo and handles toggle and delete', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    fireEvent.change(input, { target: { value: 'Task A' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Task B' } })
    fireEvent.click(addButton)

    // Check both todos rendered
    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()

    // Toggle the first todo
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])
    expect(checkboxes[0].checked).toBe(true)

    // Delete the second todo
    const deleteButtons = screen.getAllByLabelText(/delete todo/i)
    fireEvent.click(deleteButtons[1])

    expect(screen.queryByText('Task B')).not.toBeInTheDocument()
  })

  test('filter buttons filter todos correctly', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add todos with different completion states
    fireEvent.change(input, { target: { value: 'Active Task' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Completed Task' } })
    fireEvent.click(addButton)

    // Complete the second todo
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1])

    // Initially filter is 'all', both todos shown
    expect(screen.getByText('Active Task')).toBeInTheDocument()
    expect(screen.getByText('Completed Task')).toBeInTheDocument()

    // Click 'Active' filter
    const activeFilterBtn = screen.getByRole('button', { name: /active/i })
    fireEvent.click(activeFilterBtn)

    expect(screen.getByText('Active Task')).toBeInTheDocument()
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument()

    // Click 'Completed' filter
    const completedFilterBtn = screen.getByRole('button', { name: /completed/i })
    fireEvent.click(completedFilterBtn)

    expect(screen.queryByText('Active Task')).not.toBeInTheDocument()
    expect(screen.getByText('Completed Task')).toBeInTheDocument()

    // Click 'All' filter
    const allFilterBtn = screen.getByRole('button', { name: /^all$/i })
    fireEvent.click(allFilterBtn)

    expect(screen.getByText('Active Task')).toBeInTheDocument()
    expect(screen.getByText('Completed Task')).toBeInTheDocument()
  })

  test('displays appropriate message when no todos or no filtered todos', () => {
    render(<App />)

    // Initially no todos
    expect(screen.getByText(/no todos yet. add one above!/i)).toBeInTheDocument()

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add one todo
    fireEvent.change(input, { target: { value: 'Test Task' } })
    fireEvent.click(addButton)

    // Click 'Completed' filter - no completed todos
    const completedFilterBtn = screen.getByRole('button', { name: /completed/i })
    fireEvent.click(completedFilterBtn)

    expect(screen.getByText(/no completed todos./i)).toBeInTheDocument()
  })

  test('ClearCompleted button appears when there are completed todos and clears them on click', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add two todos
    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(addButton)

    // Complete one todo
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    // Clear Completed button should appear
    const clearButton = screen.getByText(/clear completed/i)
    expect(clearButton).toBeInTheDocument()
    expect(clearButton).toHaveTextContent('Clear Completed (1)')

    // Click clear completed
    fireEvent.click(clearButton)

    // Completed todo should be removed
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()

    // Clear Completed button should disappear
    expect(screen.queryByText(/clear completed/i)).not.toBeInTheDocument()
  })
})