import React from 'react'
import { render, screen } from '@testing-library/react'
import { Toaster } from '@/components/ui/sonner'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'system',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  })),
}))

// Mock sonner
jest.mock('sonner', () => ({
  Toaster: ({ 
    children, 
    theme, 
    className, 
    style, 
    position,
    richColors,
    expand,
    closeButton,
    duration,
    ...props 
  }: any) => (
    <div
      data-testid="sonner-toaster"
      data-theme={theme}
      className={`toaster group ${className || ''}`}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--success-bg': 'var(--success)',
        '--success-text': 'var(--success-foreground)',
        '--error-bg': 'var(--destructive)',
        '--error-text': 'var(--destructive-foreground)',
        '--warning-bg': 'var(--warning)',
        '--warning-text': 'var(--warning-foreground)',
        ...style
      }}
      position={position}
      richColors={richColors}
      expand={expand}
      closeButton={closeButton}
      duration={duration}
      {...props}
    >
      {children}
    </div>
  ),
}))

describe('Sonner Toaster Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with default props', () => {
    render(<Toaster />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toBeInTheDocument()
    expect(toaster).toHaveAttribute('data-theme', 'system')
    expect(toaster).toHaveClass('toaster', 'group')
  })

  it('uses theme from useTheme hook', () => {
    const mockUseTheme = require('next-themes').useTheme
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
      resolvedTheme: 'dark',
    })
    
    render(<Toaster />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('data-theme', 'dark')
  })

  it('uses system theme as fallback', () => {
    const mockUseTheme = require('next-themes').useTheme
    mockUseTheme.mockReturnValue({
      theme: undefined,
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    })
    
    render(<Toaster />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('data-theme', 'system')
  })

  it('applies correct CSS classes', () => {
    render(<Toaster />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveClass('toaster', 'group')
  })

  it('applies custom CSS variables as styles', () => {
    render(<Toaster />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveStyle({
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
    })
  })

  it('passes through additional props', () => {
    render(
      <Toaster 
        data-testid="custom-toaster"
        position="top-right"
        richColors={true}
      />
    )
    
    const toaster = screen.getByTestId('custom-toaster')
    expect(toaster).toHaveAttribute('position', 'top-right')
    expect(toaster).toHaveAttribute('richColors', 'true')
  })

  it('handles different theme values', () => {
    const mockUseTheme = require('next-themes').useTheme
    const themes = ['light', 'dark', 'system']
    
    themes.forEach(theme => {
      mockUseTheme.mockReturnValue({
        theme,
        setTheme: jest.fn(),
        resolvedTheme: theme === 'system' ? 'light' : theme,
      })
      
      const { rerender } = render(<Toaster />)
      
      let toaster = screen.getByTestId('sonner-toaster')
      expect(toaster).toHaveAttribute('data-theme', theme)
      
      rerender(<div />) // Clean up for next iteration
    })
  })

  it('renders with children', () => {
    render(
      <Toaster>
        <div>Toast Content</div>
      </Toaster>
    )
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveTextContent('Toast Content')
  })

  it('handles custom className', () => {
    render(<Toaster className="custom-toaster" />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveClass('custom-toaster')
    expect(toaster).toHaveClass('toaster', 'group') // Should still have default classes
  })

  it('handles custom style props', () => {
    const customStyle = {
      '--custom-var': 'custom-value',
    }
    
    render(<Toaster style={customStyle} />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveStyle({
      '--custom-var': 'custom-value',
      '--normal-bg': 'var(--popover)', // Should still have default styles
    })
  })

  it('handles position prop', () => {
    render(<Toaster position="bottom-center" />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('position', 'bottom-center')
  })

  it('handles expand prop', () => {
    render(<Toaster expand={true} />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('expand', 'true')
  })

  it('handles richColors prop', () => {
    render(<Toaster richColors={false} />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('richColors', 'false')
  })

  it('handles closeButton prop', () => {
    render(<Toaster closeButton={true} />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('closeButton', 'true')
  })

  it('handles duration prop', () => {
    render(<Toaster duration={5000} />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('duration', '5000')
  })

  it('handles multiple props together', () => {
    render(
      <Toaster 
        position="top-left"
        expand={true}
        richColors={true}
        closeButton={true}
        duration={3000}
        className="custom-class"
      />
    )
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('position', 'top-left')
    expect(toaster).toHaveAttribute('expand', 'true')
    expect(toaster).toHaveAttribute('richColors', 'true')
    expect(toaster).toHaveAttribute('closeButton', 'true')
    expect(toaster).toHaveAttribute('duration', '3000')
    expect(toaster).toHaveClass('custom-class')
  })

  it('maintains CSS variables with custom props', () => {
    render(<Toaster position="bottom-right" />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('position', 'bottom-right')
    expect(toaster).toHaveStyle({
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
    })
  })

  it('handles theme changes', () => {
    const mockUseTheme = require('next-themes').useTheme
    const mockSetTheme = jest.fn()
    
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
    })
    
    const { rerender } = render(<Toaster />)
    
    let toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('data-theme', 'light')
    
    // Simulate theme change
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    })
    
    rerender(<Toaster />)
    
    toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('data-theme', 'dark')
  })

  it('renders without children', () => {
    render(<Toaster />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toBeInTheDocument()
    expect(toaster).toBeEmptyDOMElement()
  })

  it('handles edge case with null theme', () => {
    const mockUseTheme = require('next-themes').useTheme
    mockUseTheme.mockReturnValue({
      theme: null,
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    })
    
    render(<Toaster />)
    
    const toaster = screen.getByTestId('sonner-toaster')
    expect(toaster).toHaveAttribute('data-theme', 'system')
  })
})
