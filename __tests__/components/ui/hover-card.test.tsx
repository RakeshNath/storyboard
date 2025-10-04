import React from 'react'
import { render, screen } from '@testing-library/react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'

// Mock Radix UI HoverCard
jest.mock('@radix-ui/react-hover-card', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="hover-card-root" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="hover-card-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="hover-card-portal" {...props}>
      {children}
    </div>
  ),
  Content: ({ children, className, align, sideOffset, ...props }: any) => (
    <div 
      data-testid="hover-card-content" 
      className={className}
      data-align={align}
      data-side-offset={sideOffset}
      {...props}
    >
      {children}
    </div>
  ),
}))

describe('HoverCard Components', () => {
  describe('HoverCard', () => {
    it('renders with default props', () => {
      render(<HoverCard />)
      
      const root = screen.getByTestId('hover-card-root')
      expect(root).toBeInTheDocument()
      expect(root).toHaveAttribute('data-slot', 'hover-card')
    })

    it('renders children', () => {
      render(
        <HoverCard>
          <div>Test Content</div>
        </HoverCard>
      )
      
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<HoverCard data-testid="custom-hover-card" />)
      
      const root = screen.getByTestId('custom-hover-card')
      expect(root).toBeInTheDocument()
    })
  })

  describe('HoverCardTrigger', () => {
    it('renders with default props', () => {
      render(<HoverCardTrigger>Trigger</HoverCardTrigger>)
      
      const trigger = screen.getByTestId('hover-card-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'hover-card-trigger')
      expect(trigger).toHaveTextContent('Trigger')
    })

    it('renders as button by default', () => {
      render(<HoverCardTrigger>Button Trigger</HoverCardTrigger>)
      
      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<HoverCardTrigger data-testid="custom-trigger">Trigger</HoverCardTrigger>)
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<HoverCardTrigger onClick={handleClick}>Clickable</HoverCardTrigger>)
      
      const trigger = screen.getByTestId('hover-card-trigger')
      trigger.click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('HoverCardContent', () => {
    it('renders with default props', () => {
      render(<HoverCardContent>Content</HoverCardContent>)
      
      const portal = screen.getByTestId('hover-card-portal')
      const content = screen.getByTestId('hover-card-content')
      
      expect(portal).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'hover-card-content')
      expect(content).toHaveAttribute('data-align', 'center')
      expect(content).toHaveAttribute('data-side-offset', '4')
      expect(content).toHaveTextContent('Content')
    })

    it('renders with custom align prop', () => {
      render(<HoverCardContent align="start">Content</HoverCardContent>)
      
      const content = screen.getByTestId('hover-card-content')
      expect(content).toHaveAttribute('data-align', 'start')
    })

    it('renders with custom sideOffset prop', () => {
      render(<HoverCardContent sideOffset={8}>Content</HoverCardContent>)
      
      const content = screen.getByTestId('hover-card-content')
      expect(content).toHaveAttribute('data-side-offset', '8')
    })

    it('renders with custom className', () => {
      render(<HoverCardContent className="custom-content">Content</HoverCardContent>)
      
      const content = screen.getByTestId('hover-card-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders with default CSS classes', () => {
      render(<HoverCardContent>Content</HoverCardContent>)
      
      const content = screen.getByTestId('hover-card-content')
      expect(content).toHaveClass(
        'bg-popover',
        'text-popover-foreground',
        'z-50',
        'w-64',
        'rounded-md',
        'border',
        'p-4',
        'shadow-md'
      )
    })

    it('passes through additional props', () => {
      render(<HoverCardContent data-testid="custom-content">Content</HoverCardContent>)
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(
        <HoverCardContent>
          <h3>Title</h3>
          <p>Description</p>
        </HoverCardContent>
      )
      
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })
  })

  describe('Complete HoverCard Structure', () => {
    it('renders a complete hover card', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>
            <h3>Card Title</h3>
            <p>Card content goes here</p>
          </HoverCardContent>
        </HoverCard>
      )
      
      expect(screen.getByTestId('hover-card-root')).toBeInTheDocument()
      expect(screen.getByTestId('hover-card-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('hover-card-portal')).toBeInTheDocument()
      expect(screen.getByTestId('hover-card-content')).toBeInTheDocument()
      expect(screen.getByText('Hover me')).toBeInTheDocument()
      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    })

    it('handles different align and sideOffset combinations', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Trigger</HoverCardTrigger>
          <HoverCardContent align="end" sideOffset={12}>
            End aligned content
          </HoverCardContent>
        </HoverCard>
      )
      
      const content = screen.getByTestId('hover-card-content')
      expect(content).toHaveAttribute('data-align', 'end')
      expect(content).toHaveAttribute('data-side-offset', '12')
    })
  })
})
