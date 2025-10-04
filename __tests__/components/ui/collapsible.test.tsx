import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

// Mock Radix UI Collapsible
jest.mock('@radix-ui/react-collapsible', () => ({
  Root: ({ children, open, ...props }: any) => (
    <div data-testid="collapsible-root" data-slot="collapsible" open={open !== undefined ? String(open) : undefined} {...props}>
      {children}
    </div>
  ),
  CollapsibleTrigger: ({ children, ...props }: any) => (
    <button data-testid="collapsible-trigger" data-slot="collapsible-trigger" {...props}>
      {children}
    </button>
  ),
  CollapsibleContent: ({ children, ...props }: any) => (
    <div data-testid="collapsible-content" data-slot="collapsible-content" {...props}>
      {children}
    </div>
  ),
}))

describe('Collapsible Components', () => {
  describe('Collapsible Root', () => {
    it('renders with default props', () => {
      render(
        <Collapsible>
          <div>Content</div>
        </Collapsible>
      )
      
      const collapsible = screen.getByTestId('collapsible-root')
      expect(collapsible).toBeInTheDocument()
      expect(collapsible).toHaveAttribute('data-slot', 'collapsible')
    })

    it('renders children correctly', () => {
      render(
        <Collapsible>
          <div data-testid="child-content">Test Content</div>
        </Collapsible>
      )
      
      expect(screen.getByTestId('child-content')).toBeInTheDocument()
      expect(screen.getByTestId('child-content')).toHaveTextContent('Test Content')
    })

    it('passes through props to the root element', () => {
      render(
        <Collapsible open={true} className="custom-class" data-testid="custom-collapsible">
          <div>Content</div>
        </Collapsible>
      )
      
      const collapsible = screen.getByTestId('custom-collapsible')
      expect(collapsible).toBeInTheDocument()
      expect(collapsible).toHaveClass('custom-class')
      expect(collapsible).toHaveAttribute('data-slot', 'collapsible')
    })

    it('handles open state', () => {
      render(
        <Collapsible open={true}>
          <div>Content</div>
        </Collapsible>
      )
      
      const collapsible = screen.getByTestId('collapsible-root')
      expect(collapsible).toHaveAttribute('open', 'true')
    })

    it('handles closed state', () => {
      render(
        <Collapsible open={false}>
          <div>Content</div>
        </Collapsible>
      )
      
      const collapsible = screen.getByTestId('collapsible-root')
      expect(collapsible).toHaveAttribute('open', 'false')
    })
  })

  describe('CollapsibleTrigger', () => {
    it('renders with default props', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      )
      
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'collapsible-trigger')
      expect(trigger).toHaveTextContent('Toggle')
    })

    it('renders with custom content', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>
            <span>Custom Trigger</span>
          </CollapsibleTrigger>
        </Collapsible>
      )
      
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger).toHaveTextContent('Custom Trigger')
    })

    it('passes through props', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger className="custom-class" data-testid="custom-trigger">
            Toggle
          </CollapsibleTrigger>
        </Collapsible>
      )
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toHaveClass('custom-class')
      expect(trigger).toHaveAttribute('data-slot', 'collapsible-trigger')
    })

    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger onClick={handleClick}>Toggle</CollapsibleTrigger>
        </Collapsible>
      )
      
      const trigger = screen.getByTestId('collapsible-trigger')
      await user.click(trigger)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('CollapsibleContent', () => {
    it('renders with default props', () => {
      render(
        <Collapsible>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      
      const content = screen.getByTestId('collapsible-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'collapsible-content')
      expect(content).toHaveTextContent('Content')
    })

    it('renders with complex content', () => {
      render(
        <Collapsible>
          <CollapsibleContent>
            <h2>Title</h2>
            <p>Description</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )
      
      const content = screen.getByTestId('collapsible-content')
      expect(content).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('passes through props', () => {
      render(
        <Collapsible>
          <CollapsibleContent className="custom-class" data-testid="custom-content">
            Content
          </CollapsibleContent>
        </Collapsible>
      )
      
      const content = screen.getByTestId('custom-content')
      expect(content).toHaveClass('custom-class')
      expect(content).toHaveAttribute('data-slot', 'collapsible-content')
    })
  })

  describe('Complete Collapsible Structure', () => {
    it('renders complete collapsible with trigger and content', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle Content</CollapsibleTrigger>
          <CollapsibleContent>Hidden Content</CollapsibleContent>
        </Collapsible>
      )
      
      expect(screen.getByTestId('collapsible-root')).toBeInTheDocument()
      expect(screen.getByTestId('collapsible-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('collapsible-content')).toBeInTheDocument()
      
      expect(screen.getByText('Toggle Content')).toBeInTheDocument()
      expect(screen.getByText('Hidden Content')).toBeInTheDocument()
    })

    it('handles multiple content sections', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content 1</CollapsibleContent>
          <CollapsibleContent>Content 2</CollapsibleContent>
        </Collapsible>
      )
      
      const contentElements = screen.getAllByTestId('collapsible-content')
      expect(contentElements).toHaveLength(2)
      expect(contentElements[0]).toHaveTextContent('Content 1')
      expect(contentElements[1]).toHaveTextContent('Content 2')
    })

    it('handles nested collapsibles', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Parent Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <Collapsible>
              <CollapsibleTrigger>Child Toggle</CollapsibleTrigger>
              <CollapsibleContent>Child Content</CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
      )
      
      expect(screen.getByText('Parent Toggle')).toBeInTheDocument()
      expect(screen.getByText('Child Toggle')).toBeInTheDocument()
      expect(screen.getByText('Child Content')).toBeInTheDocument()
      
      // Should have 2 root elements (parent and child)
      const rootElements = screen.getAllByTestId('collapsible-root')
      expect(rootElements).toHaveLength(2)
    })
  })
})
