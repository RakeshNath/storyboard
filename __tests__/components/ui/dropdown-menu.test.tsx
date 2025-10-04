import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu'

// Mock Radix UI Dropdown Menu
jest.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="dropdown-menu" {...props}>
      {children}
    </div>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="dropdown-menu-portal" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="dropdown-menu-trigger" {...props}>
      {children}
    </button>
  ),
  Content: ({ children, className, sideOffset, ...props }: any) => (
    <div 
      data-testid="dropdown-menu-content" 
      className={className}
      data-side-offset={sideOffset}
      {...props}
    >
      {children}
    </div>
  ),
  Group: ({ children, ...props }: any) => (
    <div data-testid="dropdown-menu-group" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, className, inset, variant, ...props }: any) => (
    <div 
      data-testid="dropdown-menu-item" 
      className={className}
      data-inset={inset}
      data-variant={variant}
      {...props}
    >
      {children}
    </div>
  ),
  CheckboxItem: ({ children, className, checked, ...props }: any) => (
    <div 
      data-testid="dropdown-menu-checkbox-item" 
      className={className}
      data-checked={checked ? 'true' : undefined}
      {...props}
    >
      {children}
    </div>
  ),
  RadioGroup: ({ children, ...props }: any) => (
    <div data-testid="dropdown-menu-radio-group" {...props}>
      {children}
    </div>
  ),
  RadioItem: ({ children, className, ...props }: any) => (
    <div 
      data-testid="dropdown-menu-radio-item" 
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Label: ({ children, className, inset, ...props }: any) => (
    <div 
      data-testid="dropdown-menu-label" 
      className={className}
      data-inset={inset}
      {...props}
    >
      {children}
    </div>
  ),
  Separator: ({ className, ...props }: any) => (
    <div 
      data-testid="dropdown-menu-separator" 
      className={className}
      {...props}
    />
  ),
  Sub: ({ children, ...props }: any) => (
    <div data-testid="dropdown-menu-sub" {...props}>
      {children}
    </div>
  ),
  SubTrigger: ({ children, className, inset, ...props }: any) => (
    <div 
      data-testid="dropdown-menu-sub-trigger" 
      className={className}
      data-inset={inset}
      {...props}
    >
      {children}
    </div>
  ),
  SubContent: ({ className, ...props }: any) => (
    <div 
      data-testid="dropdown-menu-sub-content" 
      className={className}
      {...props}
    />
  ),
  ItemIndicator: ({ children, ...props }: any) => (
    <div data-testid="item-indicator" {...props}>
      {children}
    </div>
  ),
  Shortcut: ({ children, className, ...props }: any) => (
    <span 
      data-testid="dropdown-menu-shortcut" 
      className={className}
      {...props}
    >
      {children}
    </span>
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

describe('Dropdown Menu Components', () => {
  describe('DropdownMenu', () => {
    it('renders with default props', () => {
      render(<DropdownMenu />)
      
      const dropdown = screen.getByTestId('dropdown-menu')
      expect(dropdown).toBeInTheDocument()
      expect(dropdown).toHaveAttribute('data-slot', 'dropdown-menu')
    })

    it('renders children', () => {
      render(
        <DropdownMenu>
          <div>Menu Content</div>
        </DropdownMenu>
      )
      
      expect(screen.getByText('Menu Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DropdownMenu data-testid="custom-dropdown" />)
      
      const dropdown = screen.getByTestId('custom-dropdown')
      expect(dropdown).toBeInTheDocument()
    })
  })

  describe('DropdownMenuPortal', () => {
    it('renders with default props', () => {
      render(<DropdownMenuPortal />)
      
      const portal = screen.getByTestId('dropdown-menu-portal')
      expect(portal).toBeInTheDocument()
      expect(portal).toHaveAttribute('data-slot', 'dropdown-menu-portal')
    })

    it('renders children', () => {
      render(
        <DropdownMenuPortal>
          <div>Portal Content</div>
        </DropdownMenuPortal>
      )
      
      expect(screen.getByText('Portal Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DropdownMenuPortal data-testid="custom-portal" />)
      
      const portal = screen.getByTestId('custom-portal')
      expect(portal).toBeInTheDocument()
    })
  })

  describe('DropdownMenuTrigger', () => {
    it('renders with default props', () => {
      render(<DropdownMenuTrigger>Trigger</DropdownMenuTrigger>)
      
      const trigger = screen.getByTestId('dropdown-menu-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'dropdown-menu-trigger')
      expect(trigger).toHaveTextContent('Trigger')
    })

    it('renders as button by default', () => {
      render(<DropdownMenuTrigger>Button Trigger</DropdownMenuTrigger>)
      
      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DropdownMenuTrigger data-testid="custom-trigger">Trigger</DropdownMenuTrigger>)
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('DropdownMenuContent', () => {
    it('renders with default props', () => {
      render(<DropdownMenuContent>Content</DropdownMenuContent>)
      
      const portal = screen.getByTestId('dropdown-menu-portal')
      const content = screen.getByTestId('dropdown-menu-content')
      
      expect(portal).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'dropdown-menu-content')
      expect(content).toHaveAttribute('data-side-offset', '4')
    })

    it('renders with custom sideOffset', () => {
      render(<DropdownMenuContent sideOffset={8}>Content</DropdownMenuContent>)
      
      const content = screen.getByTestId('dropdown-menu-content')
      expect(content).toHaveAttribute('data-side-offset', '8')
    })

    it('renders with custom className', () => {
      render(<DropdownMenuContent className="custom-content">Content</DropdownMenuContent>)
      
      const content = screen.getByTestId('dropdown-menu-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders children', () => {
      render(
        <DropdownMenuContent>
          <div>Content</div>
        </DropdownMenuContent>
      )
      
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DropdownMenuContent data-testid="custom-content">Content</DropdownMenuContent>)
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('DropdownMenuGroup', () => {
    it('renders with default props', () => {
      render(<DropdownMenuGroup />)
      
      const group = screen.getByTestId('dropdown-menu-group')
      expect(group).toBeInTheDocument()
      expect(group).toHaveAttribute('data-slot', 'dropdown-menu-group')
    })

    it('renders children', () => {
      render(
        <DropdownMenuGroup>
          <div>Group Content</div>
        </DropdownMenuGroup>
      )
      
      expect(screen.getByText('Group Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DropdownMenuGroup data-testid="custom-group" />)
      
      const group = screen.getByTestId('custom-group')
      expect(group).toBeInTheDocument()
    })
  })

  describe('DropdownMenuItem', () => {
    it('renders with default props', () => {
      render(<DropdownMenuItem>Item</DropdownMenuItem>)
      
      const item = screen.getByTestId('dropdown-menu-item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'dropdown-menu-item')
      expect(item).toHaveAttribute('data-variant', 'default')
      expect(item).toHaveTextContent('Item')
    })

    it('renders with destructive variant', () => {
      render(<DropdownMenuItem variant="destructive">Item</DropdownMenuItem>)
      
      const item = screen.getByTestId('dropdown-menu-item')
      expect(item).toHaveAttribute('data-variant', 'destructive')
    })

    it('renders with inset', () => {
      render(<DropdownMenuItem inset>Item</DropdownMenuItem>)
      
      const item = screen.getByTestId('dropdown-menu-item')
      expect(item).toHaveAttribute('data-inset', 'true')
    })

    it('renders with custom className', () => {
      render(<DropdownMenuItem className="custom-item">Item</DropdownMenuItem>)
      
      const item = screen.getByTestId('dropdown-menu-item')
      expect(item).toHaveClass('custom-item')
    })

    it('passes through additional props', () => {
      render(<DropdownMenuItem data-testid="custom-item">Item</DropdownMenuItem>)
      
      const item = screen.getByTestId('custom-item')
      expect(item).toBeInTheDocument()
    })
  })

  describe('DropdownMenuCheckboxItem', () => {
    it('renders with default props', () => {
      render(<DropdownMenuCheckboxItem>Checkbox Item</DropdownMenuCheckboxItem>)
      
      const item = screen.getByTestId('dropdown-menu-checkbox-item')
      const indicator = screen.getByTestId('item-indicator')
      const checkIcon = screen.getByTestId('check-icon')
      
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'dropdown-menu-checkbox-item')
      expect(item).toHaveAttribute('data-checked', 'false')
      expect(indicator).toBeInTheDocument()
      expect(checkIcon).toBeInTheDocument()
      expect(item).toHaveTextContent('Checkbox Item')
    })

    it('renders when checked', () => {
      render(<DropdownMenuCheckboxItem checked>Checked Item</DropdownMenuCheckboxItem>)
      
      const item = screen.getByTestId('dropdown-menu-checkbox-item')
      expect(item).toHaveAttribute('data-checked', 'true')
    })

    it('renders with custom className', () => {
      render(<DropdownMenuCheckboxItem className="custom-checkbox">Item</DropdownMenuCheckboxItem>)
      
      const item = screen.getByTestId('dropdown-menu-checkbox-item')
      expect(item).toHaveClass('custom-checkbox')
    })

    it('passes through additional props', () => {
      render(<DropdownMenuCheckboxItem data-testid="custom-checkbox">Item</DropdownMenuCheckboxItem>)
      
      const item = screen.getByTestId('custom-checkbox')
      expect(item).toBeInTheDocument()
    })
  })

  describe('DropdownMenuRadioGroup', () => {
    it('renders with default props', () => {
      render(<DropdownMenuRadioGroup />)
      
      const group = screen.getByTestId('dropdown-menu-radio-group')
      expect(group).toBeInTheDocument()
      expect(group).toHaveAttribute('data-slot', 'dropdown-menu-radio-group')
    })

    it('renders children', () => {
      render(
        <DropdownMenuRadioGroup>
          <div>Radio Group Content</div>
        </DropdownMenuRadioGroup>
      )
      
      expect(screen.getByText('Radio Group Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DropdownMenuRadioGroup data-testid="custom-radio-group" />)
      
      const group = screen.getByTestId('custom-radio-group')
      expect(group).toBeInTheDocument()
    })
  })

  describe('DropdownMenuRadioItem', () => {
    it('renders with default props', () => {
      render(<DropdownMenuRadioItem>Radio Item</DropdownMenuRadioItem>)
      
      const item = screen.getByTestId('dropdown-menu-radio-item')
      const indicator = screen.getByTestId('item-indicator')
      const circleIcon = screen.getByTestId('circle-icon')
      
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'dropdown-menu-radio-item')
      expect(indicator).toBeInTheDocument()
      expect(circleIcon).toBeInTheDocument()
      expect(item).toHaveTextContent('Radio Item')
    })

    it('renders with custom className', () => {
      render(<DropdownMenuRadioItem className="custom-radio">Item</DropdownMenuRadioItem>)
      
      const item = screen.getByTestId('dropdown-menu-radio-item')
      expect(item).toHaveClass('custom-radio')
    })

    it('passes through additional props', () => {
      render(<DropdownMenuRadioItem data-testid="custom-radio">Item</DropdownMenuRadioItem>)
      
      const item = screen.getByTestId('custom-radio')
      expect(item).toBeInTheDocument()
    })
  })

  describe('DropdownMenuLabel', () => {
    it('renders with default props', () => {
      render(<DropdownMenuLabel>Label</DropdownMenuLabel>)
      
      const label = screen.getByTestId('dropdown-menu-label')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('data-slot', 'dropdown-menu-label')
      expect(label).toHaveTextContent('Label')
    })

    it('renders with inset', () => {
      render(<DropdownMenuLabel inset>Label</DropdownMenuLabel>)
      
      const label = screen.getByTestId('dropdown-menu-label')
      expect(label).toHaveAttribute('data-inset', 'true')
    })

    it('renders with custom className', () => {
      render(<DropdownMenuLabel className="custom-label">Label</DropdownMenuLabel>)
      
      const label = screen.getByTestId('dropdown-menu-label')
      expect(label).toHaveClass('custom-label')
    })

    it('passes through additional props', () => {
      render(<DropdownMenuLabel data-testid="custom-label">Label</DropdownMenuLabel>)
      
      const label = screen.getByTestId('custom-label')
      expect(label).toBeInTheDocument()
    })
  })

  describe('DropdownMenuSeparator', () => {
    it('renders with default props', () => {
      render(<DropdownMenuSeparator />)
      
      const separator = screen.getByTestId('dropdown-menu-separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('data-slot', 'dropdown-menu-separator')
      expect(separator).toHaveClass('bg-border', '-mx-1', 'my-1', 'h-px')
    })

    it('renders with custom className', () => {
      render(<DropdownMenuSeparator className="custom-separator" />)
      
      const separator = screen.getByTestId('dropdown-menu-separator')
      expect(separator).toHaveClass('custom-separator')
    })

    it('passes through additional props', () => {
      render(<DropdownMenuSeparator data-testid="custom-separator" />)
      
      const separator = screen.getByTestId('custom-separator')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('DropdownMenuShortcut', () => {
    it('renders with default props', () => {
      render(<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>)
      
      const shortcut = screen.getByTestId('dropdown-menu-shortcut')
      expect(shortcut).toBeInTheDocument()
      expect(shortcut).toHaveAttribute('data-slot', 'dropdown-menu-shortcut')
      expect(shortcut).toHaveClass('text-muted-foreground', 'ml-auto', 'text-xs', 'tracking-widest')
      expect(shortcut).toHaveTextContent('⌘K')
    })

    it('renders with custom className', () => {
      render(<DropdownMenuShortcut className="custom-shortcut">⌘K</DropdownMenuShortcut>)
      
      const shortcut = screen.getByTestId('dropdown-menu-shortcut')
      expect(shortcut).toHaveClass('custom-shortcut')
    })

    it('passes through additional props', () => {
      render(<DropdownMenuShortcut data-testid="custom-shortcut">⌘K</DropdownMenuShortcut>)
      
      const shortcut = screen.getByTestId('custom-shortcut')
      expect(shortcut).toBeInTheDocument()
    })
  })

  describe('DropdownMenuSub', () => {
    it('renders with default props', () => {
      render(<DropdownMenuSub />)
      
      const sub = screen.getByTestId('dropdown-menu-sub')
      expect(sub).toBeInTheDocument()
      expect(sub).toHaveAttribute('data-slot', 'dropdown-menu-sub')
    })

    it('renders children', () => {
      render(
        <DropdownMenuSub>
          <div>Sub Content</div>
        </DropdownMenuSub>
      )
      
      expect(screen.getByText('Sub Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<DropdownMenuSub data-testid="custom-sub" />)
      
      const sub = screen.getByTestId('custom-sub')
      expect(sub).toBeInTheDocument()
    })
  })

  describe('DropdownMenuSubTrigger', () => {
    it('renders with default props', () => {
      render(<DropdownMenuSubTrigger>Sub Trigger</DropdownMenuSubTrigger>)
      
      const trigger = screen.getByTestId('dropdown-menu-sub-trigger')
      const chevronIcon = screen.getByTestId('chevron-right-icon')
      
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'dropdown-menu-sub-trigger')
      expect(trigger).toHaveTextContent('Sub Trigger')
      expect(chevronIcon).toBeInTheDocument()
    })

    it('renders with inset', () => {
      render(<DropdownMenuSubTrigger inset>Sub Trigger</DropdownMenuSubTrigger>)
      
      const trigger = screen.getByTestId('dropdown-menu-sub-trigger')
      expect(trigger).toHaveAttribute('data-inset', 'true')
    })

    it('renders with custom className', () => {
      render(<DropdownMenuSubTrigger className="custom-sub-trigger">Trigger</DropdownMenuSubTrigger>)
      
      const trigger = screen.getByTestId('dropdown-menu-sub-trigger')
      expect(trigger).toHaveClass('custom-sub-trigger')
    })

    it('passes through additional props', () => {
      render(<DropdownMenuSubTrigger data-testid="custom-sub-trigger">Trigger</DropdownMenuSubTrigger>)
      
      const trigger = screen.getByTestId('custom-sub-trigger')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('DropdownMenuSubContent', () => {
    it('renders with default props', () => {
      render(<DropdownMenuSubContent>Sub Content</DropdownMenuSubContent>)
      
      const content = screen.getByTestId('dropdown-menu-sub-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'dropdown-menu-sub-content')
      expect(content).toHaveTextContent('Sub Content')
    })

    it('renders with custom className', () => {
      render(<DropdownMenuSubContent className="custom-sub-content">Content</DropdownMenuSubContent>)
      
      const content = screen.getByTestId('dropdown-menu-sub-content')
      expect(content).toHaveClass('custom-sub-content')
    })

    it('passes through additional props', () => {
      render(<DropdownMenuSubContent data-testid="custom-sub-content">Content</DropdownMenuSubContent>)
      
      const content = screen.getByTestId('custom-sub-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Complete Dropdown Menu Structure', () => {
    it('renders a complete dropdown menu', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      
      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-menu-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-menu-group')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-menu-label')).toBeInTheDocument()
      expect(screen.getAllByTestId('dropdown-menu-item')).toHaveLength(3)
      expect(screen.getByTestId('dropdown-menu-separator')).toBeInTheDocument()
      
      expect(screen.getByText('Open Menu')).toBeInTheDocument()
      expect(screen.getByText('My Account')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it('renders dropdown menu with checkbox items', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>Option 1</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Option 2</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      
      expect(screen.getAllByTestId('dropdown-menu-checkbox-item')).toHaveLength(2)
      expect(screen.getAllByTestId('check-icon')).toHaveLength(2)
    })

    it('renders dropdown menu with radio items', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem>Radio 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem>Radio 2</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      
      expect(screen.getByTestId('dropdown-menu-radio-group')).toBeInTheDocument()
      expect(screen.getAllByTestId('dropdown-menu-radio-item')).toHaveLength(2)
      expect(screen.getAllByTestId('circle-icon')).toHaveLength(2)
    })

    it('renders dropdown menu with submenu', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Option 1</DropdownMenuItem>
                <DropdownMenuItem>Sub Option 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      
      expect(screen.getByTestId('dropdown-menu-sub')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-menu-sub-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-menu-sub-content')).toBeInTheDocument()
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument()
    })
  })
})
