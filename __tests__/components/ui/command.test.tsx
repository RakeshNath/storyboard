import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator
} from '@/components/ui/command'

// Mock cmdk
jest.mock('cmdk', () => ({
  Command: ({ children, className, ...props }: any) => (
    <div data-testid="command" className={className} {...props}>
      {children}
    </div>
  ),
  Input: ({ className, ...props }: any) => (
    <input data-testid="command-input" className={className} {...props} />
  ),
  List: ({ children, className, ...props }: any) => (
    <div data-testid="command-list" className={className} {...props}>
      {children}
    </div>
  ),
  Empty: ({ children, className, ...props }: any) => (
    <div data-testid="command-empty" className={className} {...props}>
      {children}
    </div>
  ),
  Group: ({ children, className, ...props }: any) => (
    <div data-testid="command-group" className={className} {...props}>
      {children}
    </div>
  ),
  Item: ({ children, className, ...props }: any) => (
    <div data-testid="command-item" className={className} {...props}>
      {children}
    </div>
  ),
  Separator: ({ className, ...props }: any) => (
    <div data-testid="command-separator" className={className} {...props} />
  ),
}))

// Mock Dialog components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, ...props }: any) => (
    <div data-testid="dialog" {...props}>
      {children}
    </div>
  ),
  DialogContent: ({ children, className, ...props }: any) => (
    <div data-testid="dialog-content" className={className} {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children, className, ...props }: any) => (
    <div data-testid="dialog-header" className={className} {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({ children, ...props }: any) => (
    <h2 data-testid="dialog-title" {...props}>
      {children}
    </h2>
  ),
  DialogDescription: ({ children, ...props }: any) => (
    <p data-testid="dialog-description" {...props}>
      {children}
    </p>
  ),
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  SearchIcon: ({ className, ...props }: any) => (
    <div data-testid="search-icon" className={className} {...props} />
  ),
}))

