import React from 'react'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton Component', () => {
  it('renders with default props', () => {
    render(<Skeleton />)
    
    const skeleton = screen.getByTestId ? screen.queryByTestId('skeleton') : document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton')
  })

  it('applies default CSS classes', () => {
    render(<Skeleton />)
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveClass(
      'bg-accent',
      'animate-pulse',
      'rounded-md'
    )
  })

  it('renders with custom className', () => {
    render(<Skeleton className="custom-class" />)
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveClass('custom-class')
    expect(skeleton).toHaveClass('bg-accent', 'animate-pulse', 'rounded-md')
  })

  it('renders with custom data-testid', () => {
    render(<Skeleton data-testid="custom-skeleton" />)
    
    const skeleton = screen.getByTestId('custom-skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton')
  })

  it('renders with custom dimensions', () => {
    render(<Skeleton className="w-32 h-8" />)
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveClass('w-32', 'h-8')
  })

  it('renders with custom shape classes', () => {
    render(<Skeleton className="rounded-full w-12 h-12" />)
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveClass('rounded-full', 'w-12', 'h-12')
  })

  it('passes through additional props', () => {
    render(
      <Skeleton 
        data-custom="value" 
        aria-label="Loading content"
        role="presentation"
      />
    )
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveAttribute('data-custom', 'value')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content')
    expect(skeleton).toHaveAttribute('role', 'presentation')
  })

  it('renders as a div element by default', () => {
    render(<Skeleton />)
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton?.tagName).toBe('DIV')
  })

  it('handles multiple skeleton elements', () => {
    render(
      <div>
        <Skeleton data-testid="skeleton-1" />
        <Skeleton data-testid="skeleton-2" />
        <Skeleton data-testid="skeleton-3" />
      </div>
    )
    
    expect(screen.getByTestId('skeleton-1')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton-2')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton-3')).toBeInTheDocument()
  })

  it('renders with text content (should be hidden by CSS)', () => {
    render(<Skeleton>Hidden text content</Skeleton>)
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveTextContent('Hidden text content')
  })

  it('renders with complex nested content', () => {
    render(
      <Skeleton>
        <div>
          <span>Nested content</span>
        </div>
      </Skeleton>
    )
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveTextContent('Nested content')
  })

  it('applies custom styles via style prop', () => {
    render(<Skeleton style={{ width: '100px', height: '20px' }} />)
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveStyle({
      width: '100px',
      height: '20px'
    })
  })

  it('renders with accessibility attributes', () => {
    render(
      <Skeleton 
        aria-label="Loading user profile"
        aria-live="polite"
      />
    )
    
    const skeleton = document.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading user profile')
    expect(skeleton).toHaveAttribute('aria-live', 'polite')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} />)
    
    expect(ref.current).toBeInTheDocument()
    expect(ref.current).toHaveAttribute('data-slot', 'skeleton')
  })
})
