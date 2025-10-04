import React from 'react'
import { render, screen } from '@testing-library/react'
import { Progress } from '@/components/ui/progress'

// Mock Radix UI Progress
jest.mock('@radix-ui/react-progress', () => ({
  Root: ({ children, className, ...props }: any) => (
    <div
      data-testid="progress-root"
      data-slot="progress"
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Indicator: ({ className, style, ...props }: any) => (
    <div
      data-testid="progress-indicator"
      data-slot="progress-indicator"
      className={className}
      style={style}
      {...props}
    />
  ),
}))

describe('Progress Component', () => {
  it('renders with default props', () => {
    render(<Progress />)
    
    const progress = screen.getByTestId('progress-root')
    const indicator = screen.getByTestId('progress-indicator')
    
    expect(progress).toBeInTheDocument()
    expect(progress).toHaveAttribute('data-slot', 'progress')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveAttribute('data-slot', 'progress-indicator')
  })

  it('renders with value prop', () => {
    render(<Progress value={50} />)
    
    const progress = screen.getByTestId('progress-root')
    const indicator = screen.getByTestId('progress-indicator')
    
    expect(progress).toBeInTheDocument()
    expect(indicator).toHaveStyle('transform: translateX(-50%)')
  })

  it('renders with 0 value', () => {
    render(<Progress value={0} />)
    
    const indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveStyle('transform: translateX(-100%)')
  })

  it('renders with 100 value', () => {
    render(<Progress value={100} />)
    
    const indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveStyle('transform: translateX(0%)')
  })

  it('applies correct CSS classes to root', () => {
    render(<Progress />)
    
    const progress = screen.getByTestId('progress-root')
    expect(progress).toHaveClass(
      'bg-primary/20',
      'relative',
      'h-2',
      'w-full',
      'overflow-hidden',
      'rounded-full'
    )
  })

  it('applies correct CSS classes to indicator', () => {
    render(<Progress />)
    
    const indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveClass(
      'bg-primary',
      'h-full',
      'w-full',
      'flex-1',
      'transition-all'
    )
  })

  it('renders with custom className', () => {
    render(<Progress className="custom-progress" />)
    
    const progress = screen.getByTestId('progress-root')
    expect(progress).toHaveClass('custom-progress')
  })

  it('passes through additional props to root', () => {
    render(
      <Progress 
        data-testid="custom-progress"
        data-custom="value"
        aria-label="Loading progress"
      />
    )
    
    const progress = screen.getByTestId('custom-progress')
    expect(progress).toHaveAttribute('data-custom', 'value')
    expect(progress).toHaveAttribute('aria-label', 'Loading progress')
  })

  it('handles undefined value', () => {
    render(<Progress value={undefined} />)
    
    const indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveStyle('transform: translateX(-100%)')
  })

  it('handles null value', () => {
    render(<Progress value={null as any} />)
    
    const indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveStyle('transform: translateX(-100%)')
  })

  it('handles fractional values', () => {
    render(<Progress value={33.5} />)
    
    const indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveStyle('transform: translateX(-66.5%)')
  })

  it('handles values greater than 100', () => {
    render(<Progress value={150} />)
    
    const indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveStyle('transform: translateX(50%)')
  })

  it('handles negative values', () => {
    render(<Progress value={-10} />)
    
    const indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveStyle('transform: translateX(-100%)')
  })

  it('updates transform when value changes', () => {
    const { rerender } = render(<Progress value={25} />)
    
    let indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveStyle('transform: translateX(-75%)')
    
    rerender(<Progress value={75} />)
    
    indicator = screen.getByTestId('progress-indicator')
    expect(indicator).toHaveStyle('transform: translateX(-25%)')
  })

  it('renders with accessibility attributes', () => {
    render(
      <Progress 
        value={60}
        aria-label="Download progress"
        role="progressbar"
      />
    )
    
    const progress = screen.getByTestId('progress-root')
    expect(progress).toHaveAttribute('aria-label', 'Download progress')
    expect(progress).toHaveAttribute('role', 'progressbar')
  })

  it('renders multiple progress bars', () => {
    render(
      <div>
        <Progress value={30} data-testid="progress-1" />
        <Progress value={70} data-testid="progress-2" />
        <Progress value={100} data-testid="progress-3" />
      </div>
    )
    
    const progress1 = screen.getByTestId('progress-1')
    const progress2 = screen.getByTestId('progress-2')
    const progress3 = screen.getByTestId('progress-3')
    
    expect(progress1).toBeInTheDocument()
    expect(progress2).toBeInTheDocument()
    expect(progress3).toBeInTheDocument()
    
    const indicators = screen.getAllByTestId('progress-indicator')
    expect(indicators).toHaveLength(3)
    
    expect(indicators[0]).toHaveStyle('transform: translateX(-70%)')
    expect(indicators[1]).toHaveStyle('transform: translateX(-30%)')
    expect(indicators[2]).toHaveStyle('transform: translateX(0%)')
  })

  it('maintains correct structure', () => {
    render(<Progress value={50} />)
    
    const progress = screen.getByTestId('progress-root')
    const indicator = screen.getByTestId('progress-indicator')
    
    expect(progress).toContainElement(indicator)
    expect(progress.tagName).toBe('DIV')
    expect(indicator.tagName).toBe('DIV')
  })

  it('handles rapid value changes', () => {
    const { rerender } = render(<Progress value={0} />)
    
    const values = [10, 25, 50, 75, 90, 100]
    
    values.forEach(value => {
      rerender(<Progress value={value} />)
      const indicator = screen.getByTestId('progress-indicator')
      const expectedTransform = `translateX(${Math.max(value - 100, -100)}%)`
      expect(indicator).toHaveStyle(`transform: ${expectedTransform}`)
    })
  })

  it('renders with custom styling', () => {
    render(
      <Progress 
        value={40}
        style={{ height: '8px' }}
        className="custom-height"
      />
    )
    
    const progress = screen.getByTestId('progress-root')
    expect(progress).toHaveClass('custom-height')
    expect(progress).toHaveStyle('height: 8px')
  })
})
