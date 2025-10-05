import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock Radix UI Select components
jest.mock('@radix-ui/react-select', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="select-root" data-slot="select" {...props}>
      {children}
    </div>
  ),
  Group: ({ children, ...props }: any) => (
    <div data-testid="select-group" data-slot="select-group" {...props}>
      {children}
    </div>
  ),
  Value: ({ children, ...props }: any) => (
    <div data-testid="select-value" data-slot="select-value" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, className, ...props }: any) => (
    <button
      data-testid="select-trigger"
      data-slot="select-trigger"
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  Portal: ({ children }: any) => <div data-testid="select-portal">{children}</div>,
  Content: ({ children, className, position, ...props }: any) => (
    <div
      data-testid="select-content"
      data-slot="select-content"
      className={className}
      data-position={position}
      {...props}
    >
      {children}
    </div>
  ),
  Viewport: ({ children, className }: any) => (
    <div data-testid="select-viewport" className={className}>
      {children}
    </div>
  ),
  Label: ({ children, className, ...props }: any) => (
    <div
      data-testid="select-label"
      data-slot="select-label"
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Item: ({ children, className, ...props }: any) => (
    <div
      data-testid="select-item"
      data-slot="select-item"
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  ItemText: ({ children }: any) => (
    <span data-testid="select-item-text">{children}</span>
  ),
  ItemIndicator: ({ children }: any) => (
    <span data-testid="select-item-indicator">{children}</span>
  ),
  Separator: ({ className, ...props }: any) => (
    <div
      data-testid="select-separator"
      data-slot="select-separator"
      className={className}
      {...props}
    />
  ),
  ScrollUpButton: ({ className, ...props }: any) => (
    <button
      data-testid="select-scroll-up-button"
      data-slot="select-scroll-up-button"
      className={className}
      {...props}
    >
      {props.children}
    </button>
  ),
  ScrollDownButton: ({ className, ...props }: any) => (
    <button
      data-testid="select-scroll-down-button"
      data-slot="select-scroll-down-button"
      className={className}
      {...props}
    >
      {props.children}
    </button>
  ),
  Icon: ({ children }: any) => <div data-testid="select-icon">{children}</div>,
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Check: ({ className }: any) => (
    <div data-testid="check-icon" className={className} />
  ),
  ChevronDown: ({ className }: any) => (
    <div data-testid="chevron-down-icon" className={className} />
  ),
  ChevronUp: ({ className }: any) => (
    <div data-testid="chevron-up-icon" className={className} />
  ),
}))

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}))

