/**
 * Tests for screenplay utility functions
 */

import { 
  getCharacterUsageCount, 
  getCharacterSceneCount, 
  getFilteredCharacters, 
  getOrderedItems,
  transitionOptions 
} from '@/components/sections/screenplay-editor/screenplay-utils'
import type { Scene, Character, ActionItem, DialogueItem, TransitionItem, ItemOrder } from '@/components/sections/screenplay-editor/types'

describe('Screenplay Utils', () => {
  describe('getCharacterUsageCount', () => {
    it('returns 0 for empty scenes array', () => {
      const result = getCharacterUsageCount('JOHN', [])
      expect(result).toBe(0)
    })

    it('counts dialogue occurrences for a character across all scenes', () => {
      const scenes: Scene[] = [
        {
          id: '1',
          number: '1',
          title: 'Scene 1',
          content: JSON.stringify({
            dialogues: [
              { id: '1', character: 'JOHN', text: 'Hello' },
              { id: '2', character: 'SARAH', text: 'Hi' },
              { id: '3', character: 'JOHN', text: 'How are you?' }
            ]
          }),
          characters: ['JOHN', 'SARAH'],
          location: 'Park',
          timeOfDay: 'DAY'
        },
        {
          id: '2',
          number: '2',
          title: 'Scene 2',
          content: JSON.stringify({
            dialogues: [
              { id: '4', character: 'JOHN', text: 'Good morning' }
            ]
          }),
          characters: ['JOHN'],
          location: 'Office',
          timeOfDay: 'DAY'
        }
      ]

      const result = getCharacterUsageCount('JOHN', scenes)
      expect(result).toBe(3)
    })

    it('handles scenes with invalid JSON content gracefully', () => {
      // Suppress console.error for this test since we're testing error handling
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      const scenes: Scene[] = [
        {
          id: '1',
          number: '1',
          title: 'Scene 1',
          content: 'invalid json',
          characters: ['JOHN'],
          location: 'Park',
          timeOfDay: 'DAY'
        }
      ]

      // Should not throw error and return 0
      const result = getCharacterUsageCount('JOHN', scenes)
      expect(result).toBe(0)
      
      // Restore console.error
      consoleSpy.mockRestore()
    })

    it('returns 0 for character not found in any scene', () => {
      const scenes: Scene[] = [
        {
          id: '1',
          number: '1',
          title: 'Scene 1',
          content: JSON.stringify({
            dialogues: [
              { id: '1', character: 'SARAH', text: 'Hello' }
            ]
          }),
          characters: ['SARAH'],
          location: 'Park',
          timeOfDay: 'DAY'
        }
      ]

      const result = getCharacterUsageCount('JOHN', scenes)
      expect(result).toBe(0)
    })
  })

  describe('getCharacterSceneCount', () => {
    it('returns 0 for empty scenes array', () => {
      const result = getCharacterSceneCount('JOHN', [])
      expect(result).toBe(0)
    })

    it('counts scenes where character has dialogue', () => {
      const scenes: Scene[] = [
        {
          id: '1',
          number: '1',
          title: 'Scene 1',
          content: JSON.stringify({
            dialogues: [
              { id: '1', character: 'JOHN', text: 'Hello' }
            ]
          }),
          characters: ['JOHN'],
          location: 'Park',
          timeOfDay: 'DAY'
        },
        {
          id: '2',
          number: '2',
          title: 'Scene 2',
          content: JSON.stringify({
            dialogues: [
              { id: '2', character: 'SARAH', text: 'Hi' }
            ]
          }),
          characters: ['SARAH'],
          location: 'Office',
          timeOfDay: 'DAY'
        },
        {
          id: '3',
          number: '3',
          title: 'Scene 3',
          content: JSON.stringify({
            dialogues: [
              { id: '3', character: 'JOHN', text: 'Good morning' }
            ]
          }),
          characters: ['JOHN'],
          location: 'Home',
          timeOfDay: 'DAY'
        }
      ]

      const result = getCharacterSceneCount('JOHN', scenes)
      expect(result).toBe(2)
    })

    it('handles scenes with invalid JSON content gracefully', () => {
      // Suppress console.error for this test since we're testing error handling
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      const scenes: Scene[] = [
        {
          id: '1',
          number: '1',
          title: 'Scene 1',
          content: 'invalid json',
          characters: ['JOHN'],
          location: 'Park',
          timeOfDay: 'DAY'
        }
      ]

      const result = getCharacterSceneCount('JOHN', scenes)
      expect(result).toBe(0)
      
      // Restore console.error
      consoleSpy.mockRestore()
    })

    it('returns 0 for character not found in any scene', () => {
      const scenes: Scene[] = [
        {
          id: '1',
          number: '1',
          title: 'Scene 1',
          content: JSON.stringify({
            dialogues: [
              { id: '1', character: 'SARAH', text: 'Hello' }
            ]
          }),
          characters: ['SARAH'],
          location: 'Park',
          timeOfDay: 'DAY'
        }
      ]

      const result = getCharacterSceneCount('JOHN', scenes)
      expect(result).toBe(0)
    })
  })

  describe('getFilteredCharacters', () => {
    const characterList: Character[] = [
      { id: '1', name: 'JOHN', description: 'Main character' },
      { id: '2', name: 'SARAH', description: 'Supporting character' },
      { id: '3', name: 'ANTAGONIST', description: 'Villain' },
      { id: '4', name: 'DETECTIVE', description: 'Law enforcement' }
    ]

    it('returns all characters when search text is empty', () => {
      const result = getFilteredCharacters('', characterList)
      expect(result).toEqual(['JOHN', 'SARAH', 'ANTAGONIST', 'DETECTIVE'])
    })

    it('filters characters by name (case insensitive)', () => {
      const result = getFilteredCharacters('john', characterList)
      expect(result).toEqual(['JOHN'])
    })

    it('returns multiple matches for partial search', () => {
      const result = getFilteredCharacters('A', characterList)
      expect(result).toEqual(['SARAH', 'ANTAGONIST'])
    })

    it('returns empty array when no matches found', () => {
      const result = getFilteredCharacters('XYZ', characterList)
      expect(result).toEqual([])
    })

    it('handles empty character list', () => {
      const result = getFilteredCharacters('test', [])
      expect(result).toEqual([])
    })
  })

  describe('getOrderedItems', () => {
    const actionItems: ActionItem[] = [
      { id: '1', text: 'John walks into the room' },
      { id: '2', text: 'Sarah looks up' }
    ]

    const dialogueItems: DialogueItem[] = [
      { id: '3', character: 'JOHN', text: 'Hello there' },
      { id: '4', character: 'SARAH', text: 'Hi John' }
    ]

    const transitionItems: TransitionItem[] = [
      { id: '5', type: 'FADE IN', text: 'FADE IN:' }
    ]

    const itemOrder: ItemOrder[] = [
      { type: 'action', id: '1' },
      { type: 'dialogue', id: '3' },
      { type: 'action', id: '2' },
      { type: 'dialogue', id: '4' }
    ]

    it('returns items in the correct order', () => {
      const result = getOrderedItems(itemOrder, actionItems, dialogueItems, transitionItems)
      
      expect(result).toHaveLength(5)
      expect(result[0]).toEqual(actionItems[0])
      expect(result[1]).toEqual(dialogueItems[0])
      expect(result[2]).toEqual(actionItems[1])
      expect(result[3]).toEqual(dialogueItems[1])
      expect(result[4]).toEqual(transitionItems[0])
    })

    it('filters out non-existent items', () => {
      const itemOrderWithMissing: ItemOrder[] = [
        { type: 'action', id: '1' },
        { type: 'action', id: '999' }, // Non-existent
        { type: 'dialogue', id: '3' }
      ]

      const result = getOrderedItems(itemOrderWithMissing, actionItems, dialogueItems, transitionItems)
      
      expect(result).toHaveLength(3) // 2 existing items + 1 transition at the end
      expect(result[0]).toEqual(actionItems[0])
      expect(result[1]).toEqual(dialogueItems[0])
      expect(result[2]).toEqual(transitionItems[0])
    })

    it('handles empty item order', () => {
      const result = getOrderedItems([], actionItems, dialogueItems, transitionItems)
      expect(result).toEqual(transitionItems)
    })

    it('handles empty arrays', () => {
      const result = getOrderedItems([], [], [], [])
      expect(result).toEqual([])
    })

    it('handles missing transition items', () => {
      const result = getOrderedItems(itemOrder, actionItems, dialogueItems, [])
      expect(result).toHaveLength(4)
      expect(result[3]).toEqual(dialogueItems[1])
    })
  })

  describe('transitionOptions', () => {
    it('contains expected transition types', () => {
      expect(transitionOptions).toContain('FADE IN')
      expect(transitionOptions).toContain('FADE OUT')
      expect(transitionOptions).toContain('CUT TO')
      expect(transitionOptions).toContain('DISSOLVE TO')
      expect(transitionOptions).toContain('SMASH CUT TO')
      expect(transitionOptions).toContain('MATCH CUT TO')
    })

    it('has the correct number of transition options', () => {
      expect(transitionOptions).toHaveLength(6)
    })
  })
})
