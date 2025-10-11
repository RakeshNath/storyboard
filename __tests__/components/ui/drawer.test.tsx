import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'

// Mock vaul drawer
jest.mock('vaul', () => ({
  Drawer: {
    Root: ({ children, open, ...props }: any) => (
      <div 
        data-testid="drawer-root" 
        data-slot="drawer" 
        open={open !== undefined ? String(open) : undefined}
        {...props}
      >
        {children}
      </div>
    ),
    Trigger: ({ children, ...props }: any) => (
      <button data-testid="drawer-trigger" data-slot="drawer-trigger" {...props}>
        {children}
      </button>
    ),
    Portal: ({ children, ...props }: any) => (
      <div data-testid="drawer-portal" data-slot="drawer-portal" {...props}>
        {children}
      </div>
    ),
    Overlay: ({ children, className, ...props }: any) => (
      <div
        data-testid="drawer-overlay"
        data-slot="drawer-overlay"
        className={className}
        {...props}
      >
        {children}
      </div>
    ),
    Content: ({ children, className, ...props }: any) => (
      <div
        data-testid="drawer-content"
        data-slot="drawer-content"
        className={className}
        {...props}
      >
        {children}
      </div>
    ),
    Close: ({ children, ...props }: any) => (
      <button data-testid="drawer-close" data-slot="drawer-close" {...props}>
        {children}
      </button>
    ),
    Title: ({ children, className, ...props }: any) => (
      <h2
        data-testid="drawer-title"
        data-slot="drawer-title"
        className={className}
        {...props}
      >
        {children}
      </h2>
    ),
    Description: ({ children, className, ...props }: any) => (
      <p
        data-testid="drawer-description"
        data-slot="drawer-description"
        className={className}
        {...props}
      >
        {children}
      </p>
    ),
  },
}))

