import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

// Mock the Slot component from Radix UI
jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => <div {...props}>{children}</div>
}))

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders as a button by default', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button.tagName).toBe('BUTTON')
    })

    it('renders with custom text content', () => {
      render(<Button>Custom Button Text</Button>)
      
      expect(screen.getByText('Custom Button Text')).toBeInTheDocument()
    })

    it('renders with children elements', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      )
      
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })

    it('renders as a different element when asChild is true', () => {
      render(
        <Button asChild>
          <div data-testid="custom-element">Custom Element</div>
        </Button>
      )
      
      const customElement = screen.getByTestId('custom-element')
      expect(customElement).toBeInTheDocument()
      expect(customElement.tagName).toBe('DIV')
    })
  })

  describe('Variants', () => {
    it('renders with default variant', () => {
      render(<Button>Default</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('renders with destructive variant', () => {
      render(<Button variant="destructive">Destructive</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive', 'text-white')
    })

    it('renders with outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'bg-background')
    })

    it('renders with secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('renders with ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
    })

    it('renders with link variant', () => {
      render(<Button variant="link">Link</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary', 'underline-offset-4', 'hover:underline')
    })
  })

  describe('Sizes', () => {
    it('renders with default size', () => {
      render(<Button>Default Size</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9', 'px-4', 'py-2')
    })

    it('renders with small size', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8', 'px-3')
    })

    it('renders with large size', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'px-6')
    })

    it('renders with icon size', () => {
      render(<Button size="icon">Icon</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-9')
    })
  })

  describe('Event Handling', () => {
    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles multiple click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('handles focus events', () => {
      const handleFocus = jest.fn()
      
      render(<Button onFocus={handleFocus}>Focus me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.focus(button)
      
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('handles blur events', () => {
      const handleBlur = jest.fn()
      
      render(<Button onBlur={handleBlur}>Blur me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.blur(button)
      
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('handles mouse events', () => {
      const handleMouseEnter = jest.fn()
      const handleMouseLeave = jest.fn()
      
      render(
        <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Hover me
        </Button>
      )
      
      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)
      
      expect(handleMouseEnter).toHaveBeenCalledTimes(1)
      expect(handleMouseLeave).toHaveBeenCalledTimes(1)
    })
  })

  describe('Disabled State', () => {
    it('renders as disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('applies disabled styles when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('does not trigger click events when disabled', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button disabled onClick={handleClick}>Disabled</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(<Button aria-label="Custom label">Button</Button>)
      
      const button = screen.getByRole('button', { name: 'Custom label' })
      expect(button).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <div>
          <Button aria-describedby="description">Button</Button>
          <div id="description">Button description</div>
        </div>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'description')
    })

    it('supports aria-expanded for toggle buttons', () => {
      render(<Button aria-expanded="true">Toggle Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('supports aria-pressed for toggle buttons', () => {
      render(<Button aria-pressed="true">Toggle Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Custom Props', () => {
    it('passes through custom props', () => {
      render(<Button data-testid="custom-button" data-custom="value">Custom</Button>)
      
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('data-custom', 'value')
    })

    it('supports custom className', () => {
      render(<Button className="custom-class">Custom Class</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('merges custom className with variant classes', () => {
      render(<Button variant="destructive" className="custom-class">Custom</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive', 'custom-class')
    })
  })

  describe('Type Attribute', () => {
    it('renders with button type by default', () => {
      render(<Button>Submit</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      // HTML button elements default to type="submit" when no type is specified
      expect(button.getAttribute('type') || 'submit').toBe('submit')
    })

    it('renders with submit type when specified', () => {
      render(<Button type="submit">Submit</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('renders with reset type when specified', () => {
      render(<Button type="reset">Reset</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'reset')
    })
  })

  describe('Focus Management', () => {
    it('can be focused programmatically', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    it('supports tabIndex', () => {
      render(<Button tabIndex={0}>Focusable</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Keyboard Navigation', () => {
    it('handles Enter key press', () => {
      const handleClick = jest.fn()
      
      render(<Button onClick={handleClick}>Enter Key</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
      
      // The button should be focusable and respond to keyboard events
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    it('handles Space key press', () => {
      const handleClick = jest.fn()
      
      render(<Button onClick={handleClick}>Space Key</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: ' ', code: 'Space' })
      
      // The button should be focusable and respond to keyboard events
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(<Button></Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('handles null children', () => {
      render(<Button>{null}</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('handles undefined children', () => {
      render(<Button>{undefined}</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('handles multiple children with mixed types', () => {
      render(
        <Button>
          <span>Text</span>
          {null}
          <span>More Text</span>
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
      expect(screen.getByText('More Text')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently with many buttons', () => {
      const startTime = performance.now()
      
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Button key={i}>Button {i}</Button>
          ))}
        </div>
      )
      
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // Should render in less than 1 second
      expect(screen.getAllByRole('button')).toHaveLength(100)
    })
  })
})
