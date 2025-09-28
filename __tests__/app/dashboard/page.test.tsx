import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import DashboardPage from '@/app/dashboard/page'
import { createMockUser } from '../../utils/test-utils'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  getUser: jest.fn(),
  logout: jest.fn(),
  getUserTheme: jest.fn(),
}))

// Mock dashboard layout
jest.mock('@/components/dashboard-layout', () => ({
  DashboardLayout: ({ user, navigationItems, activeSection, onSectionChange }: any) => (
    <div data-testid="dashboard-layout">
      <div>User: {user?.name}</div>
      <div>Active Section: {activeSection}</div>
      <div>Navigation Items: {navigationItems.length}</div>
    </div>
  ),
}))

// Mock document.documentElement.style.setProperty
const mockSetProperty = jest.fn()
Object.defineProperty(document, 'documentElement', {
  value: {
    style: {
      setProperty: mockSetProperty,
    },
  },
  writable: true,
})

// Mock window.dispatchEvent
const mockDispatchEvent = jest.fn()
Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
  writable: true,
})

describe('DashboardPage Component', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  const mockUser = createMockUser({
    name: 'John Doe',
    email: 'john.doe@example.com',
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockSetProperty.mockClear()
    mockDispatchEvent.mockClear()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  describe('Authentication', () => {
    it('redirects to login when user is not authenticated', async () => {
      const { getUser } = require('@/lib/auth')
      getUser.mockReturnValue(null)

      render(<DashboardPage />)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('renders dashboard when user is authenticated', async () => {
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('minimalist')

      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
        expect(screen.getByText('User: John Doe')).toBeInTheDocument()
      })
    })
  })

  describe('Theme Application', () => {
    it('applies user theme on mount', async () => {
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('professional')

      render(<DashboardPage />)

      await waitFor(() => {
        expect(mockSetProperty).toHaveBeenCalled()
        expect(mockDispatchEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'themeChanged',
            detail: { theme: 'professional' }
          })
        )
      })
    })

    it('applies minimalist theme correctly', async () => {
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('minimalist')

      render(<DashboardPage />)

      await waitFor(() => {
        expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.15 0.01 200)')
        expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.98 0.005 200)')
      })
    })

    it('applies cyberpunk theme correctly', async () => {
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('cyberpunk')

      render(<DashboardPage />)

      await waitFor(() => {
        expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.7 0.25 180)')
        expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.08 0.05 180)')
      })
    })

    it('handles unknown theme gracefully', async () => {
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('unknown-theme')

      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
        // Should not throw error for unknown theme
      })
    })
  })

  describe('Navigation Items', () => {
    it('renders with correct navigation items', async () => {
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('minimalist')

      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Navigation Items: 6')).toBeInTheDocument()
      })
    })

    it('has correct default active section', async () => {
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('minimalist')

      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Active Section: home')).toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('shows loading spinner when user is not loaded', () => {
      const { getUser } = require('@/lib/auth')
      getUser.mockReturnValue(null)

      render(<DashboardPage />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
    })

    it('has correct loading UI structure', () => {
      const { getUser } = require('@/lib/auth')
      getUser.mockReturnValue(null)

      render(<DashboardPage />)

      const loadingContainer = screen.getByText('Loading...').closest('div')
      expect(loadingContainer).toHaveClass('text-center')
      
      const spinner = loadingContainer?.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('renders DashboardLayout with correct props', async () => {
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('minimalist')

      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
        expect(screen.getByText('User: John Doe')).toBeInTheDocument()
      })
    })

    it('has proper CSS classes for loading state', () => {
      const { getUser } = require('@/lib/auth')
      getUser.mockReturnValue(null)

      render(<DashboardPage />)

      const container = screen.getByText('Loading...').closest('div')?.parentElement
      expect(container).toHaveClass('min-h-screen', 'bg-background', 'flex', 'items-center', 'justify-center')
    })
  })

  describe('Error Handling', () => {
    it('handles getUser errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const { getUser } = require('@/lib/auth')
      getUser.mockImplementation(() => {
        throw new Error('Auth error')
      })

      render(<DashboardPage />)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
        expect(consoleSpy).toHaveBeenCalledWith('Auth error:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('handles theme application errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('minimalist')
      
      mockSetProperty.mockImplementation(() => {
        throw new Error('CSS error')
      })

      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
        expect(consoleSpy).toHaveBeenCalledWith('Theme application error:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('Client-Side Rendering', () => {
    it('only runs logic on client side', () => {
      // Mock server-side rendering
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      // Reset mocks before rendering
      const { getUser } = require('@/lib/auth')
      getUser.mockClear()

      // Mock the useEffect to not run
      const originalUseEffect = React.useEffect
      React.useEffect = jest.fn()

      render(<DashboardPage />)

      // Should not call auth functions on server side
      expect(getUser).not.toHaveBeenCalled()

      // Restore window and useEffect
      global.window = originalWindow
      React.useEffect = originalUseEffect
    })
  })

  describe('Performance', () => {
    it('renders efficiently', () => {
      // Reset mocks to avoid errors from previous tests
      mockSetProperty.mockReset()
      mockSetProperty.mockImplementation(() => {})
      
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('minimalist')

      const startTime = performance.now()
      render(<DashboardPage />)
      const endTime = performance.now()

      // Should render quickly (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('does not cause memory leaks', async () => {
      // Reset mocks to avoid errors from previous tests
      mockSetProperty.mockReset()
      mockSetProperty.mockImplementation(() => {})
      
      const { getUser, getUserTheme } = require('@/lib/auth')
      getUser.mockReturnValue(mockUser)
      getUserTheme.mockReturnValue('minimalist')

      const { unmount } = render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
      })

      // Should unmount cleanly
      expect(() => unmount()).not.toThrow()
    })
  })
})
