import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ClearCompleted from '../components/ClearCompleted'

describe('ClearCompleted component', () => {
  test('does not render when completedCount is 0', () => {
    const { container } = render(
      <ClearCompleted completedCount={0} onClearCompleted={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  test('renders button with correct count', () => {
    render(
      <ClearCompleted completedCount={3} onClearCompleted={() => {}} />
    )
    expect(screen.getByText('Clear Completed (3)')).toBeInTheDocument()
  })

  test('calls onClearCompleted when button is clicked', () => {
    const mockClear = jest.fn()
    render(
      <ClearCompleted completedCount={2} onClearCompleted={mockClear} />
    )
    const button = screen.getByText('Clear Completed (2)')
    fireEvent.click(button)
    expect(mockClear).toHaveBeenCalledTimes(1)
  })
})