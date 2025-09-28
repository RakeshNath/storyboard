import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders as button by default', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('BUTTON')
  })

  it('renders as Slot when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('applies default variant and size classes', () => {
    render(<Button>Default button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Secondary button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
  })

  it('applies destructive variant', () => {
    render(<Button variant="destructive">Destructive button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('applies outline variant', () => {
    render(<Button variant="outline">Outline button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'bg-background')
  })

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
  })

  it('applies link variant', () => {
    render(<Button variant="link">Link button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-primary', 'underline-offset-4', 'hover:underline')
  })

  it('applies small size', () => {
    render(<Button size="sm">Small button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-8', 'rounded-md', 'px-3')
  })

  it('applies large size', () => {
    render(<Button size="lg">Large button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'rounded-md', 'px-6')
  })

  it('applies icon size', () => {
    render(<Button size="icon">Icon button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('size-9')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards all props to button element', () => {
    render(
      <Button 
        type="submit" 
        disabled 
        data-testid="test-button"
        onClick={() => {}}
      >
        Test button
      </Button>
    )
    
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toBeDisabled()
  })

  it('handles asChild with custom element', () => {
    render(
      <Button asChild>
        <div data-testid="custom-element">Custom element</div>
      </Button>
    )
    
    const element = screen.getByTestId('custom-element')
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe('DIV')
  })

  it('covers asChild branch condition', () => {
    // This test specifically targets line 48 - the asChild ? Slot : 'button' branch
    const { rerender } = render(<Button asChild={false}>Regular button</Button>)
    
    let button = screen.getByRole('button')
    expect(button.tagName).toBe('BUTTON')
    
    // Test the other branch
    rerender(
      <Button asChild={true}>
        <span>Slot button</span>
      </Button>
    )
    
    const span = screen.getByText('Slot button')
    expect(span.tagName).toBe('SPAN')
  })
})
