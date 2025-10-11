import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

// Mock Radix UI Tooltip
jest.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children, delayDuration, disableHoverableContent, ...props }: any) => (
    <div
      data-testid="tooltip-provider"
      data-slot="tooltip-provider"
      data-delay-duration={delayDuration}
      disableHoverableContent={disableHoverableContent ? 'true' : undefined}
      {...props}
    >
      {children}
    </div>
  ),
  Root: ({ children, open, ...props }: any) => (
    <div 
      data-testid="tooltip-root" 
      data-slot="tooltip" 
      open={open !== undefined ? String(open) : undefined}
      {...props}
    >
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="tooltip-trigger" data-slot="tooltip-trigger" {...props}>
      {children}
    </button>
  ),
  Content: ({ children, className, sideOffset, ...props }: any) => (
    <div
      data-testid="tooltip-content"
      data-slot="tooltip-content"
      className={className}
      data-side-offset={sideOffset}
      {...props}
    >
      {children}
    </div>
  ),
  Portal: ({ children }: any) => <div data-testid="tooltip-portal">{children}</div>,
  Arrow: ({ className }: any) => (
    <div data-testid="tooltip-arrow" className={className} />
  ),
}))

describe('Tooltip Components', () => {
  describe('TooltipProvider', () => {
    it('renders with default props', () => {
      render(
        <TooltipProvider>
          <div>Provider Content</div>
        </TooltipProvider>
      )
      
      const provider = screen.getByTestId('tooltip-provider')
      expect(provider).toBeInTheDocument()
      expect(provider).toHaveAttribute('data-slot', 'tooltip-provider')
      expect(provider).toHaveAttribute('data-delay-duration', '0')
      expect(provider).toHaveTextContent('Provider Content')
    })

    it('renders with custom delayDuration', () => {
      render(
        <TooltipProvider delayDuration={500}>
          <div>Provider Content</div>
        </TooltipProvider>
      )
      
      const provider = screen.getByTestId('tooltip-provider')
      expect(provider).toHaveAttribute('data-delay-duration', '500')
    })

    it('passes through additional props', () => {
      render(
        <TooltipProvider 
          data-testid="custom-provider"
          data-custom="value"
          disableHoverableContent={true}
        >
          <div>Content</div>
        </TooltipProvider>
      )
      
      const provider = screen.getByTestId('custom-provider')
      expect(provider).toHaveAttribute('data-custom', 'value')
      expect(provider).toHaveAttribute('disableHoverableContent', 'true')
    })
  })

  describe('Tooltip Root', () => {
    it('renders with TooltipProvider wrapper', () => {
      render(
        <Tooltip>
          <div>Tooltip Content</div>
        </Tooltip>
      )
      
      const provider = screen.getByTestId('tooltip-provider')
      const tooltip = screen.getByTestId('tooltip-root')
      
      expect(provider).toBeInTheDocument()
      expect(tooltip).toBeInTheDocument()
      expect(tooltip).toHaveAttribute('data-slot', 'tooltip')
      expect(tooltip).toHaveTextContent('Tooltip Content')
    })

    it('passes through props to root', () => {
      render(
        <Tooltip open={true} data-testid="custom-tooltip">
          <div>Content</div>
        </Tooltip>
      )
      
      const tooltip = screen.getByTestId('custom-tooltip')
      expect(tooltip).toBeInTheDocument()
      // Check that the tooltip component renders and accepts props
      expect(tooltip).toHaveAttribute('data-testid', 'custom-tooltip')
    })
  })

  describe('TooltipTrigger', () => {
    it('renders with default props', () => {
      render(<TooltipTrigger>Trigger Button</TooltipTrigger>)
      
      const trigger = screen.getByTestId('tooltip-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'tooltip-trigger')
      expect(trigger).toHaveTextContent('Trigger Button')
    })

    it('renders as a button element', () => {
      render(<TooltipTrigger>Trigger</TooltipTrigger>)
      
      const trigger = screen.getByTestId('tooltip-trigger')
      expect(trigger.tagName).toBe('BUTTON')
    })

    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<TooltipTrigger onClick={handleClick}>Trigger</TooltipTrigger>)
      
      const trigger = screen.getByTestId('tooltip-trigger')
      await user.click(trigger)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles hover events', async () => {
      const handleMouseEnter = jest.fn()
      const user = userEvent.setup()
      
      render(<TooltipTrigger onMouseEnter={handleMouseEnter}>Trigger</TooltipTrigger>)
      
      const trigger = screen.getByTestId('tooltip-trigger')
      await user.hover(trigger)
      
      expect(handleMouseEnter).toHaveBeenCalledTimes(1)
    })

    it('passes through additional props', () => {
      render(
        <TooltipTrigger 
          data-testid="custom-trigger"
          data-custom="value"
          disabled={true}
        >
          Trigger
        </TooltipTrigger>
      )
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toHaveAttribute('data-custom', 'value')
      expect(trigger).toBeDisabled()
    })
  })

  describe('TooltipContent', () => {
    it('renders with default props', () => {
      render(<TooltipContent>Tooltip Content</TooltipContent>)
      
      const portal = screen.getByTestId('tooltip-portal')
      const content = screen.getByTestId('tooltip-content')
      const arrow = screen.getByTestId('tooltip-arrow')
      
      expect(portal).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'tooltip-content')
      expect(content).toHaveTextContent('Tooltip Content')
      expect(arrow).toBeInTheDocument()
    })

    it('renders with default sideOffset', () => {
      render(<TooltipContent>Content</TooltipContent>)
      
      const content = screen.getByTestId('tooltip-content')
      expect(content).toHaveAttribute('data-side-offset', '0')
    })

    it('renders with custom sideOffset', () => {
      render(<TooltipContent sideOffset={10}>Content</TooltipContent>)
      
      const content = screen.getByTestId('tooltip-content')
      expect(content).toHaveAttribute('data-side-offset', '10')
    })

    it('applies correct CSS classes', () => {
      render(<TooltipContent>Content</TooltipContent>)
      
      const content = screen.getByTestId('tooltip-content')
      expect(content).toHaveClass(
        'bg-primary',
        'text-primary-foreground',
        'animate-in',
        'fade-in-0',
        'zoom-in-95',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        'z-50',
        'w-fit',
        'origin-(--radix-tooltip-content-transform-origin)',
        'rounded-md',
        'px-3',
        'py-1.5',
        'text-xs',
        'text-balance'
      )
    })

    it('renders with custom className', () => {
      render(<TooltipContent className="custom-content">Content</TooltipContent>)
      
      const content = screen.getByTestId('tooltip-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders arrow with correct classes', () => {
      render(<TooltipContent>Content</TooltipContent>)
      
      const arrow = screen.getByTestId('tooltip-arrow')
      expect(arrow).toHaveClass(
        'bg-primary',
        'fill-primary',
        'z-50',
        'size-2.5',
        'translate-y-[calc(-50%_-_2px)]',
        'rotate-45',
        'rounded-[2px]'
      )
    })

    it('passes through additional props', () => {
      render(
        <TooltipContent 
          data-testid="custom-content"
          data-custom="value"
          side="top"
        >
          Content
        </TooltipContent>
      )
      
      const content = screen.getByTestId('custom-content')
      expect(content).toHaveAttribute('data-custom', 'value')
      expect(content).toHaveAttribute('side', 'top')
    })

    it('renders with complex content', () => {
      render(
        <TooltipContent>
          <div>
            <strong>Bold text</strong>
            <span>Regular text</span>
          </div>
        </TooltipContent>
      )
      
      const content = screen.getByTestId('tooltip-content')
      expect(content).toHaveTextContent('Bold text')
      expect(content).toHaveTextContent('Regular text')
    })
  })

  describe('Complete Tooltip Structure', () => {
    it('renders a complete tooltip with all components', () => {
      render(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>This is a tooltip</TooltipContent>
        </Tooltip>
      )
      
      const provider = screen.getByTestId('tooltip-provider')
      const tooltip = screen.getByTestId('tooltip-root')
      const trigger = screen.getByTestId('tooltip-trigger')
      const portal = screen.getByTestId('tooltip-portal')
      const content = screen.getByTestId('tooltip-content')
      const arrow = screen.getByTestId('tooltip-arrow')
      
      expect(provider).toBeInTheDocument()
      expect(tooltip).toBeInTheDocument()
      expect(trigger).toBeInTheDocument()
      expect(portal).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(arrow).toBeInTheDocument()
      
      expect(trigger).toHaveTextContent('Hover me')
      expect(content).toHaveTextContent('This is a tooltip')
    })

    it('renders tooltip with custom configuration', () => {
      render(
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger disabled>Disabled Trigger</TooltipTrigger>
            <TooltipContent sideOffset={5} side="bottom">
              Bottom tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      
      const providers = screen.getAllByTestId('tooltip-provider')
      expect(providers).toHaveLength(2) // Outer provider + inner provider from Tooltip
      const provider = providers[0] // Use the outer provider
      const trigger = screen.getByTestId('tooltip-trigger')
      const content = screen.getByTestId('tooltip-content')
      
      expect(provider).toHaveAttribute('data-delay-duration', '300')
      expect(trigger).toBeDisabled()
      expect(trigger).toHaveTextContent('Disabled Trigger')
      expect(content).toHaveAttribute('data-side-offset', '5')
      expect(content).toHaveAttribute('side', 'bottom')
      expect(content).toHaveTextContent('Bottom tooltip')
    })

    it('renders multiple tooltips', () => {
      render(
        <div>
          <Tooltip>
            <TooltipTrigger>First</TooltipTrigger>
            <TooltipContent>First tooltip</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>Second</TooltipTrigger>
            <TooltipContent>Second tooltip</TooltipContent>
          </Tooltip>
        </div>
      )
      
      const triggers = screen.getAllByTestId('tooltip-trigger')
      const contents = screen.getAllByTestId('tooltip-content')
      
      expect(triggers).toHaveLength(2)
      expect(contents).toHaveLength(2)
      
      expect(triggers[0]).toHaveTextContent('First')
      expect(triggers[1]).toHaveTextContent('Second')
      expect(contents[0]).toHaveTextContent('First tooltip')
      expect(contents[1]).toHaveTextContent('Second tooltip')
    })

    it('handles tooltip without content', () => {
      render(
        <Tooltip>
          <TooltipTrigger>Trigger only</TooltipTrigger>
        </Tooltip>
      )
      
      const trigger = screen.getByTestId('tooltip-trigger')
      const content = screen.queryByTestId('tooltip-content')
      
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveTextContent('Trigger only')
      expect(content).toBeNull()
    })
  })
})
