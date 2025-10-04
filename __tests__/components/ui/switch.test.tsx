import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '@/components/ui/switch'

// Mock Radix UI Switch
jest.mock('@radix-ui/react-switch', () => ({
  Root: React.forwardRef(({ children, className, onCheckedChange, required, ...props }: any, ref: any) => (
    <button
      ref={ref}
      type="button"
      role="switch"
      data-testid="switch-root"
      className={className}
      data-slot="switch"
      onClick={onCheckedChange}
      required={required === true || required === "" || required === "required"}
      {...props}
    >
      {children}
    </button>
  )),
  Thumb: ({ className }: any) => (
    <span
      data-testid="switch-thumb"
      className={className}
      data-slot="switch-thumb"
    />
  ),
}))

describe('Switch Component', () => {
  it('renders with default props', () => {
    render(<Switch />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toBeInTheDocument()
    expect(switchElement).toHaveAttribute('role', 'switch')
    expect(switchElement).toHaveAttribute('data-slot', 'switch')
  })

  it('renders switch thumb', () => {
    render(<Switch />)
    
    const thumb = screen.getByTestId('switch-thumb')
    expect(thumb).toBeInTheDocument()
    expect(thumb).toHaveAttribute('data-slot', 'switch-thumb')
  })

  it('renders with custom className', () => {
    render(<Switch className="custom-class" />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveClass('custom-class')
  })

  it('applies correct CSS classes to root', () => {
    render(<Switch />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveClass(
      'peer',
      'data-[state=checked]:bg-primary',
      'data-[state=unchecked]:bg-input',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'dark:data-[state=unchecked]:bg-input/80',
      'inline-flex',
      'h-[1.15rem]',
      'w-8',
      'shrink-0',
      'items-center',
      'rounded-full',
      'border',
      'border-transparent',
      'shadow-xs',
      'transition-all',
      'outline-none',
      'focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    )
  })

  it('applies correct CSS classes to thumb', () => {
    render(<Switch />)
    
    const thumb = screen.getByTestId('switch-thumb')
    expect(thumb).toHaveClass(
      'bg-background',
      'dark:data-[state=unchecked]:bg-foreground',
      'dark:data-[state=checked]:bg-primary-foreground',
      'pointer-events-none',
      'block',
      'size-4',
      'rounded-full',
      'ring-0',
      'transition-transform',
      'data-[state=checked]:translate-x-[calc(100%-2px)]',
      'data-[state=unchecked]:translate-x-0'
    )
  })

  it('handles checked state', () => {
    render(<Switch checked />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })

  it('handles unchecked state', () => {
    render(<Switch checked={false} />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveAttribute('aria-checked', 'false')
  })

  it('handles disabled state', () => {
    render(<Switch disabled />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toBeDisabled()
  })

  it('handles required state', () => {
    render(<Switch required />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveAttribute('required')
  })

  it('handles onCheckedChange event', async () => {
    const handleCheckedChange = jest.fn()
    const user = userEvent.setup()
    
    render(<Switch onCheckedChange={handleCheckedChange} />)
    
    const switchElement = screen.getByTestId('switch-root')
    await user.click(switchElement)
    
    expect(handleCheckedChange).toHaveBeenCalledTimes(1)
  })

  it('handles onClick event', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Switch onClick={handleClick} />)
    
    const switchElement = screen.getByTestId('switch-root')
    await user.click(switchElement)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events', async () => {
    const handleCheckedChange = jest.fn()
    const user = userEvent.setup()
    
    render(<Switch onCheckedChange={handleCheckedChange} />)
    
    const switchElement = screen.getByTestId('switch-root')
    switchElement.focus()
    await user.keyboard(' ')
    
    expect(handleCheckedChange).toHaveBeenCalledTimes(1)
  })

  it('passes through additional props', () => {
    render(
      <Switch 
        data-testid="custom-switch"
        data-custom="value"
        aria-label="Toggle setting"
      />
    )
    
    const switchElement = screen.getByTestId('custom-switch')
    expect(switchElement).toHaveAttribute('data-custom', 'value')
    expect(switchElement).toHaveAttribute('aria-label', 'Toggle setting')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Switch ref={ref} />)
    
    expect(ref.current).toBeInTheDocument()
    expect(ref.current).toHaveAttribute('data-testid', 'switch-root')
  })

  it('renders with default checked value', () => {
    render(<Switch defaultChecked />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })

  it('renders with default unchecked value', () => {
    render(<Switch defaultChecked={false} />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
  })

  it('handles controlled state changes', () => {
    const { rerender } = render(<Switch checked={false} />)
    
    let switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveAttribute('aria-checked', 'false')
    
    rerender(<Switch checked={true} />)
    
    switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })

  it('renders with name attribute', () => {
    render(<Switch name="toggle-setting" />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveAttribute('name', 'toggle-setting')
  })

  it('renders with value attribute', () => {
    render(<Switch value="enabled" />)
    
    const switchElement = screen.getByTestId('switch-root')
    expect(switchElement).toHaveAttribute('value', 'enabled')
  })
})
