/**
 * Tests for storage utility functions
 * Comprehensive coverage for versioned storage management
 */

import {
  checkStorageVersion,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  getStorageJSON,
  setStorageJSON,
  clearAppStorage,
  invalidateStorageCache,
} from '@/lib/storage'

describe('Storage Utilities', () => {
  const originalLocalStorage = global.localStorage
  
  beforeEach(() => {
    const storage: { [key: string]: string } = {}
    
    const mockLocalStorage = {
      getItem: jest.fn((key: string) => storage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        storage[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete storage[key]
      }),
      clear: jest.fn(() => {
        Object.keys(storage).forEach(key => delete storage[key])
      }),
      get length() {
        return Object.keys(storage).length
      },
      key: jest.fn((index: number) => Object.keys(storage)[index] || null),
    }
    
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      configurable: true,
      writable: true,
    })
  })
  
  afterEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
      writable: true,
    })
  })

  describe('checkStorageVersion', () => {
    it('sets version on first run', () => {
      checkStorageVersion()

      expect(localStorage.setItem).toHaveBeenCalledWith('storyboard-storage-version', '1.0.0')
    })

    it('does not clear storage when version matches', () => {
      localStorage.setItem('storyboard-storage-version', '1.0.0')
      localStorage.setItem('test-key', 'test-value')

      checkStorageVersion()

      // Should not have cleared
      expect(localStorage.clear).not.toHaveBeenCalled()
    })

    it('clears storage when version mismatch', () => {
      localStorage.setItem('storyboard-storage-version', '0.9.0')
      localStorage.setItem('test-key', 'test-value')

      checkStorageVersion()

      expect(localStorage.clear).toHaveBeenCalled()
    })

    it('preserves user data during version update', () => {
      localStorage.setItem('storyboard-storage-version', '0.9.0')
      localStorage.setItem('user', '{"id":1}')

      checkStorageVersion()

      expect(localStorage.setItem).toHaveBeenCalledWith('user', '{"id":1}')
    })

    it('preserves theme data during version update', () => {
      localStorage.setItem('storyboard-storage-version', '0.9.0')
      localStorage.setItem('theme', 'dark')

      checkStorageVersion()

      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    })
  })

  describe('getStorageItem', () => {
    it('retrieves item from localStorage', () => {
      localStorage.setItem('test-key', 'test-value')

      const result = getStorageItem('test-key')
      
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    it('returns null for non-existent key', () => {
      const result = getStorageItem('non-existent')
      
      expect(localStorage.getItem).toHaveBeenCalledWith('non-existent')
    })

    it('returns typed values', () => {
      localStorage.setItem('test-key', 'typed-value')

      const result = getStorageItem<string>('test-key')
      
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key')
    })
  })

  describe('setStorageItem', () => {
    it('sets item in localStorage', () => {
      setStorageItem('test-key', 'test-value')

      expect(localStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value')
    })

    it('overwrites existing values', () => {
      localStorage.setItem('test-key', 'old-value')

      setStorageItem('test-key', 'new-value')

      expect(localStorage.setItem).toHaveBeenCalledWith('test-key', 'new-value')
    })
  })

  describe('removeStorageItem', () => {
    it('removes item from localStorage', () => {
      localStorage.setItem('test-key', 'test-value')

      removeStorageItem('test-key')

      expect(localStorage.removeItem).toHaveBeenCalledWith('test-key')
    })

    it('does not error when removing non-existent key', () => {
      expect(() => removeStorageItem('non-existent')).not.toThrow()
    })
  })

  describe('getStorageJSON', () => {
    it('retrieves and parses JSON object', () => {
      const testObj = { id: 1, name: 'Test', active: true }
      localStorage.setItem('test-key', JSON.stringify(testObj))

      const result = getStorageJSON<typeof testObj>('test-key')
      
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    it('returns null for non-existent key', () => {
      const result = getStorageJSON('non-existent')
      
      // Should check localStorage
      expect(localStorage.getItem).toHaveBeenCalledWith('non-existent')
    })

    it('handles complex nested objects', () => {
      const complexObj = {
        user: { id: 1, profile: { name: 'Test', settings: { theme: 'dark' } } },
        items: [1, 2, 3],
        meta: null,
      }
      localStorage.setItem('test-key', JSON.stringify(complexObj))

      const result = getStorageJSON<typeof complexObj>('test-key')
      
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    it('handles arrays', () => {
      const testArray = [1, 2, 3, 4, 5]
      localStorage.setItem('test-key', JSON.stringify(testArray))

      const result = getStorageJSON<number[]>('test-key')
      
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key')
    })
  })

  describe('setStorageJSON', () => {
    it('stringifies and stores JSON object', () => {
      const testObj = { id: 1, name: 'Test', active: true }

      setStorageJSON('test-key', testObj)

      expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testObj))
    })

    it('handles arrays', () => {
      const testArray = [1, 2, 3, 4, 5]

      setStorageJSON('test-key', testArray)

      expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testArray))
    })

    it('handles nested objects', () => {
      const complexObj = {
        user: { id: 1, profile: { name: 'Test' } },
        items: [1, 2, 3],
      }

      setStorageJSON('test-key', complexObj)

      expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(complexObj))
    })
  })

  describe('clearAppStorage', () => {
    it('clears all localStorage', () => {
      localStorage.setItem('key1', 'value1')
      localStorage.setItem('key2', 'value2')

      clearAppStorage()

      expect(localStorage.clear).toHaveBeenCalled()
    })

    it('preserves user data', () => {
      localStorage.setItem('user', '{"id":1}')

      clearAppStorage()

      expect(localStorage.setItem).toHaveBeenCalledWith('user', '{"id":1}')
    })

    it('preserves theme data', () => {
      localStorage.setItem('theme', 'dark')

      clearAppStorage()

      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    })

    it('sets storage version', () => {
      clearAppStorage()

      expect(localStorage.setItem).toHaveBeenCalledWith('storyboard-storage-version', '1.0.0')
    })
  })

  describe('Error Handling', () => {
    it('checkStorageVersion handles errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      ;(localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Storage error')
      })

      expect(() => checkStorageVersion()).not.toThrow()
      
      consoleErrorSpy.mockRestore()
    })

    it('getStorageItem handles errors and returns null', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      ;(localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Storage error')
      })

      const result = getStorageItem('test-key')
      expect(result).toBeNull()
      
      consoleErrorSpy.mockRestore()
    })

    it('setStorageItem handles errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      ;(localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Storage error')
      })

      expect(() => setStorageItem('test-key', 'value')).not.toThrow()
      
      consoleErrorSpy.mockRestore()
    })

    it('removeStorageItem handles errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      ;(localStorage.removeItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Storage error')
      })

      expect(() => removeStorageItem('test-key')).not.toThrow()
      
      consoleErrorSpy.mockRestore()
    })

    it('getStorageJSON handles invalid JSON', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      localStorage.setItem('test-key', 'invalid-json{')

      const result = getStorageJSON('test-key')
      expect(result).toBeNull()
      
      consoleErrorSpy.mockRestore()
    })

    it('setStorageJSON handles circular references', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const circular: any = {}
      circular.self = circular

      expect(() => setStorageJSON('test-key', circular)).not.toThrow()
      
      consoleErrorSpy.mockRestore()
    })

    it('clearAppStorage handles errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      ;(localStorage.clear as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Storage error')
      })

      expect(() => clearAppStorage()).not.toThrow()
      
      consoleErrorSpy.mockRestore()
    })

    it('invalidateStorageCache handles errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      ;(localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Storage error')
      })

      expect(() => invalidateStorageCache()).not.toThrow()
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('invalidateStorageCache', () => {
    it('sets incremented version', () => {
      const reloadMock = jest.fn()
      delete (window as any).location
      ;(window as any).location = { reload: reloadMock }

      invalidateStorageCache()

      expect(localStorage.setItem).toHaveBeenCalledWith('storyboard-storage-version', '1.1')
    })
  })
})
