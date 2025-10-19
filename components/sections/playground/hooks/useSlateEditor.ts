import { useCallback, useMemo } from 'react'
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Node } from 'slate'
import { withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { 
  CustomElement, 
  ScreenplayElementType 
} from '../screenplay-types'

// Get next element type based on current type and key press
const getNextElementType = (
  currentType: ScreenplayElementType,
  key: 'Enter' | 'Tab',
  shiftKey: boolean
): ScreenplayElementType | null => {
  if (key === 'Enter') {
    switch (currentType) {
      case 'scene-heading':
        return 'action'
      case 'action':
        return 'action'
      case 'character':
        return 'dialogue'
      case 'dialogue':
        return 'action'
      case 'parenthetical':
        return 'dialogue'
      case 'transition':
        return 'action'
      default:
        return null
    }
  }

  if (key === 'Tab') {
    if (shiftKey) {
      // Shift+Tab goes back: Scene Heading ← Action ← Character ← Dialogue ← Transition
      switch (currentType) {
        case 'action':
          return 'scene-heading'  // Go to scene heading (title), not cycle
        case 'character':
          return 'action'
        case 'dialogue':
          return 'character'
        case 'transition':
          return 'dialogue'
        case 'parenthetical':
          return 'dialogue'
        case 'scene-heading':
          return null  // Stop at scene heading, don't cycle
        default:
          return null
      }
    } else {
      // Tab goes forward: Action → Character → Dialogue → Transition → Action (cycle)
      switch (currentType) {
        case 'action':
          return 'character'
        case 'character':
          return 'dialogue'
        case 'dialogue':
          return 'transition'
        case 'transition':
          return 'action'  // Complete the cycle back to action
        case 'parenthetical':
          return 'transition'
        default:
          return null
      }
    }
  }

  return null
}

export function useSlateEditor(
  initialValue: Descendant[],
  onValueChange: (value: Descendant[]) => void,
  onSceneDelete: (element: CustomElement) => void,
  autocompleteHandlers?: {
    handleAutocompleteKeyDown: (event: React.KeyboardEvent) => void
    triggerAutocomplete: (cursorPosition: { top: number; left: number }) => void
  }
) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  // Get placeholder text for element type
  const getPlaceholderForElement = useCallback((elementType: ScreenplayElementType): string => {
    switch (elementType) {
      case 'scene-heading':
        return 'INT. LOCATION - DAY'
      case 'action':
        return 'Action description...'
      case 'character':
        return 'CHARACTER NAME'
      case 'dialogue':
        return 'Character dialogue...'
      case 'parenthetical':
        return '(parenthetical)'
      case 'transition':
        return 'CUT TO:'
      default:
        return 'Start typing...'
    }
  }, [])

  // Handle keyboard events
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const { key, shiftKey } = event
    const { selection } = editor

    if (!selection) return

    // Handle autocomplete keyboard navigation first
    if (autocompleteHandlers?.handleAutocompleteKeyDown) {
      autocompleteHandlers.handleAutocompleteKeyDown(event)
      if (event.defaultPrevented) return
    }

    try {
      const [match] = Editor.nodes(editor, {
        match: n => SlateElement.isElement(n),
      })

      if (match) {
        const [node, path] = match
        const element = node as CustomElement
        const nextType = getNextElementType(element.type, key as 'Enter' | 'Tab', shiftKey)

        if (nextType) {
          event.preventDefault()
          
          if (key === 'Tab') {
            // Both Tab and Shift+Tab: Change current element type
            Transforms.setNodes(editor, { type: nextType }, { at: path })
          } else if (key === 'Enter') {
            // Enter: Create new element and move to it
            const newElement: CustomElement = {
              type: nextType,
              children: [{ text: '' }],
            }
            Transforms.insertNodes(editor, newElement)
            Transforms.move(editor)
          }
        }
      }
    } catch (error) {
      // Ignore errors during keyboard handling
    }
  }, [editor, autocompleteHandlers])

  // Handle blur events to remove empty scene headings
  const handleBlur = useCallback(() => {
    try {
      // Check all nodes for empty scene headings
      const nodes = Array.from(Editor.nodes(editor, {
        match: n => SlateElement.isElement(n) && n.type === 'scene-heading'
      }))

      for (const [node, path] of nodes) {
        const element = node as CustomElement
        const text = Node.string(element)
        
        // If scene heading is empty, remove it
        if (!text.trim()) {
          Transforms.removeNodes(editor, { at: path })
        }
      }
    } catch (error) {
      // Ignore errors during blur handling
    }
  }, [editor])

  // Get placeholder text based on current element type
  const getPlaceholderText = useCallback((elementType: ScreenplayElementType): string => {
    switch (elementType) {
      case 'scene-heading':
        return 'INT. LOCATION - DAY (Shift+Tab to navigate back)'
      case 'action':
        return 'Action description... (Tab → Character, Shift+Tab → Scene Heading)'
      case 'character':
        return 'CHARACTER NAME (Tab → Dialogue, Shift+Tab → Action)'
      case 'dialogue':
        return 'Character dialogue... (Tab → Transition, Shift+Tab → Character)'
      case 'parenthetical':
        return '(parenthetical) (Tab → Transition, Shift+Tab → Dialogue)'
      case 'transition':
        return 'Enter transition (e.g., CUT TO:, FADE OUT)... (Tab → Action, Shift+Tab → Dialogue)'
      default:
        return 'Start typing your screenplay...'
    }
  }, [])

  return {
    editor,
    handleKeyDown,
    handleBlur,
    getPlaceholderText,
    getPlaceholderForElement
  }
}