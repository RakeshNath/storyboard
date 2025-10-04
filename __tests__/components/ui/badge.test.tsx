import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Badge>Default Badge</Badge>)
      
      expect(screen.getByText('Default Badge')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Badge className="custom-badge">Custom Badge</Badge>)
      
      const badge = screen.getByText('Custom Badge')
      expect(badge).toHaveClass('custom-badge')
    })

    it('renders with custom props', () => {
      render(<Badge data-testid="custom-badge">Test Badge</Badge>)
      
      const badge = screen.getByTestId('custom-badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent('Test Badge')
    })
  })

  describe('Variants', () => {
    it('renders with default variant', () => {
      render(<Badge>Default Badge</Badge>)
      
      const badge = screen.getByText('Default Badge')
      expect(badge).toBeInTheDocument()
    })

    it('renders with secondary variant', () => {
      render(<Badge variant="secondary">Secondary Badge</Badge>)
      
      const badge = screen.getByText('Secondary Badge')
      expect(badge).toBeInTheDocument()
    })

    it('renders with destructive variant', () => {
      render(<Badge variant="destructive">Destructive Badge</Badge>)
      
      const badge = screen.getByText('Destructive Badge')
      expect(badge).toBeInTheDocument()
    })

    it('renders with outline variant', () => {
      render(<Badge variant="outline">Outline Badge</Badge>)
      
      const badge = screen.getByText('Outline Badge')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('renders with text content', () => {
      render(<Badge>Text Badge</Badge>)
      
      expect(screen.getByText('Text Badge')).toBeInTheDocument()
    })

    it('renders with number content', () => {
      render(<Badge>42</Badge>)
      
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('renders with complex content', () => {
      render(
        <Badge>
          <span>🔔</span>
          <span>Notifications</span>
          <span>(3)</span>
        </Badge>
      )
      
      expect(screen.getByText('🔔')).toBeInTheDocument()
      expect(screen.getByText('Notifications')).toBeInTheDocument()
      expect(screen.getByText('(3)')).toBeInTheDocument()
    })

    it('renders with empty content', () => {
      render(<Badge></Badge>)
      
      const badge = screen.getByRole('badge')
      expect(badge).toBeInTheDocument()
    })

    it('renders with null children', () => {
      render(<Badge>{null}</Badge>)
      
      const badge = screen.getByRole('badge')
      expect(badge).toBeInTheDocument()
    })

    it('renders with undefined children', () => {
      render(<Badge>{undefined}</Badge>)
      
      const badge = screen.getByRole('badge')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper role', () => {
      render(<Badge>Accessible Badge</Badge>)
      
      const badge = screen.getByRole('badge')
      expect(badge).toBeInTheDocument()
    })

    it('supports screen readers', () => {
      render(<Badge aria-label="Status badge">Active</Badge>)
      
      const badge = screen.getByLabelText('Status badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent('Active')
    })

    it('supports custom ARIA attributes', () => {
      render(
        <Badge aria-live="polite" aria-atomic="true">
          Live Badge
        </Badge>
      )
      
      const badge = screen.getByText('Live Badge')
      expect(badge).toHaveAttribute('aria-live', 'polite')
      expect(badge).toHaveAttribute('aria-atomic', 'true')
    })
  })

  describe('Edge Cases', () => {
    it('handles very long text', () => {
      const longText = 'A'.repeat(1000)
      
      render(<Badge>{longText}</Badge>)
      
      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('handles special characters', () => {
      render(<Badge>!@#$%^&*()</Badge>)
      
      expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument()
    })

    it('handles HTML entities', () => {
      render(<Badge>&lt;div&gt;&lt;/div&gt;</Badge>)
      
      expect(screen.getByText('<div></div>')).toBeInTheDocument()
    })

    it('handles mixed content types', () => {
      render(
        <Badge>
          Text
          {42}
          {true && 'Conditional'}
          {null}
          {undefined}
        </Badge>
      )
      
      expect(screen.getByText(/Text.*42.*Conditional/)).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently with many badges', () => {
      const startTime = performance.now()
      
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Badge key={i}>Badge {i}</Badge>
          ))}
        </div>
      )
      
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // Should render in less than 1 second
      expect(screen.getAllByRole('badge')).toHaveLength(100)
    })
  })

  describe('Integration', () => {
    it('works within other components', () => {
      render(
        <div>
          <h1>Title <Badge>New</Badge></h1>
          <p>Description with <Badge variant="secondary">tag</Badge></p>
        </div>
      )
      
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('New')).toBeInTheDocument()
      expect(screen.getByText('Description with')).toBeInTheDocument()
      expect(screen.getByText('tag')).toBeInTheDocument()
    })

    it('works with click handlers', () => {
      const handleClick = jest.fn()
      
      render(
        <Badge onClick={handleClick} role="button" tabIndex={0}>
          Clickable Badge
        </Badge>
      )
      
      const badge = screen.getByText('Clickable Badge')
      expect(badge).toHaveAttribute('role', 'button')
      expect(badge).toHaveAttribute('tabIndex', '0')
    })
  })
})
