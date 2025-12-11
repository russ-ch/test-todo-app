import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ClearCompleted from '../components/ClearCompleted'

describe('ClearCompleted component', () => {
  test('does not render button when completedCount is 0', () => {
    const { container } = render(<ClearCompleted completedCount={0} onClearCompleted={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  test('renders button with correct count and calls onClearCompleted on click', () => {
    const onClearCompleted = jest.fn()
    render(<ClearCompleted completedCount={3} onClearCompleted={onClearCompleted} />)

    const button = screen.getByRole('button', { name: /clear completed \(3\)/i })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    expect(onClearCompleted).toHaveBeenCalledTimes(1)
  })
})