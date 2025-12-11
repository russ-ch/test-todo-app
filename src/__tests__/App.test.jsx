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

    expect(screen.getByText(/2 of 2 completed/i)).toBeInTheDocument()

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

  test('filters todos based on selected filter: All, Active, Completed', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add todos with different completion states
    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(addButton)

    // Mark second todo as completed
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1])

    // Filter buttons
    const allFilter = screen.getByRole('button', { name: /all/i })
    const activeFilter = screen.getByRole('button', { name: /active/i })
    const completedFilter = screen.getByRole('button', { name: /completed/i })

    // Initially should show all todos
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()

    // Click Active filter
    fireEvent.click(activeFilter)
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument()

    // Click Completed filter
    fireEvent.click(completedFilter)
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()

    // Click All filter
    fireEvent.click(allFilter)
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  test('displays appropriate empty state messages based on filter and todos', () => {
    render(<App />)

    // Initially empty todo list
    expect(screen.getByText(/no todos yet. add one above!/i)).toBeInTheDocument()

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)

    // By default filter is 'all', so todo should show
    expect(screen.queryByText(/no todos yet. add one above!/i)).not.toBeInTheDocument()
    expect(screen.getByText('Task 1')).toBeInTheDocument()

    // Switch to a filter with no matching todos (completed)
    const completedFilter = screen.getByRole('button', { name: /completed/i })
    fireEvent.click(completedFilter)

    expect(screen.getByText(/no completed todos\./i)).toBeInTheDocument()

    // Switch to active filter, should have one todo
    const activeFilter = screen.getByRole('button', { name: /active/i })
    fireEvent.click(activeFilter)

    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })

  test('renders ClearCompleted button only when there are completed todos and clears completed todos on click', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add two todos
    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(addButton)

    // ClearCompleted button should not be visible yet
    expect(screen.queryByText(/clear completed/i)).not.toBeInTheDocument()

    // Complete one todo
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    // Now ClearCompleted button should appear with count 1
    expect(screen.getByText(/clear completed \(1\)/i)).toBeInTheDocument()

    // Click the ClearCompleted button
    fireEvent.click(screen.getByText(/clear completed \(1\)/i))

    // The completed todo should be removed
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()

    // ClearCompleted button should disappear after clearing
    expect(screen.queryByText(/clear completed/i)).not.toBeInTheDocument()
  })
})