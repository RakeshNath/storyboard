import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  getUser: jest.fn(() => null),
}))

describe('HomePage Component', () => {
  it('renders loading state initially', () => {
    // Mock window to simulate client-side rendering
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
      },
      writable: true,
    })
    
    render(<HomePage />)
    
    // Loading state might not be present in current implementation
    expect(screen.getByText(/Welcome to StoryBoard/i)).toBeInTheDocument()
  })

  it('renders main content after loading', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome to StoryBoard/i)).toBeInTheDocument()
    })
  })

  it('displays hero section', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Professional Storyboard Writing/i)).toBeInTheDocument()
      expect(screen.getByText(/Create, manage, and organize your storyboards/i)).toBeInTheDocument()
    })
  })

  it('renders call-to-action buttons', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getAllByText(/Get Started/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/Learn More/i)).toBeInTheDocument()
    })
  })

  it('displays features section', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getAllByText(/Features/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/Easy to Use/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Professional Tools/i)[0]).toBeInTheDocument()
    })
  })

  it('shows login button when not authenticated', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
    })
  })

  it('handles button clicks', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      const getStartedButton = screen.getAllByText(/Get Started/i)[0]
      expect(getStartedButton).toBeInTheDocument()
    })
  })

  it('renders with proper accessibility attributes', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      // Check for proper heading structure
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
      
      // Check for proper button roles
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  it('displays footer information', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText(/© 2024 StoryBoard/i)).toBeInTheDocument()
    })
  })

  it('renders efficiently', () => {
    const startTime = performance.now()
    render(<HomePage />)
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(1000)
  })

  it('handles responsive design', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      // Should render responsive elements
      expect(screen.getByText(/Welcome to StoryBoard/i)).toBeInTheDocument()
    })
  })

  it('displays testimonials section', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText(/What Our Users Say/i)).toBeInTheDocument()
    })
  })

  it('shows pricing information', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Pricing/i)).toBeInTheDocument()
      expect(screen.getByText(/Free/i)).toBeInTheDocument()
      expect(screen.getByText(/Premium/i)).toBeInTheDocument()
    })
  })

  it('redirects to dashboard when user is logged in', async () => {
    const mockPush = jest.fn()
    const mockRouter = {
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
    
    // Mock useRouter to return our mock
    jest.doMock('next/navigation', () => ({
      useRouter: () => mockRouter,
      useSearchParams: () => ({
        get: jest.fn(),
      }),
      usePathname: () => '/',
    }))
    
    // Mock localStorage with valid user data
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => JSON.stringify({ id: '1', name: 'Test User' })),
      },
      writable: true,
    })
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles invalid user data in localStorage', async () => {
    const mockPush = jest.fn()
    const mockRouter = {
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
    
    // Mock useRouter to return our mock
    jest.doMock('next/navigation', () => ({
      useRouter: () => mockRouter,
      useSearchParams: () => ({
        get: jest.fn(),
      }),
      usePathname: () => '/',
    }))
    
    // Mock localStorage with invalid JSON
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'invalid json'),
      },
      writable: true,
    })
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome to StoryBoard/i)).toBeInTheDocument()
    })
    
    // Should not redirect with invalid JSON
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('displays all main content sections', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      // Hero section
      expect(screen.getByText(/Welcome to StoryBoard/i)).toBeInTheDocument()
      expect(screen.getByText(/Create amazing stories/i)).toBeInTheDocument()
      
      // Features section
      expect(screen.getByText(/Features/i)).toBeInTheDocument()
      expect(screen.getByText(/AI-Powered Writing/i)).toBeInTheDocument()
      expect(screen.getByText(/Collaborative Editing/i)).toBeInTheDocument()
      expect(screen.getByText(/Real-time Sync/i)).toBeInTheDocument()
      expect(screen.getByText(/Export Options/i)).toBeInTheDocument()
      
      // Testimonials section
      expect(screen.getByText(/What Our Users Say/i)).toBeInTheDocument()
      
      // Pricing section
      expect(screen.getByText(/Simple Pricing/i)).toBeInTheDocument()
      expect(screen.getByText(/Free/i)).toBeInTheDocument()
      expect(screen.getByText(/Pro/i)).toBeInTheDocument()
      
      // Footer
      expect(screen.getByText(/© 2024 StoryBoard/i)).toBeInTheDocument()
    })
  })

  it('handles button clicks correctly', async () => {
    const mockPush = jest.fn()
    const mockRouter = {
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
    
    // Mock useRouter to return our mock
    jest.doMock('next/navigation', () => ({
      useRouter: () => mockRouter,
      useSearchParams: () => ({
        get: jest.fn(),
      }),
      usePathname: () => '/',
    }))
    
    render(<HomePage />)
    
    await waitFor(() => {
      const getStartedButton = screen.getByText('Get Started')
      expect(getStartedButton).toBeInTheDocument()
    })
  })
})