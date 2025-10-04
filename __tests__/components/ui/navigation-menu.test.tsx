import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport
} from '@/components/ui/navigation-menu'

// Mock Radix UI Navigation Menu
jest.mock('@radix-ui/react-navigation-menu', () => ({
  Root: ({ children, className, viewport, ...props }: any) => (
    <div 
      data-testid="navigation-menu" 
      className={className}
      data-viewport={viewport}
      {...props}
    >
      {children}
    </div>
  ),
  List: ({ children, className, ...props }: any) => (
    <div 
      data-testid="navigation-menu-list" 
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Item: ({ children, className, ...props }: any) => (
    <div 
      data-testid="navigation-menu-item" 
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Trigger: ({ children, className, ...props }: any) => (
    <button 
      data-testid="navigation-menu-trigger" 
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  Content: ({ children, className, ...props }: any) => (
    <div 
      data-testid="navigation-menu-content" 
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Link: ({ children, className, ...props }: any) => (
    <a 
      data-testid="navigation-menu-link" 
      className={className}
      {...props}
    >
      {children}
    </a>
  ),
  Indicator: ({ children, className, ...props }: any) => (
    <div 
      data-testid="navigation-menu-indicator" 
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  Viewport: ({ children, className, ...props }: any) => (
    <div 
      data-testid="navigation-menu-viewport" 
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
}))

// Mock class-variance-authority
jest.mock('class-variance-authority', () => ({
  cva: jest.fn(() => jest.fn((props: any) => {
    const classes = ['base-class']
    if (props?.variant === 'default') classes.push('variant-default')
    if (props?.variant === 'destructive') classes.push('variant-destructive')
    if (props?.size === 'default') classes.push('size-default')
    if (props?.size === 'sm') classes.push('size-sm')
    if (props?.size === 'lg') classes.push('size-lg')
    return classes.join(' ')
  })),
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ChevronDownIcon: ({ className, ...props }: any) => (
    <div data-testid="chevron-down-icon" className={className} {...props} />
  ),
}))

describe('Navigation Menu Components', () => {
  describe('NavigationMenu', () => {
    it('renders with default props', () => {
      render(<NavigationMenu />)
      
      const menu = screen.getByTestId('navigation-menu')
      const viewport = screen.getByTestId('navigation-menu-viewport')
      
      expect(menu).toBeInTheDocument()
      expect(menu).toHaveAttribute('data-slot', 'navigation-menu')
      expect(menu).toHaveAttribute('data-viewport', 'true')
      expect(menu).toHaveClass('group/navigation-menu', 'relative', 'flex', 'max-w-max', 'flex-1')
      expect(viewport).toBeInTheDocument()
    })

    it('renders without viewport when viewport is false', () => {
      render(<NavigationMenu viewport={false} />)
      
      const menu = screen.getByTestId('navigation-menu')
      expect(menu).toHaveAttribute('data-viewport', 'false')
      expect(screen.queryByTestId('navigation-menu-viewport')).not.toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<NavigationMenu className="custom-navigation" />)
      
      const menu = screen.getByTestId('navigation-menu')
      expect(menu).toHaveClass('custom-navigation')
    })

    it('renders children', () => {
      render(
        <NavigationMenu>
          <div>Menu Content</div>
        </NavigationMenu>
      )
      
      expect(screen.getByText('Menu Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<NavigationMenu data-testid="custom-navigation" />)
      
      const menu = screen.getByTestId('custom-navigation')
      expect(menu).toBeInTheDocument()
    })
  })

  describe('NavigationMenuList', () => {
    it('renders with default props', () => {
      render(<NavigationMenuList />)
      
      const list = screen.getByTestId('navigation-menu-list')
      expect(list).toBeInTheDocument()
      expect(list).toHaveAttribute('data-slot', 'navigation-menu-list')
      expect(list).toHaveClass('group', 'flex', 'flex-1', 'list-none', 'items-center', 'justify-center', 'gap-1')
    })

    it('renders with custom className', () => {
      render(<NavigationMenuList className="custom-list" />)
      
      const list = screen.getByTestId('navigation-menu-list')
      expect(list).toHaveClass('custom-list')
    })

    it('renders children', () => {
      render(
        <NavigationMenuList>
          <div>List Content</div>
        </NavigationMenuList>
      )
      
      expect(screen.getByText('List Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<NavigationMenuList data-testid="custom-list" />)
      
      const list = screen.getByTestId('custom-list')
      expect(list).toBeInTheDocument()
    })
  })

  describe('NavigationMenuItem', () => {
    it('renders with default props', () => {
      render(<NavigationMenuItem />)
      
      const item = screen.getByTestId('navigation-menu-item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('data-slot', 'navigation-menu-item')
    })

    it('renders with custom className', () => {
      render(<NavigationMenuItem className="custom-item" />)
      
      const item = screen.getByTestId('navigation-menu-item')
      expect(item).toHaveClass('custom-item')
    })

    it('renders children', () => {
      render(
        <NavigationMenuItem>
          <div>Item Content</div>
        </NavigationMenuItem>
      )
      
      expect(screen.getByText('Item Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<NavigationMenuItem data-testid="custom-item" />)
      
      const item = screen.getByTestId('custom-item')
      expect(item).toBeInTheDocument()
    })
  })

  describe('NavigationMenuTrigger', () => {
    it('renders with default props', () => {
      render(<NavigationMenuTrigger>Trigger</NavigationMenuTrigger>)
      
      const trigger = screen.getByTestId('navigation-menu-trigger')
      const chevronIcon = screen.getByTestId('chevron-down-icon')
      
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('data-slot', 'navigation-menu-trigger')
      expect(trigger).toHaveClass('group')
      expect(trigger).toHaveTextContent('Trigger')
      expect(chevronIcon).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<NavigationMenuTrigger className="custom-trigger">Trigger</NavigationMenuTrigger>)
      
      const trigger = screen.getByTestId('navigation-menu-trigger')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('renders as button by default', () => {
      render(<NavigationMenuTrigger>Button Trigger</NavigationMenuTrigger>)
      
      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<NavigationMenuTrigger data-testid="custom-trigger">Trigger</NavigationMenuTrigger>)
      
      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('NavigationMenuContent', () => {
    it('renders with default props', () => {
      render(<NavigationMenuContent>Content</NavigationMenuContent>)
      
      const content = screen.getByTestId('navigation-menu-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'navigation-menu-content')
      expect(content).toHaveClass('left-0', 'top-0', 'w-full', 'data-[motion^=from-]:animate-in', 'data-[motion^=to-]:animate-out')
    })

    it('renders with custom className', () => {
      render(<NavigationMenuContent className="custom-content">Content</NavigationMenuContent>)
      
      const content = screen.getByTestId('navigation-menu-content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders children', () => {
      render(
        <NavigationMenuContent>
          <div>Content</div>
        </NavigationMenuContent>
      )
      
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<NavigationMenuContent data-testid="custom-content">Content</NavigationMenuContent>)
      
      const content = screen.getByTestId('custom-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('NavigationMenuLink', () => {
    it('renders with default props', () => {
      render(<NavigationMenuLink href="/home">Link</NavigationMenuLink>)
      
      const link = screen.getByTestId('navigation-menu-link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('data-slot', 'navigation-menu-link')
      expect(link).toHaveAttribute('href', '/home')
      expect(link).toHaveClass('flex', 'flex-col', 'gap-1', 'rounded-sm', 'p-2', 'text-sm', 'transition-all', 'outline-none')
      expect(link).toHaveTextContent('Link')
    })

    it('renders with custom className', () => {
      render(<NavigationMenuLink href="/home" className="custom-link">Link</NavigationMenuLink>)
      
      const link = screen.getByTestId('navigation-menu-link')
      expect(link).toHaveClass('custom-link')
    })

    it('renders as link by default', () => {
      render(<NavigationMenuLink href="/home">Link Element</NavigationMenuLink>)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<NavigationMenuLink href="/home" data-testid="custom-link">Link</NavigationMenuLink>)
      
      const link = screen.getByTestId('custom-link')
      expect(link).toBeInTheDocument()
    })
  })

  describe('NavigationMenuIndicator', () => {
    it('renders with default props', () => {
      render(<NavigationMenuIndicator />)
      
      const indicator = screen.getByTestId('navigation-menu-indicator')
      expect(indicator).toBeInTheDocument()
      expect(indicator).toHaveAttribute('data-slot', 'navigation-menu-indicator')
      expect(indicator).toHaveClass('top-full', 'z-[1]', 'flex', 'h-1.5', 'items-end', 'justify-center', 'overflow-hidden')
    })

    it('renders with custom className', () => {
      render(<NavigationMenuIndicator className="custom-indicator" />)
      
      const indicator = screen.getByTestId('navigation-menu-indicator')
      expect(indicator).toHaveClass('custom-indicator')
    })

    it('renders children', () => {
      render(<NavigationMenuIndicator />)
      
      const indicator = screen.getByTestId('navigation-menu-indicator')
      expect(indicator).toBeInTheDocument()
      // NavigationMenuIndicator has a fixed structure with a div inside
      expect(indicator.querySelector('div')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<NavigationMenuIndicator data-testid="custom-indicator" />)
      
      const indicator = screen.getByTestId('custom-indicator')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('NavigationMenuViewport', () => {
    it('renders with default props', () => {
      render(<NavigationMenuViewport />)
      
      const viewport = screen.getByTestId('navigation-menu-viewport')
      expect(viewport).toBeInTheDocument()
      expect(viewport).toHaveAttribute('data-slot', 'navigation-menu-viewport')
      expect(viewport).toHaveClass('origin-top-center', 'relative', 'mt-1.5', 'h-[var(--radix-navigation-menu-viewport-height)]', 'w-full', 'overflow-hidden')
    })

    it('renders with custom className', () => {
      render(<NavigationMenuViewport className="custom-viewport" />)
      
      const viewport = screen.getByTestId('navigation-menu-viewport')
      expect(viewport).toHaveClass('custom-viewport')
    })

    it('renders children', () => {
      render(
        <NavigationMenuViewport>
          <div>Viewport Content</div>
        </NavigationMenuViewport>
      )
      
      expect(screen.getByText('Viewport Content')).toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(<NavigationMenuViewport data-testid="custom-viewport" />)
      
      const viewport = screen.getByTestId('custom-viewport')
      expect(viewport).toBeInTheDocument()
    })
  })

  describe('Complete Navigation Menu Structure', () => {
    it('renders a complete navigation menu', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Product Content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/about">About</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
        </NavigationMenu>
      )
      
      expect(screen.getByTestId('navigation-menu')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-menu-list')).toBeInTheDocument()
      expect(screen.getAllByTestId('navigation-menu-item')).toHaveLength(3)
      expect(screen.getByTestId('navigation-menu-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-menu-content')).toBeInTheDocument()
      expect(screen.getAllByTestId('navigation-menu-link')).toHaveLength(2)
      expect(screen.getByTestId('navigation-menu-indicator')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-menu-viewport')).toBeInTheDocument()
      
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
      expect(screen.getByText('Product Content')).toBeInTheDocument()
    })

    it('renders navigation menu without viewport', () => {
      render(
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/home">Home</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      
      expect(screen.getByTestId('navigation-menu')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-menu-list')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-menu-item')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-menu-link')).toBeInTheDocument()
      expect(screen.queryByTestId('navigation-menu-viewport')).not.toBeInTheDocument()
    })

    it('renders navigation menu with multiple triggers', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu 1</NavigationMenuTrigger>
              <NavigationMenuContent>Content 1</NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu 2</NavigationMenuTrigger>
              <NavigationMenuContent>Content 2</NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      
      expect(screen.getAllByTestId('navigation-menu-trigger')).toHaveLength(2)
      expect(screen.getAllByTestId('navigation-menu-content')).toHaveLength(2)
      expect(screen.getByText('Menu 1')).toBeInTheDocument()
      expect(screen.getByText('Menu 2')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('handles empty navigation menu', () => {
      render(<NavigationMenu />)
      
      expect(screen.getByTestId('navigation-menu')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-menu-viewport')).toBeInTheDocument()
    })
  })
})
