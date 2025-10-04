import React from 'react'
import { render, screen } from '@testing-library/react'
import { Separator } from '@/components/ui/separator'

// Mock Radix UI Separator
jest.mock('@radix-ui/react-separator', () => ({
  Root: ({ children, className, orientation, decorative, ...props }: any) => (
    <div
      data-testid="separator-root"
      data-slot="separator"
      className={className}
      data-orientation={orientation}
      data-decorative={decorative}
      {...props}
    >
      {children}
    </div>
  ),
}))

describe('Separator Component', () => {
  it('renders with default props', () => {
    render(<Separator />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveAttribute('data-slot', 'separator')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(separator).toHaveAttribute('data-decorative', 'true')
  })

  it('renders with horizontal orientation by default', () => {
    render(<Separator />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('renders with vertical orientation', () => {
    render(<Separator orientation="vertical" />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-orientation', 'vertical')
  })

  it('renders with decorative true by default', () => {
    render(<Separator />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-decorative', 'true')
  })

  it('renders with decorative false', () => {
    render(<Separator decorative={false} />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-decorative', 'false')
  })

  it('applies correct CSS classes', () => {
    render(<Separator />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveClass(
      'bg-border',
      'shrink-0',
      'data-[orientation=horizontal]:h-px',
      'data-[orientation=horizontal]:w-full',
      'data-[orientation=vertical]:h-full',
      'data-[orientation=vertical]:w-px'
    )
  })

  it('renders with custom className', () => {
    render(<Separator className="custom-separator" />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveClass('custom-separator')
  })

  it('passes through additional props', () => {
    render(
      <Separator 
        data-testid="custom-separator"
        data-custom="value"
        aria-label="Section separator"
      />
    )
    
    const separator = screen.getByTestId('custom-separator')
    expect(separator).toHaveAttribute('data-custom', 'value')
    expect(separator).toHaveAttribute('aria-label', 'Section separator')
  })

  it('renders with children', () => {
    render(
      <Separator>
        <span>Separator Content</span>
      </Separator>
    )
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveTextContent('Separator Content')
  })

  it('handles different orientation and decorative combinations', () => {
    const { rerender } = render(<Separator orientation="horizontal" decorative={true} />)
    
    let separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(separator).toHaveAttribute('data-decorative', 'true')
    
    rerender(<Separator orientation="vertical" decorative={false} />)
    
    separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-orientation', 'vertical')
    expect(separator).toHaveAttribute('data-decorative', 'false')
  })

  it('renders multiple separators', () => {
    render(
      <div>
        <Separator data-testid="separator-1" />
        <div>Content</div>
        <Separator data-testid="separator-2" />
      </div>
    )
    
    expect(screen.getByTestId('separator-1')).toBeInTheDocument()
    expect(screen.getByTestId('separator-2')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders with custom orientation values', () => {
    render(<Separator orientation="horizontal" />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('renders with boolean decorative prop', () => {
    render(<Separator decorative={true} />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-decorative', 'true')
  })

  it('renders as a div element', () => {
    render(<Separator />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator.tagName).toBe('DIV')
  })

  it('handles empty children', () => {
    render(<Separator />)
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toBeInTheDocument()
    expect(separator).toBeEmptyDOMElement()
  })

  it('renders with complex nested content', () => {
    render(
      <Separator>
        <div>
          <span>Nested</span>
          <strong>Content</strong>
        </div>
      </Separator>
    )
    
    const separator = screen.getByTestId('separator-root')
    expect(separator).toHaveTextContent('Nested')
    expect(separator).toHaveTextContent('Content')
  })

  it('maintains correct attributes across re-renders', () => {
    const { rerender } = render(<Separator />)
    
    let separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(separator).toHaveAttribute('data-decorative', 'true')
    
    rerender(<Separator orientation="vertical" decorative={false} />)
    
    separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-orientation', 'vertical')
    expect(separator).toHaveAttribute('data-decorative', 'false')
    
    rerender(<Separator orientation="horizontal" decorative={true} />)
    
    separator = screen.getByTestId('separator-root')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(separator).toHaveAttribute('data-decorative', 'true')
  })
})
