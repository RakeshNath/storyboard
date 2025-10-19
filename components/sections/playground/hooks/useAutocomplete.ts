import { useCallback, useState, useRef } from 'react'
import { Descendant, Element as SlateElement, Node } from 'slate'
import { CustomElement, ScreenplayElementType } from '../screenplay-types'

export function useAutocomplete(
  value: Descendant[],
  currentElementType: ScreenplayElementType,
  editor?: any
) {
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompleteIndex, setAutocompleteIndex] = useState(0)
  const [autocompletePosition, setAutocompletePosition] = useState<{ top: number; left: number } | null>(null)
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get autocomplete options based on element type
  const getAutocompleteOptions = useCallback((elementType: ScreenplayElementType): string[] => {
    if (elementType !== 'scene-heading') return []

    // Extract unique locations from existing scene headings
    const locations = new Set<string>()
    value.forEach((node) => {
      if (SlateElement.isElement(node) && node.type === 'scene-heading') {
        const text = Node.string(node).trim().toUpperCase()
        if (text) {
          const match = text.match(/^(INT\.|EXT\.|INT\/EXT\.|EXT\/INT\.)\s+(.+?)\s+-\s+(.+)$/i)
          if (match) {
            locations.add(match[2].trim())
          }
        }
      }
    })

    return Array.from(locations).sort()
  }, [value])

  // Show autocomplete
  const showAutocompleteOptions = useCallback((cursorPosition: { top: number; left: number }) => {
    const options = getAutocompleteOptions(currentElementType)
    if (options.length > 0) {
      setAutocompleteOptions(options)
      setAutocompletePosition(cursorPosition)
      setShowAutocomplete(true)
      setAutocompleteIndex(0)
    }
  }, [currentElementType, getAutocompleteOptions])

  // Hide autocomplete
  const hideAutocomplete = useCallback(() => {
    setShowAutocomplete(false)
    setAutocompletePosition(null)
    setAutocompleteOptions([])
    setAutocompleteIndex(0)
    
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current)
      autocompleteTimeoutRef.current = null
    }
  }, [])

  // Select autocomplete option
  const selectAutocomplete = useCallback((option: string) => {
    if (editor && currentElementType === 'scene-heading') {
      try {
        // Insert the selected location into the scene heading
        const { selection } = editor
        if (selection) {
          const [match] = editor.children.find((node: any) => 
            node.type === 'scene-heading'
          )
          
          if (match) {
            // Find the current scene heading and replace the location part
            const text = Node.string(match).trim()
            const matchResult = text.match(/^(INT\.|EXT\.|INT\/EXT\.|EXT\/INT\.)\s+(.+?)\s+-\s+(.+)$/i)
            
            if (matchResult) {
              const [, prefix, , suffix] = matchResult
              const newText = `${prefix} ${option} - ${suffix}`
              
              // Find the scene heading node and update it
              const nodes = Array.from(editor.children)
              const sceneHeadingIndex = nodes.findIndex((node: any) => 
                node.type === 'scene-heading'
              )
              
              if (sceneHeadingIndex !== -1) {
                editor.children[sceneHeadingIndex].children[0].text = newText
              }
            }
          }
        }
      } catch (error) {
        // Ignore errors during autocomplete insertion
      }
    }
    
    hideAutocomplete()
  }, [hideAutocomplete, editor, currentElementType])

  // Handle autocomplete keyboard navigation
  const handleAutocompleteKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!showAutocomplete || autocompleteOptions.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setAutocompleteIndex(prev => 
          prev < autocompleteOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setAutocompleteIndex(prev => 
          prev > 0 ? prev - 1 : autocompleteOptions.length - 1
        )
        break
      case 'Enter':
        event.preventDefault()
        selectAutocomplete(autocompleteOptions[autocompleteIndex])
        break
      case 'Escape':
        event.preventDefault()
        hideAutocomplete()
        break
    }
  }, [showAutocomplete, autocompleteOptions, autocompleteIndex, selectAutocomplete, hideAutocomplete])

  // Debounced autocomplete trigger
  const triggerAutocomplete = useCallback((cursorPosition: { top: number; left: number }) => {
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current)
    }

    autocompleteTimeoutRef.current = setTimeout(() => {
      showAutocompleteOptions(cursorPosition)
    }, 300)
  }, [showAutocompleteOptions])

  return {
    autocompleteOptions,
    showAutocomplete,
    autocompleteIndex,
    autocompletePosition,
    selectAutocomplete,
    hideAutocomplete,
    handleAutocompleteKeyDown,
    triggerAutocomplete,
    setAutocompleteIndex
  }
}
