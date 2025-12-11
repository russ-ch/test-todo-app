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

    expect(screen.getByText(/0 of 2 completed/i)).toBeInTheDocument() // initially none completed

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

  test('filters todos by All, Active, and Completed filters', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Add multiple todos with different completion states
    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(addButton)

    // Mark second todo as completed
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1])

    // At start, filter is 'all' so both todos shown
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()

    // Click on Active filter button
    const activeFilterBtn = screen.getByRole('button', { name: /active/i })
    fireEvent.click(activeFilterBtn)

    // Only active (not completed) todo 1 should be visible
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument()

    // Click on Completed filter button
    const completedFilterBtn = screen.getByRole('button', { name: /completed/i })
    fireEvent.click(completedFilterBtn)

    // Only completed todo 2 should be visible
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()

    // Click on All filter button
    const allFilterBtn = screen.getByRole('button', { name: /^all$/i })
    fireEvent.click(allFilterBtn)

    // Both todos visible again
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  test('shows appropriate empty state messages for each filter', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByText(/add/i)

    // Empty at first
    expect(screen.getByText(/no todos yet. add one above!/i)).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)

    // By default filter all, todo 1 is visible
    expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument()

    // Switch to completed filter (no completed todos yet)
    const completedFilterBtn = screen.getByRole('button', { name: /completed/i })
    fireEvent.click(completedFilterBtn)

    expect(screen.getByText(/no completed todos\./i)).toBeInTheDocument()

    // Switch to active filter (task 1 is active, so no empty message)
    const activeFilterBtn = screen.getByRole('button', { name: /active/i })
    fireEvent.click(activeFilterBtn)

    expect(screen.queryByText(/no active todos\./i)).not.toBeInTheDocument()
  })

  test('displays Clear Completed button with count and clears completed todos', () => {
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

    const checkboxes = screen.getAllByRole('checkbox')

    // Mark two as completed
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[2])

    // The clear completed button should appear with count 2
    const clearCompletedBtn = screen.getByRole('button', { name: /clear completed \(2\)/i })
    expect(clearCompletedBtn).toBeInTheDocument()

    // Click it to clear completed todos
    fireEvent.click(clearCompletedBtn)

    // Now only one todo remains (Task 2)
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument()

    // Clear Completed button should disappear
    expect(screen.queryByRole('button', { name: /clear completed/i })).not.toBeInTheDocument()
  })
})