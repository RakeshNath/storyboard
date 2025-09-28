import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default props', () => {
      render(<Card data-testid="card">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('Card content')
      expect(card).toHaveClass('bg-card', 'text-card-foreground', 'flex', 'flex-col', 'gap-6', 'rounded-xl', 'border', 'shadow-sm', 'py-6')
    })

    it('renders with custom className', () => {
      render(<Card className="custom-class" data-testid="card">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
    })

    it('renders with additional props', () => {
      render(<Card data-testid="card" data-custom="test">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveAttribute('data-custom', 'test')
    })

    it('renders as div element', () => {
      render(<Card data-testid="card">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card.tagName).toBe('DIV')
    })
  })

  describe('CardHeader', () => {
    it('renders with default props', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)
      
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('Header content')
      expect(header).toHaveClass('text-center', 'px-6')
    })

    it('renders with custom className', () => {
      render(<CardHeader className="custom-header" data-testid="header">Header content</CardHeader>)
      
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('custom-header')
    })

    it('renders with additional props', () => {
      render(<CardHeader data-testid="header" data-custom="header-test">Header content</CardHeader>)
      
      const header = screen.getByTestId('header')
      expect(header).toHaveAttribute('data-custom', 'header-test')
    })
  })

  describe('CardTitle', () => {
    it('renders with default props', () => {
      render(<CardTitle data-testid="title">Title content</CardTitle>)
      
      const title = screen.getByTestId('title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Title content')
      expect(title).toHaveClass('leading-none', 'font-semibold')
    })

    it('renders with custom className', () => {
      render(<CardTitle className="custom-title" data-testid="title">Title content</CardTitle>)
      
      const title = screen.getByTestId('title')
      expect(title).toHaveClass('custom-title')
    })

    it('renders with additional props', () => {
      render(<CardTitle data-testid="title" data-custom="title-test">Title content</CardTitle>)
      
      const title = screen.getByTestId('title')
      expect(title).toHaveAttribute('data-custom', 'title-test')
    })
  })

  describe('CardDescription', () => {
    it('renders with default props', () => {
      render(<CardDescription data-testid="description">Description content</CardDescription>)
      
      const description = screen.getByTestId('description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent('Description content')
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
    })

    it('renders with custom className', () => {
      render(<CardDescription className="custom-description" data-testid="description">Description content</CardDescription>)
      
      const description = screen.getByTestId('description')
      expect(description).toHaveClass('custom-description')
    })

    it('renders with additional props', () => {
      render(<CardDescription data-testid="description" data-custom="description-test">Description content</CardDescription>)
      
      const description = screen.getByTestId('description')
      expect(description).toHaveAttribute('data-custom', 'description-test')
    })
  })

  describe('CardContent', () => {
    it('renders with default props', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      
      const content = screen.getByTestId('content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveTextContent('Content')
      expect(content).toHaveClass('px-6')
    })

    it('renders with custom className', () => {
      render(<CardContent className="custom-content" data-testid="content">Content</CardContent>)
      
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders with additional props', () => {
      render(<CardContent data-testid="content" data-custom="content-test">Content</CardContent>)
      
      const content = screen.getByTestId('content')
      expect(content).toHaveAttribute('data-custom', 'content-test')
    })
  })

  describe('CardFooter', () => {
    it('renders with default props', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>)
      
      const footer = screen.getByTestId('footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveTextContent('Footer content')
      expect(footer).toHaveClass('flex', 'items-center', 'px-6', '[.border-t]:pt-6')
    })

    it('renders with custom className', () => {
      render(<CardFooter className="custom-footer" data-testid="footer">Footer content</CardFooter>)
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('custom-footer')
    })

    it('renders with additional props', () => {
      render(<CardFooter data-testid="footer" data-custom="footer-test">Footer content</CardFooter>)
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveAttribute('data-custom', 'footer-test')
    })
  })

  describe('CardAction', () => {
    it('renders with default props', () => {
      render(<CardAction data-testid="action">Action content</CardAction>)
      
      const action = screen.getByTestId('action')
      expect(action).toBeInTheDocument()
      expect(action).toHaveTextContent('Action content')
      expect(action).toHaveClass('col-start-2', 'row-span-2', 'row-start-1', 'self-start', 'justify-self-end')
    })

    it('renders with custom className', () => {
      render(<CardAction className="custom-action" data-testid="action">Action content</CardAction>)
      
      const action = screen.getByTestId('action')
      expect(action).toHaveClass('custom-action')
    })

    it('renders with additional props', () => {
      render(<CardAction data-testid="action" data-custom="action-test">Action content</CardAction>)
      
      const action = screen.getByTestId('action')
      expect(action).toHaveAttribute('data-custom', 'action-test')
    })
  })

  describe('Card Composition', () => {
    it('renders complete card structure', () => {
      render(
        <Card data-testid="complete-card">
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

      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card Description')).toBeInTheDocument()
      expect(screen.getByText('Card content goes here')).toBeInTheDocument()
      expect(screen.getByText('Action Button')).toBeInTheDocument()
    })

    it('renders card with action component', () => {
      render(
        <Card data-testid="card-with-action">
          <CardHeader>
            <CardTitle>Card with Action</CardTitle>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )

      expect(screen.getByTestId('card-with-action')).toBeInTheDocument()
      expect(screen.getByText('Card with Action')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Title</CardTitle>
            <CardDescription>Accessible Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Accessible content</p>
          </CardContent>
        </Card>
      )

      // All elements should be properly nested and accessible
      expect(screen.getByText('Accessible Title')).toBeInTheDocument()
      expect(screen.getByText('Accessible Description')).toBeInTheDocument()
      expect(screen.getByText('Accessible content')).toBeInTheDocument()
    })

    it('supports custom data attributes for testing', () => {
      render(
        <Card data-testid="accessible-card">
          <CardHeader data-testid="accessible-header">
            <CardTitle data-testid="accessible-title">Title</CardTitle>
          </CardHeader>
          <CardContent data-testid="accessible-content">
            Content
          </CardContent>
        </Card>
      )

      expect(screen.getByTestId('accessible-card')).toBeInTheDocument()
      expect(screen.getByTestId('accessible-header')).toBeInTheDocument()
      expect(screen.getByTestId('accessible-title')).toBeInTheDocument()
      expect(screen.getByTestId('accessible-content')).toBeInTheDocument()
    })
  })
})
