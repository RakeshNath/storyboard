import { applyThemeToDocument, loadTheme, ThemeColors } from '@/lib/theme'

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

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

describe('Theme Application Verification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
    mockSetProperty.mockClear()
  })

  describe('CSS Variable Application', () => {
    it('applies all theme colors as CSS variables', () => {
      const themeColors: ThemeColors = {
        primary: 'oklch(0.45 0.15 264)',
        secondary: 'oklch(0.15 0.02 264)',
        background: 'oklch(0.08 0.01 264)',
        foreground: 'oklch(0.92 0.01 264)',
        accent: 'oklch(0.22 0.025 264)',
      }

      applyThemeToDocument(themeColors)

      // Verify all color properties are set as CSS variables
      expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.45 0.15 264)')
      expect(mockSetProperty).toHaveBeenCalledWith('--secondary', 'oklch(0.15 0.02 264)')
      expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.08 0.01 264)')
      expect(mockSetProperty).toHaveBeenCalledWith('--foreground', 'oklch(0.92 0.01 264)')
      expect(mockSetProperty).toHaveBeenCalledWith('--accent', 'oklch(0.22 0.025 264)')
    })

    it('verifies CSS variable names match expected format', () => {
      const themeColors: ThemeColors = {
        primary: '#3b82f6',
        secondary: '#6b7280',
        background: '#ffffff',
        foreground: '#000000',
        accent: '#f59e0b',
      }

      applyThemeToDocument(themeColors)

      // Check that CSS variable names follow the expected pattern
      const calls = mockSetProperty.mock.calls
      calls.forEach(([variableName, value]) => {
        expect(variableName).toMatch(/^--[a-z-]+$/)
        expect(typeof value).toBe('string')
        expect(value.length).toBeGreaterThan(0)
      })
    })

    it('handles complex color formats correctly', () => {
      const complexColors: ThemeColors = {
        primary: 'oklch(0.65 0.18 180)',
        secondary: 'rgb(107, 114, 128)',
        background: 'hsl(210, 40%, 98%)',
        foreground: 'var(--custom-color)',
        accent: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      }

      applyThemeToDocument(complexColors)

      expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.65 0.18 180)')
      expect(mockSetProperty).toHaveBeenCalledWith('--secondary', 'rgb(107, 114, 128)')
      expect(mockSetProperty).toHaveBeenCalledWith('--background', 'hsl(210, 40%, 98%)')
      expect(mockSetProperty).toHaveBeenCalledWith('--foreground', 'var(--custom-color)')
      expect(mockSetProperty).toHaveBeenCalledWith('--accent', 'linear-gradient(45deg, #ff6b6b, #4ecdc4)')
    })
  })

  describe('Theme Persistence', () => {
    it('loads saved theme from localStorage', () => {
      localStorageMock.setItem('selectedTheme', 'cyberpunk')
      
      const result = loadTheme()
      
      expect(result).toBe('cyberpunk')
    })

    it('returns default theme when no theme is saved', () => {
      const result = loadTheme()
      
      expect(result).toBe('professional')
    })

    it('handles theme switching correctly', () => {
      // Initial theme
      localStorageMock.setItem('selectedTheme', 'minimalist')
      expect(loadTheme()).toBe('minimalist')

      // Switch theme
      localStorageMock.setItem('selectedTheme', 'noir')
      expect(loadTheme()).toBe('noir')
    })
  })

  describe('Error Handling', () => {
    it('handles invalid color values gracefully', () => {
      const invalidColors = {
        primary: null as any,
        secondary: undefined as any,
        background: '',
        foreground: 'invalid-color',
        accent: 'oklch(0.4 0.05 200)',
      }

      expect(() => applyThemeToDocument(invalidColors)).not.toThrow()
      
      // Should still process valid colors
      expect(mockSetProperty).toHaveBeenCalledWith('--accent', 'oklch(0.4 0.05 200)')
    })

    it('handles empty theme object', () => {
      applyThemeToDocument({} as ThemeColors)
      
      expect(mockSetProperty).not.toHaveBeenCalled()
    })

    it('handles server-side rendering gracefully', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      expect(() => loadTheme()).not.toThrow()
      expect(() => applyThemeToDocument({} as ThemeColors)).not.toThrow()

      global.window = originalWindow
    })
  })

  describe('Theme Validation', () => {
    it('validates color format consistency', () => {
      const validColors: ThemeColors = {
        primary: 'oklch(0.45 0.15 264)',
        secondary: 'oklch(0.15 0.02 264)',
        background: 'oklch(0.08 0.01 264)',
        foreground: 'oklch(0.92 0.01 264)',
        accent: 'oklch(0.22 0.025 264)',
      }

      applyThemeToDocument(validColors)

      // All colors should be applied
      expect(mockSetProperty).toHaveBeenCalledTimes(5)
    })

    it('handles mixed color formats', () => {
      const mixedColors: ThemeColors = {
        primary: '#3b82f6',
        secondary: 'oklch(0.15 0.02 264)',
        background: 'rgb(255, 255, 255)',
        foreground: 'hsl(0, 0%, 0%)',
        accent: 'var(--accent-color)',
      }

      applyThemeToDocument(mixedColors)

      expect(mockSetProperty).toHaveBeenCalledTimes(5)
    })
  })

  describe.skip('Performance and Efficiency', () => {
    it('applies theme efficiently without redundant calls', () => {
      const themeColors: ThemeColors = {
        primary: 'oklch(0.45 0.15 264)',
        secondary: 'oklch(0.15 0.02 264)',
        background: 'oklch(0.08 0.01 264)',
        foreground: 'oklch(0.92 0.01 264)',
        accent: 'oklch(0.22 0.025 264)',
      }

      applyThemeToDocument(themeColors)

      // Should only call setProperty once per color
      expect(mockSetProperty).toHaveBeenCalledTimes(5)
    })

    it('handles rapid theme changes', () => {
      const theme1: ThemeColors = {
        primary: 'oklch(0.45 0.15 264)',
        secondary: 'oklch(0.15 0.02 264)',
        background: 'oklch(0.08 0.01 264)',
        foreground: 'oklch(0.92 0.01 264)',
        accent: 'oklch(0.22 0.025 264)',
      }

      const theme2: ThemeColors = {
        primary: 'oklch(0.65 0.18 180)',
        secondary: 'oklch(0.45 0.08 180)',
        background: 'oklch(0.96 0.01 180)',
        foreground: 'oklch(0.2 0.01 180)',
        accent: 'oklch(0.75 0.12 180)',
      }

      applyThemeToDocument(theme1)
      applyThemeToDocument(theme2)

      // Should handle both applications correctly
      expect(mockSetProperty).toHaveBeenCalledTimes(10)
    })
  })
})