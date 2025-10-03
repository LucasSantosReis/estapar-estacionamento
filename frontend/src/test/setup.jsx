import '@testing-library/jest-dom'

// Mock do react-router-dom
import { BrowserRouter } from 'react-router-dom'

// Wrapper global para testes que precisam do router
export const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

import { vi } from 'vitest'

// Mock de fetch global
global.fetch = vi.fn()

// Mock do console para evitar logs durante os testes
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}
