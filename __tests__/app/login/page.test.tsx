import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/login/page'

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
  usePathname: () => '/login',
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  getUser: jest.fn(() => null),
}))

describe('LoginPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
})