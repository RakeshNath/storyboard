import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme-provider'

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }: any) => {
    // Convert boolean props to strings for DOM attributes
    const domProps = Object.entries(props).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'boolean' ? value.toString() : value
      return acc
    }, {} as any)
    
    return (
      <div data-testid="next-themes-provider" {...domProps}>
        {children}
      </div>
    )
  },
}))

describe('ThemeProvider Component', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Test Content</div>
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument()
  })

  it('passes props to NextThemesProvider', () => {
    const testProps = {
      attribute: 'class',
      defaultTheme: 'light',
      enableSystem: true,
      disableTransitionOnChange: false,
    }
    
    render(
      <ThemeProvider {...testProps}>
        <div data-testid="child">Test Content</div>
      </ThemeProvider>
    )
    
    const provider = screen.getByTestId('next-themes-provider')
    expect(provider).toHaveAttribute('attribute', 'class')
    expect(provider).toHaveAttribute('defaultTheme', 'light')
    expect(provider).toHaveAttribute('enableSystem', 'true')
    expect(provider).toHaveAttribute('disableTransitionOnChange', 'false')
  })

  it('handles empty children', () => {
    render(<ThemeProvider />)
    
    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument()
  })

  it('handles multiple children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <span data-testid="child3">Child 3</span>
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('child1')).toBeInTheDocument()
    expect(screen.getByTestId('child2')).toBeInTheDocument()
    expect(screen.getByTestId('child3')).toBeInTheDocument()
  })

  it('forwards all props correctly', () => {
    const customProps = {
      customProp: 'test-value',
      anotherProp: 123,
      booleanProp: true,
    }
    
    render(
      <ThemeProvider {...customProps}>
        <div data-testid="child">Test Content</div>
      </ThemeProvider>
    )
    
    const provider = screen.getByTestId('next-themes-provider')
    expect(provider).toHaveAttribute('customProp', 'test-value')
    expect(provider).toHaveAttribute('anotherProp', '123')
    expect(provider).toHaveAttribute('booleanProp', 'true')
  })
})
