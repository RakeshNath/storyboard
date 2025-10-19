import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemesContent } from '@/components/sections/themes-content'
import { themes } from '@/lib/theme-utils'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock theme utilities
jest.mock('@/lib/theme-utils', () => ({
  themes: [
    {
      id: 'test-theme',
      name: 'Test Theme',
      description: 'A test theme for testing',
      colors: {
        primary: 'oklch(0.45 0.15 264)',
        primaryForeground: 'oklch(0.98 0.005 264)',
        secondary: 'oklch(0.15 0.02 264)',
        secondaryForeground: 'oklch(0.98 0.005 264)',
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.145 0 0)',
        card: 'oklch(1 0 0)',
        cardForeground: 'oklch(0.145 0 0)',
        popover: 'oklch(1 0 0)',
        popoverForeground: 'oklch(0.145 0 0)',
        muted: 'oklch(0.97 0 0)',
        mutedForeground: 'oklch(0.556 0 0)',
        accent: 'oklch(0.97 0 0)',
        accentForeground: 'oklch(0.145 0 0)',
        destructive: 'oklch(0.577 0.245 27.325)',
        destructiveForeground: 'oklch(0.577 0.245 27.325)',
        border: 'oklch(0.922 0 0)',
        input: 'oklch(0.922 0 0)',
        ring: 'oklch(0.708 0 0)',
        sidebar: 'oklch(0.985 0 0)',
        sidebarForeground: 'oklch(0.145 0 0)',
        sidebarPrimary: 'oklch(0.145 0 0)',
        sidebarPrimaryForeground: 'oklch(0.985 0 0)',
        sidebarAccent: 'oklch(0.97 0 0)',
        sidebarAccentForeground: 'oklch(0.145 0 0)',
        sidebarBorder: 'oklch(0.922 0 0)',
        sidebarRing: 'oklch(0.708 0 0)'
      },
      textStyle: {
        heading: 'font-bold text-xl',
        body: 'text-base leading-relaxed'
      }
    }
  ],
  applyTheme: jest.fn(),
  dispatchThemeChange: jest.fn()
}))

// Mock auth utilities
jest.mock('@/lib/auth', () => ({
  getUserTheme: jest.fn(() => 'test-theme'),
  updateUserTheme: jest.fn()
}))

