import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from '@/components/ui/breadcrumb'

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ChevronRight: ({ ...props }: any) => <div data-testid="chevron-right" {...props} />,
  MoreHorizontal: ({ ...props }: any) => <div data-testid="more-horizontal" {...props} />,
}))

describe('Breadcrumb Components', () => {
  describe('Breadcrumb', () => {
    it('renders with default props', () => {
      render(<Breadcrumb />)
      
      const breadcrumb = screen.getByRole('navigation')
      expect(breadcrumb).toBeInTheDocument()
      expect(breadcrumb).toHaveAttribute('aria-label', 'breadcrumb')
      expect(breadcrumb).toHaveAttribute('data-slot', 'breadcrumb')
    })

    it('renders with custom className', () => {
      render(<Breadcrumb className="custom-breadcrumb" />)
      
      const breadcrumb = screen.getByRole('navigation')
      expect(breadcrumb).toHaveClass('custom-breadcrumb')
    })

    it('passes through additional props', () => {
      render(<Breadcrumb data-testid="custom-breadcrumb" />)
      
      const breadcrumb = screen.getByTestId('custom-breadcrumb')
      expect(breadcrumb).toBeInTheDocument()
    })
  })

  describe('BreadcrumbList', () => {
    it('renders with default props', () => {
      render(<BreadcrumbList />)
      
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      expect(list).toHaveAttribute('data-slot', 'breadcrumb-list')
      expect(list).toHaveClass('text-muted-foreground', 'flex', 'flex-wrap', 'items-center')
    })

    it('renders with custom className', () => {
      render(<BreadcrumbList className="custom-list" />)
      
      const list = screen.getByRole('list')
      expect(list).toHaveClass('custom-list')
    })

    it('renders children', () => {
      render(
        <BreadcrumbList>
          <li>Item 1</li>
          <li>Item 2</li>
        </BreadcrumbList>
      )
      
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('BreadcrumbItem', () => {
    it('renders with default props', () => {
      render(<BreadcrumbItem />)
      
      const item = screen.getByRole('listitem')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'breadcrumb-item')
      expect(item).toHaveClass('inline-flex', 'items-center')
    })

    it('renders with custom className', () => {
      render(<BreadcrumbItem className="custom-item" />)
      
      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('custom-item')
    })

    it('renders children', () => {
      render(<BreadcrumbItem>Test Item</BreadcrumbItem>)
      
      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })
  })

  describe('BreadcrumbLink', () => {
    it('renders as anchor by default', () => {
      render(<BreadcrumbLink href="/test">Link Text</BreadcrumbLink>)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveAttribute('data-slot', 'breadcrumb-link')
      expect(link).toHaveTextContent('Link Text')
      expect(link).toHaveClass('hover:text-foreground', 'transition-colors')
    })

    it('renders with custom className', () => {
      render(<BreadcrumbLink className="custom-link">Link</BreadcrumbLink>)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-link')
    })

    it('renders as child component when asChild is true', () => {
      render(
        <BreadcrumbLink asChild>
          <button>Button Link</button>
        </BreadcrumbLink>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Button Link')
    })

    it('passes through additional props', () => {
      render(<BreadcrumbLink data-testid="custom-link">Link</BreadcrumbLink>)
      
      const link = screen.getByTestId('custom-link')
      expect(link).toBeInTheDocument()
    })
  })

  describe('BreadcrumbPage', () => {
    it('renders with default props', () => {
      render(<BreadcrumbPage>Current Page</BreadcrumbPage>)
      
      const page = screen.getByText('Current Page')
      expect(page).toBeInTheDocument()
      expect(page).toHaveAttribute('role', 'link')
      expect(page).toHaveAttribute('aria-disabled', 'true')
      expect(page).toHaveAttribute('aria-current', 'page')
      expect(page).toHaveAttribute('data-slot', 'breadcrumb-page')
      expect(page).toHaveClass('text-foreground', 'font-normal')
    })

    it('renders with custom className', () => {
      render(<BreadcrumbPage className="custom-page">Page</BreadcrumbPage>)
      
      const page = screen.getByText('Page')
      expect(page).toHaveClass('custom-page')
    })

    it('passes through additional props', () => {
      render(<BreadcrumbPage data-testid="custom-page">Page</BreadcrumbPage>)
      
      const page = screen.getByTestId('custom-page')
      expect(page).toBeInTheDocument()
    })
  })

  describe('BreadcrumbSeparator', () => {
    it('renders with default ChevronRight icon', () => {
      render(<BreadcrumbSeparator />)
      
      const separator = screen.getByTestId('breadcrumb-separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('aria-hidden', 'true')
      expect(separator).toHaveAttribute('data-slot', 'breadcrumb-separator')
      expect(screen.getByTestId('chevron-right')).toBeInTheDocument()
    })

    it('renders with custom children', () => {
      render(<BreadcrumbSeparator>/</BreadcrumbSeparator>)
      
      const separator = screen.getByTestId('breadcrumb-separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveTextContent('/')
    })

    it('renders with custom className', () => {
      render(<BreadcrumbSeparator className="custom-separator" />)
      
      const separator = screen.getByTestId('breadcrumb-separator')
      expect(separator).toHaveClass('custom-separator')
    })
  })

  describe('BreadcrumbEllipsis', () => {
    it('renders with MoreHorizontal icon', () => {
      render(<BreadcrumbEllipsis />)
      
      const ellipsis = screen.getByTestId('breadcrumb-ellipsis')
      expect(ellipsis).toBeInTheDocument()
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true')
      expect(ellipsis).toHaveAttribute('data-slot', 'breadcrumb-ellipsis')
      expect(screen.getByTestId('more-horizontal')).toBeInTheDocument()
      expect(screen.getByText('More')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<BreadcrumbEllipsis className="custom-ellipsis" />)
      
      const ellipsis = screen.getByTestId('breadcrumb-ellipsis')
      expect(ellipsis).toHaveClass('custom-ellipsis')
    })

    it('passes through additional props', () => {
      render(<BreadcrumbEllipsis data-testid="custom-ellipsis" />)
      
      const ellipsis = screen.getByTestId('custom-ellipsis')
      expect(ellipsis).toBeInTheDocument()
    })
  })

  describe('Complete Breadcrumb Structure', () => {
    it('renders a complete breadcrumb navigation', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/category">Category</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
      expect(screen.getAllByTestId('breadcrumb-separator')).toHaveLength(2) // separators
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Category')).toBeInTheDocument()
      expect(screen.getByText('Current Page')).toBeInTheDocument()
    })

    it('renders breadcrumb with ellipsis', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      
      expect(screen.getByTestId('more-horizontal')).toBeInTheDocument()
      expect(screen.getByText('More')).toBeInTheDocument()
    })
  })
})
