import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TodoFilter from '../components/TodoFilter'

describe('TodoFilter component', () => {
  test('renders all filter buttons with correct labels', () => {
    render(<TodoFilter filter="all" onFilterChange={() => {}} />)

    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  test('active filter button has active class', () => {
    const { rerender } = render(<TodoFilter filter="active" onFilterChange={() => {}} />)
    expect(screen.getByText('Active')).toHaveClass('active')

    rerender(<TodoFilter filter="completed" onFilterChange={() => {}} />)
    expect(screen.getByText('Completed')).toHaveClass('active')
  })

  test('calls onFilterChange with correct filter id when buttons are clicked', () => {
    const onFilterChange = jest.fn()
    render(<TodoFilter filter="all" onFilterChange={onFilterChange} />)

    fireEvent.click(screen.getByText('Active'))
    expect(onFilterChange).toHaveBeenCalledWith('active')

    fireEvent.click(screen.getByText('Completed'))
    expect(onFilterChange).toHaveBeenCalledWith('completed')

    fireEvent.click(screen.getByText('All'))
    expect(onFilterChange).toHaveBeenCalledWith('all')
  })
})