describe('Command Components', () => {
  describe('Command', () => {
    it('renders with default props', () => {
      render(<Command />)
      
      const command = screen.getByTestId('command')
      expect(command).toBeInTheDocument()
      expect(command).toHaveAttribute('data-slot', 'command')
      expect(command).toHaveClass('bg-popover', 'text-popover-foreground', 'flex', 'h-full', 'w-full', 'flex-col')
    })

    it('renders with custom className', () => {
      render(<Command className="custom-command" />)
      
      const command = screen.getByTestId('command')
      expect(command).toHaveClass('custom-command')
    })

    it('renders children', () => {
      render(
        <Command>
          <div>Command Content</div>
        </Command>
      )
      
      expect(screen.getByText('Command Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<Command data-testid="custom-command" />)
      
      const command = screen.getByTestId('custom-command')
      expect(command).toBeInTheDocument()
    })
  })

  describe('CommandDialog', () => {
    it('renders with default props', () => {
      render(<CommandDialog />)
      
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-header')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Command Palette')
      expect(screen.getByTestId('dialog-description')).toHaveTextContent('Search for a command to run...')
      expect(screen.getByTestId('command')).toBeInTheDocument()
    })

    it('renders with custom title and description', () => {
      render(
        <CommandDialog 
          title="Custom Title" 
          description="Custom description"
        />
      )
      
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Custom Title')
      expect(screen.getByTestId('dialog-description')).toHaveTextContent('Custom description')
    })

    it('renders with custom className', () => {
      render(<CommandDialog className="custom-dialog" />)
      
      const dialogContent = screen.getByTestId('dialog-content')
      expect(dialogContent).toHaveClass('custom-dialog')
    })

    it('renders with showCloseButton false', () => {
      render(<CommandDialog showCloseButton={false} />)
      
      const dialogContent = screen.getByTestId('dialog-content')
      expect(dialogContent).toHaveAttribute('showCloseButton', 'false')
    })

    it('renders children', () => {
      render(
        <CommandDialog>
          <div>Dialog Content</div>
        </CommandDialog>
      )
      
      expect(screen.getByText('Dialog Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<CommandDialog data-testid="custom-dialog" />)
      
      const dialog = screen.getByTestId('custom-dialog')
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('CommandInput', () => {
    it('renders with default props', () => {
      render(<CommandInput />)
      
      const wrapper = screen.getByTestId('command-input-wrapper')
      const input = screen.getByTestId('command-input')
      const searchIcon = screen.getByTestId('search-icon')
      
      expect(wrapper).toBeInTheDocument()
      expect(wrapper).toHaveAttribute('data-slot', 'command-input-wrapper')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('data-slot', 'command-input')
      expect(searchIcon).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<CommandInput className="custom-input" />)
      
      const input = screen.getByTestId('command-input')
      expect(input).toHaveClass('custom-input')
    })

    it('renders with placeholder', () => {
      render(<CommandInput placeholder="Search commands..." />)
      
      const input = screen.getByTestId('command-input')
      expect(input).toHaveAttribute('placeholder', 'Search commands...')
    })

    it('passes through additional props', () => {
      render(<CommandInput data-testid="custom-input" />)
      
      const input = screen.getByTestId('custom-input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('CommandList', () => {
    it('renders with default props', () => {
      render(<CommandList />)
      
      const list = screen.getByTestId('command-list')
      expect(list).toBeInTheDocument()
      expect(list).toHaveAttribute('data-slot', 'command-list')
      expect(list).toHaveClass('max-h-[300px]', 'scroll-py-1', 'overflow-x-hidden', 'overflow-y-auto')
    })

    it('renders with custom className', () => {
      render(<CommandList className="custom-list" />)
      
      const list = screen.getByTestId('command-list')
      expect(list).toHaveClass('custom-list')
    })

    it('renders children', () => {
      render(
        <CommandList>
          <div>List Content</div>
        </CommandList>
      )
      
      expect(screen.getByText('List Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<CommandList data-testid="custom-list" />)
      
      const list = screen.getByTestId('custom-list')
      expect(list).toBeInTheDocument()
    })
  })

  describe('CommandEmpty', () => {
    it('renders with default props', () => {
      render(<CommandEmpty>No results found</CommandEmpty>)
      
      const empty = screen.getByTestId('command-empty')
      expect(empty).toBeInTheDocument()
      expect(empty).toHaveAttribute('data-slot', 'command-empty')
      expect(empty).toHaveClass('py-6', 'text-center', 'text-sm')
      expect(empty).toHaveTextContent('No results found')
    })

    it('passes through additional props', () => {
      render(<CommandEmpty data-testid="custom-empty">Empty</CommandEmpty>)
      
      const empty = screen.getByTestId('custom-empty')
      expect(empty).toBeInTheDocument()
    })
  })

  describe('CommandGroup', () => {
    it('renders with default props', () => {
      render(<CommandGroup />)
      
      const group = screen.getByTestId('command-group')
      expect(group).toBeInTheDocument()
      expect(group).toHaveAttribute('data-slot', 'command-group')
      expect(group).toHaveClass('text-foreground', 'overflow-hidden', 'p-1')
    })

    it('renders with custom className', () => {
      render(<CommandGroup className="custom-group" />)
      
      const group = screen.getByTestId('command-group')
      expect(group).toHaveClass('custom-group')
    })

    it('renders children', () => {
      render(
        <CommandGroup>
          <div>Group Content</div>
        </CommandGroup>
      )
      
      expect(screen.getByText('Group Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<CommandGroup data-testid="custom-group" />)
      
      const group = screen.getByTestId('custom-group')
      expect(group).toBeInTheDocument()
    })
  })

  describe('CommandSeparator', () => {
    it('renders with default props', () => {
      render(<CommandSeparator />)
      
      const separator = screen.getByTestId('command-separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('data-slot', 'command-separator')
      expect(separator).toHaveClass('bg-border', '-mx-1', 'h-px')
    })

    it('renders with custom className', () => {
      render(<CommandSeparator className="custom-separator" />)
      
      const separator = screen.getByTestId('command-separator')
      expect(separator).toHaveClass('custom-separator')
    })

    it('passes through additional props', () => {
      render(<CommandSeparator data-testid="custom-separator" />)
      
      const separator = screen.getByTestId('custom-separator')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('CommandItem', () => {
    it('renders with default props', () => {
      render(<CommandItem>Item</CommandItem>)
      
      const item = screen.getByTestId('command-item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'command-item')
      expect(item).toHaveClass('relative', 'flex', 'cursor-default', 'items-center', 'gap-2')
      expect(item).toHaveTextContent('Item')
    })

    it('renders with custom className', () => {
      render(<CommandItem className="custom-item">Item</CommandItem>)
      
      const item = screen.getByTestId('command-item')
      expect(item).toHaveClass('custom-item')
    })

    it('passes through additional props', () => {
      render(<CommandItem data-testid="custom-item">Item</CommandItem>)
      
      const item = screen.getByTestId('custom-item')
      expect(item).toBeInTheDocument()
    })
  })

  describe('CommandShortcut', () => {
    it('renders with default props', () => {
      render(<CommandShortcut>⌘K</CommandShortcut>)
      
      const shortcut = screen.getByTestId('command-shortcut')
      expect(shortcut).toBeInTheDocument()
      expect(shortcut).toHaveAttribute('data-slot', 'command-shortcut')
      expect(shortcut).toHaveClass('text-muted-foreground', 'ml-auto', 'text-xs', 'tracking-widest')
      expect(shortcut).toHaveTextContent('⌘K')
    })

    it('renders with custom className', () => {
      render(<CommandShortcut className="custom-shortcut">⌘K</CommandShortcut>)
      
      const shortcut = screen.getByTestId('command-shortcut')
      expect(shortcut).toHaveClass('custom-shortcut')
    })

    it('passes through additional props', () => {
      render(<CommandShortcut data-testid="custom-shortcut">⌘K</CommandShortcut>)
      
      const shortcut = screen.getByTestId('custom-shortcut')
      expect(shortcut).toBeInTheDocument()
    })
  })

  describe('Complete Command Structure', () => {
    it('renders a complete command palette', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                Calendar
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Search Emoji
                <CommandShortcut>⌘E</CommandShortcut>
              </CommandItem>
              <CommandSeparator />
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </Command>
      )
      
      expect(screen.getByTestId('command')).toBeInTheDocument()
      expect(screen.getByTestId('command-input')).toBeInTheDocument()
      expect(screen.getByTestId('command-list')).toBeInTheDocument()
      expect(screen.getByTestId('command-group')).toBeInTheDocument()
      expect(screen.getAllByTestId('command-item')).toHaveLength(3)
      expect(screen.getAllByTestId('command-shortcut')).toHaveLength(2)
      expect(screen.getByTestId('command-separator')).toBeInTheDocument()
      
      expect(screen.getByText('Calendar')).toBeInTheDocument()
      expect(screen.getByText('Search Emoji')).toBeInTheDocument()
      expect(screen.getByText('Calculator')).toBeInTheDocument()
      expect(screen.getByText('⌘C')).toBeInTheDocument()
      expect(screen.getByText('⌘E')).toBeInTheDocument()
    })

    it('renders command dialog', () => {
      render(
        <CommandDialog title="Search" description="Find what you need">
          <CommandInput />
          <CommandList>
            <CommandItem>Option 1</CommandItem>
            <CommandItem>Option 2</CommandItem>
          </CommandList>
        </CommandDialog>
      )
      
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Search')
      expect(screen.getByTestId('dialog-description')).toHaveTextContent('Find what you need')
      expect(screen.getByTestId('command-input')).toBeInTheDocument()
      expect(screen.getByTestId('command-list')).toBeInTheDocument()
      expect(screen.getAllByTestId('command-item')).toHaveLength(2)
    })

    it('handles empty command list', () => {
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandEmpty>No commands available</CommandEmpty>
          </CommandList>
        </Command>
      )
      
      expect(screen.getByTestId('command-empty')).toBeInTheDocument()
      expect(screen.getByText('No commands available')).toBeInTheDocument()
    })

    it('handles multiple command groups', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Group 1 Item</CommandItem>
            </CommandGroup>
            <CommandGroup>
              <CommandItem>Group 2 Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )
      
      expect(screen.getAllByTestId('command-group')).toHaveLength(2)
      expect(screen.getAllByTestId('command-item')).toHaveLength(2)
      expect(screen.getByText('Group 1 Item')).toBeInTheDocument()
      expect(screen.getByText('Group 2 Item')).toBeInTheDocument()
    })
  })
})
