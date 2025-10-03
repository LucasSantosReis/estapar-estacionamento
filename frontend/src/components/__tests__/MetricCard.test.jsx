import React from 'react'
import { render, screen } from '@testing-library/react'
import { Car } from 'lucide-react'
import MetricCard from '../MetricCard'

import { vi } from 'vitest'

// Mock do framer-motion para evitar problemas com animações nos testes
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}))

describe('MetricCard', () => {
  it('should render with basic props', () => {
    render(
      <MetricCard
        title="Veículos Estacionados"
        value="150"
        icon={Car}
      />
    )
    
    expect(screen.getByText('Veículos Estacionados')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('should render with change indicator (positive)', () => {
    render(
      <MetricCard
        title="Receita"
        value="R$ 1.500"
        icon={Car}
        change="+12%"
        changeType="positive"
      />
    )
    
    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('vs ontem')).toBeInTheDocument()
  })

  it('should render with change indicator (negative)', () => {
    render(
      <MetricCard
        title="Ocupação"
        value="75%"
        icon={Car}
        change="-5%"
        changeType="negative"
      />
    )
    
    expect(screen.getByText('-5%')).toBeInTheDocument()
    expect(screen.getByText('vs ontem')).toBeInTheDocument()
  })

  it('should render with different color variants', () => {
    const { rerender } = render(
      <MetricCard
        title="Test"
        value="100"
        icon={Car}
        color="success"
      />
    )
    
    expect(screen.getByTestId('metric-card')).toHaveClass('bg-success-50', 'border-success-200')
    
    rerender(
      <MetricCard
        title="Test"
        value="100"
        icon={Car}
        color="warning"
      />
    )
    
    expect(screen.getByTestId('metric-card')).toHaveClass('bg-warning-50', 'border-warning-200')
  })

  it('should not render change indicator when change is not provided', () => {
    render(
      <MetricCard
        title="Test"
        value="100"
        icon={Car}
      />
    )
    
    expect(screen.queryByText('vs ontem')).not.toBeInTheDocument()
  })
})
