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

describe('Theme Value Application Verification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
    mockSetProperty.mockClear()
  })

  describe('Core Theme Application', () => {
    it('verifies theme colors are applied as CSS variables', () => {
      const professionalTheme: ThemeColors = {
        primary: 'oklch(0.45 0.15 264)',
        secondary: 'oklch(0.15 0.02 264)',
        background: 'oklch(0.08 0.01 264)',
        foreground: 'oklch(0.92 0.01 264)',
        accent: 'oklch(0.22 0.025 264)',
      }

      applyThemeToDocument(professionalTheme)

      // Verify all colors are applied as CSS variables
      expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.45 0.15 264)')
      expect(mockSetProperty).toHaveBeenCalledWith('--secondary', 'oklch(0.15 0.02 264)')
      expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.08 0.01 264)')
      expect(mockSetProperty).toHaveBeenCalledWith('--foreground', 'oklch(0.92 0.01 264)')
      expect(mockSetProperty).toHaveBeenCalledWith('--accent', 'oklch(0.22 0.025 264)')
    })

    it('verifies cyberpunk theme colors are applied correctly', () => {
      const cyberpunkTheme: ThemeColors = {
        primary: 'oklch(0.65 0.18 180)',
        secondary: 'oklch(0.45 0.08 180)',
        background: 'oklch(0.96 0.01 180)',
        foreground: 'oklch(0.2 0.01 180)',
        accent: 'oklch(0.75 0.12 180)',
      }

      applyThemeToDocument(cyberpunkTheme)

      expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.65 0.18 180)')
      expect(mockSetProperty).toHaveBeenCalledWith('--secondary', 'oklch(0.45 0.08 180)')
      expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.96 0.01 180)')
      expect(mockSetProperty).toHaveBeenCalledWith('--foreground', 'oklch(0.2 0.01 180)')
      expect(mockSetProperty).toHaveBeenCalledWith('--accent', 'oklch(0.75 0.12 180)')
    })

    it('verifies noir theme colors are applied correctly', () => {
      const noirTheme: ThemeColors = {
        primary: 'oklch(0.95 0 0)',
        secondary: 'oklch(0.10 0 0)',
        background: 'oklch(0.15 0 0)',
        foreground: 'oklch(0.95 0 0)',
        accent: 'oklch(0.30 0 0)',
      }

      applyThemeToDocument(noirTheme)

      expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.95 0 0)')
      expect(mockSetProperty).toHaveBeenCalledWith('--secondary', 'oklch(0.10 0 0)')
      expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.15 0 0)')
      expect(mockSetProperty).toHaveBeenCalledWith('--foreground', 'oklch(0.95 0 0)')
      expect(mockSetProperty).toHaveBeenCalledWith('--accent', 'oklch(0.30 0 0)')
    })

    it('verifies minimalist theme colors are applied correctly', () => {
      const minimalistTheme: ThemeColors = {
        primary: 'oklch(0.4 0.05 200)',
        secondary: 'oklch(0.15 0.02 200)',
        background: 'oklch(0.98 0.005 200)',
        foreground: 'oklch(0.15 0.01 200)',
        accent: 'oklch(0.85 0.05 200)',
      }

      applyThemeToDocument(minimalistTheme)

      expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.4 0.05 200)')
      expect(mockSetProperty).toHaveBeenCalledWith('--secondary', 'oklch(0.15 0.02 200)')
      expect(mockSetProperty).toHaveBeenCalledWith('--background', 'oklch(0.98 0.005 200)')
      expect(mockSetProperty).toHaveBeenCalledWith('--foreground', 'oklch(0.15 0.01 200)')
      expect(mockSetProperty).toHaveBeenCalledWith('--accent', 'oklch(0.85 0.05 200)')
    })
  })

  describe('Theme Persistence and Loading', () => {
    it('loads and applies saved theme correctly', () => {
      // Save a theme
      localStorageMock.setItem('selectedTheme', 'cyberpunk')
      
      const loadedTheme = loadTheme()
      expect(loadedTheme).toBe('cyberpunk')

      // Apply the loaded theme
      const cyberpunkTheme: ThemeColors = {
        primary: 'oklch(0.65 0.18 180)',
        secondary: 'oklch(0.45 0.08 180)',
        background: 'oklch(0.96 0.01 180)',
        foreground: 'oklch(0.2 0.01 180)',
        accent: 'oklch(0.75 0.12 180)',
      }

      applyThemeToDocument(cyberpunkTheme)

      // Verify the theme was applied
      expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.65 0.18 180)')
    })

    it('handles theme switching correctly', () => {
      // Start with professional theme
      const professionalTheme: ThemeColors = {
        primary: 'oklch(0.45 0.15 264)',
        secondary: 'oklch(0.15 0.02 264)',
        background: 'oklch(0.08 0.01 264)',
        foreground: 'oklch(0.92 0.01 264)',
        accent: 'oklch(0.22 0.025 264)',
      }

      applyThemeToDocument(professionalTheme)
      expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.45 0.15 264)')

      // Clear and switch to cyberpunk
      mockSetProperty.mockClear()

      const cyberpunkTheme: ThemeColors = {
        primary: 'oklch(0.65 0.18 180)',
        secondary: 'oklch(0.45 0.08 180)',
        background: 'oklch(0.96 0.01 180)',
        foreground: 'oklch(0.2 0.01 180)',
        accent: 'oklch(0.75 0.12 180)',
      }

      applyThemeToDocument(cyberpunkTheme)
      expect(mockSetProperty).toHaveBeenCalledWith('--primary', 'oklch(0.65 0.18 180)')
    })
  })

  describe('Color Format Validation', () => {
    it('validates OKLCH color format', () => {
      const theme: ThemeColors = {
        primary: 'oklch(0.45 0.15 264)',
        secondary: 'oklch(0.15 0.02 264)',
        background: 'oklch(0.08 0.01 264)',
        foreground: 'oklch(0.92 0.01 264)',
        accent: 'oklch(0.22 0.025 264)',
      }

      applyThemeToDocument(theme)

      // Verify all colors follow OKLCH format
      const calls = mockSetProperty.mock.calls
      calls.forEach(([variable, value]) => {
        expect(value).toMatch(/^oklch\([0-9.]+ [0-9.]+ [0-9.]+\)$/)
      })
    })

    it('handles different color formats', () => {
      const mixedFormatTheme: ThemeColors = {
        primary: '#3b82f6',
        secondary: 'rgb(107, 114, 128)',
        background: 'hsl(210, 40%, 98%)',
        foreground: 'oklch(0.15 0.01 200)',
        accent: 'var(--accent-color)',
      }

      applyThemeToDocument(mixedFormatTheme)

      expect(mockSetProperty).toHaveBeenCalledWith('--primary', '#3b82f6')
      expect(mockSetProperty).toHaveBeenCalledWith('--secondary', 'rgb(107, 114, 128)')
      expect(mockSetProperty).toHaveBeenCalledWith('--background', 'hsl(210, 40%, 98%)')
      expect(mockSetProperty).toHaveBeenCalledWith('--foreground', 'oklch(0.15 0.01 200)')
      expect(mockSetProperty).toHaveBeenCalledWith('--accent', 'var(--accent-color)')
    })
  })

  describe('Error Handling', () => {
    it('handles invalid color values gracefully', () => {
      const invalidTheme = {
        primary: null as any,
        secondary: undefined as any,
        background: '',
        foreground: 'invalid-color',
        accent: 'oklch(0.4 0.05 200)',
      }

      expect(() => applyThemeToDocument(invalidTheme)).not.toThrow()
      
      // Should still process valid colors
      expect(mockSetProperty).toHaveBeenCalledWith('--accent', 'oklch(0.4 0.05 200)')
    })

    it('handles empty theme object', () => {
      applyThemeToDocument({} as ThemeColors)
      expect(mockSetProperty).not.toHaveBeenCalled()
    })
  })

  describe.skip('Performance and Reliability', () => {
    it('applies theme efficiently', () => {
      const theme: ThemeColors = {
        primary: 'oklch(0.45 0.15 264)',
        secondary: 'oklch(0.15 0.02 264)',
        background: 'oklch(0.08 0.01 264)',
        foreground: 'oklch(0.92 0.01 264)',
        accent: 'oklch(0.22 0.025 264)',
      }

      const startTime = performance.now()
      applyThemeToDocument(theme)
      const endTime = performance.now()

      // Should be fast (less than 10ms)
      expect(endTime - startTime).toBeLessThan(10)
      expect(mockSetProperty).toHaveBeenCalledTimes(5)
    })

    it('handles rapid theme changes', () => {
      const themes = [
        { primary: 'oklch(0.45 0.15 264)', secondary: 'oklch(0.15 0.02 264)', background: 'oklch(0.08 0.01 264)', foreground: 'oklch(0.92 0.01 264)', accent: 'oklch(0.22 0.025 264)' },
        { primary: 'oklch(0.65 0.18 180)', secondary: 'oklch(0.45 0.08 180)', background: 'oklch(0.96 0.01 180)', foreground: 'oklch(0.2 0.01 180)', accent: 'oklch(0.75 0.12 180)' },
        { primary: 'oklch(0.95 0 0)', secondary: 'oklch(0.10 0 0)', background: 'oklch(0.15 0 0)', foreground: 'oklch(0.95 0 0)', accent: 'oklch(0.30 0 0)' },
      ]

      themes.forEach(theme => {
        applyThemeToDocument(theme)
      })

      // Should handle all theme changes
      expect(mockSetProperty).toHaveBeenCalledTimes(15) // 5 colors × 3 themes
    })
  })
})
