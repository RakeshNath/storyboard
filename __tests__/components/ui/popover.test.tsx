import React from 'react'
import { render, screen } from '@testing-library/react'
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from '@/components/ui/popover'

// Mock Radix UI Popover
jest.mock('@radix-ui/react-popover', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="popover-root" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="popover-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="popover-portal" {...props}>
      {children}
    </div>
  ),
  Content: ({ children, className, align, sideOffset, ...props }: any) => (
    <div 
      data-testid="popover-content" 
      className={className}
      data-align={align}
      data-side-offset={sideOffset}
      {...props}
    >
      {children}
    </div>
  ),
  Anchor: ({ children, ...props }: any) => (
    <div data-testid="popover-anchor" {...props}>
      {children}
    </div>
  ),
}))

describe('Popover Components', () => {
  describe('Popover', () => {
    it('renders with default props', () => {
      render(<Popover />)
      
      const root = screen.getByTestId('popover-root')
      expect(root).toBeInTheDocument()
      expect(root).toHaveAttribute('data-slot', 'popover')
    })

    it('renders children', () => {
      render(
        <Popover>
          <div>Popover Content</div>
        </Popover>
      )
      
      expect(screen.getByText('Popover Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<Popover data-testid="custom-popover" />)
      
      const root = screen.getByTestId('custom-popover')
      expect(root).toBeInTheDocument()
    })
  })

  describe('PopoverTrigger', () => {
    it('renders with default props', () => {
      render(<PopoverTrigger>Trigger</PopoverTrigger>)
      
      const trigger = screen.getByTestId('popover-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'popover-trigger')
      expect(trigger).toHaveTextContent('Trigger')
    })

    it('renders as button by default', () => {
      render(<PopoverTrigger>Button Trigger</PopoverTrigger>)
      
      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<PopoverTrigger data-testid="custom-trigger">Trigger</PopoverTrigger>)
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<PopoverTrigger onClick={handleClick}>Clickable</PopoverTrigger>)
      
      const trigger = screen.getByTestId('popover-trigger')
      trigger.click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('PopoverContent', () => {
    it('renders with default props', () => {
      render(<PopoverContent>Content</PopoverContent>)
      
      const portal = screen.getByTestId('popover-portal')
      const content = screen.getByTestId('popover-content')
      
      expect(portal).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'popover-content')
      expect(content).toHaveAttribute('data-align', 'center')
      expect(content).toHaveAttribute('data-side-offset', '4')
      expect(content).toHaveTextContent('Content')
    })

    it('renders with custom align prop', () => {
      render(<PopoverContent align="start">Content</PopoverContent>)
      
      const content = screen.getByTestId('popover-content')
      expect(content).toHaveAttribute('data-align', 'start')
    })

    it('renders with custom sideOffset prop', () => {
      render(<PopoverContent sideOffset={8}>Content</PopoverContent>)
      
      const content = screen.getByTestId('popover-content')
      expect(content).toHaveAttribute('data-side-offset', '8')
    })

    it('renders with custom className', () => {
      render(<PopoverContent className="custom-content">Content</PopoverContent>)
      
      const content = screen.getByTestId('popover-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders with default CSS classes', () => {
      render(<PopoverContent>Content</PopoverContent>)
      
      const content = screen.getByTestId('popover-content')
      expect(content).toHaveClass(
        'bg-popover',
        'text-popover-foreground',
        'z-50',
        'w-72',
        'rounded-md',
        'border',
        'p-4',
        'shadow-md'
      )
    })

    it('passes through additional props', () => {
      render(<PopoverContent data-testid="custom-content">Content</PopoverContent>)
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(
        <PopoverContent>
          <h3>Title</h3>
          <p>Description</p>
        </PopoverContent>
      )
      
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })
  })

  describe('PopoverAnchor', () => {
    it('renders with default props', () => {
      render(<PopoverAnchor>Anchor</PopoverAnchor>)
      
      const anchor = screen.getByTestId('popover-anchor')
      expect(anchor).toBeInTheDocument()
      expect(anchor).toHaveAttribute('data-slot', 'popover-anchor')
      expect(anchor).toHaveTextContent('Anchor')
    })

    it('renders children', () => {
      render(
        <PopoverAnchor>
          <div>Anchor Content</div>
        </PopoverAnchor>
      )
      
      expect(screen.getByText('Anchor Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<PopoverAnchor data-testid="custom-anchor">Anchor</PopoverAnchor>)
      
      const anchor = screen.getByTestId('custom-anchor')
      expect(anchor).toBeInTheDocument()
    })
  })

  describe('Complete Popover Structure', () => {
    it('renders a complete popover', () => {
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>
            <h3>Popover Title</h3>
            <p>Popover content goes here</p>
          </PopoverContent>
        </Popover>
      )
      
      expect(screen.getByTestId('popover-root')).toBeInTheDocument()
      expect(screen.getByTestId('popover-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('popover-portal')).toBeInTheDocument()
      expect(screen.getByTestId('popover-content')).toBeInTheDocument()
      expect(screen.getByText('Open Popover')).toBeInTheDocument()
      expect(screen.getByText('Popover Title')).toBeInTheDocument()
      expect(screen.getByText('Popover content goes here')).toBeInTheDocument()
    })

    it('handles different align and sideOffset combinations', () => {
      render(
        <Popover>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent align="end" sideOffset={12}>
            End aligned content
          </PopoverContent>
        </Popover>
      )
      
      const content = screen.getByTestId('popover-content')
      expect(content).toHaveAttribute('data-align', 'end')
      expect(content).toHaveAttribute('data-side-offset', '12')
    })

    it('renders with anchor', () => {
      render(
        <Popover>
          <PopoverAnchor>Anchor Point</PopoverAnchor>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      
      expect(screen.getByTestId('popover-anchor')).toBeInTheDocument()
      expect(screen.getByText('Anchor Point')).toBeInTheDocument()
    })

    it('handles complex content structure', () => {
      render(
        <Popover>
          <PopoverTrigger>Settings</PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <h4 className="font-medium">Settings</h4>
              <div className="space-y-1">
                <button>Option 1</button>
                <button>Option 2</button>
                <button>Option 3</button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )
      
      expect(screen.getAllByText('Settings')).toHaveLength(2) // Trigger and content heading
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('handles empty content', () => {
      render(
        <Popover>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent />
        </Popover>
      )
      
      expect(screen.getByTestId('popover-content')).toBeInTheDocument()
      expect(screen.getByTestId('popover-content')).toHaveTextContent('')
    })
  })
})
