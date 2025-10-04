/**
 * E2E Test Setup
 * Configures test environment for E2E tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_APP_ENV = 'test'

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  // Suppress React warnings in E2E tests
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: React does not recognize') ||
       args[0].includes('Warning: Received `true` for a non-boolean attribute'))
    ) {
      return
    }
    originalConsoleError(...args)
  }

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return
    }
    originalConsoleWarn(...args)
  }
})

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Global test timeout for E2E tests
jest.setTimeout(10000)
