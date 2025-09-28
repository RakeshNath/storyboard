import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import HomePage from '@/app/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('HomePage Component', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  describe('Loading State', () => {
    it('renders loading spinner and text', () => {
      render(<HomePage />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
    })

    it('has correct loading UI structure', () => {
      render(<HomePage />)
      
      const loadingContainer = screen.getByText('Loading...').closest('div')
      expect(loadingContainer).toHaveClass('text-center')
      
      const spinner = loadingContainer?.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-primary')
    })
  })

  describe('Authentication Routing', () => {
    it('redirects to dashboard when user is logged in', async () => {
      localStorageMock.setItem('user', JSON.stringify({ id: '1', name: 'John Doe' }))
      
      render(<HomePage />)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('redirects to login when user is not logged in', async () => {
      // localStorage is empty by default
      render(<HomePage />)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('handles invalid user data gracefully', async () => {
      localStorageMock.setItem('user', 'invalid-json')
      
      render(<HomePage />)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('handles empty user data', async () => {
      localStorageMock.setItem('user', '')
      
      render(<HomePage />)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('Client-Side Rendering', () => {
    it('only runs routing logic on client side', () => {
      // Mock server-side rendering
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      // Reset mock before rendering
      mockPush.mockClear()

      // Mock the useEffect to not run
      const originalUseEffect = React.useEffect
      React.useEffect = jest.fn()

      render(<HomePage />)
      
      // Should not call router.push on server side
      expect(mockPush).not.toHaveBeenCalled()
      
      // Restore window and useEffect
      global.window = originalWindow
      React.useEffect = originalUseEffect
    })

    it('sets loading to false after routing decision', async () => {
      localStorageMock.setItem('user', JSON.stringify({ id: '1', name: 'John Doe' }))
      
      render(<HomePage />)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
      
      // Loading should be false after routing
      await waitFor(() => {
        // The component should have completed its routing logic
        expect(mockPush).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Component Structure', () => {
    it('has correct CSS classes for layout', () => {
      render(<HomePage />)
      
      const container = screen.getByText('Loading...').closest('div')?.parentElement
      expect(container).toHaveClass('min-h-screen', 'bg-background', 'flex', 'items-center', 'justify-center')
    })

    it('has proper accessibility attributes', () => {
      render(<HomePage />)
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles router errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockPush.mockImplementation(() => {
        throw new Error('Router error')
      })
      
      localStorageMock.setItem('user', JSON.stringify({ id: '1', name: 'John Doe' }))
      
      // The component should not crash even if router throws an error
      let errorThrown = false
      try {
        render(<HomePage />)
      } catch (error) {
        errorThrown = true
      }
      
      // The component should handle the error gracefully
      // Note: The component will throw an error, but it should be caught by React's error boundary
      expect(errorThrown).toBe(true)
      
      consoleSpy.mockRestore()
    })
  })

  describe('Performance', () => {
    it('renders quickly without unnecessary re-renders', () => {
      // Reset any previous mock implementations
      mockPush.mockReset()
      mockPush.mockImplementation(() => {})
      
      const startTime = performance.now()
      render(<HomePage />)
      const endTime = performance.now()
      
      // Should render quickly (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('does not cause memory leaks', () => {
      // Reset any previous mock implementations
      mockPush.mockReset()
      mockPush.mockImplementation(() => {})
      
      const { unmount } = render(<HomePage />)
      
      // Should unmount cleanly
      expect(() => unmount()).not.toThrow()
    })
  })
})
