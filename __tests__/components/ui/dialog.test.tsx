import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// Mock Radix UI Dialog components
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="dialog" data-slot="dialog" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="dialog-trigger" data-slot="dialog-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="dialog-portal" data-slot="dialog-portal" {...props}>
      {children}
    </div>
  ),
  Close: ({ children, ...props }: any) => (
    <button data-testid="dialog-close" data-slot="dialog-close" {...props}>
      {children}
    </button>
  ),
  Overlay: ({ children, className, ...props }: any) => (
    <div
      data-testid="dialog-overlay"
      data-slot="dialog-overlay"
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Content: ({ children, className, ...props }: any) => (
    <div
      data-testid="dialog-content"
      data-slot="dialog-content"
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Title: ({ children, className, ...props }: any) => (
    <h2
      data-testid="dialog-title"
      data-slot="dialog-title"
      className={className}
      {...props}
    >
      {children}
    </h2>
  ),
  Description: ({ children, className, ...props }: any) => (
    <p
      data-testid="dialog-description"
      data-slot="dialog-description"
      className={className}
      {...props}
    >
      {children}
    </p>
  ),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  XIcon: (props: any) => <div data-testid="x-icon" {...props} />,
}))

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('Dialog Components', () => {
  describe('Dialog', () => {
    it('renders with default props', () => {
      render(<Dialog />)
      const dialog = screen.getByTestId('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveAttribute('data-slot', 'dialog')
    })

    it('renders children', () => {
      render(
        <Dialog>
          <div>Dialog Content</div>
        </Dialog>
      )
      expect(screen.getByText('Dialog Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<Dialog data-testid="custom-dialog" />)
      expect(screen.getByTestId('custom-dialog')).toBeInTheDocument()
    })
  })

  describe('DialogTrigger', () => {
    it('renders with default props', () => {
      render(<DialogTrigger>Open Dialog</DialogTrigger>)
      const trigger = screen.getByTestId('dialog-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'dialog-trigger')
      expect(trigger).toHaveTextContent('Open Dialog')
    })

    it('renders children', () => {
      render(<DialogTrigger>Click me</DialogTrigger>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DialogTrigger data-testid="custom-trigger">Trigger</DialogTrigger>)
      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
    })
  })

  describe('DialogPortal', () => {
    it('renders with default props', () => {
      render(
        <DialogPortal>
          <div>Portal Content</div>
        </DialogPortal>
      )
      const portal = screen.getByTestId('dialog-portal')
      expect(portal).toBeInTheDocument()
      expect(portal).toHaveAttribute('data-slot', 'dialog-portal')
      expect(portal).toHaveTextContent('Portal Content')
    })

    it('renders children', () => {
      render(
        <DialogPortal>
          <div>Test Portal</div>
        </DialogPortal>
      )
      expect(screen.getByText('Test Portal')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <DialogPortal data-testid="custom-portal">
          <div>Portal</div>
        </DialogPortal>
      )
      expect(screen.getByTestId('custom-portal')).toBeInTheDocument()
    })
  })

  describe('DialogClose', () => {
    it('renders with default props', () => {
      render(<DialogClose>Close</DialogClose>)
      const close = screen.getByTestId('dialog-close')
      expect(close).toBeInTheDocument()
      expect(close).toHaveAttribute('data-slot', 'dialog-close')
      expect(close).toHaveTextContent('Close')
    })

    it('renders children', () => {
      render(<DialogClose>X</DialogClose>)
      expect(screen.getByText('X')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DialogClose data-testid="custom-close">Close</DialogClose>)
      expect(screen.getByTestId('custom-close')).toBeInTheDocument()
    })
  })

  describe('DialogOverlay', () => {
    it('renders with default props', () => {
      render(<DialogOverlay />)
      const overlay = screen.getByTestId('dialog-overlay')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveAttribute('data-slot', 'dialog-overlay')
    })

    it('renders with custom className', () => {
      render(<DialogOverlay className="custom-overlay" />)
      const overlay = screen.getByTestId('dialog-overlay')
      expect(overlay).toHaveClass('custom-overlay')
    })

    it('passes through additional props', () => {
      render(<DialogOverlay data-testid="custom-overlay" />)
      expect(screen.getByTestId('custom-overlay')).toBeInTheDocument()
    })
  })

  describe('DialogContent', () => {
    it('renders with default props', () => {
      render(
        <DialogContent>
          <div>Content</div>
        </DialogContent>
      )
      const content = screen.getByTestId('dialog-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'dialog-content')
      expect(screen.getByTestId('dialog-portal')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-close')).toBeInTheDocument()
      expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <DialogContent className="custom-content">
          <div>Content</div>
        </DialogContent>
      )
      const content = screen.getByTestId('dialog-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders children', () => {
      render(
        <DialogContent>
          <div>Test Content</div>
        </DialogContent>
      )
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('renders without close button when showCloseButton is false', () => {
      render(
        <DialogContent showCloseButton={false}>
          <div>Content</div>
        </DialogContent>
      )
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-portal')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument()
      // Should not render the close button
      expect(screen.queryByTestId('dialog-close')).not.toBeInTheDocument()
    })

    it('renders with close button when showCloseButton is true', () => {
      render(
        <DialogContent showCloseButton={true}>
          <div>Content</div>
        </DialogContent>
      )
      expect(screen.getByTestId('dialog-close')).toBeInTheDocument()
      expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <DialogContent data-testid="custom-content">
          <div>Content</div>
        </DialogContent>
      )
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })
  })

  describe('DialogHeader', () => {
    it('renders with default props', () => {
      render(
        <DialogHeader>
          <div>Header Content</div>
        </DialogHeader>
      )
      const header = screen.getByTestId('dialog-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveAttribute('data-slot', 'dialog-header')
      expect(header).toHaveTextContent('Header Content')
    })

    it('renders with custom className', () => {
      render(
        <DialogHeader className="custom-header">
          <div>Header</div>
        </DialogHeader>
      )
      const header = screen.getByTestId('dialog-header')
      expect(header).toHaveClass('custom-header')
    })

    it('renders children', () => {
      render(
        <DialogHeader>
          <div>Test Header</div>
        </DialogHeader>
      )
      expect(screen.getByText('Test Header')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <DialogHeader data-testid="custom-header">
          <div>Header</div>
        </DialogHeader>
      )
      expect(screen.getByTestId('custom-header')).toBeInTheDocument()
    })
  })

  describe('DialogFooter', () => {
    it('renders with default props', () => {
      render(
        <DialogFooter>
          <div>Footer Content</div>
        </DialogFooter>
      )
      const footer = screen.getByTestId('dialog-footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveAttribute('data-slot', 'dialog-footer')
      expect(footer).toHaveTextContent('Footer Content')
    })

    it('renders with custom className', () => {
      render(
        <DialogFooter className="custom-footer">
          <div>Footer</div>
        </DialogFooter>
      )
      const footer = screen.getByTestId('dialog-footer')
      expect(footer).toHaveClass('custom-footer')
    })

    it('renders children', () => {
      render(
        <DialogFooter>
          <div>Test Footer</div>
        </DialogFooter>
      )
      expect(screen.getByText('Test Footer')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <DialogFooter data-testid="custom-footer">
          <div>Footer</div>
        </DialogFooter>
      )
      expect(screen.getByTestId('custom-footer')).toBeInTheDocument()
    })
  })

  describe('DialogTitle', () => {
    it('renders with default props', () => {
      render(<DialogTitle>Dialog Title</DialogTitle>)
      const title = screen.getByTestId('dialog-title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'dialog-title')
      expect(title).toHaveTextContent('Dialog Title')
    })

    it('renders with custom className', () => {
      render(<DialogTitle className="custom-title">Title</DialogTitle>)
      const title = screen.getByTestId('dialog-title')
      expect(title).toHaveClass('custom-title')
    })

    it('renders children', () => {
      render(<DialogTitle>Test Title</DialogTitle>)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DialogTitle data-testid="custom-title">Title</DialogTitle>)
      expect(screen.getByTestId('custom-title')).toBeInTheDocument()
    })
  })

  describe('DialogDescription', () => {
    it('renders with default props', () => {
      render(<DialogDescription>Dialog Description</DialogDescription>)
      const description = screen.getByTestId('dialog-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveAttribute('data-slot', 'dialog-description')
      expect(description).toHaveTextContent('Dialog Description')
    })

    it('renders with custom className', () => {
      render(<DialogDescription className="custom-description">Description</DialogDescription>)
      const description = screen.getByTestId('dialog-description')
      expect(description).toHaveClass('custom-description')
    })

    it('renders children', () => {
      render(<DialogDescription>Test Description</DialogDescription>)
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DialogDescription data-testid="custom-description">Description</DialogDescription>)
      expect(screen.getByTestId('custom-description')).toBeInTheDocument()
    })
  })

  describe('Complete Dialog Structure', () => {
    it('renders a complete dialog', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
            <div>Dialog Body</div>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <button>Save</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByTestId('dialog')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-portal')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-header')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-description')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-footer')).toBeInTheDocument()
      expect(screen.getAllByTestId('dialog-close')).toHaveLength(2) // Cancel button + automatic close button
      expect(screen.getByTestId('x-icon')).toBeInTheDocument()

      expect(screen.getByText('Open Dialog')).toBeInTheDocument()
      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
      expect(screen.getByText('Dialog Description')).toBeInTheDocument()
      expect(screen.getByText('Dialog Body')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('renders dialog without close button', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <div>Dialog Body</div>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-portal')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument()
      // Should not render the close button
      expect(screen.queryByTestId('dialog-close')).not.toBeInTheDocument()
    })

    it('renders dialog with custom close button', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <div>Dialog Body</div>
            <DialogClose>Custom Close</DialogClose>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
      expect(screen.getAllByTestId('dialog-close')).toHaveLength(2) // Custom close + automatic close button
      expect(screen.getByText('Custom Close')).toBeInTheDocument()
    })
  })
})
