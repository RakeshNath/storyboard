import React from 'react'
import { render, screen } from '@testing-library/react'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'

// Mock input-otp
jest.mock('input-otp', () => ({
  OTPInput: ({ children, className, containerClassName, ...props }: any) => (
    <div 
      data-testid="input-otp" 
      className={className}
      data-container-class={containerClassName}
      {...props}
    >
      {children}
    </div>
  ),
  OTPInputGroup: ({ children, className, ...props }: any) => (
    <div 
      data-testid="input-otp-group" 
      className={className}
      data-slot="input-otp-group"
      {...props}
    >
      {children}
    </div>
  ),
  OTPInputSlot: ({ children, className, index, ...props }: any) => {
    const context = React.useContext(React.createContext({
      slots: [
        { char: '1', hasFakeCaret: false, isActive: false },
        { char: '2', hasFakeCaret: false, isActive: true },
        { char: '', hasFakeCaret: true, isActive: false },
      ]
    }))
    const slot = context?.slots?.[index] || { char: '', hasFakeCaret: false, isActive: false }
    
    return (
      <div 
        data-testid="input-otp-slot" 
        className={className}
        data-slot="input-otp-slot"
        data-active={slot.isActive}
        {...props}
      >
        {slot.char}
        {slot.hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
          </div>
        )}
      </div>
    )
  },
  OTPInputSeparator: ({ children, ...props }: any) => (
    <div 
      data-testid="input-otp-separator" 
      data-slot="input-otp-separator"
      role="separator"
      {...props}
    >
      <div data-testid="minus-icon" />
      {children}
    </div>
  ),
  OTPInputContext: React.createContext({
    slots: [
      { char: '1', hasFakeCaret: false, isActive: false },
      { char: '2', hasFakeCaret: false, isActive: true },
      { char: '', hasFakeCaret: true, isActive: false },
    ]
  })
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  MinusIcon: ({ className, ...props }: any) => (
    <div data-testid="minus-icon" className={className} {...props} />
  ),
}))

