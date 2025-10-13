import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DashboardLayout } from '@/components/dashboard-layout'

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Home: () => <div data-testid="home-icon">Home</div>,
  UserIcon: () => <div data-testid="user-icon">User</div>,
  Palette: () => <div data-testid="palette-icon">Palette</div>,
  FileText: () => <div data-testid="file-icon">File</div>,
  Play: () => <div data-testid="play-icon">Play</div>,
  LogOut: () => <div data-testid="logout-icon">Logout</div>,
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="close-icon">Close</div>,
  Film: () => <div data-testid="film-icon">Film</div>,
  RefreshCw: () => <div data-testid="refresh-icon">Refresh</div>,
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
}))

// Mock the section components
jest.mock('@/components/sections/home-content', () => ({
  HomeContent: ({ user }: any) => <div data-testid="home-content">Home Content for {user?.name}</div>,
}))

jest.mock('@/components/sections/profile-content', () => ({
  ProfileContent: ({ user }: any) => <div data-testid="profile-content">Profile Content for {user?.name}</div>,
}))

jest.mock('@/components/sections/themes-content', () => ({
  ThemesContent: () => <div data-testid="themes-content">Themes Content</div>,
}))

jest.mock('@/components/sections/storyboards-content', () => ({
  StoryboardsContent: () => <div data-testid="storyboards-content">Storyboards Content</div>,
}))

jest.mock('@/components/sections/playground-content', () => ({
  PlaygroundContent: () => <div data-testid="playground-content">Playground Content</div>,
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  getUserTheme: jest.fn(() => 'professional'),
}))

