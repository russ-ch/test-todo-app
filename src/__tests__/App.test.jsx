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

  test('filters todos by filter buttons and shows correct empty messages', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add three todos
    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Task 3' } })
    fireEvent.click(addButton)

    // Complete one todo
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    // Filter buttons
    const allButton = screen.getByRole('button', { name: /all/i })
    const activeButton = screen.getByRole('button', { name: /active/i })
    const completedButton = screen.getByRole('button', { name: /completed/i })

    // Initially 'all' filter is selected, all todos visible
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    expect(screen.getByText('Task 3')).toBeInTheDocument()

    // Click 'active' filter
    fireEvent.click(activeButton)
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument() // completed
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    expect(screen.getByText('Task 3')).toBeInTheDocument()

    // Click 'completed' filter
    fireEvent.click(completedButton)
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument()
  })

  test('clears completed todos and updates the list and completed count', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add todos
    fireEvent.change(input, { target: { value: 'Todo 1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Todo 2' } })
    fireEvent.click(addButton)

    // Complete one todo
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    // Check Clear Completed button presence and label
    const clearButton = screen.getByRole('button', { name: /clear completed/i })
    expect(clearButton).toBeInTheDocument()
    expect(clearButton.textContent).toMatch(/clear completed \(1\)/i)

    // Click clear completed
    fireEvent.click(clearButton)

    // Completed todo should be removed
    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument()
    // Incomplete todo remains
    expect(screen.getByText('Todo 2')).toBeInTheDocument()

    // Clear Completed button should disappear as no completed todos
    expect(screen.queryByRole('button', { name: /clear completed/i })).not.toBeInTheDocument()
  })

  test('displays appropriate empty state messages based on filter and todo list', () => {
    render(<App />)

    const filterAll = screen.getByRole('button', { name: /all/i })
    const filterActive = screen.getByRole('button', { name: /active/i })
    const filterCompleted = screen.getByRole('button', { name: /completed/i })

    // Initially empty todo list
    expect(screen.getByText(/no todos yet\. add one above!/i)).toBeInTheDocument()

    // Add a todo and complete it
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)
    fireEvent.change(input, { target: { value: 'Only Todo' } })
    fireEvent.click(addButton)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox) // mark completed

    // Filter to active, no active todos
    fireEvent.click(filterActive)
    expect(screen.getByText(/no active todos\./i)).toBeInTheDocument()

    // Filter to completed, there is one completed todo
    fireEvent.click(filterCompleted)
    expect(screen.queryByText(/no completed todos\./i)).not.toBeInTheDocument()
    expect(screen.getByText('Only Todo')).toBeInTheDocument()

    // Filter to all, shows the todo
    fireEvent.click(filterAll)
    expect(screen.getByText('Only Todo')).toBeInTheDocument()
  })
})