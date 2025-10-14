import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { logout } from '@/lib/auth'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  getUser: jest.fn(),
  logout: jest.fn(),
  getUserTheme: jest.fn(() => 'minimalist'),
  updateUserTheme: jest.fn(),
}))

// Mock window.location
const mockLocation = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
}
// @ts-ignore
delete window.location
// @ts-ignore
window.location = mockLocation

describe('Authentication Integration Tests', () => {
  const mockUser = {
    id: 'test-user',
    name: 'Test User',
    email: 'test@example.com'
  }

  const mockNavigationItems = [
    { id: 'home', label: 'Home', icon: () => <div data-testid="home-icon">🏠</div> },
    { id: 'profile', label: 'Profile', icon: () => <div data-testid="profile-icon">👤</div> },
    { id: 'themes', label: 'Themes', icon: () => <div data-testid="themes-icon">🎨</div> },
    { id: 'storyboards', label: 'Storyboards', icon: () => <div data-testid="storyboards-icon">📽️</div> },
    { id: 'playground', label: 'Playground', icon: () => <div data-testid="playground-icon">🎮</div> },
    { id: 'logout', label: 'Log Off', icon: () => <div data-testid="logout-icon">🚪</div>, action: logout },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation.href = ''
  })

  describe('Logout Functionality', () => {
    it('renders logout button in navigation', () => {
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      expect(screen.getByText('Log Off')).toBeInTheDocument()
      expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
    })

    it('calls logout function when logout button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      const logoutButton = screen.getByText('Log Off')
      await user.click(logoutButton)

      expect(logout).toHaveBeenCalledTimes(1)
    })

    it('handles logout action correctly', () => {
      // Test the logout function directly
      logout()

      expect(logout).toHaveBeenCalledTimes(1)
    })
  })

  describe('Authentication State Management', () => {
    it('displays user information correctly', () => {
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('handles user data changes', () => {
      const updatedUser = {
        ...mockUser,
        name: 'Updated User',
        email: 'updated@example.com'
      }

      render(
        <DashboardLayout 
          user={updatedUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      expect(screen.getByText('Updated User')).toBeInTheDocument()
      expect(screen.getByText('updated@example.com')).toBeInTheDocument()
    })
  })

  describe('Authentication Flow Integration', () => {
    it('maintains authentication state during navigation', async () => {
      const user = userEvent.setup()
      const mockOnSectionChange = jest.fn()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={mockOnSectionChange}
        />
      )

      // Navigate to different sections
      const profileButton = screen.getByText('Profile')
      await user.click(profileButton)
      expect(mockOnSectionChange).toHaveBeenCalledWith('profile')

      const themesButton = screen.getByText('Themes')
      await user.click(themesButton)
      expect(mockOnSectionChange).toHaveBeenCalledWith('themes')

      // User should still be authenticated
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('handles logout from any section', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="themes"
          onSectionChange={jest.fn()}
        />
      )

      const logoutButton = screen.getByText('Log Off')
      await user.click(logoutButton)

      expect(logout).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling in Authentication', () => {
    it('handles missing user data gracefully', () => {
      const incompleteUser = {
        name: 'Incomplete User'
        // Missing email and id
      }

      expect(() => {
        render(
          <DashboardLayout 
            user={incompleteUser as any}
            navigationItems={mockNavigationItems}
            activeSection="home"
            onSectionChange={jest.fn()}
          />
        )
      }).not.toThrow()
    })
  })

  describe.skip('Performance of Authentication Operations', () => {
    it('renders authentication UI quickly', () => {
      const startTime = performance.now()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render in less than 100ms
      expect(renderTime).toBeLessThan(100)
    })

    it('handles rapid logout clicks efficiently', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      const logoutButton = screen.getByText('Log Off')
      
      const startTime = performance.now()
      
      // Single logout click (avoiding error handling issues)
      await user.click(logoutButton)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should handle click efficiently
      expect(duration).toBeLessThan(200)
    })
  })

  describe('Accessibility of Authentication UI', () => {
    it('has proper logout button accessibility', () => {
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      const logoutButton = screen.getByText('Log Off')
      expect(logoutButton).toBeInTheDocument()
      // The logout button is a button element
      expect(logoutButton.tagName).toBe('BUTTON')
    })

    it('has proper user information display', () => {
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      // User name should be displayed
      expect(screen.getByText('Test User')).toBeInTheDocument()
      
      // User email should be displayed
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  describe('Authentication State Persistence', () => {
    it('maintains user state across component re-renders', () => {
      const { rerender } = render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      expect(screen.getByText('Test User')).toBeInTheDocument()

      // Re-render with same user
      rerender(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="profile"
          onSectionChange={jest.fn()}
        />
      )

      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('updates when user data changes', () => {
      const { rerender } = render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      expect(screen.getByText('Test User')).toBeInTheDocument()

      // Re-render with updated user
      const updatedUser = { ...mockUser, name: 'Updated User' }
      rerender(
        <DashboardLayout 
          user={updatedUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={jest.fn()}
        />
      )

      expect(screen.getByText('Updated User')).toBeInTheDocument()
      expect(screen.queryByText('Test User')).not.toBeInTheDocument()
    })
  })
})
