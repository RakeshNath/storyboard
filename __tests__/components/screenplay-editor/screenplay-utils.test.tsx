import { 
  getCharacterUsageCount, 
  getCharacterSceneCount, 
  getFilteredCharacters, 
  getOrderedItems,
  transitionOptions 
} from '@/components/sections/screenplay-editor/screenplay-utils'

describe('Screenplay Utils', () => {
  const mockScenes = [
    {
      id: '1',
      number: '1',
      title: 'Scene 1',
      content: JSON.stringify({
        dialogues: [
          { id: '1', character: 'JOHN', dialogue: 'Hello there' },
          { id: '2', character: 'SARAH', dialogue: 'Hi John' },
          { id: '3', character: 'JOHN', dialogue: 'How are you?' }
        ]
      }),
      characters: []
    },
    {
      id: '2',
      number: '2',
      title: 'Scene 2',
      content: JSON.stringify({
        dialogues: [
          { id: '4', character: 'SARAH', dialogue: 'I am fine' },
          { id: '5', character: 'JOHN', dialogue: 'That is great' }
        ]
      }),
      characters: []
    },
    {
      id: '3',
      number: '3',
      title: 'Scene 3',
      content: JSON.stringify({
        dialogues: [
          { id: '6', character: 'ANTAGONIST', dialogue: 'I will stop you' }
        ]
      }),
      characters: []
    }
  ]

  const mockCharacterList = [
    { id: '1', name: 'JOHN', description: 'Main character' },
    { id: '2', name: 'SARAH', description: 'Supporting character' },
    { id: '3', name: 'ANTAGONIST', description: 'Villain' },
    { id: '4', name: 'DETECTIVE', description: 'Law enforcement' }
  ]

  const mockActionItems = [
    { id: '1', content: 'John walks into the room' },
    { id: '2', content: 'Sarah looks up from her book' }
  ]

  const mockDialogueItems = [
    { id: '1', character: 'JOHN', dialogue: 'Hello there' },
    { id: '2', character: 'SARAH', dialogue: 'Hi John' }
  ]

  const mockTransitionItems = [
    { id: '1', content: 'CUT TO' }
  ]

  const mockItemOrder = [
    { type: 'action' as const, id: '1' },
    { type: 'dialogue' as const, id: '1' },
    { type: 'action' as const, id: '2' },
    { type: 'dialogue' as const, id: '2' }
  ]

  describe('getCharacterUsageCount', () => {
    it('counts dialogue lines for a character across all scenes', () => {
      const count = getCharacterUsageCount('JOHN', mockScenes)
      expect(count).toBe(3) // 2 in scene 1, 1 in scene 2
    })

    it('counts dialogue lines for another character', () => {
      const count = getCharacterUsageCount('SARAH', mockScenes)
      expect(count).toBe(2) // 1 in scene 1, 1 in scene 2
    })

    it('returns 0 for character with no dialogue', () => {
      const count = getCharacterUsageCount('DETECTIVE', mockScenes)
      expect(count).toBe(0)
    })

    it('handles empty scenes array', () => {
      const count = getCharacterUsageCount('JOHN', [])
      expect(count).toBe(0)
    })

    it('handles scenes with invalid JSON content', () => {
      const invalidScenes = [
        {
          id: '1',
          number: '1',
          title: 'Scene 1',
          content: 'invalid json',
          characters: []
        }
      ]
      
      const count = getCharacterUsageCount('JOHN', invalidScenes)
      expect(count).toBe(0)
    })

    it('handles scenes with no dialogues property', () => {
      const scenesWithoutDialogues = [
        {
          id: '1',
          number: '1',
          title: 'Scene 1',
          content: JSON.stringify({}),
          characters: []
        }
      ]
      
      const count = getCharacterUsageCount('JOHN', scenesWithoutDialogues)
      expect(count).toBe(0)
    })
  })

  describe('getCharacterSceneCount', () => {
    it('counts scenes where character has dialogue', () => {
      const count = getCharacterSceneCount('JOHN', mockScenes)
      expect(count).toBe(2) // Scene 1 and Scene 2
    })

    it('counts scenes for another character', () => {
      const count = getCharacterSceneCount('SARAH', mockScenes)
      expect(count).toBe(2) // Scene 1 and Scene 2
    })

    it('counts scenes for character with dialogue in only one scene', () => {
      const count = getCharacterSceneCount('ANTAGONIST', mockScenes)
      expect(count).toBe(1) // Only Scene 3
    })

    it('returns 0 for character with no dialogue', () => {
      const count = getCharacterSceneCount('DETECTIVE', mockScenes)
      expect(count).toBe(0)
    })

    it('handles empty scenes array', () => {
      const count = getCharacterSceneCount('JOHN', [])
      expect(count).toBe(0)
    })

    it('handles scenes with invalid JSON content', () => {
      const invalidScenes = [
        {
          id: '1',
          number: '1',
          title: 'Scene 1',
          content: 'invalid json',
          characters: []
        }
      ]
      
      const count = getCharacterSceneCount('JOHN', invalidScenes)
      expect(count).toBe(0)
    })
  })

  describe('getFilteredCharacters', () => {
    it('filters characters by name (case insensitive)', () => {
      const filtered = getFilteredCharacters('john', mockCharacterList)
      expect(filtered).toEqual(['JOHN'])
    })

    it('filters characters by partial name', () => {
      const filtered = getFilteredCharacters('SAR', mockCharacterList)
      expect(filtered).toEqual(['SARAH'])
    })

    it('returns all characters when search is empty', () => {
      const filtered = getFilteredCharacters('', mockCharacterList)
      expect(filtered).toEqual(['JOHN', 'SARAH', 'ANTAGONIST', 'DETECTIVE'])
    })

    it('returns empty array when no matches found', () => {
      const filtered = getFilteredCharacters('xyz', mockCharacterList)
      expect(filtered).toEqual([])
    })

    it('handles empty character list', () => {
      const filtered = getFilteredCharacters('john', [])
      expect(filtered).toEqual([])
    })

    it('is case insensitive', () => {
      const filtered = getFilteredCharacters('JOHN', mockCharacterList)
      expect(filtered).toEqual(['JOHN'])
    })
  })

  describe('getOrderedItems', () => {
    it('returns items in the correct order based on itemOrder', () => {
      const ordered = getOrderedItems(mockItemOrder, mockActionItems, mockDialogueItems, mockTransitionItems)
      
      expect(ordered).toHaveLength(5) // 4 ordered items + 1 transition
      expect(ordered[0]).toEqual(mockActionItems[0]) // First action
      expect(ordered[1]).toEqual(mockDialogueItems[0]) // First dialogue
      expect(ordered[2]).toEqual(mockActionItems[1]) // Second action
      expect(ordered[3]).toEqual(mockDialogueItems[1]) // Second dialogue
      expect(ordered[4]).toEqual(mockTransitionItems[0]) // Transition at end
    })

    it('handles empty itemOrder', () => {
      const ordered = getOrderedItems([], mockActionItems, mockDialogueItems, mockTransitionItems)
      
      expect(ordered).toEqual(mockTransitionItems) // Only transitions
    })

    it('handles itemOrder with missing items', () => {
      const incompleteOrder = [
        { type: 'action' as const, id: '1' },
        { type: 'dialogue' as const, id: '999' }, // Non-existent dialogue
        { type: 'action' as const, id: '2' }
      ]
      
      const ordered = getOrderedItems(incompleteOrder, mockActionItems, mockDialogueItems, mockTransitionItems)
      
      expect(ordered).toHaveLength(3) // 2 actions + 1 transition
      expect(ordered[0]).toEqual(mockActionItems[0])
      expect(ordered[1]).toEqual(mockActionItems[1])
      expect(ordered[2]).toEqual(mockTransitionItems[0])
    })

    it('handles empty arrays', () => {
      const ordered = getOrderedItems([], [], [], [])
      expect(ordered).toEqual([])
    })

    it('filters out null items', () => {
      const orderWithNulls = [
        { type: 'action' as const, id: '1' },
        { type: 'action' as const, id: '999' }, // Non-existent action
        { type: 'dialogue' as const, id: '1' }
      ]
      
      const ordered = getOrderedItems(orderWithNulls, mockActionItems, mockDialogueItems, mockTransitionItems)
      
      expect(ordered).toHaveLength(3) // 1 action + 1 dialogue + 1 transition
      expect(ordered[0]).toEqual(mockActionItems[0])
      expect(ordered[1]).toEqual(mockDialogueItems[0])
      expect(ordered[2]).toEqual(mockTransitionItems[0])
    })

    it('handles unknown item types', () => {
      const orderWithUnknownType = [
        { type: 'action' as const, id: '1' },
        { type: 'unknown' as any, id: '2' }, // Unknown type
        { type: 'dialogue' as const, id: '1' }
      ]
      
      const ordered = getOrderedItems(orderWithUnknownType, mockActionItems, mockDialogueItems, mockTransitionItems)
      
      expect(ordered).toHaveLength(3) // 1 action + 1 dialogue + 1 transition
      expect(ordered[0]).toEqual(mockActionItems[0])
      expect(ordered[1]).toEqual(mockDialogueItems[0])
      expect(ordered[2]).toEqual(mockTransitionItems[0])
    })
  })

  describe('transitionOptions', () => {
    it('contains all expected transition options', () => {
      expect(transitionOptions).toEqual([
        'FADE IN',
        'FADE OUT',
        'CUT TO',
        'DISSOLVE TO',
        'SMASH CUT TO',
        'MATCH CUT TO'
      ])
    })

    it('has the correct number of options', () => {
      expect(transitionOptions).toHaveLength(6)
    })

    it('contains common screenplay transitions', () => {
      expect(transitionOptions).toContain('FADE IN')
      expect(transitionOptions).toContain('FADE OUT')
      expect(transitionOptions).toContain('CUT TO')
      expect(transitionOptions).toContain('DISSOLVE TO')
    })

    it('contains advanced transitions', () => {
      expect(transitionOptions).toContain('SMASH CUT TO')
      expect(transitionOptions).toContain('MATCH CUT TO')
    })
  })
})