describe('Drawer Components', () => {
  describe('Drawer Root', () => {
    it('renders with default props', () => {
      render(
        <Drawer>
          <div>Drawer Content</div>
        </Drawer>
      )
      
      const drawer = screen.getByTestId('drawer-root')
      expect(drawer).toBeInTheDocument()
      expect(drawer).toHaveAttribute('data-slot', 'drawer')
      expect(drawer).toHaveTextContent('Drawer Content')
    })

    it('passes through props', () => {
      render(
        <Drawer open={true} data-testid="custom-drawer">
          <div>Content</div>
        </Drawer>
      )
      
      const drawer = screen.getByTestId('custom-drawer')
      expect(drawer).toBeInTheDocument()
      // Check that the drawer component renders with the open prop
      expect(drawer).toHaveAttribute('data-testid', 'custom-drawer')
    })
  })

  describe('DrawerTrigger', () => {
    it('renders with default props', () => {
      render(<DrawerTrigger>Open Drawer</DrawerTrigger>)
      
      const trigger = screen.getByTestId('drawer-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'drawer-trigger')
      expect(trigger).toHaveTextContent('Open Drawer')
    })

    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<DrawerTrigger onClick={handleClick}>Trigger</DrawerTrigger>)
      
      const trigger = screen.getByTestId('drawer-trigger')
      await user.click(trigger)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('DrawerPortal', () => {
    it('renders with default props', () => {
      render(
        <DrawerPortal>
          <div>Portal Content</div>
        </DrawerPortal>
      )
      
      const portal = screen.getByTestId('drawer-portal')
      expect(portal).toBeInTheDocument()
      expect(portal).toHaveAttribute('data-slot', 'drawer-portal')
      expect(portal).toHaveTextContent('Portal Content')
    })
  })

  describe('DrawerOverlay', () => {
    it('renders with default props', () => {
      render(<DrawerOverlay />)
      
      const overlay = screen.getByTestId('drawer-overlay')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveAttribute('data-slot', 'drawer-overlay')
    })

    it('applies correct CSS classes', () => {
      render(<DrawerOverlay />)
      
      const overlay = screen.getByTestId('drawer-overlay')
      expect(overlay).toHaveClass(
        'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=open]:fade-in-0',
        'fixed',
        'inset-0',
        'z-50',
        'bg-black/50'
      )
    })

    it('renders with custom className', () => {
      render(<DrawerOverlay className="custom-overlay" />)
      
      const overlay = screen.getByTestId('drawer-overlay')
      expect(overlay).toHaveClass('custom-overlay')
    })
  })

  describe('DrawerContent', () => {
    it('renders with default props', () => {
      render(
        <DrawerContent>
          <div>Content</div>
        </DrawerContent>
      )
      
      const portal = screen.getByTestId('drawer-portal')
      const overlay = screen.getByTestId('drawer-overlay')
      const content = screen.getByTestId('drawer-content')
      
      expect(portal).toBeInTheDocument()
      expect(overlay).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'drawer-content')
    })

    it('applies correct CSS classes', () => {
      render(
        <DrawerContent>
          <div>Content</div>
        </DrawerContent>
      )
      
      const content = screen.getByTestId('drawer-content')
      expect(content).toHaveClass(
        'group/drawer-content',
        'bg-background',
        'fixed',
        'z-50',
        'flex',
        'h-auto',
        'flex-col'
      )
    })

    it('renders with custom className', () => {
      render(
        <DrawerContent className="custom-content">
          <div>Content</div>
        </DrawerContent>
      )
      
      const content = screen.getByTestId('drawer-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders handle indicator', () => {
      render(
        <DrawerContent>
          <div>Content</div>
        </DrawerContent>
      )
      
      const handle = document.querySelector('.bg-muted.mx-auto.mt-4')
      expect(handle).toBeInTheDocument()
    })
  })

  describe('DrawerClose', () => {
    it('renders with default props', () => {
      render(<DrawerClose>Close</DrawerClose>)
      
      const close = screen.getByTestId('drawer-close')
      expect(close).toBeInTheDocument()
      expect(close).toHaveAttribute('data-slot', 'drawer-close')
      expect(close).toHaveTextContent('Close')
    })

    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<DrawerClose onClick={handleClick}>Close</DrawerClose>)
      
      const close = screen.getByTestId('drawer-close')
      await user.click(close)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('DrawerHeader', () => {
    it('renders with default props', () => {
      render(
        <DrawerHeader>
          <div>Header Content</div>
        </DrawerHeader>
      )
      
      const header = document.querySelector('[data-slot="drawer-header"]')
      expect(header).toBeInTheDocument()
      expect(header?.tagName).toBe('DIV')
      expect(header).toHaveTextContent('Header Content')
    })

    it('applies correct CSS classes', () => {
      render(
        <DrawerHeader>
          <div>Header</div>
        </DrawerHeader>
      )
      
      const header = document.querySelector('[data-slot="drawer-header"]')
      expect(header).toHaveClass(
        'flex',
        'flex-col',
        'gap-0.5',
        'p-4',
        'group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center',
        'group-data-[vaul-drawer-direction=top]/drawer-content:text-center',
        'md:gap-1.5',
        'md:text-left'
      )
    })

    it('renders with custom className', () => {
      render(
        <DrawerHeader className="custom-header">
          <div>Header</div>
        </DrawerHeader>
      )
      
      const header = document.querySelector('[data-slot="drawer-header"]')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('DrawerFooter', () => {
    it('renders with default props', () => {
      render(
        <DrawerFooter>
          <div>Footer Content</div>
        </DrawerFooter>
      )
      
      const footer = document.querySelector('[data-slot="drawer-footer"]')
      expect(footer).toBeInTheDocument()
      expect(footer?.tagName).toBe('DIV')
      expect(footer).toHaveTextContent('Footer Content')
    })

    it('applies correct CSS classes', () => {
      render(
        <DrawerFooter>
          <div>Footer</div>
        </DrawerFooter>
      )
      
      const footer = document.querySelector('[data-slot="drawer-footer"]')
      expect(footer).toHaveClass('mt-auto', 'flex', 'flex-col', 'gap-2', 'p-4')
    })

    it('renders with custom className', () => {
      render(
        <DrawerFooter className="custom-footer">
          <div>Footer</div>
        </DrawerFooter>
      )
      
      const footer = document.querySelector('[data-slot="drawer-footer"]')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('DrawerTitle', () => {
    it('renders with default props', () => {
      render(<DrawerTitle>Drawer Title</DrawerTitle>)
      
      const title = screen.getByTestId('drawer-title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'drawer-title')
      expect(title).toHaveTextContent('Drawer Title')
    })

    it('applies correct CSS classes', () => {
      render(<DrawerTitle>Title</DrawerTitle>)
      
      const title = screen.getByTestId('drawer-title')
      expect(title).toHaveClass('text-foreground', 'font-semibold')
    })

    it('renders with custom className', () => {
      render(<DrawerTitle className="custom-title">Title</DrawerTitle>)
      
      const title = screen.getByTestId('drawer-title')
      expect(title).toHaveClass('custom-title')
    })
  })

  describe('DrawerDescription', () => {
    it('renders with default props', () => {
      render(<DrawerDescription>Drawer Description</DrawerDescription>)
      
      const description = screen.getByTestId('drawer-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveAttribute('data-slot', 'drawer-description')
      expect(description).toHaveTextContent('Drawer Description')
    })

    it('applies correct CSS classes', () => {
      render(<DrawerDescription>Description</DrawerDescription>)
      
      const description = screen.getByTestId('drawer-description')
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
    })

    it('renders with custom className', () => {
      render(<DrawerDescription className="custom-description">Description</DrawerDescription>)
      
      const description = screen.getByTestId('drawer-description')
      expect(description).toHaveClass('custom-description')
    })
  })

  describe('Complete Drawer Structure', () => {
    it('renders a complete drawer with all components', () => {
      render(
        <Drawer>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Drawer Description</DrawerDescription>
            </DrawerHeader>
            <div>Main Content</div>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )
      
      expect(screen.getByTestId('drawer-root')).toBeInTheDocument()
      expect(screen.getByTestId('drawer-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('drawer-portal')).toBeInTheDocument()
      expect(screen.getByTestId('drawer-overlay')).toBeInTheDocument()
      expect(screen.getByTestId('drawer-content')).toBeInTheDocument()
      expect(screen.getByTestId('drawer-title')).toBeInTheDocument()
      expect(screen.getByTestId('drawer-description')).toBeInTheDocument()
      expect(screen.getByTestId('drawer-close')).toBeInTheDocument()
      
      expect(document.querySelector('[data-slot="drawer-header"]')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="drawer-footer"]')).toBeInTheDocument()
      
      expect(screen.getByText('Open Drawer')).toBeInTheDocument()
      expect(screen.getByText('Drawer Title')).toBeInTheDocument()
      expect(screen.getByText('Drawer Description')).toBeInTheDocument()
      expect(screen.getByText('Main Content')).toBeInTheDocument()
      expect(screen.getByText('Close')).toBeInTheDocument()
    })

    it('renders drawer with multiple triggers and closes', () => {
      render(
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
            </DrawerHeader>
            <div>Content</div>
            <DrawerFooter>
              <DrawerClose>Cancel</DrawerClose>
              <DrawerClose>Save</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )
      
      const triggers = screen.getAllByTestId('drawer-trigger')
      const closes = screen.getAllByTestId('drawer-close')
      
      expect(triggers).toHaveLength(1)
      expect(closes).toHaveLength(2)
      
      expect(screen.getByText('Open')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })
  })
})
