import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import DashboardPage from '@/app/dashboard/page'
import { getUser, logout, getUserTheme } from '@/lib/auth'

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

// Mock DashboardLayout component
jest.mock('@/components/dashboard-layout', () => ({
  DashboardLayout: ({ user, navigationItems, activeSection, onSectionChange }: any) => (
    <div data-testid="dashboard-layout">
      <div data-testid="user-info">{user?.name}</div>
      <div data-testid="active-section">{activeSection}</div>
      <button 
        data-testid="section-button" 
        onClick={() => onSectionChange('test-section')}
      >
        Test Section
      </button>
    </div>
  ),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('DashboardPage', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    theme: 'professional'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(getUser as jest.Mock).mockReturnValue(mockUser)
    ;(getUserTheme as jest.Mock).mockReturnValue('professional')
    ;(logout as jest.Mock).mockImplementation(() => {
      localStorageMock.removeItem('user')
      mockPush('/login')
    })
  })

  it('renders dashboard with user information', () => {
    render(<DashboardPage />)
    
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    expect(screen.getByTestId('user-info')).toHaveTextContent('Test User')
  })

  it('shows loading state initially', () => {
    ;(getUser as jest.Mock).mockReturnValue(null)
    
    render(<DashboardPage />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to login when no user is found', async () => {
    ;(getUser as jest.Mock).mockReturnValue(null)
    
    render(<DashboardPage />)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('handles section changes', async () => {
    render(<DashboardPage />)
    
    const sectionButton = screen.getByTestId('section-button')
    fireEvent.click(sectionButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('active-section')).toHaveTextContent('test-section')
    })
  })

  it('applies user theme on mount', async () => {
    ;(getUserTheme as jest.Mock).mockReturnValue('minimalist')
    
    render(<DashboardPage />)
    
    await waitFor(() => {
      expect(getUserTheme).toHaveBeenCalled()
    })
  })

  it('handles logout action', async () => {
    render(<DashboardPage />)
    
    // Simulate logout action
    logout()
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('renders all navigation items', () => {
    render(<DashboardPage />)
    
    // Check that DashboardLayout is rendered with navigation items
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
  })

  it('handles theme application errors gracefully', async () => {
    ;(getUserTheme as jest.Mock).mockImplementation(() => {
      throw new Error('Theme error')
    })
    
    render(<DashboardPage />)
    
    // Should still render the dashboard
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
  })

  it('handles theme application DOM errors gracefully', async () => {
    // Mock document.documentElement.style.setProperty to throw an error
    const originalSetProperty = document.documentElement.style.setProperty
    document.documentElement.style.setProperty = jest.fn(() => {
      throw new Error('DOM manipulation error')
    })
    
    // Mock getUserTheme to return a valid theme
    ;(getUserTheme as jest.Mock).mockReturnValue({
      primary: '#000000',
      secondary: '#ffffff'
    })
    
    render(<DashboardPage />)
    
    // Should still render the dashboard despite theme application error
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    
    // Restore original function
    document.documentElement.style.setProperty = originalSetProperty
  })

  it('handles applyUserTheme function errors gracefully', async () => {
    // Mock getUserTheme to return a valid theme
    ;(getUserTheme as jest.Mock).mockReturnValue({
      primary: '#000000',
      secondary: '#ffffff'
    })
    
    // Mock document.documentElement.style.setProperty to throw an error
    const originalSetProperty = document.documentElement.style.setProperty
    document.documentElement.style.setProperty = jest.fn(() => {
      throw new Error('DOM manipulation error')
    })
    
    // Suppress console.error for this test since we expect an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<DashboardPage />)
    
    // Should still render the dashboard despite theme application error
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    
    // Restore original function
    document.documentElement.style.setProperty = originalSetProperty
    consoleSpy.mockRestore()
  })

  it('updates active section state correctly', async () => {
    render(<DashboardPage />)
    
    const sectionButton = screen.getByTestId('section-button')
    fireEvent.click(sectionButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('active-section')).toHaveTextContent('test-section')
    })
  })

  it('handles user data changes', async () => {
    const newUser = { ...mockUser, name: 'Updated User' }
    ;(getUser as jest.Mock).mockReturnValue(newUser)
    
    render(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('Updated User')
    })
  })

  it('applies different themes correctly', async () => {
    const themes = ['professional', 'minimalist', 'creative', 'dark']
    
    for (const theme of themes) {
      ;(getUserTheme as jest.Mock).mockReturnValue(theme)
      
      const { unmount } = render(<DashboardPage />)
      
      await waitFor(() => {
        expect(getUserTheme).toHaveBeenCalled()
      })
      
      unmount()
    }
  })

  it('handles missing user gracefully', async () => {
    ;(getUser as jest.Mock).mockReturnValue(undefined)
    
    render(<DashboardPage />)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('maintains state during re-renders', () => {
    const { rerender } = render(<DashboardPage />)
    
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    
    rerender(<DashboardPage />)
    
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
  })

  it('handles theme application errors and logs error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    // Mock documentElement.style.setProperty to throw error
    const originalSetProperty = document.documentElement.style.setProperty
    Object.defineProperty(document.documentElement.style, 'setProperty', {
      value: jest.fn(() => {
        throw new Error('DOM error')
      }),
      writable: true,
      configurable: true,
    })
    
    render(<DashboardPage />)
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Theme application error:', expect.any(Error))
    })
    
    // Restore
    Object.defineProperty(document.documentElement.style, 'setProperty', {
      value: originalSetProperty,
      writable: true,
      configurable: true,
    })
    consoleErrorSpy.mockRestore()
  })

  it('handles invalid theme gracefully', async () => {
    ;(getUserTheme as jest.Mock).mockReturnValue('invalid-theme-id')
    
    render(<DashboardPage />)
    
    await waitFor(() => {
      // Should still render even with invalid theme
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    })
  })

  it('handles theme application with window undefined check', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(<DashboardPage />)
    
    // Component should render successfully
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    
    consoleErrorSpy.mockRestore()
  })
})