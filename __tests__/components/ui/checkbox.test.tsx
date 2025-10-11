import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '@/components/ui/checkbox'

// Mock Radix UI Checkbox
jest.mock('@radix-ui/react-checkbox', () => ({
  Root: React.forwardRef(({ children, className, onCheckedChange, onChange, disabled, required, checked, ...props }: any, ref: any) => {
    const [internalChecked, setInternalChecked] = React.useState(checked)
    
    React.useEffect(() => {
      setInternalChecked(checked)
    }, [checked])
    
    const handleClick = (e: any) => {
      if (disabled) return
      const newChecked = !internalChecked
      setInternalChecked(newChecked)
      if (onCheckedChange) {
        onCheckedChange(newChecked)
      }
      if (onChange) {
        onChange(e)
      }
    }
    
    return (
      <div 
        ref={ref}
        className={className} 
        data-slot="checkbox" 
        data-testid="checkbox-root" 
        {...(disabled && { disabled: true })}
        {...(required && { required: true })}
        checked={internalChecked}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    )
  }),
  Indicator: ({ children, className }: any) => (
    <span
      data-testid="checkbox-indicator"
      className={className}
      data-slot="checkbox-indicator"
    >
      {children}
    </span>
  ),
}))

// Mock Lucide React CheckIcon
jest.mock('lucide-react', () => ({
  CheckIcon: () => <span data-testid="check-icon">✓</span>,
}))

describe('Checkbox Component', () => {
  it('renders checkbox with default props', () => {
    render(<Checkbox />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute('type', 'checkbox')
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox')
  })

  it('renders with custom className', () => {
    render(<Checkbox className="custom-class" />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    expect(checkbox).toHaveClass('custom-class')
  })

  it('renders checkbox indicator', () => {
    render(<Checkbox />)
    
    const indicator = screen.getByTestId('checkbox-indicator')
    const checkIcon = screen.getByTestId('check-icon')
    
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveAttribute('data-slot', 'checkbox-indicator')
    expect(checkIcon).toBeInTheDocument()
  })

  it('handles checked state', () => {
    render(<Checkbox checked />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    expect(checkbox).toBeChecked()
  })

  it('handles unchecked state', () => {
    render(<Checkbox checked={false} />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    expect(checkbox).not.toBeChecked()
  })

  it('handles disabled state', () => {
    render(<Checkbox disabled />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    // Radix UI sets disabled attribute when the component is disabled
    expect(checkbox).toHaveAttribute('disabled')
  })

  it('handles required state', () => {
    render(<Checkbox required />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    expect(checkbox).toHaveAttribute('required', '')
    expect(checkbox).toHaveAttribute('aria-required', 'true')
  })

  it('handles onChange event', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    
    render(<Checkbox onChange={handleChange} />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    await user.click(checkbox)
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles onCheckedChange event', async () => {
    const handleCheckedChange = jest.fn()
    const user = userEvent.setup()
    
    render(<Checkbox onCheckedChange={handleCheckedChange} />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    await user.click(checkbox)
    
    expect(handleCheckedChange).toHaveBeenCalledTimes(1)
  })

  it('applies correct CSS classes', () => {
    render(<Checkbox />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    expect(checkbox).toHaveClass(
      'peer',
      'border-input',
      'dark:bg-input/30',
      'data-[state=checked]:bg-primary',
      'data-[state=checked]:text-primary-foreground',
      'size-4',
      'shrink-0',
      'rounded-[4px]',
      'border',
      'shadow-xs',
      'transition-shadow',
      'outline-none',
      'focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    )
  })

  it('applies correct indicator classes', () => {
    render(<Checkbox />)
    
    const indicator = screen.getByTestId('checkbox-indicator')
    expect(indicator).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'text-current',
      'transition-none'
    )
  })

  it('handles indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />)
    
    const checkbox = screen.getByTestId('checkbox-root')
    // Radix UI sets aria-checked to "mixed" for indeterminate state
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Checkbox ref={ref} />)
    
    expect(ref.current).toBeInTheDocument()
    expect(ref.current).toHaveAttribute('data-testid', 'checkbox-root')
  })

  it('renders with custom data attributes', () => {
    render(<Checkbox data-testid="custom-checkbox" data-custom="value" />)
    
    const checkbox = screen.getByTestId('custom-checkbox')
    expect(checkbox).toHaveAttribute('data-custom', 'value')
  })
})
