import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from '@/components/ui/toast'

// Mock Radix UI Toast
jest.mock('@radix-ui/react-toast', () => ({
  Provider: ({ children }: any) => <div data-testid="toast-provider">{children}</div>,
  Viewport: React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="toast-viewport"
      className={className}
      {...props}
    >
      {children}
    </div>
  )),
  Root: React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="toast-root"
      className={className}
      {...props}
    >
      {children}
    </div>
  )),
  Action: React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <button
      ref={ref}
      data-testid="toast-action"
      className={className}
      {...props}
    >
      {children}
    </button>
  )),
  Close: React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <button
      ref={ref}
      data-testid="toast-close"
      className={className}
      {...props}
    >
      {children}
    </button>
  )),
  Title: React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="toast-title"
      className={className}
      {...props}
    >
      {children}
    </div>
  )),
  Description: React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="toast-description"
      className={className}
      {...props}
    >
      {children}
    </div>
  )),
}))

// Mock Lucide React X icon
jest.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon">×</span>,
}))

describe('Toast Components', () => {
  describe('ToastProvider', () => {
    it('renders with children', () => {
      render(
        <ToastProvider>
          <div>Toast Content</div>
        </ToastProvider>
      )
      
      const provider = screen.getByTestId('toast-provider')
      expect(provider).toBeInTheDocument()
      expect(provider).toHaveTextContent('Toast Content')
    })
  })

  describe('ToastViewport', () => {
    it('renders with default props', () => {
      render(
        <ToastViewport>
          <div>Viewport Content</div>
        </ToastViewport>
      )
      
      const viewport = screen.getByTestId('toast-viewport')
      expect(viewport).toBeInTheDocument()
      expect(viewport).toHaveTextContent('Viewport Content')
    })

    it('applies correct CSS classes', () => {
      render(<ToastViewport />)
      
      const viewport = screen.getByTestId('toast-viewport')
      expect(viewport).toHaveClass(
        'fixed',
        'top-0',
        'z-[100]',
        'flex',
        'max-h-screen',
        'w-full',
        'flex-col-reverse',
        'p-4',
        'sm:bottom-0',
        'sm:right-0',
        'sm:top-auto',
        'sm:flex-col',
        'md:max-w-[420px]'
      )
    })

    it('renders with custom className', () => {
      render(<ToastViewport className="custom-viewport" />)
      
      const viewport = screen.getByTestId('toast-viewport')
      expect(viewport).toHaveClass('custom-viewport')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ToastViewport ref={ref} />)
      
      expect(ref.current).toBeInTheDocument()
      expect(ref.current).toHaveAttribute('data-testid', 'toast-viewport')
    })
  })

  describe('Toast', () => {
    it('renders with default props', () => {
      render(
        <Toast>
          <ToastTitle>Toast Title</ToastTitle>
        </Toast>
      )
      
      const toast = screen.getByTestId('toast-root')
      expect(toast).toBeInTheDocument()
    })

    it('renders with default variant', () => {
      render(
        <Toast>
          <ToastTitle>Default Toast</ToastTitle>
        </Toast>
      )
      
      const toast = screen.getByTestId('toast-root')
      expect(toast).toHaveClass('border', 'bg-background', 'text-foreground')
    })

    it('renders with destructive variant', () => {
      render(
        <Toast variant="destructive">
          <ToastTitle>Error Toast</ToastTitle>
        </Toast>
      )
      
      const toast = screen.getByTestId('toast-root')
      expect(toast).toHaveClass(
        'destructive',
        'group',
        'border-destructive',
        'bg-destructive',
        'text-destructive-foreground'
      )
    })

    it('applies base CSS classes', () => {
      render(
        <Toast>
          <ToastTitle>Toast</ToastTitle>
        </Toast>
      )
      
      const toast = screen.getByTestId('toast-root')
      expect(toast).toHaveClass(
        'group',
        'pointer-events-auto',
        'relative',
        'flex',
        'w-full',
        'items-center',
        'justify-between',
        'space-x-4',
        'overflow-hidden',
        'rounded-md',
        'border',
        'p-6',
        'pr-8',
        'shadow-lg',
        'transition-all'
      )
    })

    it('renders with custom className', () => {
      render(
        <Toast className="custom-toast">
          <ToastTitle>Custom Toast</ToastTitle>
        </Toast>
      )
      
      const toast = screen.getByTestId('toast-root')
      expect(toast).toHaveClass('custom-toast')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Toast ref={ref}>
          <ToastTitle>Ref Toast</ToastTitle>
        </Toast>
      )
      
      expect(ref.current).toBeInTheDocument()
      expect(ref.current).toHaveAttribute('data-testid', 'toast-root')
    })
  })

  describe('ToastTitle', () => {
    it('renders with default props', () => {
      render(<ToastTitle>Toast Title</ToastTitle>)
      
      const title = screen.getByTestId('toast-title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Toast Title')
    })

    it('applies correct CSS classes', () => {
      render(<ToastTitle>Title</ToastTitle>)
      
      const title = screen.getByTestId('toast-title')
      expect(title).toHaveClass('text-sm', 'font-semibold')
    })

    it('renders with custom className', () => {
      render(<ToastTitle className="custom-title">Title</ToastTitle>)
      
      const title = screen.getByTestId('toast-title')
      expect(title).toHaveClass('custom-title')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ToastTitle ref={ref}>Title</ToastTitle>)
      
      expect(ref.current).toBeInTheDocument()
      expect(ref.current).toHaveAttribute('data-testid', 'toast-title')
    })
  })

  describe('ToastDescription', () => {
    it('renders with default props', () => {
      render(<ToastDescription>Toast Description</ToastDescription>)
      
      const description = screen.getByTestId('toast-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent('Toast Description')
    })

    it('applies correct CSS classes', () => {
      render(<ToastDescription>Description</ToastDescription>)
      
      const description = screen.getByTestId('toast-description')
      expect(description).toHaveClass('text-sm', 'opacity-90')
    })

    it('renders with custom className', () => {
      render(<ToastDescription className="custom-description">Description</ToastDescription>)
      
      const description = screen.getByTestId('toast-description')
      expect(description).toHaveClass('custom-description')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ToastDescription ref={ref}>Description</ToastDescription>)
      
      expect(ref.current).toBeInTheDocument()
      expect(ref.current).toHaveAttribute('data-testid', 'toast-description')
    })
  })

  describe('ToastAction', () => {
    it('renders with default props', () => {
      render(<ToastAction>Action</ToastAction>)
      
      const action = screen.getByTestId('toast-action')
      expect(action).toBeInTheDocument()
      expect(action).toHaveTextContent('Action')
    })

    it('applies correct CSS classes', () => {
      render(<ToastAction>Action</ToastAction>)
      
      const action = screen.getByTestId('toast-action')
      expect(action).toHaveClass(
        'inline-flex',
        'h-8',
        'shrink-0',
        'items-center',
        'justify-center',
        'rounded-md',
        'border',
        'bg-transparent',
        'px-3',
        'text-sm',
        'font-medium',
        'ring-offset-background',
        'transition-colors',
        'hover:bg-secondary',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-ring',
        'focus:ring-offset-2',
        'disabled:pointer-events-none',
        'disabled:opacity-50'
      )
    })

    it('renders with custom className', () => {
      render(<ToastAction className="custom-action">Action</ToastAction>)
      
      const action = screen.getByTestId('toast-action')
      expect(action).toHaveClass('custom-action')
    })

    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<ToastAction onClick={handleClick}>Action</ToastAction>)
      
      const action = screen.getByTestId('toast-action')
      await user.click(action)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<ToastAction ref={ref}>Action</ToastAction>)
      
      expect(ref.current).toBeInTheDocument()
      expect(ref.current).toHaveAttribute('data-testid', 'toast-action')
    })
  })

  describe('ToastClose', () => {
    it('renders with default props', () => {
      render(<ToastClose />)
      
      const close = screen.getByTestId('toast-close')
      const icon = screen.getByTestId('x-icon')
      
      expect(close).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveTextContent('×')
    })

    it('applies correct CSS classes', () => {
      render(<ToastClose />)
      
      const close = screen.getByTestId('toast-close')
      expect(close).toHaveClass(
        'absolute',
        'right-2',
        'top-2',
        'rounded-md',
        'p-1',
        'text-foreground/50',
        'opacity-0',
        'transition-opacity',
        'hover:text-foreground',
        'focus:opacity-100',
        'focus:outline-none',
        'focus:ring-2',
        'group-hover:opacity-100'
      )
    })

    it('renders with custom className', () => {
      render(<ToastClose className="custom-close" />)
      
      const close = screen.getByTestId('toast-close')
      expect(close).toHaveClass('custom-close')
    })

    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<ToastClose onClick={handleClick} />)
      
      const close = screen.getByTestId('toast-close')
      await user.click(close)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<ToastClose ref={ref} />)
      
      expect(ref.current).toBeInTheDocument()
      expect(ref.current).toHaveAttribute('data-testid', 'toast-close')
    })
  })

  describe('Complete Toast Structure', () => {
    it('renders a complete toast with all components', () => {
      render(
        <ToastProvider>
          <ToastViewport>
            <Toast>
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>Operation completed successfully</ToastDescription>
              <ToastAction>Undo</ToastAction>
              <ToastClose />
            </Toast>
          </ToastViewport>
        </ToastProvider>
      )
      
      expect(screen.getByTestId('toast-provider')).toBeInTheDocument()
      expect(screen.getByTestId('toast-viewport')).toBeInTheDocument()
      expect(screen.getByTestId('toast-root')).toBeInTheDocument()
      expect(screen.getByTestId('toast-title')).toBeInTheDocument()
      expect(screen.getByTestId('toast-description')).toBeInTheDocument()
      expect(screen.getByTestId('toast-action')).toBeInTheDocument()
      expect(screen.getByTestId('toast-close')).toBeInTheDocument()
      
      expect(screen.getByText('Success')).toBeInTheDocument()
      expect(screen.getByText('Operation completed successfully')).toBeInTheDocument()
      expect(screen.getByText('Undo')).toBeInTheDocument()
    })

    it('renders destructive toast with all components', () => {
      render(
        <ToastProvider>
          <ToastViewport>
            <Toast variant="destructive">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>Something went wrong</ToastDescription>
              <ToastAction>Retry</ToastAction>
              <ToastClose />
            </Toast>
          </ToastViewport>
        </ToastProvider>
      )
      
      const toast = screen.getByTestId('toast-root')
      expect(toast).toHaveClass('destructive')
      
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })
})
