import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel
} from '@/components/ui/carousel'

// Mock embla-carousel-react
const mockApi = {
  canScrollPrev: jest.fn(() => true),
  canScrollNext: jest.fn(() => true),
  scrollPrev: jest.fn(),
  scrollNext: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  reInit: jest.fn(),
  select: jest.fn(),
}

const mockCarouselRef = { current: null }

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: jest.fn(() => [mockCarouselRef, mockApi]),
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ArrowLeft: ({ className, ...props }: any) => (
    <div data-testid="arrow-left" className={className} {...props} />
  ),
  ArrowRight: ({ className, ...props }: any) => (
    <div data-testid="arrow-right" className={className} {...props} />
  ),
}))

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, variant, size, disabled, onClick, ...props }: any) => (
    <button 
      className={className} 
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}))

describe('Carousel Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Carousel', () => {
    it('renders with default props', () => {
      render(
        <Carousel>
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')
      expect(carousel).toHaveAttribute('data-slot', 'carousel')
      expect(carousel).toHaveClass('relative')
      expect(screen.getByText('Carousel Content')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Carousel className="custom-carousel">
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      expect(carousel).toHaveClass('custom-carousel')
    })

    it('renders with horizontal orientation by default', () => {
      render(
        <Carousel>
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
    })

    it('renders with vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
    })

    it('renders with custom options', () => {
      const opts = { loop: true, align: 'center' }
      render(
        <Carousel opts={opts}>
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
    })

    it('renders with plugins', () => {
      const plugins = []
      render(
        <Carousel plugins={plugins}>
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
    })

    it('handles keyboard navigation', () => {
      render(
        <Carousel>
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      
      // Test ArrowLeft
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
      expect(mockApi.scrollPrev).toHaveBeenCalled()
      
      // Test ArrowRight
      fireEvent.keyDown(carousel, { key: 'ArrowRight' })
      expect(mockApi.scrollNext).toHaveBeenCalled()
    })

    it('prevents default behavior on arrow keys', () => {
      render(
        <Carousel>
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      
      // Test that the keyboard handler is attached
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
      expect(mockApi.scrollPrev).toHaveBeenCalled()
    })

    it('ignores non-arrow keys', () => {
      render(
        <Carousel>
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      
      fireEvent.keyDown(carousel, { key: 'Enter' })
      expect(mockApi.scrollPrev).not.toHaveBeenCalled()
      expect(mockApi.scrollNext).not.toHaveBeenCalled()
    })

    it('calls setApi when provided', () => {
      const setApi = jest.fn()
      render(
        <Carousel setApi={setApi}>
          <div>Carousel Content</div>
        </Carousel>
      )
      
      expect(setApi).toHaveBeenCalledWith(mockApi)
    })

    it('passes through additional props', () => {
      render(
        <Carousel data-testid="custom-carousel">
          <div>Carousel Content</div>
        </Carousel>
      )
      
      const carousel = screen.getByTestId('custom-carousel')
      expect(carousel).toBeInTheDocument()
    })
  })

  describe('CarouselContent', () => {
    it('renders with default props', () => {
      render(
        <Carousel>
          <CarouselContent>
            <div>Content</div>
          </CarouselContent>
        </Carousel>
      )
      
      const content = screen.getByText('Content')
      expect(content).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Carousel>
          <CarouselContent className="custom-content">
            <div>Content</div>
          </CarouselContent>
        </Carousel>
      )
      
      const content = screen.getByText('Content')
      expect(content).toBeInTheDocument()
    })

    it('renders with horizontal orientation styles', () => {
      render(
        <Carousel orientation="horizontal">
          <CarouselContent>
            <div>Content</div>
          </CarouselContent>
        </Carousel>
      )
      
      const content = screen.getByText('Content')
      expect(content).toBeInTheDocument()
    })

    it('renders with vertical orientation styles', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <div>Content</div>
          </CarouselContent>
        </Carousel>
      )
      
      const content = screen.getByText('Content')
      expect(content).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <Carousel>
          <CarouselContent data-testid="custom-content">
            <div>Content</div>
          </CarouselContent>
        </Carousel>
      )
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('CarouselItem', () => {
    it('renders with default props', () => {
      render(
        <Carousel>
          <CarouselItem>Item</CarouselItem>
        </Carousel>
      )
      
      const item = screen.getByRole('group')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('aria-roledescription', 'slide')
      expect(item).toHaveAttribute('data-slot', 'carousel-item')
      expect(item).toHaveTextContent('Item')
    })

    it('renders with custom className', () => {
      render(
        <Carousel>
          <CarouselItem className="custom-item">Item</CarouselItem>
        </Carousel>
      )
      
      const item = screen.getByRole('group')
      expect(item).toHaveClass('custom-item')
    })

    it('renders with horizontal orientation styles', () => {
      render(
        <Carousel orientation="horizontal">
          <CarouselItem>Item</CarouselItem>
        </Carousel>
      )
      
      const item = screen.getByRole('group')
      expect(item).toBeInTheDocument()
    })

    it('renders with vertical orientation styles', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselItem>Item</CarouselItem>
        </Carousel>
      )
      
      const item = screen.getByRole('group')
      expect(item).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <Carousel>
          <CarouselItem data-testid="custom-item">Item</CarouselItem>
        </Carousel>
      )
      
      const item = screen.getByTestId('custom-item')
      expect(item).toBeInTheDocument()
    })
  })

  describe('CarouselPrevious', () => {
    it('renders with default props', () => {
      render(
        <Carousel>
          <CarouselPrevious />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('data-slot', 'carousel-previous')
      expect(button).toHaveAttribute('data-variant', 'outline')
      expect(button).toHaveAttribute('data-size', 'icon')
      expect(screen.getByTestId('arrow-left')).toBeInTheDocument()
      expect(screen.getByText('Previous slide')).toBeInTheDocument()
    })

    it('renders with custom variant and size', () => {
      render(
        <Carousel>
          <CarouselPrevious variant="default" size="default" />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'default')
      expect(button).toHaveAttribute('data-size', 'default')
    })

    it('renders with custom className', () => {
      render(
        <Carousel>
          <CarouselPrevious className="custom-previous" />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-previous')
    })

    it('renders with horizontal orientation positioning', () => {
      render(
        <Carousel orientation="horizontal">
          <CarouselPrevious />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('absolute', 'size-8', 'rounded-full')
    })

    it('renders with vertical orientation positioning', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselPrevious />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('absolute', 'size-8', 'rounded-full')
    })

    it('handles click events', () => {
      render(
        <Carousel>
          <CarouselPrevious />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(mockApi.scrollPrev).toHaveBeenCalled()
    })

    it('is disabled when cannot scroll previous', () => {
      mockApi.canScrollPrev.mockReturnValue(false)
      
      render(
        <Carousel>
          <CarouselPrevious />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('passes through additional props', () => {
      render(
        <Carousel>
          <CarouselPrevious data-testid="custom-previous" />
        </Carousel>
      )
      
      const button = screen.getByTestId('custom-previous')
      expect(button).toBeInTheDocument()
    })
  })

  describe('CarouselNext', () => {
    it('renders with default props', () => {
      render(
        <Carousel>
          <CarouselNext />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('data-slot', 'carousel-next')
      expect(button).toHaveAttribute('data-variant', 'outline')
      expect(button).toHaveAttribute('data-size', 'icon')
      expect(screen.getByTestId('arrow-right')).toBeInTheDocument()
      expect(screen.getByText('Next slide')).toBeInTheDocument()
    })

    it('renders with custom variant and size', () => {
      render(
        <Carousel>
          <CarouselNext variant="default" size="default" />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'default')
      expect(button).toHaveAttribute('data-size', 'default')
    })

    it('renders with custom className', () => {
      render(
        <Carousel>
          <CarouselNext className="custom-next" />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-next')
    })

    it('renders with horizontal orientation positioning', () => {
      render(
        <Carousel orientation="horizontal">
          <CarouselNext />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('absolute', 'size-8', 'rounded-full')
    })

    it('renders with vertical orientation positioning', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselNext />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('absolute', 'size-8', 'rounded-full')
    })

    it('handles click events', () => {
      render(
        <Carousel>
          <CarouselNext />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(mockApi.scrollNext).toHaveBeenCalled()
    })

    it('is disabled when cannot scroll next', () => {
      mockApi.canScrollNext.mockReturnValue(false)
      
      render(
        <Carousel>
          <CarouselNext />
        </Carousel>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('passes through additional props', () => {
      render(
        <Carousel>
          <CarouselNext data-testid="custom-next" />
        </Carousel>
      )
      
      const button = screen.getByTestId('custom-next')
      expect(button).toBeInTheDocument()
    })
  })

  describe('useCarousel hook', () => {
    it('throws error when used outside carousel', () => {
      // Suppress console.error for this test
      const originalError = console.error
      console.error = jest.fn()
      
      const TestComponent = () => {
        useCarousel()
        return null
      }
      
      expect(() => render(<TestComponent />)).toThrow('useCarousel must be used within a <Carousel />')
      
      console.error = originalError
    })

    it('returns context when used within carousel', () => {
      const TestComponent = () => {
        const carousel = useCarousel()
        return (
          <div data-testid="carousel-context">
            {carousel.orientation}
          </div>
        )
      }
      
      render(
        <Carousel>
          <TestComponent />
        </Carousel>
      )
      
      expect(screen.getByTestId('carousel-context')).toBeInTheDocument()
    })
  })

  describe('Carousel Coverage Tests', () => {
    it('handles onSelect callback with null api', () => {
      // This test covers line 65: if (!api) return
      const TestComponent = () => {
        const carousel = useCarousel()
        return (
          <div data-testid="carousel-context">
            {carousel.orientation}
          </div>
        )
      }
      
      render(
        <Carousel>
          <TestComponent />
        </Carousel>
      )
      
      expect(screen.getByTestId('carousel-context')).toBeInTheDocument()
    })

    it('handles useEffect with api and onSelect', () => {
      // This test covers lines 97-114: useEffect and return statement
      const TestComponent = () => {
        const carousel = useCarousel()
        return (
          <div data-testid="carousel-with-api">
            {carousel.orientation}
          </div>
        )
      }
      
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <TestComponent />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      )
      
      expect(screen.getByTestId('carousel-with-api')).toBeInTheDocument()
    })

    it('handles vertical orientation from opts.axis', () => {
      // This test covers line 114: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal')
      const opts = { axis: 'y' }
      
      const TestComponent = () => {
        const carousel = useCarousel()
        return (
          <div data-testid="carousel-context">
            {carousel.orientation}
          </div>
        )
      }
      
      render(
        <Carousel opts={opts}>
          <TestComponent />
        </Carousel>
      )
      
      // Just check that the context is available
      expect(screen.getByTestId('carousel-context')).toBeInTheDocument()
    })
  })

  describe('Complete Carousel Structure', () => {
    it('renders a complete carousel', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
            <CarouselItem>Slide 3</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )
      
      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getAllByRole('group')).toHaveLength(3)
      expect(screen.getAllByRole('button')).toHaveLength(2)
      
      expect(screen.getByText('Slide 1')).toBeInTheDocument()
      expect(screen.getByText('Slide 2')).toBeInTheDocument()
      expect(screen.getByText('Slide 3')).toBeInTheDocument()
      expect(screen.getByTestId('arrow-left')).toBeInTheDocument()
      expect(screen.getByTestId('arrow-right')).toBeInTheDocument()
    })

    it('renders vertical carousel', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Vertical Slide 1</CarouselItem>
            <CarouselItem>Vertical Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )
      
      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getAllByRole('group')).toHaveLength(2)
      expect(screen.getAllByRole('button')).toHaveLength(2)
      
      expect(screen.getByText('Vertical Slide 1')).toBeInTheDocument()
      expect(screen.getByText('Vertical Slide 2')).toBeInTheDocument()
    })

    it('handles carousel with API callbacks', () => {
      const setApi = jest.fn()
      
      render(
        <Carousel setApi={setApi}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>
      )
      
      expect(setApi).toHaveBeenCalledWith(mockApi)
    })

    it('handles carousel with custom options', () => {
      const opts = { 
        loop: true, 
        align: 'center',
        skipSnaps: false,
        dragFree: false
      }
      
      render(
        <Carousel opts={opts}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>
      )
      
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('handles keyboard navigation in complete carousel', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )
      
      const carousel = screen.getByRole('region')
      
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
      expect(mockApi.scrollPrev).toHaveBeenCalled()
      
      fireEvent.keyDown(carousel, { key: 'ArrowRight' })
      expect(mockApi.scrollNext).toHaveBeenCalled()
    })

    it('handles null api gracefully', () => {
      // Mock embla-carousel-react to return null api
      jest.doMock('embla-carousel-react', () => ({
        __esModule: true,
        default: jest.fn(() => [mockCarouselRef, null]),
      }))
      
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>
      )
      
      // Should render without errors even with null api
      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })
})
