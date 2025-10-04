import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from '@/components/ui/pagination'

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ChevronLeftIcon: ({ ...props }: any) => <div data-testid="chevron-left" {...props} />,
  ChevronRightIcon: ({ ...props }: any) => <div data-testid="chevron-right" {...props} />,
  MoreHorizontalIcon: ({ className, ...props }: any) => (
    <div data-testid="more-horizontal" className={className} {...props} />
  ),
}))

// Mock button variants
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
  buttonVariants: jest.fn(({ variant, size }) => {
    const variants = {
      ghost: 'bg-transparent hover:bg-accent',
      outline: 'border border-input bg-background hover:bg-accent',
    }
    const sizes = {
      default: 'h-9 px-4 py-2',
      icon: 'h-9 w-9',
    }
    return `${variants[variant] || ''} ${sizes[size] || ''}`.trim()
  }),
}))

describe('Pagination Components', () => {
  describe('Pagination', () => {
    it('renders with default props', () => {
      render(<Pagination />)
      
      const pagination = screen.getByRole('navigation')
      expect(pagination).toBeInTheDocument()
      expect(pagination).toHaveAttribute('aria-label', 'pagination')
      expect(pagination).toHaveAttribute('data-slot', 'pagination')
      expect(pagination).toHaveClass('mx-auto', 'flex', 'w-full', 'justify-center')
    })

    it('renders with custom className', () => {
      render(<Pagination className="custom-pagination" />)
      
      const pagination = screen.getByRole('navigation')
      expect(pagination).toHaveClass('custom-pagination')
    })

    it('renders children', () => {
      render(
        <Pagination>
          <div>Pagination Content</div>
        </Pagination>
      )
      
      expect(screen.getByText('Pagination Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<Pagination data-testid="custom-pagination" />)
      
      const pagination = screen.getByTestId('custom-pagination')
      expect(pagination).toBeInTheDocument()
    })
  })

  describe('PaginationContent', () => {
    it('renders with default props', () => {
      render(<PaginationContent />)
      
      const content = screen.getByRole('list')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'pagination-content')
      expect(content).toHaveClass('flex', 'flex-row', 'items-center', 'gap-1')
    })

    it('renders with custom className', () => {
      render(<PaginationContent className="custom-content" />)
      
      const content = screen.getByRole('list')
      expect(content).toHaveClass('custom-content')
    })

    it('renders children', () => {
      render(
        <PaginationContent>
          <li>Item 1</li>
          <li>Item 2</li>
        </PaginationContent>
      )
      
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<PaginationContent data-testid="custom-content" />)
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('PaginationItem', () => {
    it('renders with default props', () => {
      render(<PaginationItem />)
      
      const item = screen.getByRole('listitem')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'pagination-item')
    })

    it('renders children', () => {
      render(<PaginationItem>Item Content</PaginationItem>)
      
      expect(screen.getByText('Item Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<PaginationItem data-testid="custom-item" />)
      
      const item = screen.getByTestId('custom-item')
      expect(item).toBeInTheDocument()
    })
  })

  describe('PaginationLink', () => {
    it('renders with default props', () => {
      render(<PaginationLink href="/page/1">1</PaginationLink>)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/page/1')
      expect(link).toHaveAttribute('data-slot', 'pagination-link')
      expect(link).toHaveTextContent('1')
    })

    it('renders as active link', () => {
      render(<PaginationLink href="/page/2" isActive>2</PaginationLink>)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(link).toHaveAttribute('data-active', 'true')
    })

    it('renders with custom size', () => {
      render(<PaginationLink href="/page/1" size="default">1</PaginationLink>)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<PaginationLink href="/page/1" className="custom-link">1</PaginationLink>)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-link')
    })

    it('passes through additional props', () => {
      render(<PaginationLink href="/page/1" data-testid="custom-link">1</PaginationLink>)
      
      const link = screen.getByTestId('custom-link')
      expect(link).toBeInTheDocument()
    })
  })

  describe('PaginationPrevious', () => {
    it('renders with default props', () => {
      render(<PaginationPrevious href="/prev" />)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('aria-label', 'Go to previous page')
      expect(link).toHaveAttribute('href', '/prev')
      expect(screen.getByTestId('chevron-left')).toBeInTheDocument()
      expect(screen.getByText('Previous')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<PaginationPrevious href="/prev" className="custom-prev" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-prev')
    })

    it('passes through additional props', () => {
      render(<PaginationPrevious href="/prev" data-testid="custom-prev" />)
      
      const link = screen.getByTestId('custom-prev')
      expect(link).toBeInTheDocument()
    })

    it('hides Previous text on small screens', () => {
      render(<PaginationPrevious href="/prev" />)
      
      const textSpan = screen.getByText('Previous')
      expect(textSpan).toHaveClass('hidden', 'sm:block')
    })
  })

  describe('PaginationNext', () => {
    it('renders with default props', () => {
      render(<PaginationNext href="/next" />)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('aria-label', 'Go to next page')
      expect(link).toHaveAttribute('href', '/next')
      expect(screen.getByTestId('chevron-right')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<PaginationNext href="/next" className="custom-next" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-next')
    })

    it('passes through additional props', () => {
      render(<PaginationNext href="/next" data-testid="custom-next" />)
      
      const link = screen.getByTestId('custom-next')
      expect(link).toBeInTheDocument()
    })

    it('hides Next text on small screens', () => {
      render(<PaginationNext href="/next" />)
      
      const textSpan = screen.getByText('Next')
      expect(textSpan).toHaveClass('hidden', 'sm:block')
    })
  })

  describe('PaginationEllipsis', () => {
    it('renders with default props', () => {
      render(<PaginationEllipsis />)
      
      const ellipsis = screen.getByTestId('pagination-ellipsis')
      const icon = screen.getByTestId('more-horizontal')
      
      expect(ellipsis).toBeInTheDocument()
      expect(ellipsis).toHaveAttribute('data-slot', 'pagination-ellipsis')
      expect(ellipsis).toHaveAttribute('aria-hidden')
      expect(icon).toBeInTheDocument()
      expect(screen.getByText('More pages')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<PaginationEllipsis className="custom-ellipsis" />)
      
      const ellipsis = screen.getByTestId('pagination-ellipsis')
      expect(ellipsis).toHaveClass('custom-ellipsis')
    })

    it('renders MoreHorizontalIcon with correct size', () => {
      render(<PaginationEllipsis />)
      
      const icon = screen.getByTestId('more-horizontal')
      expect(icon).toHaveClass('size-4')
    })

    it('passes through additional props', () => {
      render(<PaginationEllipsis data-testid="custom-ellipsis" />)
      
      const ellipsis = screen.getByTestId('custom-ellipsis')
      expect(ellipsis).toBeInTheDocument()
    })
  })

  describe('Complete Pagination Structure', () => {
    it('renders a complete pagination', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="/prev" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/page/1">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/page/2" isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/page/3">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="/next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(6)
      expect(screen.getAllByRole('link')).toHaveLength(5) // Previous, 3 pages, Next
      expect(screen.getByTestId('pagination-ellipsis')).toBeInTheDocument()
      
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('handles empty pagination', () => {
      render(<Pagination />)
      
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('handles pagination with only ellipsis', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      
      expect(screen.getByTestId('pagination-ellipsis')).toBeInTheDocument()
    })

    it('handles multiple ellipsis', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="/page/1">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/page/5">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/page/10">10</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      
      expect(screen.getAllByTestId('pagination-ellipsis')).toHaveLength(2)
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })
})