describe('ThemesContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Layout and Structure', () => {
    it('renders all theme tiles in a grid layout', () => {
      render(<ThemesContent />)
      
      // Check if grid container exists
      const gridContainer = screen.getByRole('main', { hidden: true })
      expect(gridContainer).toBeInTheDocument()
      
      // Check if theme tiles are rendered
      const themeCards = screen.getAllByRole('article')
      expect(themeCards).toHaveLength(themes.length)
    })

    it('applies correct grid classes for responsive layout', () => {
      render(<ThemesContent />)
      
      const gridContainer = screen.getByRole('main', { hidden: true })
      expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-2', 'xl:grid-cols-3', 'gap-8')
    })

    it('maintains consistent spacing between theme tiles', () => {
      render(<ThemesContent />)
      
      const gridContainer = screen.getByRole('main', { hidden: true })
      expect(gridContainer).toHaveClass('gap-8')
    })
  })

  describe('Icon Sizing and Positioning', () => {
    it('renders theme logos with correct dimensions', () => {
      render(<ThemesContent />)
      
      const themeImages = screen.getAllByRole('img')
      themeImages.forEach(img => {
        expect(img).toHaveAttribute('width', '72')
        expect(img).toHaveAttribute('height', '72')
      })
    })

    it('positions logos in centered containers', () => {
      render(<ThemesContent />)
      
      const logoContainers = screen.getAllByTestId('theme-logo-container', { exact: false })
      logoContainers.forEach(container => {
        expect(container).toHaveClass('w-20', 'h-20', 'flex', 'items-center', 'justify-center')
      })
    })

    it('applies object-contain class to images for proper scaling', () => {
      render(<ThemesContent />)
      
      const themeImages = screen.getAllByRole('img')
      themeImages.forEach(img => {
        expect(img).toHaveClass('w-full', 'h-full', 'object-contain')
      })
    })
  })

  describe('Theme Information Display', () => {
    it('displays theme names correctly', () => {
      render(<ThemesContent />)
      
      themes.forEach(theme => {
        expect(screen.getByText(theme.name)).toBeInTheDocument()
      })
    })

    it('displays theme descriptions correctly', () => {
      render(<ThemesContent />)
      
      themes.forEach(theme => {
        expect(screen.getByText(theme.description)).toBeInTheDocument()
      })
    })

    it('applies theme-specific colors to text elements', () => {
      render(<ThemesContent />)
      
      const themeNames = screen.getAllByText(/Test Theme|Professional|Classic|Noir|Indie|Minimalist|Cyberpunk/)
      themeNames.forEach((name, index) => {
        if (index < themes.length) {
          const expectedColor = themes[index].colors.foreground
          expect(name).toHaveStyle(`color: ${expectedColor}`)
        }
      })
    })
  })

  describe('Color Palette Display', () => {
    it('displays complete color palette for each theme', () => {
      render(<ThemesContent />)
      
      // Check for color palette labels
      const paletteLabels = screen.getAllByText('Complete Color Palette')
      expect(paletteLabels).toHaveLength(themes.length)
    })

    it('renders 20 color swatches per theme in 10x2 grid', () => {
      render(<ThemesContent />)
      
      // Each theme should have 20 color swatches
      const colorSwatches = screen.getAllByTitle(/Primary|Secondary|Accent|Muted|Destructive|Background|Card|Popover|Input|Border|Foreground|Primary Text|Secondary Text|Muted Text|Accent Text|Sidebar|Sidebar Primary|Sidebar Accent|Sidebar Border|Ring\/Focus/)
      expect(colorSwatches.length).toBeGreaterThanOrEqual(20 * themes.length)
    })

    it('applies correct background colors to color swatches', () => {
      render(<ThemesContent />)
      
      const primaryColorSwatches = screen.getAllByTitle('Primary')
      primaryColorSwatches.forEach((swatch, index) => {
        if (index < themes.length) {
          const expectedColor = themes[index].colors.primary
          expect(swatch).toHaveStyle(`background-color: ${expectedColor}`)
        }
      })
    })

    it('uses 10-column grid for color palette rows', () => {
      render(<ThemesContent />)
      
      const colorRows = screen.getAllByTitle('Primary')
      colorRows.forEach(row => {
        const parentGrid = row.closest('.grid-cols-10')
        expect(parentGrid).toBeInTheDocument()
      })
    })

    it('applies proper spacing between color swatches', () => {
      render(<ThemesContent />)
      
      const colorRows = document.querySelectorAll('.grid-cols-10')
      colorRows.forEach(row => {
        expect(row).toHaveClass('gap-1')
      })
    })
  })

  describe('Button Text and Actions', () => {
    it('displays correct button text for unselected themes', () => {
      render(<ThemesContent />)
      
      const applyButtons = screen.getAllByText('Apply Theme')
      expect(applyButtons.length).toBeGreaterThan(0)
    })

    it('displays correct button text for selected theme', async () => {
      render(<ThemesContent />)
      
      // Find and click the first theme button
      const applyButtons = screen.getAllByText('Apply Theme')
      if (applyButtons.length > 0) {
        fireEvent.click(applyButtons[0])
        
        await waitFor(() => {
          expect(screen.getByText('✓ Applied')).toBeInTheDocument()
        })
      }
    })

    it('applies theme-specific colors to buttons', () => {
      render(<ThemesContent />)
      
      const applyButtons = screen.getAllByText('Apply Theme')
      applyButtons.forEach((button, index) => {
        if (index < themes.length) {
          const expectedBackgroundColor = themes[index].colors.muted
          const expectedTextColor = themes[index].colors.mutedForeground
          expect(button).toHaveStyle(`background-color: ${expectedBackgroundColor}`)
          expect(button).toHaveStyle(`color: ${expectedTextColor}`)
        }
      })
    })

    it('calls theme change handler when button is clicked', async () => {
      const { updateUserTheme } = require('@/lib/auth')
      render(<ThemesContent />)
      
      const applyButtons = screen.getAllByText('Apply Theme')
      if (applyButtons.length > 0) {
        fireEvent.click(applyButtons[0])
        
        await waitFor(() => {
          expect(updateUserTheme).toHaveBeenCalledWith('test-theme')
        })
      }
    })

    it('shows checkmark icon for selected theme', async () => {
      render(<ThemesContent />)
      
      // Click first theme to select it
      const applyButtons = screen.getAllByText('Apply Theme')
      if (applyButtons.length > 0) {
        fireEvent.click(applyButtons[0])
        
        await waitFor(() => {
          const checkIcons = screen.getAllByTestId('check-icon', { exact: false })
          expect(checkIcons.length).toBeGreaterThan(0)
        })
      }
    })
  })

  describe('Theme Card Styling', () => {
    it('applies theme-specific background colors to cards', () => {
      render(<ThemesContent />)
      
      const themeCards = screen.getAllByRole('article')
      themeCards.forEach((card, index) => {
        if (index < themes.length) {
          const expectedBackgroundColor = themes[index].colors.card
          expect(card).toHaveStyle(`background-color: ${expectedBackgroundColor}`)
        }
      })
    })

    it('applies theme-specific border colors to cards', () => {
      render(<ThemesContent />)
      
      const themeCards = screen.getAllByRole('article')
      themeCards.forEach((card, index) => {
        if (index < themes.length) {
          const expectedBorderColor = themes[index].colors.border
          expect(card).toHaveStyle(`border-color: ${expectedBorderColor}`)
        }
      })
    })

    it('applies hover effects to theme cards', () => {
      render(<ThemesContent />)
      
      const themeCards = screen.getAllByRole('article')
      themeCards.forEach(card => {
        expect(card).toHaveClass('hover:shadow-lg', 'hover:scale-105')
      })
    })
  })

  describe('Accessibility', () => {
    it('provides proper alt text for theme logos', () => {
      render(<ThemesContent />)
      
      const themeImages = screen.getAllByRole('img')
      themeImages.forEach((img, index) => {
        if (index < themes.length) {
          expect(img).toHaveAttribute('alt', `${themes[index].name} logo`)
        }
      })
    })

    it('provides proper title attributes for color swatches', () => {
      render(<ThemesContent />)
      
      const colorSwatches = screen.getAllByTitle(/Primary|Secondary|Accent/)
      expect(colorSwatches.length).toBeGreaterThan(0)
    })

    it('maintains proper focus management for buttons', () => {
      render(<ThemesContent />)
      
      const applyButtons = screen.getAllByText('Apply Theme')
      applyButtons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button')
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('adapts grid layout for different screen sizes', () => {
      render(<ThemesContent />)
      
      const gridContainer = screen.getByRole('main', { hidden: true })
      expect(gridContainer).toHaveClass(
        'grid-cols-1',      // Mobile
        'md:grid-cols-2',   // Tablet
        'lg:grid-cols-2',   // Laptop
        'xl:grid-cols-3'    // Desktop
      )
    })

    it('maintains proper spacing across different screen sizes', () => {
      render(<ThemesContent />)
      
      const gridContainer = screen.getByRole('main', { hidden: true })
      expect(gridContainer).toHaveClass('gap-8')
    })
  })

  describe('Theme Selection State', () => {
    it('shows selected state for current theme', async () => {
      render(<ThemesContent />)
      
      // Check if any theme shows as selected initially
      const appliedButtons = screen.queryAllByText('✓ Applied')
      const applyButtons = screen.getAllByText('Apply Theme')
      
      // Should have either applied or apply buttons, not both
      expect(appliedButtons.length + applyButtons.length).toBe(themes.length)
    })

    it('updates selection state when theme is changed', async () => {
      render(<ThemesContent />)
      
      const applyButtons = screen.getAllByText('Apply Theme')
      if (applyButtons.length > 0) {
        fireEvent.click(applyButtons[0])
        
        await waitFor(() => {
          expect(screen.getByText('✓ Applied')).toBeInTheDocument()
        })
      }
    })
  })
})
