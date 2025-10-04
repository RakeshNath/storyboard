import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from '@/components/ui/toggle'

// Mock Radix UI Toggle
jest.mock('@radix-ui/react-toggle', () => ({
  Root: React.forwardRef(({ children, className, onPressedChange, pressed, defaultPressed, ...props }: any, ref: any) => {
    const [internalPressed, setInternalPressed] = React.useState(pressed !== undefined ? pressed : defaultPressed || false)
    
    const handleClick = () => {
      const newPressed = !internalPressed
      setInternalPressed(newPressed)
      if (onPressedChange) {
        onPressedChange(newPressed)
      }
    }
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleClick()
      }
    }
    
    return (
      <button
        ref={ref}
        type="button"
        data-testid="toggle-root"
        className={className}
        data-slot="toggle"
        data-state={internalPressed ? 'on' : 'off'}
        aria-pressed={internalPressed ? 'true' : 'false'}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    )
  }),
}))

describe('Toggle Component', () => {
  it('renders with default props', () => {
    render(<Toggle>Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveAttribute('data-slot', 'toggle')
    expect(toggle).toHaveTextContent('Toggle')
  })

  it('renders with children', () => {
    render(
      <Toggle>
        <span>Custom Content</span>
      </Toggle>
    )
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveTextContent('Custom Content')
  })

  it('renders with default variant and size', () => {
    render(<Toggle>Default Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveClass('bg-transparent', 'h-9', 'px-2', 'min-w-9')
  })

  it('renders with outline variant', () => {
    render(<Toggle variant="outline">Outline Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveClass(
      'border',
      'border-input',
      'bg-transparent',
      'shadow-xs',
      'hover:bg-accent',
      'hover:text-accent-foreground'
    )
  })

  it('renders with small size', () => {
    render(<Toggle size="sm">Small Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveClass('h-8', 'px-1.5', 'min-w-8')
  })

  it('renders with large size', () => {
    render(<Toggle size="lg">Large Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveClass('h-10', 'px-2.5', 'min-w-10')
  })

  it('applies base CSS classes', () => {
    render(<Toggle>Base Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'rounded-md',
      'text-sm',
      'font-medium',
      'hover:bg-muted',
      'hover:text-muted-foreground',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'data-[state=on]:bg-accent',
      'data-[state=on]:text-accent-foreground',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[3px]',
      'outline-none',
      'transition-[color,box-shadow]',
      'whitespace-nowrap'
    )
  })

  it('handles pressed state', () => {
    render(<Toggle pressed>Pressed Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('handles unpressed state', () => {
    render(<Toggle pressed={false}>Unpressed Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })

  it('handles disabled state', () => {
    render(<Toggle disabled>Disabled Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toBeDisabled()
  })

  it('handles onPressedChange event', async () => {
    const handlePressedChange = jest.fn()
    const user = userEvent.setup()
    
    render(<Toggle onPressedChange={handlePressedChange}>Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    await user.click(toggle)
    
    expect(handlePressedChange).toHaveBeenCalledTimes(1)
  })

  it('handles onClick event', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Toggle onClick={handleClick}>Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    await user.click(toggle)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders with custom className', () => {
    render(<Toggle className="custom-class">Custom Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveClass('custom-class')
  })

  it('renders with icon content', () => {
    render(
      <Toggle>
        <span data-testid="icon">🎯</span>
        Toggle with Icon
      </Toggle>
    )
    
    const toggle = screen.getByTestId('toggle-root')
    const icon = screen.getByTestId('icon')
    
    expect(toggle).toHaveTextContent('Toggle with Icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveTextContent('🎯')
  })

  it('handles keyboard events', async () => {
    const handlePressedChange = jest.fn()
    const user = userEvent.setup()
    
    render(<Toggle onPressedChange={handlePressedChange}>Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    toggle.focus()
    await user.keyboard(' ')
    
    expect(handlePressedChange).toHaveBeenCalledTimes(1)
  })

  it('passes through additional props', () => {
    render(
      <Toggle 
        data-testid="custom-toggle"
        data-custom="value"
        aria-label="Toggle setting"
      >
        Custom Toggle
      </Toggle>
    )
    
    const toggle = screen.getByTestId('custom-toggle')
    expect(toggle).toHaveAttribute('data-custom', 'value')
    expect(toggle).toHaveAttribute('aria-label', 'Toggle setting')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Toggle ref={ref}>Toggle</Toggle>)
    
    expect(ref.current).toBeInTheDocument()
    expect(ref.current).toHaveAttribute('data-testid', 'toggle-root')
  })

  it('renders with default pressed value', () => {
    render(<Toggle defaultPressed>Default Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveAttribute('data-state', 'on')
  })

  it('renders with default unpressed value', () => {
    render(<Toggle defaultPressed={false}>Default Toggle</Toggle>)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveAttribute('data-state', 'off')
  })

  it('handles controlled state changes', () => {
    const { rerender } = render(<Toggle pressed={false}>Toggle</Toggle>)
    
    let toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    
    rerender(<Toggle pressed={true}>Toggle</Toggle>)
    
    toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders with different variant and size combinations', () => {
    const { rerender } = render(
      <Toggle variant="outline" size="sm">Small Outline</Toggle>
    )
    
    let toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveClass('border', 'border-input', 'h-8', 'px-1.5')
    
    rerender(<Toggle variant="default" size="lg">Large Default</Toggle>)
    
    toggle = screen.getByTestId('toggle-root')
    expect(toggle).toHaveClass('bg-transparent', 'h-10', 'px-2.5')
  })

  it('renders without children', () => {
    render(<Toggle />)
    
    const toggle = screen.getByTestId('toggle-root')
    expect(toggle).toBeInTheDocument()
    expect(toggle).toBeEmptyDOMElement()
  })
})
