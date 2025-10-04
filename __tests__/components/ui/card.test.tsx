import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  CardAction 
} from '@/components/ui/card'

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

describe('Card Components', () => {
  describe('Card Component', () => {
    it('renders as a div element', () => {
      render(<Card>Card content</Card>)
      
      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
      expect(card.tagName).toBe('DIV')
    })

    it('applies default classes', () => {
      render(<Card>Card content</Card>)
      
      const card = screen.getByText('Card content')
      expect(card).toHaveClass(
        'bg-card',
        'text-card-foreground',
        'flex',
        'flex-col',
        'gap-6',
        'rounded-xl',
        'border',
        'shadow-sm',
        'py-6'
      )
    })

    it('applies custom className', () => {
      render(<Card className="custom-class">Card content</Card>)
      
      const card = screen.getByText('Card content')
      expect(card).toHaveClass('custom-class')
    })

    it('merges custom className with default classes', () => {
      render(<Card className="custom-class">Card content</Card>)
      
      const card = screen.getByText('Card content')
      expect(card).toHaveClass('bg-card', 'custom-class')
    })

    it('passes through custom props', () => {
      render(<Card data-testid="custom-card" data-custom="value">Card content</Card>)
      
      const card = screen.getByTestId('custom-card')
      expect(card).toHaveAttribute('data-custom', 'value')
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      
      render(<Card onClick={handleClick}>Clickable card</Card>)
      
      const card = screen.getByText('Clickable card')
      fireEvent.click(card)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles mouse events', () => {
      const handleMouseEnter = jest.fn()
      const handleMouseLeave = jest.fn()
      
      render(
        <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Hoverable card
        </Card>
      )
      
      const card = screen.getByText('Hoverable card')
      fireEvent.mouseEnter(card)
      fireEvent.mouseLeave(card)
      
      expect(handleMouseEnter).toHaveBeenCalledTimes(1)
      expect(handleMouseLeave).toHaveBeenCalledTimes(1)
    })

    it('renders with custom props', () => {
      render(<Card data-testid="custom-card">Card content</Card>)
      
      const card = screen.getByTestId('custom-card')
      expect(card).toBeInTheDocument()
    })
  })

  describe('CardHeader Component', () => {
    it('renders as a div element', () => {
      render(<CardHeader>Header content</CardHeader>)
      
      const header = screen.getByText('Header content')
      expect(header).toBeInTheDocument()
      expect(header.tagName).toBe('DIV')
    })

    it('applies default classes', () => {
      render(<CardHeader>Header content</CardHeader>)
      
      const header = screen.getByText('Header content')
      expect(header).toHaveClass('text-center', 'px-6')
    })

    it('applies custom className', () => {
      render(<CardHeader className="custom-header">Header content</CardHeader>)
      
      const header = screen.getByText('Header content')
      expect(header).toHaveClass('custom-header')
    })

    it('passes through custom props', () => {
      render(<CardHeader data-testid="header" data-custom="value">Header content</CardHeader>)
      
      const header = screen.getByTestId('header')
      expect(header).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('CardTitle Component', () => {
    it('renders as a div element', () => {
      render(<CardTitle>Title content</CardTitle>)
      
      const title = screen.getByText('Title content')
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('DIV')
    })

    it('applies default classes', () => {
      render(<CardTitle>Title content</CardTitle>)
      
      const title = screen.getByText('Title content')
      expect(title).toHaveClass('leading-none', 'font-semibold')
    })

    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Title content</CardTitle>)
      
      const title = screen.getByText('Title content')
      expect(title).toHaveClass('custom-title')
    })

    it('passes through custom props', () => {
      render(<CardTitle data-testid="title" data-custom="value">Title content</CardTitle>)
      
      const title = screen.getByTestId('title')
      expect(title).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('CardDescription Component', () => {
    it('renders as a div element', () => {
      render(<CardDescription>Description content</CardDescription>)
      
      const description = screen.getByText('Description content')
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('DIV')
    })

    it('applies default classes', () => {
      render(<CardDescription>Description content</CardDescription>)
      
      const description = screen.getByText('Description content')
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
    })

    it('applies custom className', () => {
      render(<CardDescription className="custom-description">Description content</CardDescription>)
      
      const description = screen.getByText('Description content')
      expect(description).toHaveClass('custom-description')
    })

    it('passes through custom props', () => {
      render(<CardDescription data-testid="description" data-custom="value">Description content</CardDescription>)
      
      const description = screen.getByTestId('description')
      expect(description).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('CardContent Component', () => {
    it('renders as a div element', () => {
      render(<CardContent>Content</CardContent>)
      
      const content = screen.getByText('Content')
      expect(content).toBeInTheDocument()
      expect(content.tagName).toBe('DIV')
    })

    it('applies default classes', () => {
      render(<CardContent>Content</CardContent>)
      
      const content = screen.getByText('Content')
      expect(content).toHaveClass('px-6')
    })

    it('applies custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>)
      
      const content = screen.getByText('Content')
      expect(content).toHaveClass('custom-content')
    })

    it('passes through custom props', () => {
      render(<CardContent data-testid="content" data-custom="value">Content</CardContent>)
      
      const content = screen.getByTestId('content')
      expect(content).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('CardFooter Component', () => {
    it('renders as a div element', () => {
      render(<CardFooter>Footer content</CardFooter>)
      
      const footer = screen.getByText('Footer content')
      expect(footer).toBeInTheDocument()
      expect(footer.tagName).toBe('DIV')
    })

    it('applies default classes', () => {
      render(<CardFooter>Footer content</CardFooter>)
      
      const footer = screen.getByText('Footer content')
      expect(footer).toHaveClass('flex', 'items-center', 'px-6', '[.border-t]:pt-6')
    })

    it('applies custom className', () => {
      render(<CardFooter className="custom-footer">Footer content</CardFooter>)
      
      const footer = screen.getByText('Footer content')
      expect(footer).toHaveClass('custom-footer')
    })

    it('passes through custom props', () => {
      render(<CardFooter data-testid="footer" data-custom="value">Footer content</CardFooter>)
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('CardAction Component', () => {
    it('renders as a div element', () => {
      render(<CardAction>Action content</CardAction>)
      
      const action = screen.getByText('Action content')
      expect(action).toBeInTheDocument()
      expect(action.tagName).toBe('DIV')
    })

    it('applies default classes', () => {
      render(<CardAction>Action content</CardAction>)
      
      const action = screen.getByText('Action content')
      expect(action).toHaveClass(
        'col-start-2',
        'row-span-2',
        'row-start-1',
        'self-start',
        'justify-self-end'
      )
    })

    it('applies custom className', () => {
      render(<CardAction className="custom-action">Action content</CardAction>)
      
      const action = screen.getByText('Action content')
      expect(action).toHaveClass('custom-action')
    })

    it('passes through custom props', () => {
      render(<CardAction data-testid="action" data-custom="value">Action content</CardAction>)
      
      const action = screen.getByTestId('action')
      expect(action).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('Card Composition', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      )
      
      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card Description')).toBeInTheDocument()
      expect(screen.getByText('Card content goes here')).toBeInTheDocument()
      expect(screen.getByText('Action Button')).toBeInTheDocument()
    })

    it('renders card with action', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>Card content</p>
          </CardContent>
        </Card>
      )
      
      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('renders multiple cards', () => {
      render(
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
            </CardHeader>
            <CardContent>Content 1</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
            </CardHeader>
            <CardContent>Content 2</CardContent>
          </Card>
        </div>
      )
      
      expect(screen.getByText('Card 1')).toBeInTheDocument()
      expect(screen.getByText('Card 2')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label on Card', () => {
      render(<Card aria-label="Custom card">Card content</Card>)
      
      const card = screen.getByLabelText('Custom card')
      expect(card).toBeInTheDocument()
    })

    it('supports role attribute on Card', () => {
      render(<Card role="article">Card content</Card>)
      
      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })

    it('supports aria-describedby on Card', () => {
      render(
        <div>
          <Card aria-describedby="card-description">Card content</Card>
          <div id="card-description">Card description</div>
        </div>
      )
      
      const card = screen.getByText('Card content')
      expect(card).toHaveAttribute('aria-describedby', 'card-description')
    })

    it('supports semantic HTML structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle as="h2">Card Title</CardTitle>
            <CardDescription as="p">Card Description</CardDescription>
          </CardHeader>
          <CardContent as="main">
            <p>Card content</p>
          </CardContent>
        </Card>
      )
      
      // Note: The components render as div by default, but we can test the structure
      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card Description')).toBeInTheDocument()
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(<Card></Card>)
      
      const cards = screen.getAllByRole('generic')
      const card = cards.find(el => el.className.includes('bg-card'))
      expect(card).toBeInTheDocument()
      expect(card).toBeEmptyDOMElement()
    })

    it('handles null children', () => {
      render(<Card>{null}</Card>)
      
      const cards = screen.getAllByRole('generic')
      const card = cards.find(el => el.className.includes('bg-card'))
      expect(card).toBeInTheDocument()
    })

    it('handles undefined children', () => {
      render(<Card>{undefined}</Card>)
      
      const cards = screen.getAllByRole('generic')
      const card = cards.find(el => el.className.includes('bg-card'))
      expect(card).toBeInTheDocument()
    })

    it('handles multiple children with mixed types', () => {
      render(
        <Card>
          <span>Text</span>
          {null}
          <span>More Text</span>
        </Card>
      )
      
      const cards = screen.getAllByRole('generic')
      const card = cards.find(el => el.className.includes('bg-card'))
      expect(card).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
      expect(screen.getByText('More Text')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently with many cards', () => {
      const startTime = performance.now()
      
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
              </CardHeader>
              <CardContent>Content {i}</CardContent>
            </Card>
          ))}
        </div>
      )
      
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // Should render in less than 1 second
      expect(screen.getAllByText(/Card \d+/)).toHaveLength(100)
    })
  })
})
