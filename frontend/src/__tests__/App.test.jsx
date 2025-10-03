import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

import { vi } from 'vitest'

// Mock do framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}))

// Mock das páginas
vi.mock('../pages/Dashboard', () => ({
  default: function MockDashboard() {
    return <div data-testid="dashboard-page">Dashboard Page</div>
  }
}))

vi.mock('../pages/Revenue', () => ({
  default: function MockRevenue() {
    return <div data-testid="revenue-page">Revenue Page</div>
  }
}))

vi.mock('../pages/Analytics', () => ({
  default: function MockAnalytics() {
    return <div data-testid="analytics-page">Analytics Page</div>
  }
}))

vi.mock('../pages/Simulation', () => ({
  default: function MockSimulation() {
    return <div data-testid="simulation-page">Simulation Page</div>
  }
}))

vi.mock('../pages/SystemMonitoring', () => ({
  default: function MockSystemMonitoring() {
    return <div data-testid="monitoring-page">System Monitoring Page</div>
  }
}))

const renderWithRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('App', () => {
  it('should render Dashboard page on root route', () => {
    renderWithRouter(<App />, { route: '/' })
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
  })

  it('should render Revenue page on /revenue route', () => {
    renderWithRouter(<App />, { route: '/revenue' })
    
    expect(screen.getByTestId('revenue-page')).toBeInTheDocument()
    expect(screen.getByText('Revenue Page')).toBeInTheDocument()
  })

  it('should render Analytics page on /analytics route', () => {
    renderWithRouter(<App />, { route: '/analytics' })
    
    expect(screen.getByTestId('analytics-page')).toBeInTheDocument()
    expect(screen.getByText('Analytics Page')).toBeInTheDocument()
  })

  it('should render Simulation page on /simulation route', () => {
    renderWithRouter(<App />, { route: '/simulation' })
    
    expect(screen.getByTestId('simulation-page')).toBeInTheDocument()
    expect(screen.getByText('Simulation Page')).toBeInTheDocument()
  })

  it('should render SystemMonitoring page on /monitoring route', () => {
    renderWithRouter(<App />, { route: '/monitoring' })
    
    expect(screen.getByTestId('monitoring-page')).toBeInTheDocument()
    expect(screen.getByText('System Monitoring Page')).toBeInTheDocument()
  })

  it('should have correct CSS classes', () => {
    const { container } = renderWithRouter(<App />)
    
    const appDiv = container.firstChild
    expect(appDiv).toHaveClass('min-h-screen', 'bg-gray-50')
  })
})