describe('InputOTP Components', () => {
  describe('InputOTP', () => {
    it('renders with default props', () => {
      render(<InputOTP />)
      
      const inputOTP = screen.getByTestId('input-otp')
      expect(inputOTP).toBeInTheDocument()
      expect(inputOTP).toHaveAttribute('data-slot', 'input-otp')
      expect(inputOTP).toHaveClass('disabled:cursor-not-allowed')
    })

    it('renders with custom className', () => {
      render(<InputOTP className="custom-input-otp" />)
      
      const inputOTP = screen.getByTestId('input-otp')
      expect(inputOTP).toHaveClass('custom-input-otp')
    })

  it('renders with custom containerClassName', () => {
    render(<InputOTP containerClassName="custom-container" />)
    
    const inputOTP = screen.getByTestId('input-otp')
    expect(inputOTP).toHaveAttribute('data-container-class', expect.stringContaining('custom-container'))
  })

    it('renders children', () => {
      render(
        <InputOTP>
          <div>OTP Content</div>
        </InputOTP>
      )
      
      expect(screen.getByText('OTP Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<InputOTP data-testid="custom-otp" maxLength={6} />)
      
      const inputOTP = screen.getByTestId('custom-otp')
      expect(inputOTP).toBeInTheDocument()
      expect(inputOTP).toHaveAttribute('maxLength', '6')
    })

    it('applies disabled cursor class', () => {
      render(<InputOTP disabled />)
      
      const inputOTP = screen.getByTestId('input-otp')
      expect(inputOTP).toHaveAttribute('disabled')
    })
  })

  describe('InputOTPGroup', () => {
  it('renders with default props', () => {
    render(<InputOTPGroup />)
    
    const group = document.querySelector('[data-slot="input-otp-group"]')
    expect(group).toBeInTheDocument()
    expect(group).toHaveAttribute('data-slot', 'input-otp-group')
    expect(group).toHaveClass('flex', 'items-center')
  })

    it('renders with custom className', () => {
      render(<InputOTPGroup className="custom-group" />)
      
      const group = document.querySelector('[data-slot="input-otp-group"]')
      expect(group).toHaveClass('custom-group')
    })

    it('renders children', () => {
      render(
        <InputOTPGroup>
          <div>Group Content</div>
        </InputOTPGroup>
      )
      
      expect(screen.getByText('Group Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<InputOTPGroup data-testid="custom-group" />)
      
      const group = screen.getByTestId('custom-group')
      expect(group).toBeInTheDocument()
    })
  })

  describe('InputOTPSlot', () => {
    it('renders with default props', () => {
      render(<InputOTPSlot index={0} />)
      
      const slot = screen.getByTestId('input-otp-slot')
      expect(slot).toBeInTheDocument()
      expect(slot).toHaveAttribute('data-slot', 'input-otp-slot')
      expect(slot).toHaveAttribute('data-active', 'false')
      expect(slot).toHaveTextContent('1') // From mocked context
    })

    it('renders with custom className', () => {
      render(<InputOTPSlot index={0} className="custom-slot" />)
      
      const slot = screen.getByTestId('input-otp-slot')
      expect(slot).toHaveClass('custom-slot')
    })

    it('renders with active state', () => {
      render(<InputOTPSlot index={1} />)
      
      const slot = screen.getByTestId('input-otp-slot')
      expect(slot).toHaveAttribute('data-active', 'true')
      expect(slot).toHaveTextContent('2') // From mocked context
    })

    it('renders with fake caret', () => {
      render(<InputOTPSlot index={2} />)
      
      const slot = screen.getByTestId('input-otp-slot')
      expect(slot).toHaveAttribute('data-active', 'false')
      expect(slot).toHaveTextContent('') // Empty char from mocked context
    })

    it('applies correct CSS classes', () => {
      render(<InputOTPSlot index={0} />)
      
      const slot = screen.getByTestId('input-otp-slot')
      expect(slot).toHaveClass(
        'relative',
        'flex',
        'h-9',
        'w-9',
        'items-center',
        'justify-center',
        'border-y',
        'border-r',
        'text-sm',
        'shadow-xs',
        'transition-all',
        'outline-none'
      )
    })

    it('passes through additional props', () => {
      render(<InputOTPSlot index={0} data-testid="custom-slot" />)
      
      const slot = screen.getByTestId('custom-slot')
      expect(slot).toBeInTheDocument()
    })
  })

  describe('InputOTPSeparator', () => {
    it('renders with default props', () => {
      render(<InputOTPSeparator />)
      
      const separator = screen.getByTestId('input-otp-separator')
      const icon = screen.getByTestId('minus-icon')
      
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('data-slot', 'input-otp-separator')
      expect(separator).toHaveAttribute('role', 'separator')
      expect(icon).toBeInTheDocument()
    })

    it('renders MinusIcon', () => {
      render(<InputOTPSeparator />)
      
      const icon = screen.getByTestId('minus-icon')
      expect(icon).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<InputOTPSeparator data-testid="custom-separator" />)
      
      const separator = screen.getByTestId('custom-separator')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Complete InputOTP Structure', () => {
    it('renders a complete OTP input', () => {
      render(
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )
      
      expect(screen.getByTestId('input-otp')).toBeInTheDocument()
      expect(screen.getAllByTestId('input-otp-group')).toHaveLength(2)
      expect(screen.getAllByTestId('input-otp-slot')).toHaveLength(6)
      expect(screen.getByTestId('input-otp-separator')).toBeInTheDocument()
    })

    it('renders OTP with different slot states', () => {
      render(
        <InputOTP>
          <InputOTPGroup>
            <InputOTPSlot index={0} /> {/* char: '1', isActive: false */}
            <InputOTPSlot index={1} /> {/* char: '2', isActive: true */}
            <InputOTPSlot index={2} /> {/* char: '', hasFakeCaret: true */}
          </InputOTPGroup>
        </InputOTP>
      )
      
      const slots = screen.getAllByTestId('input-otp-slot')
      expect(slots[0]).toHaveAttribute('data-active', 'false')
      expect(slots[0]).toHaveTextContent('1')
      expect(slots[1]).toHaveAttribute('data-active', 'true')
      expect(slots[1]).toHaveTextContent('2')
      expect(slots[2]).toHaveAttribute('data-active', 'false')
      expect(slots[2]).toHaveTextContent('')
    })

    it('handles empty OTP input', () => {
      render(<InputOTP />)
      
      expect(screen.getByTestId('input-otp')).toBeInTheDocument()
    })

    it('handles single group OTP', () => {
      render(
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      )
      
      expect(screen.getByTestId('input-otp')).toBeInTheDocument()
      expect(screen.getAllByTestId('input-otp-slot')).toHaveLength(4)
      expect(screen.queryByTestId('input-otp-separator')).not.toBeInTheDocument()
    })

    it('handles multiple separators', () => {
      render(
        <InputOTP maxLength={9}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
            <InputOTPSlot index={8} />
          </InputOTPGroup>
        </InputOTP>
      )
      
      expect(screen.getAllByTestId('input-otp-separator')).toHaveLength(2)
      expect(screen.getAllByTestId('input-otp-group')).toHaveLength(3)
      expect(screen.getAllByTestId('input-otp-slot')).toHaveLength(9)
    })
  })
})
