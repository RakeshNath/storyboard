import React from 'react'
import { render, screen } from '@testing-library/react'
import { Toaster } from '@/components/ui/toaster'

// Mock useToast hook
const mockToasts = [
  {
    id: '1',
    title: 'Success',
    description: 'Operation completed successfully',
    action: <button>Undo</button>,
    variant: 'default',
    open: true,
  },
  {
    id: '2',
    title: 'Error',
    description: 'Something went wrong',
    action: null,
    variant: 'destructive',
    open: true,
  },
  {
    id: '3',
    title: 'Warning',
    description: null,
    action: <button>Retry</button>,
    variant: 'default',
    open: false,
  },
]

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toasts: mockToasts,
    toast: jest.fn(),
    dismiss: jest.fn(),
  })),
}))

// Mock toast components
jest.mock('@/components/ui/toast', () => ({
  Toast: ({ children, open, ...props }: any) => {
    return (
      <div data-testid="toast" {...props} open={open !== undefined ? String(open) : undefined}>
        {children}
      </div>
    );
  },
  ToastClose: () => <button data-testid="toast-close">Close</button>,
  ToastDescription: ({ children }: any) => (
    <p data-testid="toast-description">{children}</p>
  ),
  ToastProvider: ({ children }: any) => (
    <div data-testid="toast-provider">{children}</div>
  ),
  ToastTitle: ({ children }: any) => (
    <h3 data-testid="toast-title">{children}</h3>
  ),
  ToastViewport: () => <div data-testid="toast-viewport">Viewport</div>,
}))

