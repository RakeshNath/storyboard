import React from 'react'
import { render, screen } from '@testing-library/react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'

// Mock react-resizable-panels
jest.mock('react-resizable-panels', () => ({
  PanelGroup: ({ children, className, ...props }: any) => (
    <div data-testid="resizable-panel-group" className={className} {...props}>
      {children}
    </div>
  ),
  Panel: ({ children, ...props }: any) => (
    <div data-testid="resizable-panel" {...props}>
      {children}
    </div>
  ),
  PanelResizeHandle: ({ children, className, ...props }: any) => (
    <div data-testid="resizable-handle" className={className} {...props}>
      {children}
    </div>
  ),
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  GripVerticalIcon: ({ className, ...props }: any) => (
    <div data-testid="grip-vertical-icon" className={className} {...props} />
  ),
}))

describe('Resizable Components', () => {
  describe('ResizablePanelGroup', () => {
    it('renders with default props', () => {
      render(<ResizablePanelGroup />)
      
      const group = screen.getByTestId('resizable-panel-group')
      expect(group).toBeInTheDocument()
      expect(group).toHaveAttribute('data-slot', 'resizable-panel-group')
      expect(group).toHaveClass('flex', 'h-full', 'w-full')
    })

    it('renders with custom className', () => {
      render(<ResizablePanelGroup className="custom-group" />)
      
      const group = screen.getByTestId('resizable-panel-group')
      expect(group).toHaveClass('custom-group')
    })

    it('renders children', () => {
      render(
        <ResizablePanelGroup>
          <div>Panel 1</div>
          <div>Panel 2</div>
        </ResizablePanelGroup>
      )
      
      expect(screen.getByText('Panel 1')).toBeInTheDocument()
      expect(screen.getByText('Panel 2')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<ResizablePanelGroup data-testid="custom-group" />)
      
      const group = screen.getByTestId('custom-group')
      expect(group).toBeInTheDocument()
    })

    it('applies vertical direction classes', () => {
      render(<ResizablePanelGroup direction="vertical" />)
      
      const group = screen.getByTestId('resizable-panel-group')
      expect(group).toHaveClass('data-[panel-group-direction=vertical]:flex-col')
    })
  })

  describe('ResizablePanel', () => {
    it('renders with default props', () => {
      render(<ResizablePanel />)
      
      const panel = screen.getByTestId('resizable-panel')
      expect(panel).toBeInTheDocument()
      expect(panel).toHaveAttribute('data-slot', 'resizable-panel')
    })

    it('renders children', () => {
      render(<ResizablePanel>Panel Content</ResizablePanel>)
      
      const panel = screen.getByTestId('resizable-panel')
      expect(panel).toHaveTextContent('Panel Content')
    })

    it('passes through additional props', () => {
      render(<ResizablePanel data-testid="custom-panel" />)
      
      const panel = screen.getByTestId('custom-panel')
      expect(panel).toBeInTheDocument()
    })

    it('renders with panel props', () => {
      render(<ResizablePanel defaultSize={50} minSize={20} maxSize={80} />)
      
      const panel = screen.getByTestId('resizable-panel')
      expect(panel).toHaveAttribute('defaultSize', '50')
      expect(panel).toHaveAttribute('minSize', '20')
      expect(panel).toHaveAttribute('maxSize', '80')
    })
  })

  describe('ResizableHandle', () => {
    it('renders with default props', () => {
      render(<ResizableHandle />)
      
      const handle = screen.getByTestId('resizable-handle')
      expect(handle).toBeInTheDocument()
      expect(handle).toHaveAttribute('data-slot', 'resizable-handle')
      expect(handle).toHaveClass('bg-border', 'relative', 'flex', 'w-px', 'items-center', 'justify-center')
    })

    it('renders without handle by default', () => {
      render(<ResizableHandle />)
      
      expect(screen.queryByTestId('grip-vertical-icon')).not.toBeInTheDocument()
    })

    it('renders with handle when withHandle is true', () => {
      render(<ResizableHandle withHandle />)
      
      const handle = screen.getByTestId('resizable-handle')
      const gripIcon = screen.getByTestId('grip-vertical-icon')
      
      expect(handle).toBeInTheDocument()
      expect(gripIcon).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<ResizableHandle className="custom-handle" />)
      
      const handle = screen.getByTestId('resizable-handle')
      expect(handle).toHaveClass('custom-handle')
    })

    it('applies correct handle styling when withHandle is true', () => {
      render(<ResizableHandle withHandle />)
      
      const handle = screen.getByTestId('resizable-handle')
      const handleElement = handle.querySelector('[data-testid="grip-vertical-icon"]')?.parentElement
      
      expect(handleElement).toHaveClass(
        'bg-border',
        'z-10',
        'flex',
        'h-4',
        'w-3',
        'items-center',
        'justify-center',
        'rounded-xs',
        'border'
      )
    })

    it('renders grip icon with correct styling', () => {
      render(<ResizableHandle withHandle />)
      
      const gripIcon = screen.getByTestId('grip-vertical-icon')
      expect(gripIcon).toHaveClass('size-2.5')
    })

    it('passes through additional props', () => {
      render(<ResizableHandle data-testid="custom-handle" />)
      
      const handle = screen.getByTestId('custom-handle')
      expect(handle).toBeInTheDocument()
    })
  })

  describe('Complete Resizable Structure', () => {
    it('renders a complete resizable panel layout', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50}>
            <div>Left Panel</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div>Right Panel</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
      
      expect(screen.getByTestId('resizable-panel-group')).toBeInTheDocument()
      expect(screen.getAllByTestId('resizable-panel')).toHaveLength(2)
      expect(screen.getByTestId('resizable-handle')).toBeInTheDocument()
      expect(screen.getByTestId('grip-vertical-icon')).toBeInTheDocument()
      
      expect(screen.getByText('Left Panel')).toBeInTheDocument()
      expect(screen.getByText('Right Panel')).toBeInTheDocument()
    })

    it('renders vertical layout', () => {
      render(
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <div>Top Panel</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={40}>
            <div>Bottom Panel</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
      
      const group = screen.getByTestId('resizable-panel-group')
      expect(group).toHaveAttribute('direction', 'vertical')
      expect(screen.getByText('Top Panel')).toBeInTheDocument()
      expect(screen.getByText('Bottom Panel')).toBeInTheDocument()
    })

    it('renders multiple panels with handles', () => {
      render(
        <ResizablePanelGroup>
          <ResizablePanel defaultSize={33}>
            <div>Panel 1</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={34}>
            <div>Panel 2</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={33}>
            <div>Panel 3</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
      
      expect(screen.getAllByTestId('resizable-panel')).toHaveLength(3)
      expect(screen.getAllByTestId('resizable-handle')).toHaveLength(2)
      expect(screen.getAllByTestId('grip-vertical-icon')).toHaveLength(2)
      
      expect(screen.getByText('Panel 1')).toBeInTheDocument()
      expect(screen.getByText('Panel 2')).toBeInTheDocument()
      expect(screen.getByText('Panel 3')).toBeInTheDocument()
    })

    it('handles empty panels', () => {
      render(
        <ResizablePanelGroup>
          <ResizablePanel />
          <ResizableHandle />
          <ResizablePanel />
        </ResizablePanelGroup>
      )
      
      expect(screen.getByTestId('resizable-panel-group')).toBeInTheDocument()
      expect(screen.getAllByTestId('resizable-panel')).toHaveLength(2)
      expect(screen.getByTestId('resizable-handle')).toBeInTheDocument()
    })

    it('handles complex nested content', () => {
      render(
        <ResizablePanelGroup>
          <ResizablePanel>
            <div>
              <h3>Left Sidebar</h3>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div>
              <h3>Main Content</h3>
              <p>Main content area</p>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
      
      expect(screen.getByText('Left Sidebar')).toBeInTheDocument()
      expect(screen.getByText('Main Content')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Main content area')).toBeInTheDocument()
    })
  })
})
