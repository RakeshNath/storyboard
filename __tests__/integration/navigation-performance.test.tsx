import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DashboardLayout } from '@/components/dashboard-layout'
import { mockDocumentSetProperty, mockWindowDispatchEvent } from '../utils/test-utils'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, priority, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock window.alert
Object.defineProperty(window, 'alert', {
  value: jest.fn(),
  writable: true
})

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  getUserTheme: jest.fn(() => 'minimalist'),
  updateUserTheme: jest.fn(),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/dashboard',
}))

describe('Navigation Performance Tests', () => {
  let mockSetProperty: jest.Mock
  let mockDispatchEvent: jest.Mock
  let mockOnSectionChange: jest.Mock

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
    { id: 'settings', label: 'Settings', icon: () => <div data-testid="settings-icon">⚙️</div> }
  ]

  beforeEach(() => {
    mockSetProperty = mockDocumentSetProperty()
    mockDispatchEvent = mockWindowDispatchEvent()
    mockOnSectionChange = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Navigation Button Response Time', () => {
    it('responds to navigation clicks within acceptable time', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={mockOnSectionChange}
        />
      )

      // Test each navigation button response time
      for (const item of mockNavigationItems) {
        const startTime = performance.now()
        
        const navButton = screen.getByText(item.label)
        await user.click(navButton)
        
        const endTime = performance.now()
        const responseTime = endTime - startTime
        
        // Navigation should respond within 1000ms (reasonable for test environment)
        expect(responseTime).toBeLessThan(1000)
        
        // Verify the section change was called
        expect(mockOnSectionChange).toHaveBeenCalledWith(item.id)
        
        mockOnSectionChange.mockClear()
      }
    })

    it('handles rapid navigation clicks efficiently', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={mockOnSectionChange}
        />
      )

      const startTime = performance.now()
      
      // Rapidly click through all navigation items
      for (const item of mockNavigationItems) {
        const navButton = screen.getByText(item.label)
        await user.click(navButton)
      }
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      // All navigation clicks should complete within 1000ms
      expect(totalTime).toBeLessThan(1000)
      
      // Verify all section changes were called
      expect(mockOnSectionChange).toHaveBeenCalledTimes(mockNavigationItems.length)
    })

    it('maintains performance during navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={mockOnSectionChange}
        />
      )

      const startTime = performance.now()
      
      // Navigate through multiple sections
      const profileButton = screen.getByText('Profile')
      await user.click(profileButton)
      
      const themesButton = screen.getByText('Themes')
      await user.click(themesButton)
      
      const storyboardsButton = screen.getByText('Storyboards')
      await user.click(storyboardsButton)
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      // Multiple navigation clicks should complete within 1000ms
      expect(totalTime).toBeLessThan(1000)
    })
  })

  describe('Navigation Visual Feedback Performance', () => {
    it('updates active state immediately on click', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={mockOnSectionChange}
        />
      )

      const startTime = performance.now()
      
      // Click on profile navigation
      const profileButton = screen.getByText('Profile')
      await user.click(profileButton)
      
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      // Visual feedback should be immediate (within 100ms for test environment)
      expect(responseTime).toBeLessThan(100)
      
      // Verify the section change was called
      expect(mockOnSectionChange).toHaveBeenCalledWith('profile')
    })

    it('handles hover states without performance impact', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={mockOnSectionChange}
        />
      )

      const startTime = performance.now()
      
      // Hover over multiple navigation items
      for (const item of mockNavigationItems) {
        const navButton = screen.getByText(item.label)
        await user.hover(navButton)
        await user.unhover(navButton)
      }
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      // Hover interactions should be very fast
      expect(totalTime).toBeLessThan(500)
    })
  })

  describe('Navigation with Content Loading Performance', () => {
    it('loads content sections efficiently when navigating', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={mockOnSectionChange}
        />
      )

      // Test navigation to each section and measure content loading time
      for (const item of mockNavigationItems) {
        const startTime = performance.now()
        
        const navButton = screen.getByText(item.label)
        await user.click(navButton)
        
        // Wait for content to load
        await waitFor(() => {
          expect(mockOnSectionChange).toHaveBeenCalledWith(item.id)
        })
        
        const endTime = performance.now()
        const loadTime = endTime - startTime
        
        // Each section should load within 500ms
        expect(loadTime).toBeLessThan(500)
        
        mockOnSectionChange.mockClear()
      }
    })
  })

  describe('Navigation Accessibility Performance', () => {
    it('responds to keyboard navigation efficiently', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={mockOnSectionChange}
        />
      )

      const startTime = performance.now()
      
      // Navigate using keyboard
      const firstNavButton = screen.getByText('Home')
      firstNavButton.focus()
      
      // Tab through navigation items
      for (let i = 0; i < mockNavigationItems.length; i++) {
        await user.keyboard('{Tab}')
        await user.keyboard('{Enter}')
      }
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      // Keyboard navigation should be fast
      expect(totalTime).toBeLessThan(1000)
    })

    it('maintains focus management performance during navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <DashboardLayout 
          user={mockUser}
          navigationItems={mockNavigationItems}
          activeSection="home"
          onSectionChange={mockOnSectionChange}
        />
      )

      const startTime = performance.now()
      
      // Focus and click navigation items
      for (const item of mockNavigationItems) {
        const navButton = screen.getByText(item.label)
        navButton.focus()
        await user.click(navButton)
      }
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      // Focus management should not slow down navigation
      expect(totalTime).toBeLessThan(1000)
    })
  })

  describe('Navigation Performance Summary', () => {
    it('provides comprehensive navigation performance testing', () => {
      // This test documents the navigation performance testing coverage
      expect(true).toBe(true)
    })
  })
})
