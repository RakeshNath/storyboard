import React from 'react'
import { render, screen } from '@testing-library/react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

// Mock Radix UI ScrollArea
jest.mock('@radix-ui/react-scroll-area', () => ({
  Root: ({ children, className, ...props }: any) => (
    <div data-testid="scroll-area-root" className={className} {...props}>
      {children}
    </div>
  ),
  Viewport: ({ children, className, ...props }: any) => (
    <div data-testid="scroll-area-viewport" className={className} {...props}>
      {children}
    </div>
  ),
  ScrollAreaScrollbar: ({ orientation, className, ...props }: any) => (
    <div 
      data-testid="scroll-area-scrollbar" 
      data-orientation={orientation}
      className={className} 
      {...props}
    >
      <div 
        data-testid="scroll-area-thumb" 
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </div>
  ),
  ScrollAreaThumb: ({ className, ...props }: any) => (
    <div 
      data-testid="scroll-area-thumb" 
      data-slot="scroll-area-thumb"
      className={`bg-border relative flex-1 rounded-full ${className || ''}`} 
      {...props} 
    />
  ),
  Corner: ({ ...props }: any) => (
    <div data-testid="scroll-area-corner" {...props} />
  ),
}))

describe('ScrollArea Components', () => {
  describe('ScrollArea', () => {
    it('renders with default props', () => {
      render(<ScrollArea>Content</ScrollArea>)
      
      const root = screen.getByTestId('scroll-area-root')
      const viewport = screen.getByTestId('scroll-area-viewport')
      const scrollbar = screen.getByTestId('scroll-area-scrollbar')
      const corner = screen.getByTestId('scroll-area-corner')
      
      expect(root).toBeInTheDocument()
      expect(root).toHaveAttribute('data-slot', 'scroll-area')
      expect(root).toHaveClass('relative')
      
      expect(viewport).toBeInTheDocument()
      expect(viewport).toHaveAttribute('data-slot', 'scroll-area-viewport')
      
      expect(scrollbar).toBeInTheDocument()
      expect(corner).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<ScrollArea className="custom-scroll-area">Content</ScrollArea>)
      
      const root = screen.getByTestId('scroll-area-root')
      expect(root).toHaveClass('custom-scroll-area')
    })

    it('renders children in viewport', () => {
      render(
        <ScrollArea>
          <div>Child Content</div>
          <p>Another child</p>
        </ScrollArea>
      )
      
      const viewport = screen.getByTestId('scroll-area-viewport')
      expect(viewport).toHaveTextContent('Child Content')
      expect(viewport).toHaveTextContent('Another child')
    })

    it('passes through additional props to root', () => {
      render(<ScrollArea data-testid="custom-scroll">Content</ScrollArea>)
      
      const root = screen.getByTestId('custom-scroll')
      expect(root).toBeInTheDocument()
    })

    it('applies correct viewport classes', () => {
      render(<ScrollArea>Content</ScrollArea>)
      
      const viewport = screen.getByTestId('scroll-area-viewport')
      expect(viewport).toHaveClass(
        'size-full',
        'rounded-[inherit]',
        'transition-[color,box-shadow]',
        'outline-none',
        'focus-visible:ring-[3px]',
        'focus-visible:outline-1'
      )
    })
  })

  describe('ScrollBar', () => {
    it('renders with default vertical orientation', () => {
      render(<ScrollBar />)
      
      const scrollbar = screen.getByTestId('scroll-area-scrollbar')
      const thumb = screen.getByTestId('scroll-area-thumb')
      
      expect(scrollbar).toBeInTheDocument()
      expect(scrollbar).toHaveAttribute('data-slot', 'scroll-area-scrollbar')
      expect(scrollbar).toHaveAttribute('data-orientation', 'vertical')
      expect(scrollbar).toHaveClass('flex', 'touch-none', 'p-px', 'transition-colors', 'select-none')
      
      expect(thumb).toBeInTheDocument()
      expect(thumb).toHaveAttribute('data-slot', 'scroll-area-thumb')
    })

    it('renders with horizontal orientation', () => {
      render(<ScrollBar orientation="horizontal" />)
      
      const scrollbar = screen.getByTestId('scroll-area-scrollbar')
      expect(scrollbar).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('applies correct classes for vertical orientation', () => {
      render(<ScrollBar orientation="vertical" />)
      
      const scrollbar = screen.getByTestId('scroll-area-scrollbar')
      expect(scrollbar).toHaveClass(
        'h-full',
        'w-2.5',
        'border-l',
        'border-l-transparent'
      )
    })

    it('applies correct classes for horizontal orientation', () => {
      render(<ScrollBar orientation="horizontal" />)
      
      const scrollbar = screen.getByTestId('scroll-area-scrollbar')
      expect(scrollbar).toHaveClass(
        'h-2.5',
        'flex-col',
        'border-t',
        'border-t-transparent'
      )
    })

    it('renders with custom className', () => {
      render(<ScrollBar className="custom-scrollbar" />)
      
      const scrollbar = screen.getByTestId('scroll-area-scrollbar')
      expect(scrollbar).toHaveClass('custom-scrollbar')
    })

    it('applies correct thumb classes', () => {
      render(<ScrollBar />)
      
      const thumb = screen.getByTestId('scroll-area-thumb')
      expect(thumb).toHaveClass('bg-border', 'relative', 'flex-1', 'rounded-full')
    })

    it('passes through additional props', () => {
      render(<ScrollBar data-testid="custom-scrollbar" />)
      
      const scrollbar = screen.getByTestId('custom-scrollbar')
      expect(scrollbar).toBeInTheDocument()
    })
  })

  describe('Complete ScrollArea Structure', () => {
    it('renders a complete scroll area with content', () => {
      render(
        <ScrollArea className="h-72 w-48">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium">Tags</h4>
            <div className="space-y-2">
              <div className="text-sm">Vercel</div>
              <div className="text-sm">Next.js</div>
              <div className="text-sm">React</div>
              <div className="text-sm">TypeScript</div>
            </div>
          </div>
        </ScrollArea>
      )
      
      expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area-viewport')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area-scrollbar')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area-corner')).toBeInTheDocument()
      
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Vercel')).toBeInTheDocument()
      expect(screen.getByText('Next.js')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    it('renders with custom scrollbar orientation', () => {
      render(
        <div>
          <ScrollArea>
            <div>Content</div>
          </ScrollArea>
          <ScrollBar orientation="horizontal" />
        </div>
      )
      
      const scrollbars = screen.getAllByTestId('scroll-area-scrollbar')
      expect(scrollbars).toHaveLength(2) // One default vertical, one custom horizontal
      expect(scrollbars[1]).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('handles empty content', () => {
      render(<ScrollArea />)
      
      expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area-viewport')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area-viewport')).toHaveTextContent('')
    })

    it('handles complex nested content', () => {
      render(
        <ScrollArea>
          <div>
            <section>
              <h2>Section 1</h2>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </section>
            <section>
              <h2>Section 2</h2>
              <p>Some content</p>
            </section>
          </div>
        </ScrollArea>
      )
      
      expect(screen.getByText('Section 1')).toBeInTheDocument()
      expect(screen.getByText('Section 2')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Some content')).toBeInTheDocument()
    })
  })
})
