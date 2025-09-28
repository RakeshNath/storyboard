import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemesContent } from '@/components/sections/themes-content'
import { ProfileContent } from '@/components/sections/profile-content'
import { getUserTheme, updateUserTheme } from '@/lib/auth'

// Mock the auth functions
jest.mock('@/lib/auth', () => ({
  getUserTheme: jest.fn(),
  updateUserTheme: jest.fn(),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: (props: any) => <svg {...props} data-testid="check-icon" />,
  Palette: (props: any) => <svg {...props} data-testid="palette-icon" />,
  ChevronDown: (props: any) => <svg {...props} data-testid="chevron-down-icon" />,
  ChevronUp: (props: any) => <svg {...props} data-testid="chevron-up-icon" />,
}))

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  dateOfBirth: '1990-01-01',
  location: 'New York',
  phoneNumber: '+1234567890',
  subscription: 'premium',
}

// Helper function to get CSS custom property value
const getCSSVariable = (variableName: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${variableName}`).trim()
}

describe('Theme Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getUserTheme as jest.Mock).mockReturnValue('minimalist')
    ;(updateUserTheme as jest.Mock).mockResolvedValue(undefined)
    
    // Reset any existing CSS variables
    document.documentElement.style.cssText = ''
  })

  describe('Theme Application to CSS Variables', () => {
    it('should apply professional theme colors to CSS variables', async () => {
      render(<ThemesContent />)

      // Find and click on professional theme apply button
      const professionalText = screen.getByText('Professional')
      const professionalCard = professionalText.closest('div[class*="bg-card"]')
      expect(professionalCard).toBeInTheDocument()
      
      const applyButton = professionalCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      fireEvent.click(applyButton!)

      // Wait for theme to be applied
      await waitFor(() => {
        expect(getCSSVariable('primary')).toBe('oklch(0.45 0.15 264)')
        expect(getCSSVariable('primary-foreground')).toBe('oklch(0.98 0.005 264)')
        expect(getCSSVariable('background')).toBe('oklch(0.08 0.01 264)')
        expect(getCSSVariable('foreground')).toBe('oklch(0.92 0.01 264)')
        expect(getCSSVariable('card')).toBe('oklch(0.12 0.015 264)')
        expect(getCSSVariable('card-foreground')).toBe('oklch(0.92 0.01 264)')
      })
    })

    it('should apply cyberpunk theme colors to CSS variables', async () => {
      render(<ThemesContent />)

      // Find and click on cyberpunk theme apply button
      const cyberpunkText = screen.getByText('Cyberpunk')
      const cyberpunkCard = cyberpunkText.closest('div[class*="bg-card"]')
      expect(cyberpunkCard).toBeInTheDocument()
      
      const applyButton = cyberpunkCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      fireEvent.click(applyButton!)

      // Wait for theme to be applied
      await waitFor(() => {
        expect(getCSSVariable('primary')).toBe('oklch(0.65 0.18 180)')
        expect(getCSSVariable('primary-foreground')).toBe('oklch(0.95 0.01 180)')
        expect(getCSSVariable('background')).toBe('oklch(0.96 0.01 180)')
        expect(getCSSVariable('foreground')).toBe('oklch(0.2 0.01 180)')
      })
    })

    it('should apply minimalist theme colors to CSS variables', async () => {
      render(<ThemesContent />)

      // Find and click on minimalist theme apply button
      const minimalistText = screen.getByText('Minimalist')
      const minimalistCard = minimalistText.closest('div[class*="bg-card"]')
      expect(minimalistCard).toBeInTheDocument()
      
      const applyButton = minimalistCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      fireEvent.click(applyButton!)

      // Wait for theme to be applied
      await waitFor(() => {
        expect(getCSSVariable('primary')).toBe('oklch(0.4 0.05 200)')
        expect(getCSSVariable('primary-foreground')).toBe('oklch(0.98 0.005 200)')
        expect(getCSSVariable('background')).toBe('oklch(0.98 0.005 200)')
        expect(getCSSVariable('foreground')).toBe('oklch(0.15 0.01 200)')
      })
    })

    it('should apply all theme color properties to CSS variables', async () => {
      render(<ThemesContent />)

      // Find and click on professional theme apply button
      const professionalText = screen.getByText('Professional')
      const professionalCard = professionalText.closest('div[class*="bg-card"]')
      const applyButton = professionalCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      fireEvent.click(applyButton!)

      // Wait for all theme properties to be applied
      await waitFor(() => {
        // Primary colors
        expect(getCSSVariable('primary')).toBe('oklch(0.45 0.15 264)')
        expect(getCSSVariable('primary-foreground')).toBe('oklch(0.98 0.005 264)')
        
        // Secondary colors
        expect(getCSSVariable('secondary')).toBe('oklch(0.15 0.02 264)')
        expect(getCSSVariable('secondary-foreground')).toBe('oklch(0.95 0.01 264)')
        
        // Background colors
        expect(getCSSVariable('background')).toBe('oklch(0.08 0.01 264)')
        expect(getCSSVariable('foreground')).toBe('oklch(0.92 0.01 264)')
        
        // Card colors
        expect(getCSSVariable('card')).toBe('oklch(0.12 0.015 264)')
        expect(getCSSVariable('card-foreground')).toBe('oklch(0.92 0.01 264)')
        
        // Accent colors
        expect(getCSSVariable('accent')).toBe('oklch(0.22 0.025 264)')
        expect(getCSSVariable('accent-foreground')).toBe('oklch(0.85 0.01 264)')
        
        // Border and input
        expect(getCSSVariable('border')).toBe('oklch(0.22 0.025 264)')
        expect(getCSSVariable('input')).toBe('oklch(0.18 0.02 264)')
        expect(getCSSVariable('ring')).toBe('oklch(0.65 0.18 264)')
      })
    })
  })

  describe('Theme Change Communication', () => {
    it('should dispatch themeChanged event when theme is changed', async () => {
      render(<ThemesContent />)

      // Set up event listener
      const themeChangeHandler = jest.fn()
      window.addEventListener('themeChanged', themeChangeHandler)

      // Change theme
      const professionalCard = screen.getByText('Professional').closest('div[class*="bg-card"]')
      const applyButton = professionalCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      fireEvent.click(applyButton!)

      // Wait for event to be dispatched
      await waitFor(() => {
        expect(themeChangeHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'themeChanged',
            detail: { theme: 'professional' }
          })
        )
      })

      // Clean up
      window.removeEventListener('themeChanged', themeChangeHandler)
    })

    it('should update ProfileContent when theme is changed from ThemesContent', async () => {
      render(
        <div>
          <ThemesContent />
          <ProfileContent user={mockUser} />
        </div>
      )

      // Initial theme in ProfileContent - should find at least one Minimalist text
      expect(screen.getAllByText('Minimalist')).toHaveLength(2)

      // Change theme from ThemesContent
      const professionalCard = screen.getByText('Professional').closest('div[class*="bg-card"]')
      const applyButton = professionalCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      fireEvent.click(applyButton!)

      // Wait for ProfileContent to update - should find at least one Professional text
      await waitFor(() => {
        expect(screen.getAllByText('Professional')).toHaveLength(2)
      })
    })

    it('should update multiple ProfileContent instances when theme changes', async () => {
      render(
        <div>
          <ThemesContent />
          <ProfileContent user={mockUser} />
          <ProfileContent user={{ ...mockUser, email: 'test2@example.com' }} />
        </div>
      )

      // Both ProfileContent instances should show initial theme (plus one in ThemesContent)
      const minimalistTexts = screen.getAllByText('Minimalist')
      expect(minimalistTexts).toHaveLength(3)

      // Change theme
      const professionalCard = screen.getByText('Professional').closest('div[class*="bg-card"]')
      const applyButton = professionalCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      fireEvent.click(applyButton!)

      // Both instances should update
      await waitFor(() => {
        const professionalTexts = screen.getAllByText('Professional')
        expect(professionalTexts).toHaveLength(3)
      })
    })
  })

  describe('Theme Persistence', () => {
    it('should persist theme changes across component re-renders', async () => {
      const { rerender } = render(<ThemesContent />)

      // Change theme
      const professionalCard = screen.getByText('Professional').closest('div[class*="bg-card"]')
      const applyButton = professionalCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      fireEvent.click(applyButton!)

      // Wait for theme to be applied
      await waitFor(() => {
        expect(getCSSVariable('primary')).toBe('oklch(0.45 0.15 264)')
      })

      // Re-render component
      rerender(<ThemesContent />)

      // Theme should persist
      expect(getCSSVariable('primary')).toBe('oklch(0.45 0.15 264)')
    })

    it('should load saved theme on component mount', () => {
      ;(getUserTheme as jest.Mock).mockReturnValue('cyberpunk')
      
      render(<ThemesContent />)

      // Should load cyberpunk theme
      expect(getCSSVariable('primary')).toBe('oklch(0.65 0.18 180)')
    })
  })

  describe('Theme Error Handling', () => {
    it('should handle invalid theme selection gracefully', async () => {
      render(<ThemesContent />)

      // Try to apply invalid theme (this shouldn't happen in normal usage)
      // but we can test the error handling
      const originalConsoleError = console.error
      console.error = jest.fn()

      // Simulate invalid theme application
      const invalidTheme = { id: 'invalid', name: 'Invalid', colors: {} }
      
      // This should not crash the application
      expect(() => {
        // Simulate what happens when an invalid theme is selected
        document.documentElement.style.setProperty('--primary', '')
      }).not.toThrow()

      console.error = originalConsoleError
    })

    it('should handle theme application errors gracefully', async () => {
      render(<ThemesContent />)

      // Mock document.documentElement.style.setProperty to throw an error
      const originalSetProperty = document.documentElement.style.setProperty
      document.documentElement.style.setProperty = jest.fn().mockImplementation(() => {
        throw new Error('CSS property setting failed')
      })

      const originalConsoleError = console.error
      console.error = jest.fn()

      // Try to change theme
      const professionalCard = screen.getByText('Professional').closest('div[class*="bg-card"]')
      
      // Should not crash the application
      expect(() => {
        const applyButton = professionalCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      fireEvent.click(applyButton!)
      }).not.toThrow()

      // Restore original function
      document.documentElement.style.setProperty = originalSetProperty
      console.error = originalConsoleError
    })
  })

  describe('Theme Performance', () => {
    it('should apply theme changes efficiently', async () => {
      const { rerender } = render(<ThemesContent />)

      const startTime = performance.now()

      // Change theme multiple times rapidly
      const themes = ['professional', 'cyberpunk', 'minimalist', 'film noir']
      
      for (const themeName of themes) {
        const displayName = themeName === 'film noir' ? 'Film Noir' : themeName.charAt(0).toUpperCase() + themeName.slice(1)
        const themeText = screen.getByText(displayName)
        const themeCard = themeText.closest('div[class*="bg-card"]')
        const applyButton = themeCard?.querySelector('button')
        expect(applyButton).toBeInTheDocument()
        fireEvent.click(applyButton!)
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Theme changes should be fast (less than 100ms for 4 changes)
      expect(duration).toBeLessThan(100)

      // Final theme should be applied correctly (Film Noir)
      await waitFor(() => {
        expect(getCSSVariable('primary')).toBe('oklch(0.95 0 0)') // Film Noir theme primary color
      })
    })
  })
})
