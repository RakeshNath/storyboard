import { render, screen } from '@testing-library/react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

// Mock Radix UI AspectRatio
jest.mock('@radix-ui/react-aspect-ratio', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="aspect-ratio-root" {...props}>
      {children}
    </div>
  ),
}))

describe('AspectRatio Component', () => {
  it('renders with default props', () => {
    render(
      <AspectRatio>
        <div>Content</div>
      </AspectRatio>
    )
    
    const aspectRatio = screen.getByTestId('aspect-ratio-root')
    expect(aspectRatio).toBeInTheDocument()
    expect(aspectRatio).toHaveAttribute('data-slot', 'aspect-ratio')
  })

  it('renders children correctly', () => {
    render(
      <AspectRatio>
        <div data-testid="child-content">Test Content</div>
      </AspectRatio>
    )
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByTestId('child-content')).toHaveTextContent('Test Content')
  })

  it('passes through props to the root element', () => {
    render(
      <AspectRatio ratio={16 / 9} className="custom-class" data-testid="custom-aspect-ratio">
        <div>Content</div>
      </AspectRatio>
    )
    
    const aspectRatio = screen.getByTestId('custom-aspect-ratio')
    expect(aspectRatio).toBeInTheDocument()
    expect(aspectRatio).toHaveClass('custom-class')
    expect(aspectRatio).toHaveAttribute('data-slot', 'aspect-ratio')
  })

  it('renders with multiple children', () => {
    render(
      <AspectRatio>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
        <span data-testid="child-3">Third Child</span>
      </AspectRatio>
    )
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })

  it('handles empty children', () => {
    render(<AspectRatio />)
    
    const aspectRatio = screen.getByTestId('aspect-ratio-root')
    expect(aspectRatio).toBeInTheDocument()
    expect(aspectRatio).toBeEmptyDOMElement()
  })

  it('renders with complex nested content', () => {
    render(
      <AspectRatio>
        <div>
          <h1>Title</h1>
          <p>Description</p>
          <button>Action</button>
        </div>
      </AspectRatio>
    )
    
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