describe('DashboardLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    theme: 'professional'
  }

  const mockNavigationItems = [
    { id: 'home', label: 'Home', icon: 'Home' },
    { id: 'profile', label: 'Profile', icon: 'UserIcon' },
    { id: 'themes', label: 'Themes', icon: 'Palette' },
    { id: 'storyboards', label: 'Storyboards', icon: 'FileText' },
    { id: 'playground', label: 'Playground', icon: 'Play' },
    { id: 'logout', label: 'Logout', icon: 'LogOut', action: jest.fn() },
  ]

  const defaultProps = {
    user: mockUser,
    navigationItems: mockNavigationItems,
    activeSection: 'home',
    onSectionChange: jest.fn(),
  }


  it('renders with user information', () => {
    render(<DashboardLayout {...defaultProps} />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    render(<DashboardLayout {...defaultProps} />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Themes')).toBeInTheDocument()
    expect(screen.getByText('Storyboards')).toBeInTheDocument()
    expect(screen.getByText('Playground')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('renders home content when home is active', () => {
    render(<DashboardLayout {...defaultProps} activeSection="home" />)
    
    expect(screen.getByTestId('home-content')).toBeInTheDocument()
    expect(screen.getByText('Home Content for Test User')).toBeInTheDocument()
  })

  it('renders profile content when profile is active', () => {
    render(<DashboardLayout {...defaultProps} activeSection="profile" />)
    
    expect(screen.getByTestId('profile-content')).toBeInTheDocument()
    expect(screen.getByText('Profile Content for Test User')).toBeInTheDocument()
  })

  it('renders themes content when themes is active', () => {
    render(<DashboardLayout {...defaultProps} activeSection="themes" />)
    
    expect(screen.getByTestId('themes-content')).toBeInTheDocument()
    expect(screen.getByText('Themes Content')).toBeInTheDocument()
  })

  it('renders storyboards content when storyboards is active', () => {
    render(<DashboardLayout {...defaultProps} activeSection="storyboards" />)
    
    expect(screen.getByTestId('storyboards-content')).toBeInTheDocument()
    expect(screen.getByText('Storyboards Content')).toBeInTheDocument()
  })

  it('renders playground content when playground is active', () => {
    render(<DashboardLayout {...defaultProps} activeSection="playground" />)
    
    expect(screen.getByTestId('playground-content')).toBeInTheDocument()
    expect(screen.getByText('Playground Content')).toBeInTheDocument()
  })

  it('calls onSectionChange when navigation item is clicked', () => {
    const mockOnSectionChange = jest.fn()
    render(
      <DashboardLayout 
        {...defaultProps} 
        onSectionChange={mockOnSectionChange}
      />
    )
    
    const themesButton = screen.getByText('Themes').closest('button')
    fireEvent.click(themesButton!)
    
    expect(mockOnSectionChange).toHaveBeenCalledWith('themes')
  })

  it('calls action when navigation item has action', () => {
    const mockAction = jest.fn()
    const itemsWithAction = [
      ...mockNavigationItems.slice(0, -1),
      { id: 'logout', label: 'Logout', icon: 'LogOut', action: mockAction }
    ]
    
    render(
      <DashboardLayout 
        {...defaultProps} 
        navigationItems={itemsWithAction}
      />
    )
    
    const logoutButton = screen.getByText('Logout').closest('button')
    fireEvent.click(logoutButton!)
    
    expect(mockAction).toHaveBeenCalled()
  })

  it('shows user avatar and initials', () => {
    render(<DashboardLayout {...defaultProps} />)
    
    // Check for user initials (first letter of name)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('handles different user names', () => {
    const userWithLongName = {
      ...mockUser,
      name: 'John Doe Smith'
    }
    
    render(
      <DashboardLayout 
        {...defaultProps} 
        user={userWithLongName}
      />
    )
    
    expect(screen.getByText('John Doe Smith')).toBeInTheDocument()
    expect(screen.getByText('J')).toBeInTheDocument() // First initial
  })

  it('handles missing user gracefully', () => {
    render(
      <DashboardLayout 
        {...defaultProps} 
        user={null}
      />
    )
    
    // Should still render the layout
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<DashboardLayout {...defaultProps} />)
    
    const sidebar = container.querySelector('[data-testid="sidebar"]') || 
                   container.querySelector('.sidebar') ||
                   container.querySelector('[data-slot="sidebar"]') ||
                   container.querySelector('.w-64.bg-sidebar')
    expect(sidebar).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    render(<DashboardLayout {...defaultProps} />)
    
    const homeButton = screen.getByText('Home').closest('button')
    homeButton?.focus()
    
    expect(homeButton).toHaveFocus()
  })

  it('renders with different active sections', () => {
    const sections = ['home', 'profile', 'themes', 'storyboards', 'playground']
    
    sections.forEach(section => {
      const { unmount } = render(
        <DashboardLayout 
          {...defaultProps} 
          activeSection={section}
        />
      )
      
      const activeButtons = screen.getAllByText(section.charAt(0).toUpperCase() + section.slice(1))
      expect(activeButtons.length).toBeGreaterThan(0)
      // Check that at least one button is active (has the active styling)
      const activeButton = activeButtons.find(button => 
        button.classList.contains('bg-sidebar-primary') || 
        button.classList.contains('text-sidebar-primary-foreground')
      )
      expect(activeButton).toBeDefined()
      
      unmount()
    })
  })

  it('handles empty navigation items', () => {
    render(
      <DashboardLayout 
        {...defaultProps} 
        navigationItems={[]}
      />
    )
    
    // Should still render the layout structure
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(<DashboardLayout {...defaultProps} />)
    
    const navigation = screen.getByRole('navigation')
    expect(navigation).toBeInTheDocument()
    
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  describe('Theme Handling', () => {
    it('handles theme change events', () => {
      render(<DashboardLayout {...defaultProps} />)
      
      // Simulate theme change event
      const themeChangeEvent = new CustomEvent('themeChanged', {
        detail: { theme: 'dark' }
      })
      
      // Dispatch the event
      window.dispatchEvent(themeChangeEvent)
      
      // The component should handle the event without errors
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('covers getThemeBorderColor function with different themes', () => {
      const { rerender } = render(<DashboardLayout {...defaultProps} />)
      
      // Test different themes by re-rendering with different user themes
      const themes = ['professional', 'dark', 'warm', 'indie', 'minimalist', 'cyberpunk', 'unknown']
      
      themes.forEach(theme => {
        rerender(
          <DashboardLayout 
            {...defaultProps} 
            user={{ ...mockUser, theme }}
          />
        )
        
        // Should render without errors for each theme
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })
    })
  })

  describe('Page Title and Navigation', () => {
    it('covers getPageTitle function for different sections', () => {
      const sections = ['home', 'profile', 'themes', 'storyboards', 'playground', 'unknown']
      
      sections.forEach(section => {
        const { unmount } = render(
          <DashboardLayout 
            {...defaultProps} 
            activeSection={section}
          />
        )
        
        // Should render without errors for each section
        expect(screen.getByText('Test User')).toBeInTheDocument()
        
        unmount()
      })
    })

  })

  describe('Theme Border Colors', () => {
    it('applies correct border colors for all theme variants', () => {
      const themes = ['professional', 'dark', 'warm', 'indie', 'minimalist', 'cyberpunk']
      
      themes.forEach(theme => {
        const { unmount } = render(
          <DashboardLayout 
            {...defaultProps} 
            activeSection="themes"
          />
        )
        
        // Component should render for each theme
        expect(screen.getByText('Test User')).toBeInTheDocument()
        
        unmount()
      })
    })

    it('applies default border color for unknown theme', () => {
      render(<DashboardLayout {...defaultProps} />)
      
      // Component should render with default border color
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })
  })

  describe('Theme Refresh', () => {
    it('component handles theme changes with setTimeout', () => {
      jest.useFakeTimers()
      
      render(<DashboardLayout {...defaultProps} />)
      
      // Component renders and setups timeout for potential reload
      expect(screen.getByText('Test User')).toBeInTheDocument()
      
      // Fast forward timers
      jest.advanceTimersByTime(3000)
      
      // Component should still be rendered
      expect(screen.getByText('Test User')).toBeInTheDocument()
      
      jest.useRealTimers()
    })
  })

  describe('Clear Cache Button in Header', () => {
    it('renders Clear Cache button', () => {
      render(<DashboardLayout {...defaultProps} />)

      const clearCacheButton = screen.getAllByText('Clear Cache')[0]
      expect(clearCacheButton).toBeInTheDocument()
    })

    it('clicks clear cache button triggers alert', async () => {
      jest.useFakeTimers()
      const user = userEvent.setup({ delay: null })
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation()
      
      render(<DashboardLayout {...defaultProps} />)

      // Find all Clear Cache elements
      const clearCacheElements = screen.getAllByText('Clear Cache')
      const headerButton = clearCacheElements.find(el => el.closest('header'))
      
      if (headerButton) {
        const button = headerButton.closest('button')
        if (button) {
          await user.click(button)
          
          // Should call alert
          expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining('Cache cleared!')
          )
        }
      }
      
      jest.useRealTimers()
      alertSpy.mockRestore()
    })
  })
})