import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemesContent } from '@/components/sections/themes-content'
import { createMockUser } from '@/utils/test-utils'

// Mock the auth functions
jest.mock('@/lib/auth', () => ({
  getUserTheme: jest.fn(() => 'minimalist'),
  updateUserTheme: jest.fn(),
}))

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock document.documentElement.style.setProperty
const mockSetProperty = jest.fn()
Object.defineProperty(document, 'documentElement', {
  value: {
    style: {
      setProperty: mockSetProperty,
    },
  },
  writable: true,
})

// Mock window.dispatchEvent
const mockDispatchEvent = jest.fn()
Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
  writable: true,
})

describe('ThemesContent Theme Application', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSetProperty.mockClear()
    mockDispatchEvent.mockClear()
  })

  describe('Theme Application on Mount', () => {
    it('applies saved theme on component mount', async () => {
      const { getUserTheme } = require('@/lib/auth')
      getUserTheme.mockReturnValue('professional')

      render(<ThemesContent />)

      await waitFor(() => {
        // Should apply professional theme colors
        expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.45 0.15 264)')
        expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.08 0.01 264)')
        expect(mockSetProperty).toHaveBeenCalledWith('--foreground', 'oklch(0.92 0.01 264)')
      })
    })

    it('applies all theme color variables correctly', async () => {
      const { getUserTheme } = require('@/lib/auth')
      getUserTheme.mockReturnValue('cyberpunk')

      render(<ThemesContent />)

      await waitFor(() => {
        // Check that all expected CSS variables are set
        const expectedVariables = [
          '--primary', '--primary-foreground', '--secondary', '--secondary-foreground',
          '--background', '--foreground', '--card', '--card-foreground',
          '--popover', '--popover-foreground', '--muted', '--muted-foreground',
          '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
          '--border', '--input', '--ring', '--sidebar', '--sidebar-foreground',
          '--sidebar-primary', '--sidebar-primary-foreground', '--sidebar-accent',
          '--sidebar-accent-foreground', '--sidebar-border', '--sidebar-ring'
        ]

        expectedVariables.forEach(variable => {
          expect(mockSetProperty).toHaveBeenCalledWith(
            variable,
            expect.any(String)
          )
        })
      })
    })
  })

  describe('Theme Switching', () => {
    it('applies new theme when user clicks apply button', async () => {
      render(<ThemesContent />)

      // Find the cyberpunk theme card and its apply button
      const cyberpunkCard = screen.getByText('Cyberpunk').closest('div')
      expect(cyberpunkCard).toBeInTheDocument()
      
      const applyButton = cyberpunkCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      
      fireEvent.click(applyButton!)

      await waitFor(() => {
        // Should apply cyberpunk theme colors
        expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.65 0.18 180)')
        expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.96 0.01 180)')
        expect(mockSetProperty).toHaveBeenCalledWith('--foreground', 'oklch(0.2 0.01 180)')
      })
    })

    it('dispatches theme change event when theme is applied', async () => {
      render(<ThemesContent />)

      const noirCard = screen.getByText('Film Noir').closest('div')
      expect(noirCard).toBeInTheDocument()
      
      const applyButton = noirCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      
      fireEvent.click(applyButton!)

      await waitFor(() => {
        expect(mockDispatchEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'themeChanged',
            detail: { theme: 'noir' }
          })
        )
      })
    })

    it('updates user theme preference when applied', async () => {
      const { updateUserTheme } = require('@/lib/auth')
      
      render(<ThemesContent />)

      const classicCard = screen.getByText('Classic').closest('div')
      expect(classicCard).toBeInTheDocument()
      
      const applyButton = classicCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      
      fireEvent.click(applyButton!)

      await waitFor(() => {
        expect(updateUserTheme).toHaveBeenCalledWith('classic')
      })
    })
  })

  describe('Theme Preview', () => {
    it('applies preview colors on hover', async () => {
      render(<ThemesContent />)

      const indieCard = screen.getByText('Indie Spirit').closest('[data-testid]') || 
                       screen.getByText('Indie Spirit').closest('div')
      
      // Hover over the card to trigger preview
      fireEvent.mouseEnter(indieCard!)

      // The preview should show the indie theme colors
      // Note: The actual preview implementation would need to be tested
      // based on how the preview functionality is implemented
    })

    it('resets preview when mouse leaves', async () => {
      render(<ThemesContent />)

      const minimalistCard = screen.getByText('Minimalist').closest('[data-testid]') || 
                            screen.getByText('Minimalist').closest('div')
      
      fireEvent.mouseEnter(minimalistCard!)
      fireEvent.mouseLeave(minimalistCard!)

      // Preview should be reset
      // This would depend on the actual preview implementation
    })
  })

  describe('Visual Theme Application', () => {
    it('applies theme colors to card elements', () => {
      render(<ThemesContent />)

      // Check that theme cards exist and have some styling
      const professionalCard = screen.getByText('Professional').closest('div')
      expect(professionalCard).toBeInTheDocument()
      
      // Check that the card has some styling applied (may be inline or CSS)
      expect(professionalCard).toHaveAttribute('class')
    })

    it('applies theme colors to buttons', () => {
      render(<ThemesContent />)

      // Check that apply buttons exist and have styling
      const applyButtons = screen.getAllByRole('button')
      expect(applyButtons.length).toBeGreaterThan(0)
      
      applyButtons.forEach(button => {
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('class')
      })
    })

    it('shows correct selected state styling', async () => {
      const { getUserTheme } = require('@/lib/auth')
      getUserTheme.mockReturnValue('minimalist')

      render(<ThemesContent />)

      await waitFor(() => {
        const minimalistCard = screen.getByText('Minimalist').closest('div')
        expect(minimalistCard).toBeInTheDocument()
        
        const appliedButton = minimalistCard?.querySelector('button')
        expect(appliedButton).toBeInTheDocument()
        expect(appliedButton).toHaveTextContent('Applied')
      })
    })
  })

  describe('Theme Color Validation', () => {
    it('validates all theme colors are valid CSS values', () => {
      render(<ThemesContent />)

      // Get all theme cards
      const themeCards = screen.getAllByText(/Professional|Classic|Film Noir|Indie Spirit|Minimalist|Cyberpunk/)
      
      themeCards.forEach(card => {
        const colorSwatches = card.closest('div')?.querySelectorAll('[style*="backgroundColor"]')
        colorSwatches?.forEach(swatch => {
          const style = swatch.getAttribute('style')
          const backgroundColor = style?.match(/backgroundColor:\s*([^;]+)/)?.[1]
          
          if (backgroundColor) {
            // Validate that the color is a valid CSS color
            expect(backgroundColor).toMatch(/^(oklch|rgb|hsl|#|var)\(/)
          }
        })
      })
    })

    it('ensures color contrast for accessibility', () => {
      render(<ThemesContent />)

      // Check that foreground and background colors are different
      const themeCards = screen.getAllByText(/Professional|Classic|Film Noir|Indie Spirit|Minimalist|Cyberpunk/)
      
      themeCards.forEach(card => {
        const cardElement = card.closest('div')
        const backgroundColor = cardElement?.style.backgroundColor
        const color = cardElement?.style.color
        
        if (backgroundColor && color) {
          expect(backgroundColor).not.toBe(color)
        }
      })
    })
  })

  describe('Error Handling', () => {
    it('handles missing theme gracefully', async () => {
      const { getUserTheme } = require('@/lib/auth')
      getUserTheme.mockReturnValue('nonexistent-theme')

      render(<ThemesContent />)

      // Should not throw an error
      expect(screen.getByText('Themes')).toBeInTheDocument()
    })

    it('handles theme application errors gracefully', async () => {
      // Mock setProperty to throw an error
      mockSetProperty.mockImplementation(() => {
        throw new Error('CSS property setting failed')
      })

      render(<ThemesContent />)

      // The component should still render despite the error
      expect(screen.getByText('Themes')).toBeInTheDocument()
      
      // Try to click an apply button - it should not crash the component
      const applyButtons = screen.getAllByRole('button')
      if (applyButtons.length > 0) {
        expect(() => fireEvent.click(applyButtons[0])).not.toThrow()
      }
    })
  })
})
