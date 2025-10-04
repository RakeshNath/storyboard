import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from '@/components/ui/slider'

// Mock Radix UI Slider
jest.mock('@radix-ui/react-slider', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="slider-root" {...props}>
      {children}
    </div>
  ),
  Track: ({ children, ...props }: any) => (
    <div data-testid="slider-track" {...props}>
      {children}
    </div>
  ),
  Range: ({ ...props }: any) => (
    <div data-testid="slider-range" {...props} />
  ),
  Thumb: ({ ...props }: any) => (
    <div data-testid="slider-thumb" {...props} />
  ),
}))

describe('Slider Component', () => {
  it('renders with default props', () => {
    render(<Slider />)
    
    expect(screen.getByTestId('slider-root')).toBeInTheDocument()
    expect(screen.getByTestId('slider-track')).toBeInTheDocument()
    expect(screen.getByTestId('slider-range')).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<Slider className="custom-slider" />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toHaveClass('custom-slider')
  })

  it('renders with default values when no value or defaultValue provided', () => {
    render(<Slider min={10} max={90} />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toHaveAttribute('min', '10')
    expect(sliderRoot).toHaveAttribute('max', '90')
  })

  it('renders with defaultValue', () => {
    render(<Slider defaultValue={[25, 75]} />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toBeInTheDocument()
  })

  it('renders with value prop', () => {
    render(<Slider value={[30, 70]} />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toHaveAttribute('value', '30,70')
  })

  it('renders with custom min and max values', () => {
    render(<Slider min={5} max={95} />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toHaveAttribute('min', '5')
    expect(sliderRoot).toHaveAttribute('max', '95')
  })

  it('renders correct number of thumbs based on array length', () => {
    render(<Slider defaultValue={[20, 40, 60, 80]} />)
    
    const thumbs = screen.getAllByTestId('slider-thumb')
    expect(thumbs).toHaveLength(4)
  })

  it('renders single thumb for single value', () => {
    render(<Slider defaultValue={[50]} />)
    
    const thumbs = screen.getAllByTestId('slider-thumb')
    expect(thumbs).toHaveLength(1)
  })

  it('renders two thumbs for range value with default min/max', () => {
    render(<Slider />)
    
    const thumbs = screen.getAllByTestId('slider-thumb')
    expect(thumbs).toHaveLength(2) // Default min and max create a range
  })

  it('applies correct data attributes', () => {
    render(<Slider />)
    
    expect(screen.getByTestId('slider-root')).toHaveAttribute('data-slot', 'slider')
    expect(screen.getByTestId('slider-track')).toHaveAttribute('data-slot', 'slider-track')
    expect(screen.getByTestId('slider-range')).toHaveAttribute('data-slot', 'slider-range')
    
    const thumbs = screen.getAllByTestId('slider-thumb')
    thumbs.forEach(thumb => {
      expect(thumb).toHaveAttribute('data-slot', 'slider-thumb')
    })
  })

  it('passes through additional props to root element', () => {
    render(<Slider data-testid="custom-slider" aria-label="Volume control" />)
    
    const sliderRoot = screen.getByTestId('custom-slider')
    expect(sliderRoot).toHaveAttribute('aria-label', 'Volume control')
  })

  it('handles disabled state', () => {
    render(<Slider disabled />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toHaveAttribute('disabled')
  })

  it('handles orientation prop', () => {
    render(<Slider orientation="vertical" />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toHaveAttribute('orientation', 'vertical')
  })

  it('handles step prop', () => {
    render(<Slider step={5} />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toHaveAttribute('step', '5')
  })

  it('handles onValueChange callback', () => {
    const handleValueChange = jest.fn()
    render(<Slider onValueChange={handleValueChange} />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toBeInTheDocument()
  })

  it('handles onValueCommit callback', () => {
    const handleValueCommit = jest.fn()
    render(<Slider onValueCommit={handleValueCommit} />)
    
    const sliderRoot = screen.getByTestId('slider-root')
    expect(sliderRoot).toBeInTheDocument()
  })
})
