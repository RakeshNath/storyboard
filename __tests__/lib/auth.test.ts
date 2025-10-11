import { getUser, logout, getUserTheme, updateUserTheme } from '@/lib/auth'

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

describe('Auth Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.removeItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  describe('getUser', () => {
    it('returns null when no user in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const user = getUser()
      
      expect(user).toBeNull()
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user')
    })

    it('returns parsed user when valid JSON in localStorage', () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      const user = getUser()
      
      expect(user).toEqual(mockUser)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user')
    })

    it('returns null when invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      
      const user = getUser()
      
      expect(user).toBeNull()
    })

    it('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      
      const user = getUser()
      
      expect(user).toBeNull()
    })

    it('handles empty string in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('')
      
      const user = getUser()
      
      expect(user).toBeNull()
    })

    it('handles null value in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('null')
      
      const user = getUser()
      
      expect(user).toBeNull()
    })
  })

  describe('logout', () => {
    it('removes user from localStorage', () => {
      logout()
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })

    it('handles localStorage errors gracefully', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      
      expect(() => logout()).not.toThrow()
    })
  })

  describe('getUserTheme', () => {
    it('returns default theme when no user in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const theme = getUserTheme()
      
      expect(theme).toBe('minimalist')
    })

    it('returns user theme when user exists in localStorage', () => {
      const mockUser = { id: '1', name: 'John Doe', theme: 'dark' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      const theme = getUserTheme()
      
      expect(theme).toBe('dark')
    })

    it('returns default theme when user has no theme', () => {
      const mockUser = { id: '1', name: 'John Doe' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      const theme = getUserTheme()
      
      expect(theme).toBe('minimalist')
    })
  })

  describe('updateUserTheme', () => {
    it('updates user theme in localStorage', () => {
      const mockUser = { id: '1', name: 'John Doe', theme: 'light' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      updateUserTheme('dark')
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ ...mockUser, theme: 'dark' })
      )
    })

    it('handles localStorage errors gracefully', () => {
      // Set up a user in localStorage first
      const mockUser = { id: '1', name: 'John Doe', theme: 'light' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      // Mock localStorage.setItem to throw an error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      
      // Suppress console.error for this test since we expect an error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => updateUserTheme('dark')).toThrow('localStorage error')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Integration', () => {
    it('works with complete authentication flow', () => {
      // Start unauthenticated
      localStorageMock.getItem.mockReturnValue(null)
      expect(getUser()).toBeNull()
      expect(getUserTheme()).toBe('minimalist')

      // Simulate login
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com', theme: 'dark' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
      expect(getUser()).toEqual(mockUser)
      expect(getUserTheme()).toBe('dark')

      // Simulate logout
      logout()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })

    it('handles multiple getUser calls', () => {
      const mockUser = { id: '1', name: 'John Doe' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      const user1 = getUser()
      const user2 = getUser()
      
      expect(user1).toEqual(mockUser)
      expect(user2).toEqual(mockUser)
      expect(localStorageMock.getItem).toHaveBeenCalledTimes(2)
    })

    it('handles multiple getUserTheme calls', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const theme1 = getUserTheme()
      const theme2 = getUserTheme()
      
      expect(theme1).toBe('minimalist')
      expect(theme2).toBe('minimalist')
      expect(localStorageMock.getItem).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge Cases', () => {
    it('handles very large user objects', () => {
      const largeUser = {
        id: '1',
        name: 'John Doe',
        data: 'x'.repeat(10000),
        metadata: Array.from({ length: 1000 }, (_, i) => ({ key: i, value: `value-${i}` }))
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(largeUser))
      
      const user = getUser()
      
      expect(user).toEqual(largeUser)
    })

    it('handles user with special characters', () => {
      const specialUser = {
        id: '1',
        name: 'José María',
        email: 'josé@example.com',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(specialUser))
      
      const user = getUser()
      
      expect(user).toEqual(specialUser)
    })

    it('handles user with null/undefined values', () => {
      const userWithNulls = {
        id: '1',
        name: 'John Doe',
        email: null,
        phone: undefined,
        address: null
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(userWithNulls))
      
      const user = getUser()
      
      expect(user).toEqual(userWithNulls)
    })
  })

  describe('Server-Side Rendering (SSR)', () => {
    it('getUser returns null when window is undefined (SSR)', () => {
      // Mock window as undefined (server-side)
      const originalWindow = global.window
      // @ts-ignore
      delete global.window
      
      const user = getUser()
      
      expect(user).toBeNull()
      
      // Restore window
      global.window = originalWindow
    })

    it('updateUserTheme returns early when window is undefined (SSR)', () => {
      // Mock window as undefined (server-side)
      const originalWindow = global.window
      // @ts-ignore
      delete global.window
      
      // Should not throw and should not call localStorage
      expect(() => updateUserTheme('dark')).not.toThrow()
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
      
      // Restore window
      global.window = originalWindow
    })


  })
})