import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemesContent } from '@/components/sections/themes-content'
import { applyThemeToDocument } from '@/lib/theme'

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

describe('Comprehensive Theme Application Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSetProperty.mockClear()
    mockDispatchEvent.mockClear()
  })

  describe('Complete Theme Application Workflow', () => {
    it('applies all theme colors for professional theme', async () => {
      const { getUserTheme } = require('@/lib/auth')
      getUserTheme.mockReturnValue('professional')

      render(<ThemesContent />)

      await waitFor(() => {
        // Verify all professional theme colors are applied
        const expectedProfessionalColors = {
          '--primary': 'oklch(0.45 0.15 264)',
          '--primary-foreground': 'oklch(0.98 0.005 264)',
          '--secondary': 'oklch(0.15 0.02 264)',
          '--secondary-foreground': 'oklch(0.95 0.01 264)',
          '--background': 'oklch(0.08 0.01 264)',
          '--foreground': 'oklch(0.92 0.01 264)',
          '--card': 'oklch(0.12 0.015 264)',
          '--card-foreground': 'oklch(0.92 0.01 264)',
          '--popover': 'oklch(0.12 0.015 264)',
          '--popover-foreground': 'oklch(0.92 0.01 264)',
          '--muted': 'oklch(0.18 0.02 264)',
          '--muted-foreground': 'oklch(0.65 0.02 264)',
          '--accent': 'oklch(0.22 0.025 264)',
          '--accent-foreground': 'oklch(0.85 0.01 264)',
          '--destructive': 'oklch(0.55 0.22 25)',
          '--destructive-foreground': 'oklch(0.92 0.01 264)',
          '--border': 'oklch(0.22 0.025 264)',
          '--input': 'oklch(0.18 0.02 264)',
          '--ring': 'oklch(0.65 0.18 264)',
          '--sidebar': 'oklch(0.12 0.015 264)',
          '--sidebar-foreground': 'oklch(0.92 0.01 264)',
          '--sidebar-primary': 'oklch(0.65 0.18 264)',
          '--sidebar-primary-foreground': 'oklch(0.08 0.01 264)',
          '--sidebar-accent': 'oklch(0.18 0.02 264)',
          '--sidebar-accent-foreground': 'oklch(0.85 0.01 264)',
          '--sidebar-border': 'oklch(0.22 0.025 264)',
          '--sidebar-ring': 'oklch(0.65 0.18 264)',
        }

        Object.entries(expectedProfessionalColors).forEach(([variable, value]) => {
          expect(mockSetProperty).toHaveBeenCalledWith(variable, value)
        })
      })
    })

    it('applies all theme colors for cyberpunk theme', async () => {
      const { getUserTheme } = require('@/lib/auth')
      getUserTheme.mockReturnValue('cyberpunk')

      render(<ThemesContent />)

      await waitFor(() => {
        // Verify all cyberpunk theme colors are applied
        const expectedCyberpunkColors = {
          '--primary': 'oklch(0.65 0.18 180)',
          '--primary-foreground': 'oklch(0.95 0.01 180)',
          '--secondary': 'oklch(0.45 0.08 180)',
          '--secondary-foreground': 'oklch(0.15 0.02 180)',
          '--background': 'oklch(0.96 0.01 180)',
          '--foreground': 'oklch(0.2 0.01 180)',
          '--card': 'oklch(0.98 0.005 180)',
          '--card-foreground': 'oklch(0.2 0.01 180)',
          '--popover': 'oklch(0.98 0.005 180)',
          '--popover-foreground': 'oklch(0.2 0.01 180)',
          '--muted': 'oklch(0.88 0.03 180)',
          '--muted-foreground': 'oklch(0.45 0.02 180)',
          '--accent': 'oklch(0.75 0.12 180)',
          '--accent-foreground': 'oklch(0.25 0.02 180)',
          '--destructive': 'oklch(0.55 0.22 25)',
          '--destructive-foreground': 'oklch(0.95 0.01 180)',
          '--border': 'oklch(0.82 0.03 180)',
          '--input': 'oklch(0.88 0.03 180)',
          '--ring': 'oklch(0.65 0.18 180)',
          '--sidebar': 'oklch(0.92 0.02 180)',
          '--sidebar-foreground': 'oklch(0.2 0.01 180)',
          '--sidebar-primary': 'oklch(0.55 0.12 140)',
          '--sidebar-primary-foreground': 'oklch(0.95 0.01 140)',
          '--sidebar-accent': 'oklch(0.85 0.05 180)',
          '--sidebar-accent-foreground': 'oklch(0.25 0.02 180)',
          '--sidebar-border': 'oklch(0.82 0.03 180)',
          '--sidebar-ring': 'oklch(0.65 0.18 180)',
        }

        Object.entries(expectedCyberpunkColors).forEach(([variable, value]) => {
          expect(mockSetProperty).toHaveBeenCalledWith(variable, value)
        })
      })
    })

    it('applies all theme colors for noir theme', async () => {
      const { getUserTheme } = require('@/lib/auth')
      getUserTheme.mockReturnValue('noir')

      render(<ThemesContent />)

      await waitFor(() => {
        // Verify all noir theme colors are applied
        const expectedNoirColors = {
          '--primary': 'oklch(0.95 0 0)',
          '--primary-foreground': 'oklch(0.05 0 0)',
          '--secondary': 'oklch(0.10 0 0)',
          '--secondary-foreground': 'oklch(0.95 0 0)',
          '--background': 'oklch(0.15 0 0)',
          '--foreground': 'oklch(0.95 0 0)',
          '--card': 'oklch(0.18 0 0)',
          '--card-foreground': 'oklch(0.95 0 0)',
          '--popover': 'oklch(0.18 0 0)',
          '--popover-foreground': 'oklch(0.95 0 0)',
          '--muted': 'oklch(0.25 0 0)',
          '--muted-foreground': 'oklch(0.65 0 0)',
          '--accent': 'oklch(0.30 0 0)',
          '--accent-foreground': 'oklch(0.85 0 0)',
          '--destructive': 'oklch(0.55 0.22 25)',
          '--destructive-foreground': 'oklch(0.95 0 0)',
          '--border': 'oklch(0.35 0 0)',
          '--input': 'oklch(0.25 0 0)',
          '--ring': 'oklch(0.75 0 0)',
          '--sidebar': 'oklch(0.18 0 0)',
          '--sidebar-foreground': 'oklch(0.95 0 0)',
          '--sidebar-primary': 'oklch(0.75 0 0)',
          '--sidebar-primary-foreground': 'oklch(0.15 0 0)',
          '--sidebar-accent': 'oklch(0.25 0 0)',
          '--sidebar-accent-foreground': 'oklch(0.85 0 0)',
          '--sidebar-border': 'oklch(0.35 0 0)',
          '--sidebar-ring': 'oklch(0.75 0 0)',
        }

        Object.entries(expectedNoirColors).forEach(([variable, value]) => {
          expect(mockSetProperty).toHaveBeenCalledWith(variable, value)
        })
      })
    })
  })

  describe('Theme Switching Verification', () => {
    it('switches from professional to cyberpunk theme', async () => {
      const { getUserTheme, updateUserTheme } = require('@/lib/auth')
      getUserTheme.mockReturnValue('professional')

      render(<ThemesContent />)

      // Wait for initial theme application
      await waitFor(() => {
        expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.45 0.15 264)')
      })

      // Clear previous calls
      mockSetProperty.mockClear()

      // Click cyberpunk apply button
      const cyberpunkText = screen.getByText('Cyberpunk')
      const cyberpunkCard = cyberpunkText.closest('div[class*="bg-card"]')
      expect(cyberpunkCard).toBeInTheDocument()
      
      const applyButton = cyberpunkCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      
      fireEvent.click(applyButton!)

      await waitFor(() => {
        // Verify cyberpunk theme is applied
        expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.65 0.18 180)')
        expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.96 0.01 180)')
        expect(updateUserTheme).toHaveBeenCalledWith('cyberpunk')
        expect(mockDispatchEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'themeChanged',
            detail: { theme: 'cyberpunk' }
          })
        )
      })
    })

    it('switches from minimalist to noir theme', async () => {
      const { getUserTheme, updateUserTheme } = require('@/lib/auth')
      getUserTheme.mockReturnValue('minimalist')

      render(<ThemesContent />)

      // Wait for initial theme application
      await waitFor(() => {
        expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.4 0.05 200)')
      })

      // Clear previous calls
      mockSetProperty.mockClear()

      // Click noir apply button
      const noirText = screen.getByText('Film Noir')
      const noirCard = noirText.closest('div[class*="bg-card"]')
      expect(noirCard).toBeInTheDocument()
      
      const applyButton = noirCard?.querySelector('button')
      expect(applyButton).toBeInTheDocument()
      
      fireEvent.click(applyButton!)

      await waitFor(() => {
        // Verify noir theme is applied
        expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.95 0 0)')
        expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.15 0 0)')
        expect(updateUserTheme).toHaveBeenCalledWith('noir')
      })
    })
  })

  describe('Theme Color Validation', () => {
    it('validates all theme colors are valid OKLCH values', () => {
      render(<ThemesContent />)

      // Get all calls to setProperty
      const calls = mockSetProperty.mock.calls
      
      calls.forEach(([variable, value]) => {
        if (value.startsWith('oklch(')) {
          // Validate OKLCH format: oklch(lightness chroma hue)
          const oklchMatch = value.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/)
          expect(oklchMatch).toBeTruthy()
          
          if (oklchMatch) {
            const [, lightness, chroma, hue] = oklchMatch
            expect(parseFloat(lightness)).toBeGreaterThanOrEqual(0)
            expect(parseFloat(lightness)).toBeLessThanOrEqual(1)
            expect(parseFloat(chroma)).toBeGreaterThanOrEqual(0)
            expect(parseFloat(hue)).toBeGreaterThanOrEqual(0)
            expect(parseFloat(hue)).toBeLessThanOrEqual(360)
          }
        }
      })
    })

    it('ensures consistent color format across themes', () => {
      render(<ThemesContent />)

      const calls = mockSetProperty.mock.calls
      const colorValues = calls.map(([, value]) => value)
      
      // All values should be valid CSS color values
      colorValues.forEach(value => {
        expect(value).toMatch(/^(oklch|rgb|hsl|#|var)\(/)
        expect(value.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Performance and Reliability', () => {
    it('applies theme without performance issues', async () => {
      const startTime = performance.now()
      
      render(<ThemesContent />)
      
      await waitFor(() => {
        expect(mockSetProperty).toHaveBeenCalled()
      })
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Theme application should be fast (less than 100ms)
      expect(duration).toBeLessThan(100)
    })

    it('handles rapid theme switching', async () => {
      render(<ThemesContent />)

      const themes = ['professional', 'cyberpunk', 'noir', 'minimalist', 'classic', 'indie']
      
      for (const theme of themes) {
        const themeCard = screen.getByText(theme === 'noir' ? 'Film Noir' : 
                                         theme === 'indie' ? 'Indie Spirit' : 
                                         theme.charAt(0).toUpperCase() + theme.slice(1)).closest('div')
        const applyButton = themeCard?.querySelector('button')
        
        if (applyButton) {
          fireEvent.click(applyButton)
          await waitFor(() => {
            expect(mockSetProperty).toHaveBeenCalled()
          })
        }
      }
    })
  })
})
