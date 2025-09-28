import { render } from '@testing-library/react'

// Mock user data factory
export const createMockUser = (overrides = {}) => ({
  email: 'john.doe@example.com',
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  location: 'New York, NY',
  phoneNumber: '+1 (555) 123-4567',
  subscription: 'free',
  theme: 'minimalist',
  bio: 'Passionate screenwriter with 10+ years of experience',
  website: 'https://example.com',
  ...overrides,
})

// Theme simulation utilities
export const mockThemes = {
  minimalist: 'Minimalist',
  professional: 'Professional',
  cyberpunk: 'Cyberpunk',
  filmnoir: 'Film Noir',
  indie: 'Indie',
  classic: 'Classic',
}

export const simulateThemeChange = (theme: string) => {
  const event = new CustomEvent('themeChanged', {
    detail: { theme }
  })
  window.dispatchEvent(event)
}

// Theme testing utilities
export const mockDocumentSetProperty = () => {
  const mockSetProperty = jest.fn()
  Object.defineProperty(document, 'documentElement', {
    value: {
      style: {
        setProperty: mockSetProperty,
      },
    },
    writable: true,
  })
  return mockSetProperty
}

export const mockWindowDispatchEvent = () => {
  const mockDispatchEvent = jest.fn()
  Object.defineProperty(window, 'dispatchEvent', {
    value: mockDispatchEvent,
    writable: true,
  })
  return mockDispatchEvent
}

export const createMockThemeColors = (overrides = {}) => ({
  primary: 'oklch(0.45 0.15 264)',
  secondary: 'oklch(0.15 0.02 264)',
  background: 'oklch(0.08 0.01 264)',
  foreground: 'oklch(0.92 0.01 264)',
  accent: 'oklch(0.22 0.025 264)',
  ...overrides,
})

export const validateThemeApplication = (mockSetProperty: jest.Mock, expectedColors: Record<string, string>) => {
  Object.entries(expectedColors).forEach(([variable, value]) => {
    expect(mockSetProperty).toHaveBeenCalledWith(variable, value)
  })
}

export const getThemeColorSwatches = (container: HTMLElement) => {
  return container.querySelectorAll('[style*="backgroundColor"]')
}

export const validateColorFormat = (colorValue: string) => {
  return /^(oklch|rgb|hsl|#|var)\(/.test(colorValue)
}

export * from '@testing-library/react'
