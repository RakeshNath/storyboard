import { 
  getStoryboards, 
  saveStoryboard, 
  deleteStoryboard, 
  createNewStoryboard 
} from '@/lib/storyboard'

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

describe('Storyboard Utilities', () => {
  const mockStoryboard = {
    id: '1',
    title: 'Test Storyboard',
    type: 'screenplay' as const,
    status: 'draft' as const,
    pages: 10,
    sceneCount: 5,
    subsceneCount: 3,
    lastModified: 'Just now',
    created: '2023-01-01T00:00:00Z',
    genre: 'Drama',
    content: 'Test screenplay content'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('getStoryboards', () => {
    it('returns empty array when no storyboards in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const storyboards = getStoryboards()
      
      expect(storyboards).toEqual([])
      expect(localStorageMock.getItem).toHaveBeenCalledWith('storyboards')
    })

    it('returns parsed storyboards when valid JSON in localStorage', () => {
      const mockStoryboards = [mockStoryboard]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockStoryboards))
      
      const storyboards = getStoryboards()
      
      expect(storyboards).toEqual(mockStoryboards)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('storyboards')
    })

    it('returns empty array when invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      
      const storyboards = getStoryboards()
      
      expect(storyboards).toEqual([])
    })

    it('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      
      const storyboards = getStoryboards()
      
      expect(storyboards).toEqual([])
    })

    it('returns empty array when empty string in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('')
      
      const storyboards = getStoryboards()
      
      expect(storyboards).toEqual([])
    })
  })


  describe('saveStoryboard', () => {
    it('saves new storyboard to localStorage', () => {
      localStorageMock.getItem.mockReturnValue('[]')
      
      saveStoryboard(mockStoryboard)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'storyboards',
        JSON.stringify([mockStoryboard])
      )
    })

    it('updates existing storyboard in localStorage', () => {
      const existingStoryboards = [mockStoryboard]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingStoryboards))
      
      const updatedStoryboard = { ...mockStoryboard, title: 'Updated Title' }
      saveStoryboard(updatedStoryboard)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'storyboards',
        JSON.stringify([updatedStoryboard])
      )
    })

    it('adds to existing storyboards', () => {
      const existingStoryboards = [mockStoryboard]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingStoryboards))
      
      const newStoryboard = { ...mockStoryboard, id: '2', title: 'New Storyboard' }
      saveStoryboard(newStoryboard)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'storyboards',
        JSON.stringify([mockStoryboard, newStoryboard])
      )
    })

    it('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('[]')
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      
      expect(() => saveStoryboard(mockStoryboard)).toThrow('localStorage error')
    })

    it('handles invalid existing data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      // Reset setItem to normal behavior for this test
      localStorageMock.setItem.mockImplementation((key, value) => {
        // Normal localStorage behavior
      })
      
      // Should not throw, should handle gracefully
      expect(() => saveStoryboard(mockStoryboard)).not.toThrow()
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'storyboards',
        JSON.stringify([mockStoryboard])
      )
    })
  })

  describe('deleteStoryboard', () => {
    it('deletes storyboard from localStorage', () => {
      const mockStoryboards = [mockStoryboard, { ...mockStoryboard, id: '2' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockStoryboards))
      
      deleteStoryboard('1')
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'storyboards',
        JSON.stringify([{ ...mockStoryboard, id: '2' }])
      )
    })

    it('handles deleting non-existent storyboard', () => {
      const mockStoryboards = [mockStoryboard]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockStoryboards))
      
      deleteStoryboard('999')
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'storyboards',
        JSON.stringify(mockStoryboards)
      )
    })

    it('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('[]')
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      
      expect(() => deleteStoryboard('1')).toThrow('localStorage error')
    })

    it('handles invalid existing data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      // Reset setItem to normal behavior for this test
      localStorageMock.setItem.mockImplementation((key, value) => {
        // Normal localStorage behavior
      })
      
      // Should not throw, should handle gracefully
      expect(() => deleteStoryboard('1')).not.toThrow()
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'storyboards',
        JSON.stringify([])
      )
    })
  })

  describe('createNewStoryboard', () => {
    it('creates new screenplay storyboard with default values', () => {
      const storyboard = createNewStoryboard('screenplay')
      
      expect(storyboard.type).toBe('screenplay')
      expect(storyboard.title).toBe('Untitled Storyboard')
      expect(storyboard.status).toBe('draft')
      expect(storyboard.pages).toBe(0)
      expect(storyboard.sceneCount).toBe(0)
      expect(storyboard.subsceneCount).toBe(0)
      expect(storyboard.genre).toBe('Drama')
      expect(storyboard.content).toBe('')
      expect(storyboard.id).toBeDefined()
      expect(storyboard.created).toBeDefined()
      expect(storyboard.lastModified).toBe('Just now')
    })

    it('creates new synopsis storyboard with default values', () => {
      const storyboard = createNewStoryboard('synopsis')
      
      expect(storyboard.type).toBe('synopsis')
      expect(storyboard.title).toBe('Untitled Storyboard')
      expect(storyboard.status).toBe('draft')
      expect(storyboard.pages).toBe(0)
      expect(storyboard.sceneCount).toBeUndefined()
      expect(storyboard.subsceneCount).toBeUndefined()
      expect(storyboard.genre).toBe('Drama')
      expect(storyboard.content).toBe('')
    })

    it('creates screenplay storyboard by default', () => {
      const storyboard = createNewStoryboard()
      
      expect(storyboard.type).toBe('screenplay')
    })

    it('generates unique ids for multiple storyboards', async () => {
      const storyboard1 = createNewStoryboard('screenplay')
      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10))
      const storyboard2 = createNewStoryboard('screenplay')
      
      expect(storyboard1.id).not.toBe(storyboard2.id)
    })
  })

  describe('Integration', () => {
    it('works with complete CRUD operations', () => {
      // Create
      const storyboard = createNewStoryboard('screenplay')
      expect(storyboard.id).toBeDefined()

      // Save
      localStorageMock.getItem.mockReturnValue('[]')
      // Reset setItem to normal behavior for this test
      localStorageMock.setItem.mockImplementation((key, value) => {
        // Normal localStorage behavior
      })
      saveStoryboard(storyboard)
      expect(localStorageMock.setItem).toHaveBeenCalled()

      // Get all
      localStorageMock.getItem.mockReturnValue(JSON.stringify([storyboard]))
      const storyboards = getStoryboards()
      expect(storyboards).toHaveLength(1)
      expect(storyboards[0]).toEqual(storyboard)

      // Update
      const updatedStoryboard = { ...storyboard, title: 'Updated Title' }
      saveStoryboard(updatedStoryboard)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'storyboards',
        JSON.stringify([updatedStoryboard])
      )

      // Delete
      deleteStoryboard(storyboard.id)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'storyboards',
        JSON.stringify([])
      )
    })
  })

  describe('Edge Cases', () => {
    it('handles very large storyboard objects', () => {
      const largeStoryboard = {
        ...mockStoryboard,
        screenplay: 'x'.repeat(100000),
        synopsis: 'x'.repeat(100000),
        characters: Array.from({ length: 1000 }, (_, i) => ({
          id: `char-${i}`,
          name: `Character ${i}`,
          description: `Description ${i}`
        })),
        scenes: Array.from({ length: 1000 }, (_, i) => ({
          id: `scene-${i}`,
          title: `Scene ${i}`,
          content: `Content ${i}`
        }))
      }

      localStorageMock.getItem.mockReturnValue('[]')
      localStorageMock.setItem.mockImplementation(() => {}) // Reset to normal behavior
      saveStoryboard(largeStoryboard)
      
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('handles storyboard with null/undefined values', () => {
      const storyboardWithNulls = {
        ...mockStoryboard,
        description: null,
        screenplay: undefined,
        characters: null,
        scenes: undefined
      }

      localStorageMock.getItem.mockReturnValue('[]')
      localStorageMock.setItem.mockImplementation(() => {}) // Reset to normal behavior
      saveStoryboard(storyboardWithNulls)
      
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })
})