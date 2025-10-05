import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuRadioGroup,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuContent,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuLabel,
  ContextMenuRadioItem
} from '@/components/ui/context-menu'

// Mock Radix UI Context Menu
jest.mock('@radix-ui/react-context-menu', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="context-menu" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <div data-testid="context-menu-trigger" {...props}>
      {children}
    </div>
  ),
  Group: ({ children, ...props }: any) => (
    <div data-testid="context-menu-group" {...props}>
      {children}
    </div>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="context-menu-portal" {...props}>
      {children}
    </div>
  ),
  Sub: ({ children, ...props }: any) => (
    <div data-testid="context-menu-sub" {...props}>
      {children}
    </div>
  ),
  RadioGroup: ({ children, ...props }: any) => (
    <div data-testid="context-menu-radio-group" {...props}>
      {children}
    </div>
  ),
  SubTrigger: ({ children, ...props }: any) => (
    <div data-testid="context-menu-sub-trigger" {...props}>
      {children}
    </div>
  ),
  SubContent: ({ children, ...props }: any) => (
    <div data-testid="context-menu-sub-content" {...props}>
      {children}
    </div>
  ),
  Content: ({ children, ...props }: any) => (
    <div data-testid="context-menu-content" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, ...props }: any) => (
    <div data-testid="context-menu-item" {...props}>
      {children}
    </div>
  ),
  CheckboxItem: ({ children, ...props }: any) => (
    <div data-testid="context-menu-checkbox-item" {...props}>
      {children}
    </div>
  ),
  RadioItem: ({ children, ...props }: any) => (
    <div data-testid="context-menu-radio-item" {...props}>
      {children}
    </div>
  ),
  Label: ({ children, ...props }: any) => (
    <div data-testid="context-menu-label" {...props}>
      {children}
    </div>
  ),
  Separator: ({ children, ...props }: any) => (
    <div data-testid="context-menu-separator" {...props}>
      {children}
    </div>
  ),
  Shortcut: ({ children, ...props }: any) => (
    <span data-testid="context-menu-shortcut" {...props}>
      {children}
    </span>
  ),
  ItemIndicator: ({ children, ...props }: any) => (
    <div data-testid="item-indicator" {...props}>
      {children}
    </div>
  ),
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  CheckIcon: ({ className, ...props }: any) => (
    <div data-testid="check-icon" className={className} {...props} />
  ),
  ChevronRightIcon: ({ className, ...props }: any) => (
    <div data-testid="chevron-right-icon" className={className} {...props} />
  ),
  CircleIcon: ({ className, ...props }: any) => (
    <div data-testid="circle-icon" className={className} {...props} />
  ),
}))

