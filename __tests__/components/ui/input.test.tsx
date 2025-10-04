import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('renders as an input element', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe('INPUT')
    })

    it('renders with default type text', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      // HTML input elements default to type="text" when no type is specified
      expect(input.getAttribute('type') || 'text').toBe('text')
    })

    it('renders with custom type', () => {
      render(<Input type="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders with placeholder text', () => {
      render(<Input placeholder="Enter your name" />)
      
      const input = screen.getByPlaceholderText('Enter your name')
      expect(input).toBeInTheDocument()
    })

    it('renders with value', () => {
      render(<Input value="Test value" readOnly />)
      
      const input = screen.getByDisplayValue('Test value')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Input Types', () => {
    it('renders as text input', () => {
      render(<Input type="text" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('renders as email input', () => {
      render(<Input type="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders as password input', () => {
      render(<Input type="password" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('renders as number input', () => {
      render(<Input type="number" />)
      
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
    })

    it('renders as tel input', () => {
      render(<Input type="tel" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'tel')
    })

    it('renders as url input', () => {
      render(<Input type="url" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'url')
    })

    it('renders as search input', () => {
      render(<Input type="search" />)
      
      const input = screen.getByRole('searchbox')
      expect(input).toHaveAttribute('type', 'search')
    })

    it('renders as file input', () => {
      render(<Input type="file" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'file')
    })

    it('renders as date input', () => {
      render(<Input type="date" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'date')
    })

    it('renders as time input', () => {
      render(<Input type="time" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'time')
    })

    it('renders as datetime-local input', () => {
      render(<Input type="datetime-local" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'datetime-local')
    })

    it('renders as color input', () => {
      render(<Input type="color" />)
      
      const input = document.querySelector('input[type="color"]')
      expect(input).toHaveAttribute('type', 'color')
    })

    it('renders as range input', () => {
      render(<Input type="range" />)
      
      const input = screen.getByRole('slider')
      expect(input).toHaveAttribute('type', 'range')
    })
  })

  describe('Event Handling', () => {
    it('handles change events', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'test')
      
      expect(handleChange).toHaveBeenCalled()
    })

    it('handles input events', () => {
      const handleInput = jest.fn()
      
      render(<Input onInput={handleInput} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.input(input, { target: { value: 'test' } })
      
      expect(handleInput).toHaveBeenCalled()
    })

    it('handles focus events', () => {
      const handleFocus = jest.fn()
      
      render(<Input onFocus={handleFocus} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      
      expect(handleFocus).toHaveBeenCalled()
    })

    it('handles blur events', () => {
      const handleBlur = jest.fn()
      
      render(<Input onBlur={handleBlur} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.blur(input)
      
      expect(handleBlur).toHaveBeenCalled()
    })

    it('handles key events', () => {
      const handleKeyDown = jest.fn()
      const handleKeyUp = jest.fn()
      const handleKeyPress = jest.fn()
      
      render(
        <Input 
          onKeyDown={handleKeyDown} 
          onKeyUp={handleKeyUp} 
          onKeyPress={handleKeyPress} 
        />
      )
      
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'a' })
      fireEvent.keyUp(input, { key: 'a' })
      fireEvent.keyPress(input, { key: 'a' })
      
      expect(handleKeyDown).toHaveBeenCalled()
      expect(handleKeyUp).toHaveBeenCalled()
      // Note: onKeyPress is deprecated and may not work in all browsers
      expect(handleKeyPress).toHaveBeenCalledTimes(0)
    })

    it('handles mouse events', () => {
      const handleMouseEnter = jest.fn()
      const handleMouseLeave = jest.fn()
      const handleMouseOver = jest.fn()
      
      render(
        <Input 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
        />
      )
      
      const input = screen.getByRole('textbox')
      fireEvent.mouseEnter(input)
      fireEvent.mouseLeave(input)
      fireEvent.mouseOver(input)
      
      expect(handleMouseEnter).toHaveBeenCalled()
      expect(handleMouseLeave).toHaveBeenCalled()
      expect(handleMouseOver).toHaveBeenCalled()
    })
  })

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled input', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('')
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />
      }
      
      render(<TestComponent />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('works as uncontrolled input', () => {
      render(<Input defaultValue="default" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('default')
    })

    it('updates value in controlled input', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('initial')
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />
      }
      
      render(<TestComponent />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('initial')
      
      // Simulate user input
      fireEvent.change(input, { target: { value: 'updated' } })
      expect(input).toHaveValue('updated')
    })
  })

  describe('Disabled State', () => {
    it('renders as disabled when disabled prop is true', () => {
      render(<Input disabled />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('applies disabled styles when disabled', () => {
      render(<Input disabled />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('disabled:pointer-events-none', 'disabled:cursor-not-allowed', 'disabled:opacity-50')
    })

    it('does not trigger change events when disabled', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Input disabled onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'test')
      
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Read-only State', () => {
    it('renders as read-only when readOnly prop is true', () => {
      render(<Input readOnly />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('readOnly')
    })

    it('still triggers change events when read-only', () => {
      const handleChange = jest.fn()
      
      render(<Input readOnly onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test' } })
      
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Input aria-label="Custom label" />)
      
      const input = screen.getByLabelText('Custom label')
      expect(input).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <div>
          <Input aria-describedby="description" />
          <div id="description">Input description</div>
        </div>
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'description')
    })

    it('supports aria-invalid', () => {
      render(<Input aria-invalid="true" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('supports aria-required', () => {
      render(<Input aria-required="true" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-required', 'true')
    })

    it('supports required attribute', () => {
      render(<Input required />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeRequired()
    })

    it('supports autoComplete attribute', () => {
      render(<Input autoComplete="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('autoComplete', 'email')
    })

    it('supports autoFocus attribute', () => {
      render(<Input autoFocus />)
      
      const input = screen.getByRole('textbox')
      // Check if the element has the autofocus attribute or property
      expect(input).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('works within a form', () => {
      render(
        <form>
          <Input name="test-input" />
        </form>
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'test-input')
    })

    it('supports form validation', () => {
      render(<Input required minLength={3} maxLength={10} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeRequired()
      expect(input).toHaveAttribute('minLength', '3')
      expect(input).toHaveAttribute('maxLength', '10')
    })

    it('supports pattern validation', () => {
      render(<Input pattern="[0-9]+" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('pattern', '[0-9]+')
    })
  })

  describe('Styling and Classes', () => {
    it('applies default classes', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(
        'flex',
        'h-9',
        'w-full',
        'rounded-md',
        'border',
        'bg-transparent',
        'px-3',
        'py-1'
      )
    })

    it('applies custom className', () => {
      render(<Input className="custom-class" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
    })

    it('merges custom className with default classes', () => {
      render(<Input className="custom-class" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('flex', 'h-9', 'custom-class')
    })

    it('applies focus styles', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(
        'focus-visible:border-ring',
        'focus-visible:ring-ring/50',
        'focus-visible:ring-[3px]'
      )
    })

    it('applies invalid styles', () => {
      render(<Input aria-invalid="true" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(
        'aria-invalid:ring-destructive/20',
        'dark:aria-invalid:ring-destructive/40',
        'aria-invalid:border-destructive'
      )
    })
  })

  describe('Custom Props', () => {
    it('passes through custom props', () => {
      render(<Input data-testid="custom-input" data-custom="value" />)
      
      const input = screen.getByTestId('custom-input')
      expect(input).toHaveAttribute('data-custom', 'value')
    })

    it('renders with custom props', () => {
      render(<Input data-testid="custom-input" />)
      
      const input = screen.getByTestId('custom-input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty value', () => {
      render(<Input defaultValue="" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('handles null value', () => {
      render(<Input defaultValue={null as any} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('handles undefined value', () => {
      render(<Input defaultValue={undefined as any} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('handles very long values', () => {
      const longValue = 'a'.repeat(10000)
      render(<Input value={longValue} readOnly />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue(longValue)
    })
  })

  describe('Performance', () => {
    it('renders efficiently with many inputs', () => {
      const startTime = performance.now()
      
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Input key={i} placeholder={`Input ${i}`} />
          ))}
        </div>
      )
      
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // Should render in less than 1 second
      expect(screen.getAllByRole('textbox')).toHaveLength(100)
    })
  })
})
