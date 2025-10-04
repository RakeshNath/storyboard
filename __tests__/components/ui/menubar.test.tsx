import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  Menubar,
  MenubarMenu,
  MenubarGroup,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarTrigger,
  MenubarContent,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent
} from '@/components/ui/menubar'

// Mock Radix UI Menubar
jest.mock('@radix-ui/react-menubar', () => ({
  Root: ({ children, className, ...props }: any) => (
    <div data-testid="menubar" className={className} {...props}>
      {children}
    </div>
  ),
  Menu: ({ children, ...props }: any) => (
    <div data-testid="menubar-menu" {...props}>
      {children}
    </div>
  ),
  Group: ({ children, ...props }: any) => (
    <div data-testid="menubar-group" {...props}>
      {children}
    </div>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="menubar-portal" {...props}>
      {children}
    </div>
  ),
  RadioGroup: ({ children, ...props }: any) => (
    <div data-testid="menubar-radio-group" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, className, ...props }: any) => (
    <button data-testid="menubar-trigger" className={className} {...props}>
      {children}
    </button>
  ),
  Content: ({ children, className, ...props }: any) => (
    <div data-testid="menubar-content" className={className} {...props}>
      {children}
    </div>
  ),
  Separator: ({ className, ...props }: any) => (
    <div data-testid="menubar-separator" className={className} {...props} />
  ),
  Label: ({ children, ...props }: any) => (
    <div data-testid="menubar-label" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, ...props }: any) => (
    <div data-testid="menubar-item" {...props}>
      {children}
    </div>
  ),
  CheckboxItem: ({ children, ...props }: any) => (
    <div data-testid="menubar-checkbox-item" {...props}>
      {children}
    </div>
  ),
  RadioItem: ({ children, ...props }: any) => (
    <div data-testid="menubar-radio-item" {...props}>
      {children}
    </div>
  ),
  Sub: ({ children, ...props }: any) => (
    <div data-testid="menubar-sub" {...props}>
      {children}
    </div>
  ),
  SubTrigger: ({ children, ...props }: any) => (
    <div data-testid="menubar-sub-trigger" {...props}>
      {children}
    </div>
  ),
  SubContent: ({ children, className, ...props }: any) => (
    <div data-testid="menubar-sub-content" className={className} {...props}>
      {children}
    </div>
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

describe('Menubar Components', () => {
  describe('Menubar', () => {
    it('renders with default props', () => {
      render(<Menubar />)
      
      const menubar = screen.getByTestId('menubar')
      expect(menubar).toBeInTheDocument()
      expect(menubar).toHaveAttribute('data-slot', 'menubar')
      expect(menubar).toHaveClass('bg-background', 'flex', 'h-9', 'items-center', 'gap-1')
    })

    it('renders with custom className', () => {
      render(<Menubar className="custom-menubar" />)
      
      const menubar = screen.getByTestId('menubar')
      expect(menubar).toHaveClass('custom-menubar')
    })

    it('renders children', () => {
      render(
        <Menubar>
          <div>Menubar Content</div>
        </Menubar>
      )
      
      expect(screen.getByText('Menubar Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<Menubar data-testid="custom-menubar" />)
      
      const menubar = screen.getByTestId('custom-menubar')
      expect(menubar).toBeInTheDocument()
    })
  })

  describe('MenubarMenu', () => {
    it('renders with default props', () => {
      render(<MenubarMenu />)
      
      const menu = screen.getByTestId('menubar-menu')
      expect(menu).toBeInTheDocument()
      expect(menu).toHaveAttribute('data-slot', 'menubar-menu')
    })

    it('renders children', () => {
      render(
        <MenubarMenu>
          <div>Menu Content</div>
        </MenubarMenu>
      )
      
      expect(screen.getByText('Menu Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<MenubarMenu data-testid="custom-menu" />)
      
      const menu = screen.getByTestId('custom-menu')
      expect(menu).toBeInTheDocument()
    })
  })

  describe('MenubarGroup', () => {
    it('renders with default props', () => {
      render(<MenubarGroup />)
      
      const group = screen.getByTestId('menubar-group')
      expect(group).toBeInTheDocument()
      expect(group).toHaveAttribute('data-slot', 'menubar-group')
    })

    it('renders children', () => {
      render(
        <MenubarGroup>
          <div>Group Content</div>
        </MenubarGroup>
      )
      
      expect(screen.getByText('Group Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<MenubarGroup data-testid="custom-group" />)
      
      const group = screen.getByTestId('custom-group')
      expect(group).toBeInTheDocument()
    })
  })

  describe('MenubarPortal', () => {
    it('renders with default props', () => {
      render(<MenubarPortal />)
      
      const portal = screen.getByTestId('menubar-portal')
      expect(portal).toBeInTheDocument()
      expect(portal).toHaveAttribute('data-slot', 'menubar-portal')
    })

    it('renders children', () => {
      render(
        <MenubarPortal>
          <div>Portal Content</div>
        </MenubarPortal>
      )
      
      expect(screen.getByText('Portal Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<MenubarPortal data-testid="custom-portal" />)
      
      const portal = screen.getByTestId('custom-portal')
      expect(portal).toBeInTheDocument()
    })
  })

  describe('MenubarRadioGroup', () => {
    it('renders with default props', () => {
      render(<MenubarRadioGroup />)
      
      const radioGroup = screen.getByTestId('menubar-radio-group')
      expect(radioGroup).toBeInTheDocument()
      expect(radioGroup).toHaveAttribute('data-slot', 'menubar-radio-group')
    })

    it('renders children', () => {
      render(
        <MenubarRadioGroup>
          <div>Radio Group Content</div>
        </MenubarRadioGroup>
      )
      
      expect(screen.getByText('Radio Group Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<MenubarRadioGroup data-testid="custom-radio-group" />)
      
      const radioGroup = screen.getByTestId('custom-radio-group')
      expect(radioGroup).toBeInTheDocument()
    })
  })

  describe('MenubarTrigger', () => {
    it('renders with default props', () => {
      render(<MenubarTrigger>Trigger</MenubarTrigger>)
      
      const trigger = screen.getByTestId('menubar-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'menubar-trigger')
      expect(trigger).toHaveClass('flex', 'items-center', 'rounded-sm', 'px-2', 'py-1')
      expect(trigger).toHaveTextContent('Trigger')
    })

    it('renders with custom className', () => {
      render(<MenubarTrigger className="custom-trigger">Trigger</MenubarTrigger>)
      
      const trigger = screen.getByTestId('menubar-trigger')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('renders as button by default', () => {
      render(<MenubarTrigger>Button Trigger</MenubarTrigger>)
      
      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<MenubarTrigger data-testid="custom-trigger">Trigger</MenubarTrigger>)
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('MenubarContent', () => {
    it('renders with default props', () => {
      render(<MenubarContent>Content</MenubarContent>)
      
      const portal = screen.getByTestId('menubar-portal')
      const content = screen.getByTestId('menubar-content')
      
      expect(portal).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'menubar-content')
    })

    it('renders with custom className', () => {
      render(<MenubarContent className="custom-content">Content</MenubarContent>)
      
      const content = screen.getByTestId('menubar-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders children', () => {
      render(
        <MenubarContent>
          <div>Content</div>
        </MenubarContent>
      )
      
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<MenubarContent data-testid="custom-content">Content</MenubarContent>)
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('MenubarSeparator', () => {
    it('renders with default props', () => {
      render(<MenubarSeparator />)
      
      const separator = screen.getByTestId('menubar-separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('data-slot', 'menubar-separator')
      expect(separator).toHaveClass('bg-border', '-mx-1', 'my-1', 'h-px')
    })

    it('renders with custom className', () => {
      render(<MenubarSeparator className="custom-separator" />)
      
      const separator = screen.getByTestId('menubar-separator')
      expect(separator).toHaveClass('custom-separator')
    })

    it('passes through additional props', () => {
      render(<MenubarSeparator data-testid="custom-separator" />)
      
      const separator = screen.getByTestId('custom-separator')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('MenubarLabel', () => {
    it('renders with default props', () => {
      render(<MenubarLabel>Label</MenubarLabel>)
      
      const label = screen.getByTestId('menubar-label')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('data-slot', 'menubar-label')
      expect(label).toHaveTextContent('Label')
    })

    it('passes through additional props', () => {
      render(<MenubarLabel data-testid="custom-label">Label</MenubarLabel>)
      
      const label = screen.getByTestId('custom-label')
      expect(label).toBeInTheDocument()
    })
  })

  describe('MenubarItem', () => {
    it('renders with default props', () => {
      render(<MenubarItem>Item</MenubarItem>)
      
      const item = screen.getByTestId('menubar-item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'menubar-item')
      expect(item).toHaveTextContent('Item')
    })

    it('passes through additional props', () => {
      render(<MenubarItem data-testid="custom-item">Item</MenubarItem>)
      
      const item = screen.getByTestId('custom-item')
      expect(item).toBeInTheDocument()
    })
  })

  describe('MenubarCheckboxItem', () => {
    it('renders with default props', () => {
      render(<MenubarCheckboxItem>Checkbox Item</MenubarCheckboxItem>)
      
      const item = screen.getByTestId('menubar-checkbox-item')
      const indicator = screen.getByTestId('item-indicator')
      const checkIcon = screen.getByTestId('check-icon')
      
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'menubar-checkbox-item')
      expect(indicator).toBeInTheDocument()
      expect(checkIcon).toBeInTheDocument()
      expect(item).toHaveTextContent('Checkbox Item')
    })

    it('passes through additional props', () => {
      render(<MenubarCheckboxItem data-testid="custom-checkbox">Item</MenubarCheckboxItem>)
      
      const item = screen.getByTestId('custom-checkbox')
      expect(item).toBeInTheDocument()
    })
  })

  describe('MenubarRadioItem', () => {
    it('renders with default props', () => {
      render(<MenubarRadioItem>Radio Item</MenubarRadioItem>)
      
      const item = screen.getByTestId('menubar-radio-item')
      const indicator = screen.getByTestId('item-indicator')
      const circleIcon = screen.getByTestId('circle-icon')
      
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'menubar-radio-item')
      expect(indicator).toBeInTheDocument()
      expect(circleIcon).toBeInTheDocument()
      expect(item).toHaveTextContent('Radio Item')
    })

    it('passes through additional props', () => {
      render(<MenubarRadioItem data-testid="custom-radio">Item</MenubarRadioItem>)
      
      const item = screen.getByTestId('custom-radio')
      expect(item).toBeInTheDocument()
    })
  })

  describe('MenubarShortcut', () => {
    it('renders with default props', () => {
      render(<MenubarShortcut>⌘K</MenubarShortcut>)
      
      const shortcut = screen.getByTestId('menubar-shortcut')
      expect(shortcut).toBeInTheDocument()
      expect(shortcut).toHaveAttribute('data-slot', 'menubar-shortcut')
      expect(shortcut).toHaveTextContent('⌘K')
    })

    it('passes through additional props', () => {
      render(<MenubarShortcut data-testid="custom-shortcut">⌘K</MenubarShortcut>)
      
      const shortcut = screen.getByTestId('custom-shortcut')
      expect(shortcut).toBeInTheDocument()
    })
  })

  describe('MenubarSub', () => {
    it('renders with default props', () => {
      render(<MenubarSub />)
      
      const sub = screen.getByTestId('menubar-sub')
      expect(sub).toBeInTheDocument()
      expect(sub).toHaveAttribute('data-slot', 'menubar-sub')
    })

    it('renders children', () => {
      render(
        <MenubarSub>
          <div>Sub Content</div>
        </MenubarSub>
      )
      
      expect(screen.getByText('Sub Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<MenubarSub data-testid="custom-sub" />)
      
      const sub = screen.getByTestId('custom-sub')
      expect(sub).toBeInTheDocument()
    })
  })

  describe('MenubarSubTrigger', () => {
    it('renders with default props', () => {
      render(<MenubarSubTrigger>Sub Trigger</MenubarSubTrigger>)
      
      const trigger = screen.getByTestId('menubar-sub-trigger')
      const chevronIcon = screen.getByTestId('chevron-right-icon')
      
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'menubar-sub-trigger')
      expect(trigger).toHaveTextContent('Sub Trigger')
      expect(chevronIcon).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<MenubarSubTrigger data-testid="custom-sub-trigger">Trigger</MenubarSubTrigger>)
      
      const trigger = screen.getByTestId('custom-sub-trigger')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('MenubarSubContent', () => {
    it('renders with default props', () => {
      render(<MenubarSubContent>Sub Content</MenubarSubContent>)
      
      const content = screen.getByTestId('menubar-sub-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'menubar-sub-content')
      expect(content).toHaveTextContent('Sub Content')
    })

    it('renders with custom className', () => {
      render(<MenubarSubContent className="custom-sub-content">Content</MenubarSubContent>)
      
      const content = screen.getByTestId('menubar-sub-content')
      expect(content).toHaveClass('custom-sub-content')
    })

    it('passes through additional props', () => {
      render(<MenubarSubContent data-testid="custom-sub-content">Content</MenubarSubContent>)
      
      const content = screen.getByTestId('custom-sub-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Complete Menubar Structure', () => {
    it('renders a complete menubar', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New File</MenubarItem>
              <MenubarItem>Open</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Exit</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Cut</MenubarItem>
              <MenubarItem>Copy</MenubarItem>
              <MenubarItem>Paste</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      
      expect(screen.getByTestId('menubar')).toBeInTheDocument()
      expect(screen.getAllByTestId('menubar-menu')).toHaveLength(2)
      expect(screen.getAllByTestId('menubar-trigger')).toHaveLength(2)
      expect(screen.getAllByTestId('menubar-content')).toHaveLength(2)
      expect(screen.getAllByTestId('menubar-item')).toHaveLength(6)
      expect(screen.getAllByTestId('menubar-separator')).toHaveLength(1)
      
      expect(screen.getByText('File')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('New File')).toBeInTheDocument()
      expect(screen.getByText('Open')).toBeInTheDocument()
      expect(screen.getByText('Exit')).toBeInTheDocument()
      expect(screen.getByText('Cut')).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
      expect(screen.getByText('Paste')).toBeInTheDocument()
    })

    it('renders menubar with checkbox items', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem>Show Sidebar</MenubarCheckboxItem>
              <MenubarCheckboxItem>Show Toolbar</MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      
      expect(screen.getAllByTestId('menubar-checkbox-item')).toHaveLength(2)
      expect(screen.getAllByTestId('check-icon')).toHaveLength(2)
    })

    it('renders menubar with radio items', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Theme</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup>
                <MenubarRadioItem>Light</MenubarRadioItem>
                <MenubarRadioItem>Dark</MenubarRadioItem>
                <MenubarRadioItem>System</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      
      expect(screen.getByTestId('menubar-radio-group')).toBeInTheDocument()
      expect(screen.getAllByTestId('menubar-radio-item')).toHaveLength(3)
      expect(screen.getAllByTestId('circle-icon')).toHaveLength(3)
    })

    it('renders menubar with submenu', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Tools</MenubarTrigger>
            <MenubarContent>
              <MenubarSub>
                <MenubarSubTrigger>External Tools</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Tool 1</MenubarItem>
                  <MenubarItem>Tool 2</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      
      expect(screen.getByTestId('menubar-sub')).toBeInTheDocument()
      expect(screen.getByTestId('menubar-sub-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('menubar-sub-content')).toBeInTheDocument()
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument()
    })
  })
})