describe('Toaster Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with toast provider', () => {
    render(<Toaster />)
    
    const provider = screen.getByTestId('toast-provider')
    expect(provider).toBeInTheDocument()
  })

  it('renders toast viewport', () => {
    render(<Toaster />)
    
    const viewport = screen.getByTestId('toast-viewport')
    expect(viewport).toBeInTheDocument()
  })

  it('renders all toasts from useToast hook', () => {
    render(<Toaster />)
    
    const toasts = screen.getAllByTestId('toast')
    expect(toasts).toHaveLength(3)
  })

  it('renders toast with title and description', () => {
    render(<Toaster />)
    
    const successToast = screen.getByText('Success')
    const successDescription = screen.getByText('Operation completed successfully')
    
    expect(successToast).toBeInTheDocument()
    expect(successDescription).toBeInTheDocument()
  })

  it('renders toast with only title', () => {
    render(<Toaster />)
    
    const warningToast = screen.getByText('Warning')
    expect(warningToast).toBeInTheDocument()
  })

  it('renders toast with action button', () => {
    render(<Toaster />)
    
    const undoButton = screen.getByText('Undo')
    const retryButton = screen.getByText('Retry')
    
    expect(undoButton).toBeInTheDocument()
    expect(retryButton).toBeInTheDocument()
  })

  it('renders toast without action when action is null', () => {
    render(<Toaster />)
    
    const errorToast = screen.getByText('Error')
    expect(errorToast).toBeInTheDocument()
  })

  it('renders close button for each toast', () => {
    render(<Toaster />)
    
    const closeButtons = screen.getAllByTestId('toast-close')
    expect(closeButtons).toHaveLength(3)
  })

  it('passes toast props to Toast component', () => {
    render(<Toaster />)
    
    const toasts = screen.getAllByTestId('toast')
    
    // Check that each toast has the correct props
    expect(toasts[0]).toHaveAttribute('variant', 'default')
    expect(toasts[0]).toHaveAttribute('open', 'true')
    expect(toasts[1]).toHaveAttribute('variant', 'destructive')
    expect(toasts[1]).toHaveAttribute('open', 'true')
    expect(toasts[2]).toHaveAttribute('variant', 'default')
    expect(toasts[2]).toHaveAttribute('open', 'false')
  })

  it('renders toast with correct structure', () => {
    render(<Toaster />)
    
    const firstToast = screen.getAllByTestId('toast')[0]
    const title = screen.getAllByTestId('toast-title')[0]
    const description = screen.getAllByTestId('toast-description')[0]
    const closeButton = screen.getAllByTestId('toast-close')[0]
    
    expect(firstToast).toContainElement(title)
    expect(firstToast).toContainElement(description)
    expect(firstToast).toContainElement(closeButton)
  })

  it('handles empty toasts array', () => {
    const mockUseToast = require('@/hooks/use-toast').useToast
    mockUseToast.mockReturnValue({
      toasts: [],
      toast: jest.fn(),
      dismiss: jest.fn(),
    })
    
    render(<Toaster />)
    
    const toasts = screen.queryAllByTestId('toast')
    const provider = screen.getByTestId('toast-provider')
    const viewport = screen.getByTestId('toast-viewport')
    
    expect(toasts).toHaveLength(0)
    expect(provider).toBeInTheDocument()
    expect(viewport).toBeInTheDocument()
  })

  it('handles toast with missing title', () => {
    const mockUseToast = require('@/hooks/use-toast').useToast
    mockUseToast.mockReturnValue({
      toasts: [
        {
          id: '4',
          title: null,
          description: 'Description only',
          action: null,
          variant: 'default',
          open: true,
        },
      ],
      toast: jest.fn(),
      dismiss: jest.fn(),
    })
    
    render(<Toaster />)
    
    const description = screen.getByText('Description only')
    const titles = screen.queryAllByTestId('toast-title')
    
    expect(description).toBeInTheDocument()
    expect(titles).toHaveLength(0)
  })

  it('handles toast with missing description', () => {
    const mockUseToast = require('@/hooks/use-toast').useToast
    mockUseToast.mockReturnValue({
      toasts: [
        {
          id: '5',
          title: 'Title only',
          description: null,
          action: null,
          variant: 'default',
          open: true,
        },
      ],
      toast: jest.fn(),
      dismiss: jest.fn(),
    })
    
    render(<Toaster />)
    
    const title = screen.getByText('Title only')
    const descriptions = screen.queryAllByTestId('toast-description')
    
    expect(title).toBeInTheDocument()
    expect(descriptions).toHaveLength(0)
  })

  it('renders toast with complex action', () => {
    const mockUseToast = require('@/hooks/use-toast').useToast
    const complexAction = (
      <div>
        <button>Action 1</button>
        <button>Action 2</button>
      </div>
    )
    
    mockUseToast.mockReturnValue({
      toasts: [
        {
          id: '6',
          title: 'Complex Action',
          description: 'Multiple actions available',
          action: complexAction,
          variant: 'default',
          open: true,
        },
      ],
      toast: jest.fn(),
      dismiss: jest.fn(),
    })
    
    render(<Toaster />)
    
    expect(screen.getByText('Complex Action')).toBeInTheDocument()
    expect(screen.getByText('Multiple actions available')).toBeInTheDocument()
    expect(screen.getByText('Action 1')).toBeInTheDocument()
    expect(screen.getByText('Action 2')).toBeInTheDocument()
  })

  it('uses correct key for each toast', () => {
    // Mock useToast to return only open toasts
    const mockUseToast = require('@/hooks/use-toast').useToast
    mockUseToast.mockReturnValue({
      toasts: mockToasts.filter(toast => toast.open),
      toast: jest.fn(),
      dismiss: jest.fn(),
    })
    
    render(<Toaster />)
    
    const toasts = screen.getAllByTestId('toast')
    
    // Only open toasts should be rendered
    expect(toasts).toHaveLength(2)
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('renders toast with all props spread correctly', () => {
    const mockUseToast = require('@/hooks/use-toast').useToast
    mockUseToast.mockReturnValue({
      toasts: [
        {
          id: '7',
          title: 'Custom Toast',
          description: 'With custom props',
          action: null,
          variant: 'destructive',
          open: true,
          duration: 5000,
          className: 'custom-toast',
        },
      ],
      toast: jest.fn(),
      dismiss: jest.fn(),
    })
    
    render(<Toaster />)
    
    const toast = screen.getByTestId('toast')
    expect(toast).toHaveAttribute('variant', 'destructive')
    expect(toast).toHaveAttribute('open', 'true')
    expect(toast).toHaveAttribute('duration', '5000')
    expect(toast).toHaveAttribute('className', 'custom-toast')
  })

  it('maintains toast order', () => {
    // Reset to original mock with 3 toasts
    const mockUseToast = require('@/hooks/use-toast').useToast
    mockUseToast.mockReturnValue({
      toasts: mockToasts,
      toast: jest.fn(),
      dismiss: jest.fn(),
    })
    
    render(<Toaster />)
    
    const toasts = screen.getAllByTestId('toast')
    
    // Check that toasts are rendered in the order they appear in the array
    const firstToast = toasts[0]
    const secondToast = toasts[1]
    const thirdToast = toasts[2]
    
    expect(firstToast).toContainElement(screen.getByText('Success'))
    expect(secondToast).toContainElement(screen.getByText('Error'))
    expect(thirdToast).toContainElement(screen.getByText('Warning'))
  })

  it('handles toast updates from useToast hook', () => {
    const mockUseToast = require('@/hooks/use-toast').useToast
    
    // Set up initial mock with 3 toasts
    mockUseToast.mockReturnValue({
      toasts: mockToasts,
      toast: jest.fn(),
      dismiss: jest.fn(),
    })
    
    const { rerender } = render(<Toaster />)
    
    // Initially render with 3 toasts
    expect(screen.getAllByTestId('toast')).toHaveLength(3)
    
    // Update toasts
    mockUseToast.mockReturnValue({
      toasts: [
        ...mockToasts,
        {
          id: '8',
          title: 'New Toast',
          description: 'Added dynamically',
          action: null,
          variant: 'default',
          open: true,
        },
      ],
      toast: jest.fn(),
      dismiss: jest.fn(),
    })
    
    rerender(<Toaster />)
    
    // Should now have 4 toasts
    expect(screen.getAllByTestId('toast')).toHaveLength(4)
    expect(screen.getByText('New Toast')).toBeInTheDocument()
  })
})
