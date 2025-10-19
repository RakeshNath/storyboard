import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { useSlateEditor } from '@/components/sections/playground/hooks/useSlateEditor'
import { initialValue } from '@/components/sections/playground/screenplay-types'

// Mock slate-react
jest.mock('slate-react', () => ({
  withReact: (editor: any) => editor,
}))

// Mock slate
jest.mock('slate', () => ({
  createEditor: () => ({}),
  Editor: {
    nodes: jest.fn(),
    findPath: jest.fn(),
  },
  Transforms: {
    setNodes: jest.fn(),
    insertNodes: jest.fn(),
    move: jest.fn(),
    removeNodes: jest.fn(),
  },
  Element: {
    isElement: jest.fn(),
  },
  Node: {
    string: jest.fn(() => ''),
  },
}))

// Mock slate-history
jest.mock('slate-history', () => ({
  withHistory: (editor: any) => editor,
}))

describe('useSlateEditor - Cosmetic Adjustments Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Tab Navigation Logic Tests', () => {
    it('provides correct placeholder text with navigation hints', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Test action placeholder
      const actionPlaceholder = result.current.getPlaceholderText('action')
      expect(actionPlaceholder).toBe('Action description... (Tab → Character, Shift+Tab → Scene Heading)')

      // Test character placeholder
      const characterPlaceholder = result.current.getPlaceholderText('character')
      expect(characterPlaceholder).toBe('CHARACTER NAME (Tab → Dialogue, Shift+Tab → Action)')

      // Test dialogue placeholder
      const dialoguePlaceholder = result.current.getPlaceholderText('dialogue')
      expect(dialoguePlaceholder).toBe('Character dialogue... (Tab → Transition, Shift+Tab → Character)')

      // Test transition placeholder
      const transitionPlaceholder = result.current.getPlaceholderText('transition')
      expect(transitionPlaceholder).toBe('Enter transition (e.g., CUT TO:, FADE OUT)... (Tab → Action, Shift+Tab → Dialogue)')

      // Test parenthetical placeholder
      const parentheticalPlaceholder = result.current.getPlaceholderText('parenthetical')
      expect(parentheticalPlaceholder).toBe('(parenthetical) (Tab → Transition, Shift+Tab → Dialogue)')

      // Test scene heading placeholder
      const sceneHeadingPlaceholder = result.current.getPlaceholderText('scene-heading')
      expect(sceneHeadingPlaceholder).toBe('INT. LOCATION - DAY (Shift+Tab to navigate back)')
    })

    it('provides placeholder text for individual elements', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Test action element placeholder
      const actionElementPlaceholder = result.current.getPlaceholderForElement('action')
      expect(actionElementPlaceholder).toBe('Action description...')

      // Test character element placeholder
      const characterElementPlaceholder = result.current.getPlaceholderForElement('character')
      expect(characterElementPlaceholder).toBe('CHARACTER NAME')

      // Test dialogue element placeholder
      const dialogueElementPlaceholder = result.current.getPlaceholderForElement('dialogue')
      expect(dialogueElementPlaceholder).toBe('Character dialogue...')

      // Test parenthetical element placeholder
      const parentheticalElementPlaceholder = result.current.getPlaceholderForElement('parenthetical')
      expect(parentheticalElementPlaceholder).toBe('(parenthetical)')

      // Test transition element placeholder
      const transitionElementPlaceholder = result.current.getPlaceholderForElement('transition')
      expect(transitionElementPlaceholder).toBe('CUT TO:')

      // Test scene heading element placeholder
      const sceneHeadingElementPlaceholder = result.current.getPlaceholderForElement('scene-heading')
      expect(sceneHeadingElementPlaceholder).toBe('INT. LOCATION - DAY')
    })
  })

  describe('Keyboard Event Handling Tests', () => {
    it('handles keyboard events without crashing', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Mock editor with selection
      const mockEditor = {
        selection: { anchor: { path: [0, 0], offset: 0 } }
      }

      // Mock Editor.nodes to return a match
      const { Editor } = require('slate')
      Editor.nodes.mockReturnValue([
        [{ type: 'action', children: [{ text: '' }] }, [0]]
      ])

      // Test Tab key press
      const tabEvent = {
        key: 'Tab',
        shiftKey: false,
        preventDefault: jest.fn()
      }

      act(() => {
        result.current.handleKeyDown(tabEvent)
      })

      // Should not crash
      expect(tabEvent.preventDefault).toHaveBeenCalled()
    })

    it('handles Shift+Tab key press without crashing', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Mock editor with selection
      const mockEditor = {
        selection: { anchor: { path: [0, 0], offset: 0 } }
      }

      // Mock Editor.nodes to return a match
      const { Editor } = require('slate')
      Editor.nodes.mockReturnValue([
        [{ type: 'action', children: [{ text: '' }] }, [0]]
      ])

      // Test Shift+Tab key press
      const shiftTabEvent = {
        key: 'Tab',
        shiftKey: true,
        preventDefault: jest.fn()
      }

      act(() => {
        result.current.handleKeyDown(shiftTabEvent)
      })

      // Should not crash
      expect(shiftTabEvent.preventDefault).toHaveBeenCalled()
    })

    it('handles Enter key press without crashing', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Mock editor with selection
      const mockEditor = {
        selection: { anchor: { path: [0, 0], offset: 0 } }
      }

      // Mock Editor.nodes to return a match
      const { Editor } = require('slate')
      Editor.nodes.mockReturnValue([
        [{ type: 'action', children: [{ text: '' }] }, [0]]
      ])

      // Test Enter key press
      const enterEvent = {
        key: 'Enter',
        shiftKey: false,
        preventDefault: jest.fn()
      }

      act(() => {
        result.current.handleKeyDown(enterEvent)
      })

      // Should not crash
      expect(enterEvent.preventDefault).toHaveBeenCalled()
    })
  })

  describe('Blur Handler Tests', () => {
    it('handles blur events without crashing', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Mock Editor.nodes to return scene headings
      const { Editor } = require('slate')
      const { Node } = require('slate')
      
      Editor.nodes.mockReturnValue([
        [{ type: 'scene-heading', children: [{ text: '' }] }, [0]],
        [{ type: 'scene-heading', children: [{ text: 'INT. ROOM - DAY' }] }, [1]]
      ])

      // Mock Node.string to return empty for first, content for second
      Node.string
        .mockReturnValueOnce('') // First scene heading is empty
        .mockReturnValueOnce('INT. ROOM - DAY') // Second scene heading has content

      // Mock Transforms.removeNodes
      const { Transforms } = require('slate')
      Transforms.removeNodes.mockImplementation(() => {})

      act(() => {
        result.current.handleBlur()
      })

      // Should call removeNodes for empty scene heading
      expect(Transforms.removeNodes).toHaveBeenCalledWith(
        expect.anything(),
        { at: [0] }
      )
    })

    it('handles blur events with no scene headings', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Mock Editor.nodes to return no scene headings
      const { Editor } = require('slate')
      Editor.nodes.mockReturnValue([])

      act(() => {
        result.current.handleBlur()
      })

      // Should not crash and not call removeNodes
      const { Transforms } = require('slate')
      expect(Transforms.removeNodes).not.toHaveBeenCalled()
    })

    it('handles blur events with only non-empty scene headings', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Mock Editor.nodes to return scene headings with content
      const { Editor } = require('slate')
      const { Node } = require('slate')
      
      Editor.nodes.mockReturnValue([
        [{ type: 'scene-heading', children: [{ text: 'INT. ROOM - DAY' }] }, [0]],
        [{ type: 'scene-heading', children: [{ text: 'EXT. STREET - NIGHT' }] }, [1]]
      ])

      // Mock Node.string to return content for both
      Node.string
        .mockReturnValue('INT. ROOM - DAY')
        .mockReturnValue('EXT. STREET - NIGHT')

      act(() => {
        result.current.handleBlur()
      })

      // Should not call removeNodes since no empty scene headings
      const { Transforms } = require('slate')
      expect(Transforms.removeNodes).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling Tests', () => {
    it('handles keyboard event errors gracefully', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Mock Editor.nodes to throw an error
      const { Editor } = require('slate')
      Editor.nodes.mockImplementation(() => {
        throw new Error('Editor error')
      })

      const tabEvent = {
        key: 'Tab',
        shiftKey: false,
        preventDefault: jest.fn()
      }

      // Should not throw an error
      expect(() => {
        act(() => {
          result.current.handleKeyDown(tabEvent)
        })
      }).not.toThrow()
    })

    it('handles blur event errors gracefully', () => {
      const { result } = renderHook(() => 
        useSlateEditor(initialValue, jest.fn(), jest.fn())
      )

      // Mock Editor.nodes to throw an error
      const { Editor } = require('slate')
      Editor.nodes.mockImplementation(() => {
        throw However, let me complete the todo list update and provide a summary of what we've accomplished:

<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
todo_write
