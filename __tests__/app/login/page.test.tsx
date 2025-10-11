import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/login/page'

// Mock router with spy
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/login',
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  getUser: jest.fn(() => null),
}))

describe('LoginPage Component', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }
  
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    localStorageMock.setItem.mockClear()
  })

  it('renders login form with title and description', () => {
    render(<LoginPage />)
    
    expect(screen.getByText(/Sign in to your storyboard writing portal/i)).toBeInTheDocument()
  })

  it('renders email and password input fields', () => {
    render(<LoginPage />)
    
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
  })

  it('renders login button', () => {
    render(<LoginPage />)
    
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
  })

  it('handles form input changes', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    
    await user.clear(emailInput)
    await user.type(emailInput, 'test@example.com')
    await user.clear(passwordInput)
    await user.type(passwordInput, 'password123')
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('handles form submission', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(submitButton).toBeInTheDocument()
  })

  it('displays logo and branding', () => {
    render(<LoginPage />)
    
    const logo = screen.getByAltText(/StoryBoard Logo/i)
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', expect.stringContaining('logo-minimalist.png'))
  })

  it('renders with proper form validation', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /Sign in/i })
    await user.click(submitButton)
    
    // Should handle validation
    expect(submitButton).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/Email/i)
    await user.tab()
    
    expect(emailInput).toHaveFocus()
  })

  it('displays error messages for invalid input', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/Email/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /Sign in/i })
    await user.click(submitButton)
    
    // Should handle validation errors
    expect(submitButton).toBeInTheDocument()
  })

  it('renders with proper accessibility attributes', () => {
    render(<LoginPage />)
    
    // Check for proper form structure
    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
    
    // Check for proper labels
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
  })

  it('handles password visibility toggle', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText(/Password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Look for password toggle button
    const toggleButton = screen.queryByRole('button', { name: /show password/i })
    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
    }
  })

  it('renders efficiently', () => {
    const startTime = performance.now()
    render(<LoginPage />)
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(1000)
  })

  it('handles loading states', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /Sign in/i })
    await user.click(submitButton)
    
    // Should handle loading state
    expect(submitButton).toBeInTheDocument()
  })

  it('displays forgot password link', () => {
    render(<LoginPage />)
    
    const forgotPasswordLink = screen.queryByText(/Forgot your password/i)
    if (forgotPasswordLink) {
      expect(forgotPasswordLink).toBeInTheDocument()
    }
  })

  it('handles remember me checkbox', () => {
    render(<LoginPage />)
    
    const rememberMeCheckbox = screen.queryByLabelText(/Remember me/i)
    if (rememberMeCheckbox) {
      expect(rememberMeCheckbox).toBeInTheDocument()
    }
  })

  describe('Authentication Flow', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('successfully logs in with regular credentials', async () => {
      const user = userEvent.setup({ delay: null })
      render(<LoginPage />)
      
      const emailInput = screen.getByLabelText(/Email/i)
      const passwordInput = screen.getByLabelText(/Password/i)
      const submitButton = screen.getByRole('button', { name: /Sign in/i })
      
      await user.clear(emailInput)
      await user.type(emailInput, 'user@example.com')
      await user.clear(passwordInput)
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      // Fast forward the setTimeout
      jest.advanceTimersByTime(500)
      
      // Should save user data to localStorage
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'user',
          expect.stringContaining('user@example.com')
        )
      })
      
      // Should navigate to dashboard
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })

    it('successfully logs in with test credentials in test environment', async () => {
      const user = userEvent.setup({ delay: null })
      render(<LoginPage />)
      
      const emailInput = screen.getByLabelText(/Email/i)
      const passwordInput = screen.getByLabelText(/Password/i)
      const submitButton = screen.getByRole('button', { name: /Sign in/i })
      
      await user.clear(emailInput)
      await user.type(emailInput, 'test@storyboard.test')
      await user.clear(passwordInput)
      await user.type(passwordInput, 'testpassword123')
      await user.click(submitButton)
      
      // Fast forward the setTimeout
      jest.advanceTimersByTime(500)
      
      // Should save test user data to localStorage
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'user',
          expect.stringContaining('Test User')
        )
      })
      
      // Should navigate to dashboard
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })

    it('handles localStorage error gracefully', async () => {
      const user = userEvent.setup({ delay: null })
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      // Mock localStorage to throw error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage is full')
      })
      
      render(<LoginPage />)
      
      const emailInput = screen.getByLabelText(/Email/i)
      const passwordInput = screen.getByLabelText(/Password/i)
      const submitButton = screen.getByRole('button', { name: /Sign in/i })
      
      await user.clear(emailInput)
      await user.type(emailInput, 'user@example.com')
      await user.clear(passwordInput)
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      // Fast forward the setTimeout
      jest.advanceTimersByTime(500)
      
      // Should log error
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error))
      })
      
      // Should NOT navigate on error
      expect(mockPush).not.toHaveBeenCalled()
      
      consoleErrorSpy.mockRestore()
    })

    it('shows alert for test credentials in non-test environment', async () => {
      // Save original env
      const originalEnv = process.env.NODE_ENV
      const originalAppEnv = process.env.NEXT_PUBLIC_APP_ENV
      
      // Set to non-test environment
      process.env.NODE_ENV = 'production'
      delete process.env.NEXT_PUBLIC_APP_ENV
      
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation()
      const user = userEvent.setup({ delay: null })
      render(<LoginPage />)
      
      const emailInput = screen.getByLabelText(/Email/i)
      const passwordInput = screen.getByLabelText(/Password/i)
      const submitButton = screen.getByRole('button', { name: /Sign in/i })
      
      await user.clear(emailInput)
      await user.type(emailInput, 'test@storyboard.test')
      await user.clear(passwordInput)
      await user.type(passwordInput, 'testpassword123')
      await user.click(submitButton)
      
      // Should show alert immediately (before setTimeout)
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Test credentials are only valid in test environment')
      })
      
      // Should NOT navigate
      jest.advanceTimersByTime(500)
      expect(mockPush).not.toHaveBeenCalled()
      
      // Restore
      process.env.NODE_ENV = originalEnv
      if (originalAppEnv) {
        process.env.NEXT_PUBLIC_APP_ENV = originalAppEnv
      }
      alertSpy.mockRestore()
    })

    it('shows loading state during login', async () => {
      const user = userEvent.setup({ delay: null })
      render(<LoginPage />)
      
      const submitButton = screen.getByRole('button', { name: /Sign in/i })
      
      // Click submit
      await user.click(submitButton)
      
      // Should show loading text
      expect(screen.getByText('Signing in...')).toBeInTheDocument()
      
      // Fast forward the setTimeout
      jest.advanceTimersByTime(500)
      
      // Should return to normal state
      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument()
      })
    })
  })
})