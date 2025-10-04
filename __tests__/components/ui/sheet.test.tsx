import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'

// Mock Radix UI Dialog (used by Sheet)
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="sheet-root" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="sheet-trigger" {...props}>
      {children}
    </button>
  ),
  Close: ({ children, className, ...props }: any) => (
    <button data-testid="sheet-close" className={className} {...props}>
      {children}
    </button>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="sheet-portal" {...props}>
      {children}
    </div>
  ),
  Overlay: ({ className, ...props }: any) => (
    <div data-testid="sheet-overlay" className={className} {...props} />
  ),
  Content: ({ children, className, side, ...props }: any) => (
    <div 
      data-testid="sheet-content" 
      className={className}
      data-side={side}
      {...props}
    >
      {children}
    </div>
  ),
  Title: ({ children, className, ...props }: any) => (
    <h2 data-testid="sheet-title" className={className} {...props}>
      {children}
    </h2>
  ),
  Description: ({ children, className, ...props }: any) => (
    <p data-testid="sheet-description" className={className} {...props}>
      {children}
    </p>
  ),
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  XIcon: ({ className, ...props }: any) => (
    <div data-testid="x-icon" className={className} {...props} />
  ),
}))

describe('Sheet Components', () => {
  describe('Sheet', () => {
    it('renders with default props', () => {
      render(<Sheet />)
      
      const sheet = screen.getByTestId('sheet-root')
      expect(sheet).toBeInTheDocument()
      expect(sheet).toHaveAttribute('data-slot', 'sheet')
    })

    it('renders children', () => {
      render(
        <Sheet>
          <div>Sheet Content</div>
        </Sheet>
      )
      
      expect(screen.getByText('Sheet Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<Sheet data-testid="custom-sheet" />)
      
      const sheet = screen.getByTestId('custom-sheet')
      expect(sheet).toBeInTheDocument()
    })
  })

  describe('SheetTrigger', () => {
    it('renders with default props', () => {
      render(<SheetTrigger>Trigger</SheetTrigger>)
      
      const trigger = screen.getByTestId('sheet-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'sheet-trigger')
      expect(trigger).toHaveTextContent('Trigger')
    })

    it('renders as button by default', () => {
      render(<SheetTrigger>Button Trigger</SheetTrigger>)
      
      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SheetTrigger data-testid="custom-trigger">Trigger</SheetTrigger>)
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('SheetClose', () => {
    it('renders with default props', () => {
      render(<SheetClose>Close</SheetClose>)
      
      const close = screen.getByTestId('sheet-close')
      expect(close).toBeInTheDocument()
      expect(close).toHaveAttribute('data-slot', 'sheet-close')
      expect(close).toHaveTextContent('Close')
    })

    it('renders as button by default', () => {
      render(<SheetClose>Close Button</SheetClose>)
      
      const close = screen.getByRole('button')
      expect(close).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SheetClose data-testid="custom-close">Close</SheetClose>)
      
      const close = screen.getByTestId('custom-close')
      expect(close).toBeInTheDocument()
    })
  })


  describe('SheetContent', () => {
    it('renders with default props (right side)', () => {
      render(<SheetContent>Content</SheetContent>)
      
      const portal = screen.getByTestId('sheet-portal')
      const overlay = screen.getByTestId('sheet-overlay')
      const content = screen.getByTestId('sheet-content')
      const closeButton = screen.getByTestId('sheet-close')
      
      expect(portal).toBeInTheDocument()
      expect(overlay).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'sheet-content')
      expect(closeButton).toBeInTheDocument()
    })

    it('renders with left side', () => {
      render(<SheetContent side="left">Content</SheetContent>)
      
      const content = screen.getByTestId('sheet-content')
      expect(content).toBeInTheDocument()
    })

    it('renders with top side', () => {
      render(<SheetContent side="top">Content</SheetContent>)
      
      const content = screen.getByTestId('sheet-content')
      expect(content).toBeInTheDocument()
    })

    it('renders with bottom side', () => {
      render(<SheetContent side="bottom">Content</SheetContent>)
      
      const content = screen.getByTestId('sheet-content')
      expect(content).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<SheetContent className="custom-content">Content</SheetContent>)
      
      const content = screen.getByTestId('sheet-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders children', () => {
      render(
        <SheetContent>
          <div>Sheet Content</div>
        </SheetContent>
      )
      
      expect(screen.getByText('Sheet Content')).toBeInTheDocument()
    })

    it('renders close button with X icon', () => {
      render(<SheetContent>Content</SheetContent>)
      
      const closeButton = screen.getByTestId('sheet-close')
      const xIcon = screen.getByTestId('x-icon')
      const closeText = screen.getByText('Close')
      
      expect(closeButton).toBeInTheDocument()
      expect(xIcon).toBeInTheDocument()
      expect(closeText).toBeInTheDocument()
      expect(closeText).toHaveClass('sr-only')
    })

    it('passes through additional props', () => {
      render(<SheetContent data-testid="custom-content">Content</SheetContent>)
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('SheetHeader', () => {
    it('renders with default props', () => {
      render(<SheetHeader>Header</SheetHeader>)
      
      const header = screen.getByTestId('sheet-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveAttribute('data-slot', 'sheet-header')
      expect(header).toHaveClass('flex', 'flex-col', 'gap-1.5', 'p-4')
    })

    it('renders with custom className', () => {
      render(<SheetHeader className="custom-header">Header</SheetHeader>)
      
      const header = screen.getByTestId('sheet-header')
      expect(header).toHaveClass('custom-header')
    })

    it('renders children', () => {
      render(
        <SheetHeader>
          <div>Header Content</div>
        </SheetHeader>
      )
      
      expect(screen.getByText('Header Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SheetHeader data-testid="custom-header">Header</SheetHeader>)
      
      const header = screen.getByTestId('custom-header')
      expect(header).toBeInTheDocument()
    })
  })

  describe('SheetFooter', () => {
    it('renders with default props', () => {
      render(<SheetFooter>Footer</SheetFooter>)
      
      const footer = screen.getByTestId('sheet-footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveAttribute('data-slot', 'sheet-footer')
      expect(footer).toHaveClass('mt-auto', 'flex', 'flex-col', 'gap-2', 'p-4')
    })

    it('renders with custom className', () => {
      render(<SheetFooter className="custom-footer">Footer</SheetFooter>)
      
      const footer = screen.getByTestId('sheet-footer')
      expect(footer).toHaveClass('custom-footer')
    })

    it('renders children', () => {
      render(
        <SheetFooter>
          <div>Footer Content</div>
        </SheetFooter>
      )
      
      expect(screen.getByText('Footer Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<SheetFooter data-testid="custom-footer">Footer</SheetFooter>)
      
      const footer = screen.getByTestId('custom-footer')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('SheetTitle', () => {
    it('renders with default props', () => {
      render(<SheetTitle>Title</SheetTitle>)
      
      const title = screen.getByTestId('sheet-title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'sheet-title')
      expect(title).toHaveClass('text-foreground', 'font-semibold')
      expect(title).toHaveTextContent('Title')
    })

    it('renders with custom className', () => {
      render(<SheetTitle className="custom-title">Title</SheetTitle>)
      
      const title = screen.getByTestId('sheet-title')
      expect(title).toHaveClass('custom-title')
    })

    it('passes through additional props', () => {
      render(<SheetTitle data-testid="custom-title">Title</SheetTitle>)
      
      const title = screen.getByTestId('custom-title')
      expect(title).toBeInTheDocument()
    })
  })

  describe('SheetDescription', () => {
    it('renders with default props', () => {
      render(<SheetDescription>Description</SheetDescription>)
      
      const description = screen.getByTestId('sheet-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveAttribute('data-slot', 'sheet-description')
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
      expect(description).toHaveTextContent('Description')
    })

    it('renders with custom className', () => {
      render(<SheetDescription className="custom-description">Description</SheetDescription>)
      
      const description = screen.getByTestId('sheet-description')
      expect(description).toHaveClass('custom-description')
    })

    it('passes through additional props', () => {
      render(<SheetDescription data-testid="custom-description">Description</SheetDescription>)
      
      const description = screen.getByTestId('custom-description')
      expect(description).toBeInTheDocument()
    })
  })

  describe('Complete Sheet Structure', () => {
    it('renders a complete sheet', () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet description goes here</SheetDescription>
            </SheetHeader>
            <div>Sheet body content</div>
            <SheetFooter>
              <button>Cancel</button>
              <button>Save</button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )
      
      expect(screen.getByTestId('sheet-root')).toBeInTheDocument()
      expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('sheet-content')).toBeInTheDocument()
      expect(screen.getByTestId('sheet-header')).toBeInTheDocument()
      expect(screen.getByTestId('sheet-footer')).toBeInTheDocument()
      expect(screen.getByTestId('sheet-title')).toBeInTheDocument()
      expect(screen.getByTestId('sheet-description')).toBeInTheDocument()
      
      expect(screen.getByText('Open Sheet')).toBeInTheDocument()
      expect(screen.getByText('Sheet Title')).toBeInTheDocument()
      expect(screen.getByText('Sheet description goes here')).toBeInTheDocument()
      expect(screen.getByText('Sheet body content')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('renders sheet with different sides', () => {
      const sides = ['left', 'right', 'top', 'bottom'] as const
      
      sides.forEach(side => {
        const { unmount } = render(
          <Sheet key={side}>
            <SheetContent side={side}>Content</SheetContent>
          </Sheet>
        )
        
        const content = screen.getByTestId('sheet-content')
        expect(content).toHaveAttribute('data-side', side)
        unmount()
      })
    })

    it('handles empty sheet content', () => {
      render(
        <Sheet>
          <SheetContent />
        </Sheet>
      )
      
      expect(screen.getByTestId('sheet-content')).toBeInTheDocument()
      expect(screen.getByTestId('sheet-close')).toBeInTheDocument()
    })

    it('handles sheet with only header', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Title Only</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )
      
      expect(screen.getByTestId('sheet-title')).toBeInTheDocument()
      expect(screen.getByText('Title Only')).toBeInTheDocument()
    })
  })
})
