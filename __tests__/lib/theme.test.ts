import { loadTheme, applyThemeToDocument } from '@/lib/theme'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock window.matchMedia
const mockMatchMedia = jest.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

describe('Theme Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('loadTheme', () => {
    it('returns default theme when no theme in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const theme = loadTheme()
      
      expect(theme).toBe('professional')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('selectedTheme')
    })

    it('returns theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark')
      
      const theme = loadTheme()
      
      expect(theme).toBe('dark')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('selectedTheme')
    })

    it('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      
      const theme = loadTheme()
      
      expect(theme).toBe('professional')
    })
  })

  describe('applyThemeToDocument', () => {
    it('applies theme colors to document', () => {
      const mockColors = {
        primary: '#000000',
        secondary: '#ffffff',
        background: '#f0f0f0',
        foreground: '#333333',
        accent: '#ff0000'
      }

      // Mock document.documentElement
      const mockRoot = {
        style: {
          setProperty: jest.fn()
        }
      }
      Object.defineProperty(document, 'documentElement', {
        value: mockRoot,
        writable: true
      })

      applyThemeToDocument(mockColors)

      expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--primary', '#000000')
      expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--secondary', '#ffffff')
      expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--background', '#f0f0f0')
      expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--foreground', '#333333')
      expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--accent', '#ff0000')
    })

    it('handles invalid colors gracefully', () => {
      const mockRoot = {
        style: {
          setProperty: jest.fn()
        }
      }
      Object.defineProperty(document, 'documentElement', {
        value: mockRoot,
        writable: true
      })

      applyThemeToDocument(null as any)
      applyThemeToDocument(undefined as any)
      applyThemeToDocument('invalid' as any)

      expect(mockRoot.style.setProperty).not.toHaveBeenCalled()
    })
  })

  describe('Server-Side Rendering (SSR)', () => {
    it('loadTheme returns default when window is undefined (SSR)', () => {
      // Mock window as undefined (server-side)
      const originalWindow = global.window
      // @ts-ignore
      global.window = undefined
      
      const theme = loadTheme()
      
      expect(theme).toBe('professional')
      
      // Restore window
      global.window = originalWindow
    })

    it('applyThemeToDocument does nothing when window is undefined (SSR)', () => {
      // Mock window as undefined (server-side)
      const originalWindow = global.window
      // @ts-ignore
      global.window = undefined
      
      const mockColors = {
        primary: '#000000',
        secondary: '#ffffff',
        background: '#f0f0f0',
        foreground: '#333333',
        accent: '#ff0000'
      }
      
      // Should not throw and should not call document methods
      expect(() => applyThemeToDocument(mockColors)).not.toThrow()
      
      // Restore window
      global.window = originalWindow
    })
  })
})