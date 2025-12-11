import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TodoFilter from '../components/TodoFilter'

describe('TodoFilter component', () => {
  const filters = ['all', 'active', 'completed']

  test('renders all filter buttons with correct labels', () => {
    render(<TodoFilter filter="all" onFilterChange={() => {}} />)

    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument()
  })

  test('applies active class to the button matching filter prop', () => {
    const { rerender } = render(<TodoFilter filter="all" onFilterChange={() => {}} />)
    expect(screen.getByRole('button', { name: /all/i })).toHaveClass('active')

    rerender(<TodoFilter filter="active" onFilterChange={() => {}} />)
    expect(screen.getByRole('button', { name: /active/i })).toHaveClass('active')
    expect(screen.getByRole('button', { name: /all/i })).not.toHaveClass('active')

    rerender(<TodoFilter filter="completed" onFilterChange={() => {}} />)
    expect(screen.getByRole('button', { name: /completed/i })).toHaveClass('active')
  })

  test('calls onFilterChange callback with correct filter id when a button is clicked', () => {
    const onFilterChange = jest.fn()
    render(<TodoFilter filter="all" onFilterChange={onFilterChange} />)

    filters.forEach((filterId) => {
      const button = screen.getByRole('button', { name: new RegExp(filterId, 'i') })
      fireEvent.click(button)
      expect(onFilterChange).toHaveBeenLastCalledWith(filterId)
    })
  })
})