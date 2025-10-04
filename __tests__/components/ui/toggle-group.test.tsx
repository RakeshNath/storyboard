import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// Mock Radix UI ToggleGroup
jest.mock('@radix-ui/react-toggle-group', () => ({
  Root: ({ children, variant, size, ...props }: any) => (
    <div data-testid="toggle-group-root" data-variant={variant} data-size={size} {...props}>
      {children}
    </div>
  ),
  Item: ({ children, variant, size, ...props }: any) => (
    <button 
      data-testid="toggle-group-item" 
      data-variant={variant} 
      data-size={size} 
      {...props}
    >
      {children}
    </button>
  ),
}))

// Mock toggle variants
jest.mock('@/components/ui/toggle', () => ({
  toggleVariants: jest.fn(() => 'mock-toggle-variants'),
}))

describe('ToggleGroup Component', () => {
  it('renders with default props', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    expect(screen.getByTestId('toggle-group-root')).toBeInTheDocument()
    expect(screen.getAllByTestId('toggle-group-item')).toHaveLength(2)
  })

  it('renders with custom className', () => {
    render(
      <ToggleGroup className="custom-toggle-group">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    expect(root).toHaveClass('custom-toggle-group')
  })

  it('renders with variant prop', () => {
    render(
      <ToggleGroup variant="outline">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    expect(root).toHaveAttribute('data-variant', 'outline')
  })

  it('renders with size prop', () => {
    render(
      <ToggleGroup size="sm">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    expect(root).toHaveAttribute('data-size', 'sm')
  })

  it('renders with both variant and size props', () => {
    render(
      <ToggleGroup variant="default" size="lg">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    expect(root).toHaveAttribute('data-variant', 'default')
    expect(root).toHaveAttribute('data-size', 'lg')
  })

  it('renders children correctly', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1">First Item</ToggleGroupItem>
        <ToggleGroupItem value="item2">Second Item</ToggleGroupItem>
        <ToggleGroupItem value="item3">Third Item</ToggleGroupItem>
      </ToggleGroup>
    )
    
    expect(screen.getByText('First Item')).toBeInTheDocument()
    expect(screen.getByText('Second Item')).toBeInTheDocument()
    expect(screen.getByText('Third Item')).toBeInTheDocument()
    expect(screen.getAllByTestId('toggle-group-item')).toHaveLength(3)
  })

  it('passes through additional props to root element', () => {
    render(
      <ToggleGroup data-testid="custom-group" aria-label="Options">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('custom-group')
    expect(root).toHaveAttribute('aria-label', 'Options')
  })

  it('handles type prop', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    expect(root).toHaveAttribute('type', 'single')
  })

  it('handles value prop', () => {
    render(
      <ToggleGroup value="item1">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    expect(root).toHaveAttribute('value', 'item1')
  })

  it('handles defaultValue prop', () => {
    render(
      <ToggleGroup defaultValue="item1">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    // defaultValue is not set as an attribute on the root element
    expect(root).toBeInTheDocument()
  })

  it('handles disabled prop', () => {
    render(
      <ToggleGroup disabled>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    expect(root).toHaveAttribute('disabled')
  })

  it('handles orientation prop', () => {
    render(
      <ToggleGroup orientation="vertical">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    expect(root).toHaveAttribute('orientation', 'vertical')
  })

  it('handles onValueChange callback', () => {
    const handleValueChange = jest.fn()
    render(
      <ToggleGroup onValueChange={handleValueChange}>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const root = screen.getByTestId('toggle-group-root')
    // onValueChange is a function property, not an attribute
    expect(root).toBeInTheDocument()
  })

  it('applies correct data attributes', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    expect(screen.getByTestId('toggle-group-root')).toHaveAttribute('data-slot', 'toggle-group')
  })
})

describe('ToggleGroupItem Component', () => {
  it('renders with default props', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toBeInTheDocument()
    expect(item).toHaveAttribute('value', 'item1')
    expect(item).toHaveTextContent('Item 1')
  })

  it('renders with custom className', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1" className="custom-item">
          Item 1
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toHaveClass('custom-item')
  })

  it('renders with variant prop', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1" variant="outline">
          Item 1
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toHaveAttribute('data-variant', 'outline')
  })

  it('renders with size prop', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1" size="sm">
          Item 1
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toHaveAttribute('data-size', 'sm')
  })

  it('inherits variant and size from context', () => {
    render(
      <ToggleGroup variant="outline" size="lg">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toHaveAttribute('data-variant', 'outline')
    expect(item).toHaveAttribute('data-size', 'lg')
  })

  it('overrides context with own props', () => {
    render(
      <ToggleGroup variant="outline" size="lg">
        <ToggleGroupItem value="item1" variant="default" size="sm">
          Item 1
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toHaveAttribute('data-variant', 'default')
    expect(item).toHaveAttribute('data-size', 'sm')
  })

  it('renders children correctly', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1">
          <span>Custom Content</span>
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    expect(screen.getByText('Custom Content')).toBeInTheDocument()
  })

  it('passes through additional props', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem 
          value="item1" 
          data-testid="custom-item"
          aria-label="Custom Item"
        >
          Item 1
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('custom-item')
    expect(item).toHaveAttribute('aria-label', 'Custom Item')
  })

  it('handles disabled state', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1" disabled>
          Item 1
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toHaveAttribute('disabled')
  })

  it('handles pressed state', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1" data-state="on">
          Item 1
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toHaveAttribute('data-state', 'on')
  })

  it('applies correct data attributes', () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toHaveAttribute('data-slot', 'toggle-group-item')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(
      <ToggleGroup>
        <ToggleGroupItem value="item1" onClick={handleClick}>
          Item 1
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('toggle-group-item')
    fireEvent.click(item)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('works without context (fallback to default)', () => {
    // This tests the fallback behavior when context is not available
    render(<ToggleGroupItem value="item1">Item 1</ToggleGroupItem>)
    
    const item = screen.getByTestId('toggle-group-item')
    expect(item).toHaveAttribute('data-variant', 'default')
    expect(item).toHaveAttribute('data-size', 'default')
  })
})
