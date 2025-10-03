import React from 'react'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should render with custom message', () => {
    render(<LoadingSpinner message="Processando dados..." />)
    
    expect(screen.getByText('Processando dados...')).toBeInTheDocument()
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-4', 'w-4')
    
    rerender(<LoadingSpinner size="medium" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-6', 'w-6')
    
    rerender(<LoadingSpinner size="large" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-8', 'w-8')
  })

  it('should not render message when message prop is empty', () => {
    render(<LoadingSpinner message="" />)
    
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument()
  })
})
