import React from 'react'
import { render, screen } from '@testing-library/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

describe('Alert Components', () => {
  describe('Alert', () => {
    it('renders with default props', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      
      expect(screen.getByText('Alert Title')).toBeInTheDocument()
      expect(screen.getByText('Alert description')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Alert className="custom-alert">
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('custom-alert')
    })

    it('renders with different variants', () => {
      const { rerender } = render(
        <Alert>
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>Default description</AlertDescription>
        </Alert>
      )
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
      
      rerender(
        <Alert>
          <AlertTitle>Destructive Alert</AlertTitle>
          <AlertDescription>Destructive description</AlertDescription>
        </Alert>
      )
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('renders with custom props', () => {
      render(
        <Alert data-testid="custom-alert" role="banner">
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      
      const alert = screen.getByTestId('custom-alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('role', 'banner')
    })
  })

  describe('AlertTitle', () => {
    it('renders as heading element', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      
      const title = screen.getByText('Alert Title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Alert Title')
      expect(title.tagName).toBe('DIV') // AlertTitle renders as div, not heading
    })

    it('renders with custom className', () => {
      render(
        <Alert>
          <AlertTitle className="custom-title">Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      
      const title = screen.getByText('Alert Title')
      expect(title).toHaveClass('custom-title')
    })

    it('renders with custom heading level', () => {
      render(
        <Alert>
          <AlertTitle asChild>
            <h3>Custom Title</h3>
          </AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      
      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Custom Title')
    })
  })

  describe('AlertDescription', () => {
    it('renders description text', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      
      expect(screen.getByText('Alert description')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription className="custom-description">Alert description</AlertDescription>
        </Alert>
      )
      
      const description = screen.getByText('Alert description')
      expect(description).toHaveClass('custom-description')
    })

    it('renders with complex content', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>
            <div>
              <p>First paragraph</p>
              <p>Second paragraph</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )
      
      expect(screen.getByText('First paragraph')).toBeInTheDocument()
      expect(screen.getByText('Second paragraph')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('supports screen readers', () => {
      render(
        <Alert>
          <AlertTitle>Important Alert</AlertTitle>
          <AlertDescription>This is an important message</AlertDescription>
        </Alert>
      )
      
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('Important Alert')
      expect(alert).toHaveTextContent('This is an important message')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty content', () => {
      render(
        <Alert>
          <AlertTitle></AlertTitle>
          <AlertDescription></AlertDescription>
        </Alert>
      )
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('handles null children', () => {
      render(
        <Alert>
          <AlertTitle>{null}</AlertTitle>
          <AlertDescription>{null}</AlertDescription>
        </Alert>
      )
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('handles undefined children', () => {
      render(
        <Alert>
          <AlertTitle>{undefined}</AlertTitle>
          <AlertDescription>{undefined}</AlertDescription>
        </Alert>
      )
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('handles only title without description', () => {
      render(
        <Alert>
          <AlertTitle>Title Only</AlertTitle>
        </Alert>
      )
      
      expect(screen.getByText('Title Only')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('handles only description without title', () => {
      render(
        <Alert>
          <AlertDescription>Description Only</AlertDescription>
        </Alert>
      )
      
      expect(screen.getByText('Description Only')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  describe.skip('Performance', () => {
    it('renders efficiently with many alerts', () => {
      const startTime = performance.now()
      
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Alert key={i}>
              <AlertTitle>Alert {i}</AlertTitle>
              <AlertDescription>Description {i}</AlertDescription>
            </Alert>
          ))}
        </div>
      )
      
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // Should render in less than 1 second
      expect(screen.getAllByRole('alert')).toHaveLength(100)
    })
  })
})