describe('Context Menu Components', () => {
  describe('ContextMenu', () => {
    it('renders with default props', () => {
      render(<ContextMenu />)
      
      const contextMenu = screen.getByTestId('context-menu')
      expect(contextMenu).toBeInTheDocument()
      expect(contextMenu).toHaveAttribute('data-slot', 'context-menu')
    })

    it('renders children', () => {
      render(
        <ContextMenu>
          <div>Menu Content</div>
        </ContextMenu>
      )
      
      expect(screen.getByText('Menu Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<ContextMenu data-testid="custom-context-menu" />)
      
      const contextMenu = screen.getByTestId('custom-context-menu')
      expect(contextMenu).toBeInTheDocument()
    })
  })

  describe('ContextMenuTrigger', () => {
    it('renders with default props', () => {
      render(<ContextMenuTrigger>Trigger</ContextMenuTrigger>)
      
      const trigger = screen.getByTestId('context-menu-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'context-menu-trigger')
      expect(trigger).toHaveTextContent('Trigger')
    })

    it('passes through additional props', () => {
      render(<ContextMenuTrigger data-testid="custom-trigger">Trigger</ContextMenuTrigger>)
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('ContextMenuContent', () => {
    it('renders with default props', () => {
      render(<ContextMenuContent>Content</ContextMenuContent>)
      
      const portal = screen.getByTestId('context-menu-portal')
      const content = screen.getByTestId('context-menu-content')
      
      expect(portal).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'context-menu-content')
    })

    it('renders with custom className', () => {
      render(<ContextMenuContent className="custom-content">Content</ContextMenuContent>)
      
      const content = screen.getByTestId('context-menu-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders children', () => {
      render(
        <ContextMenuContent>
          <div>Content</div>
        </ContextMenuContent>
      )
      
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<ContextMenuContent data-testid="custom-content">Content</ContextMenuContent>)
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('ContextMenuItem', () => {
    it('renders with default props', () => {
      render(<ContextMenuItem>Item</ContextMenuItem>)
      
      const item = screen.getByTestId('context-menu-item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'context-menu-item')
      expect(item).toHaveTextContent('Item')
    })

    it('renders with custom className', () => {
      render(<ContextMenuItem className="custom-item">Item</ContextMenuItem>)
      
      const item = screen.getByTestId('context-menu-item')
      expect(item).toHaveClass('custom-item')
    })

    it('passes through additional props', () => {
      render(<ContextMenuItem data-testid="custom-item">Item</ContextMenuItem>)
      
      const item = screen.getByTestId('custom-item')
      expect(item).toBeInTheDocument()
    })
  })

  describe('ContextMenuCheckboxItem', () => {
    it('renders with default props', () => {
      render(<ContextMenuCheckboxItem>Checkbox Item</ContextMenuCheckboxItem>)
      
      const item = screen.getByTestId('context-menu-checkbox-item')
      const indicator = screen.getByTestId('item-indicator')
      const checkIcon = screen.getByTestId('check-icon')
      
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'context-menu-checkbox-item')
      expect(indicator).toBeInTheDocument()
      expect(checkIcon).toBeInTheDocument()
      expect(item).toHaveTextContent('Checkbox Item')
    })

    it('renders with custom className', () => {
      render(<ContextMenuCheckboxItem className="custom-checkbox">Item</ContextMenuCheckboxItem>)
      
      const item = screen.getByTestId('context-menu-checkbox-item')
      expect(item).toHaveClass('custom-checkbox')
    })

    it('passes through additional props', () => {
      render(<ContextMenuCheckboxItem data-testid="custom-checkbox">Item</ContextMenuCheckboxItem>)
      
      const item = screen.getByTestId('custom-checkbox')
      expect(item).toBeInTheDocument()
    })
  })

  describe('ContextMenuRadioGroup', () => {
    it('renders with default props', () => {
      render(<ContextMenuRadioGroup />)
      
      const group = screen.getByTestId('context-menu-radio-group')
      expect(group).toBeInTheDocument()
      expect(group).toHaveAttribute('data-slot', 'context-menu-radio-group')
    })

    it('renders children', () => {
      render(
        <ContextMenuRadioGroup>
          <div>Radio Group Content</div>
        </ContextMenuRadioGroup>
      )
      
      expect(screen.getByText('Radio Group Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<ContextMenuRadioGroup data-testid="custom-radio-group" />)
      
      const group = screen.getByTestId('custom-radio-group')
      expect(group).toBeInTheDocument()
    })
  })

  describe('ContextMenuRadioItem', () => {
    it('renders with default props', () => {
      render(<ContextMenuRadioItem>Radio Item</ContextMenuRadioItem>)
      
      const item = screen.getByTestId('context-menu-radio-item')
      const indicator = screen.getByTestId('item-indicator')
      const circleIcon = screen.getByTestId('circle-icon')
      
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'context-menu-radio-item')
      expect(indicator).toBeInTheDocument()
      expect(circleIcon).toBeInTheDocument()
      expect(item).toHaveTextContent('Radio Item')
    })

    it('renders with custom className', () => {
      render(<ContextMenuRadioItem className="custom-radio">Item</ContextMenuRadioItem>)
      
      const item = screen.getByTestId('context-menu-radio-item')
      expect(item).toHaveClass('custom-radio')
    })

    it('passes through additional props', () => {
      render(<ContextMenuRadioItem data-testid="custom-radio">Item</ContextMenuRadioItem>)
      
      const item = screen.getByTestId('custom-radio')
      expect(item).toBeInTheDocument()
    })
  })

  describe('ContextMenuLabel', () => {
    it('renders with default props', () => {
      render(<ContextMenuLabel>Label</ContextMenuLabel>)
      
      const label = screen.getByTestId('context-menu-label')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('data-slot', 'context-menu-label')
      expect(label).toHaveTextContent('Label')
    })

    it('renders with custom className', () => {
      render(<ContextMenuLabel className="custom-label">Label</ContextMenuLabel>)
      
      const label = screen.getByTestId('context-menu-label')
      expect(label).toHaveClass('custom-label')
    })

    it('passes through additional props', () => {
      render(<ContextMenuLabel data-testid="custom-label">Label</ContextMenuLabel>)
      
      const label = screen.getByTestId('custom-label')
      expect(label).toBeInTheDocument()
    })
  })

  describe('ContextMenuSeparator', () => {
    it('renders with default props', () => {
      render(<ContextMenuSeparator />)
      
      const separator = screen.getByTestId('context-menu-separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('data-slot', 'context-menu-separator')
    })

    it('renders with custom className', () => {
      render(<ContextMenuSeparator className="custom-separator" />)
      
      const separator = screen.getByTestId('context-menu-separator')
      expect(separator).toHaveClass('custom-separator')
    })

    it('passes through additional props', () => {
      render(<ContextMenuSeparator data-testid="custom-separator" />)
      
      const separator = screen.getByTestId('custom-separator')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('ContextMenuShortcut', () => {
    it('renders with default props', () => {
      render(<ContextMenuShortcut>⌘K</ContextMenuShortcut>)
      
      const shortcut = screen.getByTestId('context-menu-shortcut')
      expect(shortcut).toBeInTheDocument()
      expect(shortcut).toHaveAttribute('data-slot', 'context-menu-shortcut')
      expect(shortcut).toHaveTextContent('⌘K')
    })

    it('renders with custom className', () => {
      render(<ContextMenuShortcut className="custom-shortcut">⌘K</ContextMenuShortcut>)
      
      const shortcut = screen.getByTestId('context-menu-shortcut')
      expect(shortcut).toHaveClass('custom-shortcut')
    })

    it('passes through additional props', () => {
      render(<ContextMenuShortcut data-testid="custom-shortcut">⌘K</ContextMenuShortcut>)
      
      const shortcut = screen.getByTestId('custom-shortcut')
      expect(shortcut).toBeInTheDocument()
    })
  })

  describe('Complete Context Menu Structure', () => {
    it('renders a complete context menu', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuLabel>My Account</ContextMenuLabel>
              <ContextMenuItem>Profile</ContextMenuItem>
              <ContextMenuItem>Settings</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Logout</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      )
      
      expect(screen.getByTestId('context-menu')).toBeInTheDocument()
      expect(screen.getByTestId('context-menu-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('context-menu-content')).toBeInTheDocument()
      expect(screen.getByTestId('context-menu-group')).toBeInTheDocument()
      expect(screen.getByTestId('context-menu-label')).toBeInTheDocument()
      expect(screen.getAllByTestId('context-menu-item')).toHaveLength(3)
      expect(screen.getByTestId('context-menu-separator')).toBeInTheDocument()
      
      expect(screen.getByText('Right-click me')).toBeInTheDocument()
      expect(screen.getByText('My Account')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it('renders context menu with checkbox items', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuCheckboxItem>Option 1</ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Option 2</ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      
      expect(screen.getAllByTestId('context-menu-checkbox-item')).toHaveLength(2)
      expect(screen.getAllByTestId('check-icon')).toHaveLength(2)
    })

    it('renders context menu with radio items', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuRadioGroup>
              <ContextMenuRadioItem>Radio 1</ContextMenuRadioItem>
              <ContextMenuRadioItem>Radio 2</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      )
      
      expect(screen.getByTestId('context-menu-radio-group')).toBeInTheDocument()
      expect(screen.getAllByTestId('context-menu-radio-item')).toHaveLength(2)
      expect(screen.getAllByTestId('circle-icon')).toHaveLength(2)
    })
  })

  describe('Context Menu Sub Components', () => {
    describe('ContextMenuPortal', () => {
      it('renders with default props', () => {
        render(
          <ContextMenuPortal>
            <div>Portal Content</div>
          </ContextMenuPortal>
        )
        
        const portal = screen.getByTestId('context-menu-portal')
        expect(portal).toBeInTheDocument()
        expect(portal).toHaveTextContent('Portal Content')
      })

      it('renders children', () => {
        render(
          <ContextMenuPortal>
            <div>Test Portal</div>
          </ContextMenuPortal>
        )
        
        expect(screen.getByText('Test Portal')).toBeInTheDocument()
      })

      it('passes through additional props', () => {
        render(
          <ContextMenuPortal data-testid="custom-portal">
            <div>Portal</div>
          </ContextMenuPortal>
        )
        
        const portal = screen.getByTestId('custom-portal')
        expect(portal).toBeInTheDocument()
      })
    })

    describe('ContextMenuSub', () => {
      it('renders with default props', () => {
        render(
          <ContextMenuSub>
            <div>Sub Content</div>
          </ContextMenuSub>
        )
        
        const sub = screen.getByTestId('context-menu-sub')
        expect(sub).toBeInTheDocument()
        expect(sub).toHaveTextContent('Sub Content')
      })

      it('renders children', () => {
        render(
          <ContextMenuSub>
            <div>Test Sub</div>
          </ContextMenuSub>
        )
        
        expect(screen.getByText('Test Sub')).toBeInTheDocument()
      })

      it('passes through additional props', () => {
        render(
          <ContextMenuSub data-testid="custom-sub">
            <div>Sub</div>
          </ContextMenuSub>
        )
        
        const sub = screen.getByTestId('custom-sub')
        expect(sub).toBeInTheDocument()
      })
    })

    describe('ContextMenuSubContent', () => {
      it('renders with default props', () => {
        render(
          <ContextMenuSubContent>
            <div>Sub Content</div>
          </ContextMenuSubContent>
        )
        
        const subContent = screen.getByTestId('context-menu-sub-content')
        expect(subContent).toBeInTheDocument()
        expect(subContent).toHaveTextContent('Sub Content')
      })

      it('renders with custom className', () => {
        render(
          <ContextMenuSubContent className="custom-sub-content">
            <div>Sub Content</div>
          </ContextMenuSubContent>
        )
        
        const subContent = screen.getByTestId('context-menu-sub-content')
        expect(subContent).toHaveClass('custom-sub-content')
      })

      it('renders children', () => {
        render(
          <ContextMenuSubContent>
            <div>Test Sub Content</div>
          </ContextMenuSubContent>
        )
        
        expect(screen.getByText('Test Sub Content')).toBeInTheDocument()
      })

      it('passes through additional props', () => {
        render(
          <ContextMenuSubContent data-testid="custom-sub-content">
            <div>Sub Content</div>
          </ContextMenuSubContent>
        )
        
        const subContent = screen.getByTestId('custom-sub-content')
        expect(subContent).toBeInTheDocument()
      })
    })

    describe('ContextMenuSubTrigger', () => {
      it('renders with default props', () => {
        render(
          <ContextMenuSubTrigger>
            <div>Sub Trigger</div>
          </ContextMenuSubTrigger>
        )
        
        const subTrigger = screen.getByTestId('context-menu-sub-trigger')
        expect(subTrigger).toBeInTheDocument()
        expect(subTrigger).toHaveTextContent('Sub Trigger')
      })

      it('renders with custom className', () => {
        render(
          <ContextMenuSubTrigger className="custom-sub-trigger">
            <div>Sub Trigger</div>
          </ContextMenuSubTrigger>
        )
        
        const subTrigger = screen.getByTestId('context-menu-sub-trigger')
        expect(subTrigger).toHaveClass('custom-sub-trigger')
      })

      it('renders children', () => {
        render(
          <ContextMenuSubTrigger>
            <div>Test Sub Trigger</div>
          </ContextMenuSubTrigger>
        )
        
        expect(screen.getByText('Test Sub Trigger')).toBeInTheDocument()
      })

      it('passes through additional props', () => {
        render(
          <ContextMenuSubTrigger data-testid="custom-sub-trigger">
            <div>Sub Trigger</div>
          </ContextMenuSubTrigger>
        )
        
        const subTrigger = screen.getByTestId('custom-sub-trigger')
        expect(subTrigger).toBeInTheDocument()
      })
    })

    describe('Complete Sub Menu Structure', () => {
      it('renders a complete sub menu', () => {
        render(
          <ContextMenu>
            <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Item 1</ContextMenuItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger>Sub Menu</ContextMenuSubTrigger>
                <ContextMenuPortal>
                  <ContextMenuSubContent>
                    <ContextMenuItem>Sub Item 1</ContextMenuItem>
                    <ContextMenuItem>Sub Item 2</ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuPortal>
              </ContextMenuSub>
              <ContextMenuItem>Item 2</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
        
        // Check all components are rendered
        expect(screen.getByTestId('context-menu')).toBeInTheDocument()
        expect(screen.getByTestId('context-menu-trigger')).toBeInTheDocument()
        expect(screen.getByTestId('context-menu-content')).toBeInTheDocument()
        expect(screen.getByTestId('context-menu-sub')).toBeInTheDocument()
        expect(screen.getByTestId('context-menu-sub-trigger')).toBeInTheDocument()
        expect(screen.getAllByTestId('context-menu-portal')).toHaveLength(2) // Main portal + sub portal
        expect(screen.getByTestId('context-menu-sub-content')).toBeInTheDocument()
        
        // Check text content
        expect(screen.getByText('Right-click me')).toBeInTheDocument()
        expect(screen.getByText('Sub Menu')).toBeInTheDocument()
        expect(screen.getByText('Sub Item 1')).toBeInTheDocument()
        expect(screen.getByText('Sub Item 2')).toBeInTheDocument()
      })
    })
  })
})