describe('Select Components', () => {
  describe('Select', () => {
    it('renders with default props', () => {
      render(<Select />)
      
      const select = screen.getByTestId('select-root')
      expect(select).toBeInTheDocument()
      expect(select).toHaveAttribute('data-slot', 'select')
    })

    it('passes through additional props', () => {
      render(<Select data-testid="custom-select" />)
      
      const select = screen.getByTestId('custom-select')
      expect(select).toBeInTheDocument()
    })
  })

  describe('SelectGroup', () => {
    it('renders with default props', () => {
      render(<SelectGroup />)
      
      const group = screen.getByTestId('select-group')
      expect(group).toBeInTheDocument()
      expect(group).toHaveAttribute('data-slot', 'select-group')
    })

    it('renders children', () => {
      render(
        <SelectGroup>
          <div>Group Content</div>
        </SelectGroup>
      )
      
      const group = screen.getByTestId('select-group')
      expect(group).toBeInTheDocument()
      expect(screen.getByText('Group Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SelectGroup data-testid="custom-group" />)
      
      const group = screen.getByTestId('custom-group')
      expect(group).toBeInTheDocument()
    })
  })

  describe('SelectValue', () => {
    it('renders with default props', () => {
      render(<SelectValue />)
      
      const value = screen.getByTestId('select-value')
      expect(value).toBeInTheDocument()
      expect(value).toHaveAttribute('data-slot', 'select-value')
    })

    it('renders with placeholder', () => {
      render(<SelectValue placeholder="Select an option" />)
      
      const value = screen.getByTestId('select-value')
      expect(value).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SelectValue data-testid="custom-value" />)
      
      const value = screen.getByTestId('custom-value')
      expect(value).toBeInTheDocument()
    })
  })

  describe('SelectTrigger', () => {
    it('renders with default props', () => {
      render(<SelectTrigger />)
      
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'select-trigger')
      expect(trigger).toHaveAttribute('data-size', 'default')
    })

    it('renders with custom size', () => {
      render(<SelectTrigger size="sm" />)
      
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger).toHaveAttribute('data-size', 'sm')
    })

    it('renders with custom className', () => {
      render(<SelectTrigger className="custom-trigger" />)
      
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('renders children', () => {
      render(
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
      )
      
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger).toBeInTheDocument()
      expect(screen.getByTestId('select-value')).toBeInTheDocument()
    })

    it('renders with chevron icon', () => {
      render(<SelectTrigger />)
      
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger).toBeInTheDocument()
      expect(screen.getByTestId('select-icon')).toBeInTheDocument()
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SelectTrigger data-testid="custom-trigger" />)
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('SelectContent', () => {
    it('renders with default props', () => {
      render(<SelectContent />)
      
      const portal = screen.getByTestId('select-portal')
      const content = screen.getByTestId('select-content')
      
      expect(portal).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'select-content')
      expect(content).toHaveAttribute('data-position', 'popper')
    })

    it('renders with custom position', () => {
      render(<SelectContent position="item-aligned" />)
      
      const content = screen.getByTestId('select-content')
      expect(content).toHaveAttribute('data-position', 'item-aligned')
    })

    it('renders with custom className', () => {
      render(<SelectContent className="custom-content" />)
      
      const content = screen.getByTestId('select-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders children', () => {
      render(
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      )
      
      const content = screen.getByTestId('select-content')
      expect(content).toBeInTheDocument()
      expect(screen.getByTestId('select-item')).toBeInTheDocument()
    })

    it('renders scroll buttons', () => {
      render(<SelectContent />)
      
      expect(screen.getByTestId('select-scroll-up-button')).toBeInTheDocument()
      expect(screen.getByTestId('select-scroll-down-button')).toBeInTheDocument()
    })

    it('renders viewport', () => {
      render(<SelectContent />)
      
      const viewport = screen.getByTestId('select-viewport')
      expect(viewport).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SelectContent data-testid="custom-content" />)
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('SelectLabel', () => {
    it('renders with default props', () => {
      render(<SelectLabel>Label Text</SelectLabel>)
      
      const label = screen.getByTestId('select-label')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('data-slot', 'select-label')
      expect(label).toHaveTextContent('Label Text')
    })

    it('renders with custom className', () => {
      render(<SelectLabel className="custom-label">Label</SelectLabel>)
      
      const label = screen.getByTestId('select-label')
      expect(label).toHaveClass('custom-label')
    })

    it('passes through additional props', () => {
      render(<SelectLabel data-testid="custom-label">Label</SelectLabel>)
      
      const label = screen.getByTestId('custom-label')
      expect(label).toBeInTheDocument()
    })
  })

  describe('SelectItem', () => {
    it('renders with default props', () => {
      render(<SelectItem value="option1">Option 1</SelectItem>)
      
      const item = screen.getByTestId('select-item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'select-item')
    })

    it('renders with custom className', () => {
      render(<SelectItem value="option1" className="custom-item">Option 1</SelectItem>)
      
      const item = screen.getByTestId('select-item')
      expect(item).toHaveClass('custom-item')
    })

    it('renders children as item text', () => {
      render(<SelectItem value="option1">Option 1</SelectItem>)
      
      const itemText = screen.getByTestId('select-item-text')
      expect(itemText).toHaveTextContent('Option 1')
    })

    it('renders item indicator', () => {
      render(<SelectItem value="option1">Option 1</SelectItem>)
      
      const indicator = screen.getByTestId('select-item-indicator')
      expect(indicator).toBeInTheDocument()
      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SelectItem value="option1" data-testid="custom-item">Option 1</SelectItem>)
      
      const item = screen.getByTestId('custom-item')
      expect(item).toBeInTheDocument()
    })
  })

  describe('SelectSeparator', () => {
    it('renders with default props', () => {
      render(<SelectSeparator />)
      
      const separator = screen.getByTestId('select-separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('data-slot', 'select-separator')
    })

    it('renders with custom className', () => {
      render(<SelectSeparator className="custom-separator" />)
      
      const separator = screen.getByTestId('select-separator')
      expect(separator).toHaveClass('custom-separator')
    })

    it('passes through additional props', () => {
      render(<SelectSeparator data-testid="custom-separator" />)
      
      const separator = screen.getByTestId('custom-separator')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('SelectScrollUpButton', () => {
    it('renders with default props', () => {
      render(<SelectScrollUpButton />)
      
      const button = screen.getByTestId('select-scroll-up-button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('data-slot', 'select-scroll-up-button')
    })

    it('renders with custom className', () => {
      render(<SelectScrollUpButton className="custom-scroll-up" />)
      
      const button = screen.getByTestId('select-scroll-up-button')
      expect(button).toHaveClass('custom-scroll-up')
    })

    it('renders chevron up icon', () => {
      render(<SelectScrollUpButton />)
      
      expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SelectScrollUpButton data-testid="custom-scroll-up" />)
      
      const button = screen.getByTestId('custom-scroll-up')
      expect(button).toBeInTheDocument()
    })
  })

  describe('SelectScrollDownButton', () => {
    it('renders with default props', () => {
      render(<SelectScrollDownButton />)
      
      const button = screen.getByTestId('select-scroll-down-button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('data-slot', 'select-scroll-down-button')
    })

    it('renders with custom className', () => {
      render(<SelectScrollDownButton className="custom-scroll-down" />)
      
      const button = screen.getByTestId('select-scroll-down-button')
      expect(button).toHaveClass('custom-scroll-down')
    })

    it('renders chevron down icon', () => {
      render(<SelectScrollDownButton />)
      
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SelectScrollDownButton data-testid="custom-scroll-down" />)
      
      const button = screen.getByTestId('custom-scroll-down')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Complete Select Structure', () => {
    it('renders a complete select component', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectSeparator />
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
      
      // Check all components are rendered
      expect(screen.getByTestId('select-root')).toBeInTheDocument()
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('select-value')).toBeInTheDocument()
      expect(screen.getByTestId('select-content')).toBeInTheDocument()
      expect(screen.getByTestId('select-group')).toBeInTheDocument()
      expect(screen.getAllByTestId('select-label')).toHaveLength(2)
      expect(screen.getAllByTestId('select-item')).toHaveLength(3)
      expect(screen.getByTestId('select-separator')).toBeInTheDocument()
    })

    it('renders select with scroll buttons', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>
      )
      
      // Use getAllByTestId since SelectContent automatically renders scroll buttons
      expect(screen.getAllByTestId('select-scroll-up-button')).toHaveLength(2) // One from SelectContent, one from test
      expect(screen.getAllByTestId('select-scroll-down-button')).toHaveLength(2) // One from SelectContent, one from test
    })

    it('renders select with different positions', () => {
      const { rerender } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      expect(screen.getByTestId('select-content')).toHaveAttribute('data-position', 'popper')
      
      rerender(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      expect(screen.getByTestId('select-content')).toHaveAttribute('data-position', 'item-aligned')
    })
  })
})
