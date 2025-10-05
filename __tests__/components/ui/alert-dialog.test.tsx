import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

// Mock Radix UI Alert Dialog components
jest.mock('@radix-ui/react-alert-dialog', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog" data-slot="alert-dialog" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="alert-dialog-trigger" data-slot="alert-dialog-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog-portal" data-slot="alert-dialog-portal" {...props}>
      {children}
    </div>
  ),
  Overlay: ({ children, className, ...props }: any) => (
    <div
      data-testid="alert-dialog-overlay"
      data-slot="alert-dialog-overlay"
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Content: ({ children, className, ...props }: any) => (
    <div
      data-testid="alert-dialog-content"
      data-slot="alert-dialog-content"
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Title: ({ children, className, ...props }: any) => (
    <h2
      data-testid="alert-dialog-title"
      data-slot="alert-dialog-title"
      className={className}
      {...props}
    >
      {children}
    </h2>
  ),
  Description: ({ children, className, ...props }: any) => (
    <p
      data-testid="alert-dialog-description"
      data-slot="alert-dialog-description"
      className={className}
      {...props}
    >
      {children}
    </p>
  ),
  Action: ({ children, className, ...props }: any) => (
    <button
      data-testid="alert-dialog-action"
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  Cancel: ({ children, className, ...props }: any) => (
    <button
      data-testid="alert-dialog-cancel"
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}))

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

// Mock the buttonVariants function
jest.mock('@/components/ui/button', () => ({
  buttonVariants: jest.fn((options?: any) => {
    if (options?.variant === 'outline') {
      return 'button-outline-variant'
    }
    return 'button-default-variant'
  }),
}))

describe('Alert Dialog Components', () => {
  describe('AlertDialog', () => {
    it('renders with default props', () => {
      render(<AlertDialog />)
      const alertDialog = screen.getByTestId('alert-dialog')
      expect(alertDialog).toBeInTheDocument()
      expect(alertDialog).toHaveAttribute('data-slot', 'alert-dialog')
    })

    it('renders children', () => {
      render(
        <AlertDialog>
          <div>Alert Dialog Content</div>
        </AlertDialog>
      )
      expect(screen.getByText('Alert Dialog Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<AlertDialog data-testid="custom-alert-dialog" />)
      expect(screen.getByTestId('custom-alert-dialog')).toBeInTheDocument()
    })
  })

  describe('AlertDialogTrigger', () => {
    it('renders with default props', () => {
      render(<AlertDialogTrigger>Open Alert</AlertDialogTrigger>)
      const trigger = screen.getByTestId('alert-dialog-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'alert-dialog-trigger')
      expect(trigger).toHaveTextContent('Open Alert')
    })

    it('renders children', () => {
      render(<AlertDialogTrigger>Click me</AlertDialogTrigger>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<AlertDialogTrigger data-testid="custom-trigger">Trigger</AlertDialogTrigger>)
      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
    })
  })

  describe('AlertDialogPortal', () => {
    it('renders with default props', () => {
      render(
        <AlertDialogPortal>
          <div>Portal Content</div>
        </AlertDialogPortal>
      )
      const portal = screen.getByTestId('alert-dialog-portal')
      expect(portal).toBeInTheDocument()
      expect(portal).toHaveAttribute('data-slot', 'alert-dialog-portal')
      expect(portal).toHaveTextContent('Portal Content')
    })

    it('renders children', () => {
      render(
        <AlertDialogPortal>
          <div>Test Portal</div>
        </AlertDialogPortal>
      )
      expect(screen.getByText('Test Portal')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <AlertDialogPortal data-testid="custom-portal">
          <div>Portal</div>
        </AlertDialogPortal>
      )
      expect(screen.getByTestId('custom-portal')).toBeInTheDocument()
    })
  })

  describe('AlertDialogOverlay', () => {
    it('renders with default props', () => {
      render(<AlertDialogOverlay />)
      const overlay = screen.getByTestId('alert-dialog-overlay')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveAttribute('data-slot', 'alert-dialog-overlay')
    })

    it('renders with custom className', () => {
      render(<AlertDialogOverlay className="custom-overlay" />)
      const overlay = screen.getByTestId('alert-dialog-overlay')
      expect(overlay).toHaveClass('custom-overlay')
    })

    it('passes through additional props', () => {
      render(<AlertDialogOverlay data-testid="custom-overlay" />)
      expect(screen.getByTestId('custom-overlay')).toBeInTheDocument()
    })
  })

  describe('AlertDialogContent', () => {
    it('renders with default props', () => {
      render(
        <AlertDialogContent>
          <div>Content</div>
        </AlertDialogContent>
      )
      const content = screen.getByTestId('alert-dialog-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'alert-dialog-content')
      expect(screen.getByTestId('alert-dialog-portal')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-overlay')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <AlertDialogContent className="custom-content">
          <div>Content</div>
        </AlertDialogContent>
      )
      const content = screen.getByTestId('alert-dialog-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders children', () => {
      render(
        <AlertDialogContent>
          <div>Test Content</div>
        </AlertDialogContent>
      )
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <AlertDialogContent data-testid="custom-content">
          <div>Content</div>
        </AlertDialogContent>
      )
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })
  })

  describe('AlertDialogHeader', () => {
    it('renders with default props', () => {
      render(
        <AlertDialogHeader>
          <div>Header Content</div>
        </AlertDialogHeader>
      )
      const header = screen.getByTestId('alert-dialog-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveAttribute('data-slot', 'alert-dialog-header')
      expect(header).toHaveTextContent('Header Content')
    })

    it('renders with custom className', () => {
      render(
        <AlertDialogHeader className="custom-header">
          <div>Header</div>
        </AlertDialogHeader>
      )
      const header = screen.getByTestId('alert-dialog-header')
      expect(header).toHaveClass('custom-header')
    })

    it('renders children', () => {
      render(
        <AlertDialogHeader>
          <div>Test Header</div>
        </AlertDialogHeader>
      )
      expect(screen.getByText('Test Header')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <AlertDialogHeader data-testid="custom-header">
          <div>Header</div>
        </AlertDialogHeader>
      )
      expect(screen.getByTestId('custom-header')).toBeInTheDocument()
    })
  })

  describe('AlertDialogFooter', () => {
    it('renders with default props', () => {
      render(
        <AlertDialogFooter>
          <div>Footer Content</div>
        </AlertDialogFooter>
      )
      const footer = screen.getByTestId('alert-dialog-footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveAttribute('data-slot', 'alert-dialog-footer')
      expect(footer).toHaveTextContent('Footer Content')
    })

    it('renders with custom className', () => {
      render(
        <AlertDialogFooter className="custom-footer">
          <div>Footer</div>
        </AlertDialogFooter>
      )
      const footer = screen.getByTestId('alert-dialog-footer')
      expect(footer).toHaveClass('custom-footer')
    })

    it('renders children', () => {
      render(
        <AlertDialogFooter>
          <div>Test Footer</div>
        </AlertDialogFooter>
      )
      expect(screen.getByText('Test Footer')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <AlertDialogFooter data-testid="custom-footer">
          <div>Footer</div>
        </AlertDialogFooter>
      )
      expect(screen.getByTestId('custom-footer')).toBeInTheDocument()
    })
  })

  describe('AlertDialogTitle', () => {
    it('renders with default props', () => {
      render(<AlertDialogTitle>Alert Title</AlertDialogTitle>)
      const title = screen.getByTestId('alert-dialog-title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'alert-dialog-title')
      expect(title).toHaveTextContent('Alert Title')
    })

    it('renders with custom className', () => {
      render(<AlertDialogTitle className="custom-title">Title</AlertDialogTitle>)
      const title = screen.getByTestId('alert-dialog-title')
      expect(title).toHaveClass('custom-title')
    })

    it('renders children', () => {
      render(<AlertDialogTitle>Test Title</AlertDialogTitle>)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<AlertDialogTitle data-testid="custom-title">Title</AlertDialogTitle>)
      expect(screen.getByTestId('custom-title')).toBeInTheDocument()
    })
  })

  describe('AlertDialogDescription', () => {
    it('renders with default props', () => {
      render(<AlertDialogDescription>Alert Description</AlertDialogDescription>)
      const description = screen.getByTestId('alert-dialog-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveAttribute('data-slot', 'alert-dialog-description')
      expect(description).toHaveTextContent('Alert Description')
    })

    it('renders with custom className', () => {
      render(<AlertDialogDescription className="custom-description">Description</AlertDialogDescription>)
      const description = screen.getByTestId('alert-dialog-description')
      expect(description).toHaveClass('custom-description')
    })

    it('renders children', () => {
      render(<AlertDialogDescription>Test Description</AlertDialogDescription>)
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<AlertDialogDescription data-testid="custom-description">Description</AlertDialogDescription>)
      expect(screen.getByTestId('custom-description')).toBeInTheDocument()
    })
  })

  describe('AlertDialogAction', () => {
    it('renders with default props', () => {
      render(<AlertDialogAction>Confirm</AlertDialogAction>)
      const action = screen.getByTestId('alert-dialog-action')
      expect(action).toBeInTheDocument()
      expect(action).toHaveTextContent('Confirm')
      expect(action).toHaveClass('button-default-variant')
    })

    it('renders with custom className', () => {
      render(<AlertDialogAction className="custom-action">Action</AlertDialogAction>)
      const action = screen.getByTestId('alert-dialog-action')
      expect(action).toHaveClass('custom-action')
    })

    it('renders children', () => {
      render(<AlertDialogAction>Test Action</AlertDialogAction>)
      expect(screen.getByText('Test Action')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<AlertDialogAction data-testid="custom-action">Action</AlertDialogAction>)
      expect(screen.getByTestId('custom-action')).toBeInTheDocument()
    })
  })

  describe('AlertDialogCancel', () => {
    it('renders with default props', () => {
      render(<AlertDialogCancel>Cancel</AlertDialogCancel>)
      const cancel = screen.getByTestId('alert-dialog-cancel')
      expect(cancel).toBeInTheDocument()
      expect(cancel).toHaveTextContent('Cancel')
      expect(cancel).toHaveClass('button-outline-variant')
    })

    it('renders with custom className', () => {
      render(<AlertDialogCancel className="custom-cancel">Cancel</AlertDialogCancel>)
      const cancel = screen.getByTestId('alert-dialog-cancel')
      expect(cancel).toHaveClass('custom-cancel')
    })

    it('renders children', () => {
      render(<AlertDialogCancel>Test Cancel</AlertDialogCancel>)
      expect(screen.getByText('Test Cancel')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<AlertDialogCancel data-testid="custom-cancel">Cancel</AlertDialogCancel>)
      expect(screen.getByTestId('custom-cancel')).toBeInTheDocument()
    })
  })

  describe('Complete Alert Dialog Structure', () => {
    it('renders a complete alert dialog', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByTestId('alert-dialog')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-content')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-portal')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-overlay')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-header')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-title')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-description')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-footer')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-cancel')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-action')).toBeInTheDocument()

      expect(screen.getByText('Open Alert')).toBeInTheDocument()
      expect(screen.getByText('Are you sure?')).toBeInTheDocument()
      expect(screen.getByText('This action cannot be undone. This will permanently delete your account.')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Continue')).toBeInTheDocument()
    })

    it('renders alert dialog with only action button', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Success!</AlertDialogTitle>
              <AlertDialogDescription>
                Your action has been completed successfully.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByTestId('alert-dialog-content')).toBeInTheDocument()
      expect(screen.getByTestId('alert-dialog-action')).toBeInTheDocument()
      expect(screen.getByText('OK')).toBeInTheDocument()
    })

    it('renders alert dialog with custom button variants', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Custom Buttons</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="custom-cancel-class">Custom Cancel</AlertDialogCancel>
              <AlertDialogAction className="custom-action-class">Custom Action</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      const cancelButton = screen.getByTestId('alert-dialog-cancel')
      const actionButton = screen.getByTestId('alert-dialog-action')
      
      expect(cancelButton).toHaveClass('custom-cancel-class')
      expect(actionButton).toHaveClass('custom-action-class')
      expect(screen.getByText('Custom Cancel')).toBeInTheDocument()
      expect(screen.getByText('Custom Action')).toBeInTheDocument()
    })
  })
})
