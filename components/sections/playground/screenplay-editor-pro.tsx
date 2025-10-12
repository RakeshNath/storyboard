"use client"

import { useCallback, useMemo, useState, useEffect } from 'react'
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Node } from 'slate'
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import { 
  CustomElement, 
  CustomText, 
  ScreenplayElementType, 
  initialValue, 
  elementStyles,
  keyboardShortcuts 
} from './screenplay-types'
import { Button } from '@/components/ui/button'
import { 
  FileDown, 
  List, 
  Keyboard,
  ChevronRight,
  ChevronDown,
  Users,
  MapPin,
  Edit3,
  Download
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
      // Shift+Tab goes back
      switch (currentType) {
        case 'dialogue':
          return 'character'
        case 'character':
          return 'action'
        case 'parenthetical':
          return 'dialogue'
        default:
          return null
      }
    } else {
      // Tab moves forward
      switch (currentType) {
        case 'action':
          return 'character'
        case 'character':
          return 'dialogue'
        case 'dialogue':
          return 'parenthetical'
        default:
          return null
      }
    }
  }

  return null
}

// Define CustomEditor type
type CustomEditor = Editor & ReactEditor

// Custom plugin to handle screenplay formatting
const withScreenplay = (editor: CustomEditor) => {
  const { insertBreak, deleteBackward, insertText } = editor

  editor.insertBreak = () => {
    const { selection } = editor
    if (!selection) {
      insertBreak()
      return
    }

    try {
      const [match] = Editor.nodes(editor, {
        match: n => SlateElement.isElement(n),
        at: selection,
      })

      if (match) {
        const [node] = match
        const element = node as CustomElement
        const nextType = getNextElementType(element.type, 'Enter', false)

        console.log('insertBreak override:', {
          currentType: element.type,
          nextType,
        })

        if (nextType) {
          // Insert a new node with the next type
          Transforms.insertNodes(editor, {
            type: nextType,
            children: [{ text: '' }],
          })
          return
        }
      }
    } catch (error) {
      console.error('Error in insertBreak:', error)
    }

    // Default behavior
    insertBreak()
  }

  editor.insertText = (text: string) => {
    const { selection } = editor
    
    // Auto-detect scene headings
    if (selection) {
      try {
        const [match] = Editor.nodes(editor, {
          match: n => SlateElement.isElement(n),
          at: selection,
        })

        if (match) {
          const [node, path] = match
          const element = node as CustomElement
          
          // If we're in an action line and typing INT. or EXT., convert to scene heading
          if (element.type === 'action') {
            const currentText = Node.string(node)
            const newText = currentText.slice(0, selection.anchor.offset) + text + currentText.slice(selection.anchor.offset)
            
            // Check if the line starts with INT. or EXT. (case insensitive)
            if (/^(INT\.|EXT\.|INT\s|EXT\s|INT\/|EXT\/)/i.test(newText.trim())) {
              // Convert to scene heading
              Transforms.setNodes(
                editor,
                { type: 'scene-heading' },
                { at: path }
              )
              console.log('Auto-converted to scene heading:', newText)
            }
          }
        }
      } catch (error) {
        // Ignore errors in auto-detection
      }
    }

    // Default behavior
    insertText(text)
  }

  editor.deleteBackward = (unit: 'character' | 'word' | 'line' | 'block') => {
    const { selection } = editor

    if (selection && selection.anchor.offset === 0) {
      try {
        const [match] = Editor.nodes(editor, {
          match: n => SlateElement.isElement(n),
          at: selection,
        })

        if (match) {
          const [node, path] = match
          const element = node as CustomElement
          
          // If the element is empty and we're at the start, just delete normally
          if (Node.string(node).length === 0 && path[0] > 0) {
            // Remove the empty element
            Transforms.removeNodes(editor, { at: path })
            return
          }
        }
      } catch (error) {
        console.error('Error in deleteBackward:', error)
      }
    }

    // Default behavior
    deleteBackward(unit)
  }

  return editor
}

// Autocomplete options for scene headings
const FORMAT_OPTIONS = ['INT.', 'EXT.', 'INT./EXT.', 'EXT./INT.']
const TIME_OPTIONS = [
  'DAY', 'NIGHT', 'DAWN', 'DUSK', 'MORNING', 'AFTERNOON', 'EVENING',
  'CONTINUOUS', 'LATER', 'SAME TIME', 'MOMENTS LATER'
]
const COMMON_LOCATIONS = [
  'COFFEE SHOP', 'APARTMENT', 'BEDROOM', 'LIVING ROOM', 'KITCHEN',
  'OFFICE', 'STREET', 'CAR', 'RESTAURANT', 'BAR', 'HOSPITAL',
  'SCHOOL', 'PARK', 'HOTEL ROOM', 'BATHROOM', 'HALLWAY'
]

interface ScreenplayEditorProProps {
  title?: string
}

interface CharacterData {
  name: string
  appearances: number
  firstLine: number
  dialogues: { text: string; lineNumber: number }[]
  scenes: number[]
  profile: string
}

interface LocationData {
  name: string
  scenes: number[]
  timeOfDay: Record<string, number>
}

export function ScreenplayEditorPro({ title = 'Untitled Screenplay' }: ScreenplayEditorProProps = {}) {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const [showHelp, setShowHelp] = useState(false)
  const [showCharacters, setShowCharacters] = useState(false)
  const [showLocations, setShowLocations] = useState(false)
  const [showOutliner, setShowOutliner] = useState(true)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showCharacterExportMenu, setShowCharacterExportMenu] = useState(false)
  const [showLocationExportMenu, setShowLocationExportMenu] = useState(false)
  const [scenes, setScenes] = useState<{ id: string; text: string; lineNumber: number }[]>([])
  const [characters, setCharacters] = useState<{ name: string; appearances: number; firstLine: number }[]>([])
  const [characterDetails, setCharacterDetails] = useState<CharacterData[]>([])
  const [locations, setLocations] = useState<LocationData[]>([])
  const [characterProfiles, setCharacterProfiles] = useState<Record<string, string>>({})
  const [characterTypes, setCharacterTypes] = useState<Record<string, string>>({})
  const [locationProfiles, setLocationProfiles] = useState<Record<string, string>>({})
  const [currentElementType, setCurrentElementType] = useState<ScreenplayElementType>('action')
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompleteIndex, setAutocompleteIndex] = useState(0)
  const [autocompletePosition, setAutocompletePosition] = useState<{ top: number; left: number } | null>(null)
  const screenplayTitle = title
  const [authorName, setAuthorName] = useState('Your Name')
  
  const editor = useMemo(() => withScreenplay(withHistory(withReact(createEditor()))), [])

  // Extract scenes from document for outliner
  useEffect(() => {
    const extractedScenes = value
      .map((node, index) => {
        if (SlateElement.isElement(node) && node.type === 'scene-heading') {
          const text = Node.string(node)
          return {
            id: `scene-${index}`,
            text: text || 'UNTITLED SCENE',
            lineNumber: index,
          }
        }
        return null
      })
      .filter(Boolean) as { id: string; text: string; lineNumber: number }[]
    
    setScenes(extractedScenes)
  }, [value])

  // Extract characters from document for character list
  useEffect(() => {
    const characterMap = new Map<string, { appearances: number; firstLine: number }>()
    
    value.forEach((node, index) => {
      if (SlateElement.isElement(node) && node.type === 'character') {
        const characterName = Node.string(node).trim().toUpperCase()
        if (characterName) {
          const existing = characterMap.get(characterName)
          if (existing) {
            characterMap.set(characterName, {
              appearances: existing.appearances + 1,
              firstLine: existing.firstLine,
            })
          } else {
            characterMap.set(characterName, {
              appearances: 1,
              firstLine: index,
            })
          }
        }
      }
    })
    
    const extractedCharacters = Array.from(characterMap.entries())
      .map(([name, data]) => ({
        name,
        appearances: data.appearances,
        firstLine: data.firstLine,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
    
    setCharacters(extractedCharacters)
  }, [value])

  // Extract detailed character information (dialogues, scenes)
  useEffect(() => {
    const characterDetailsMap = new Map<string, CharacterData>()
    let currentSceneIndex = 0
    
    value.forEach((node, index) => {
      if (SlateElement.isElement(node)) {
        // Track scene numbers
        if (node.type === 'scene-heading') {
          currentSceneIndex++
        }
        
        // Track characters and their dialogues
        if (node.type === 'character') {
          const characterName = Node.string(node).trim().toUpperCase()
          if (characterName) {
            if (!characterDetailsMap.has(characterName)) {
              characterDetailsMap.set(characterName, {
                name: characterName,
                appearances: 0,
                firstLine: index,
                dialogues: [],
                scenes: [],
                profile: characterProfiles[characterName] || ''
              })
            }
            
            const charData = characterDetailsMap.get(characterName)!
            charData.appearances++
            
            // Track which scene this character appears in
            if (!charData.scenes.includes(currentSceneIndex)) {
              charData.scenes.push(currentSceneIndex)
            }
            
            // Get the next node (dialogue)
            if (index + 1 < value.length) {
              const nextNode = value[index + 1]
              if (SlateElement.isElement(nextNode) && (nextNode as CustomElement).type === 'dialogue') {
                const dialogueText = Node.string(nextNode)
                charData.dialogues.push({
                  text: dialogueText,
                  lineNumber: index + 1
                })
              }
            }
          }
        }
      }
    })
    
    const details = Array.from(characterDetailsMap.values()).sort((a, b) => a.name.localeCompare(b.name))
    setCharacterDetails(details)
  }, [value, characterProfiles])

  // Extract locations from scene headings
  useEffect(() => {
    const locationMap = new Map<string, LocationData>()
    let sceneNumber = 0
    
    value.forEach((node) => {
      if (SlateElement.isElement(node) && node.type === 'scene-heading') {
        sceneNumber++
        const sceneText = Node.string(node).trim()
        
        // Parse scene heading: INT./EXT. LOCATION - TIME
        const match = sceneText.match(/^(INT\.?|EXT\.?|INT\.?\/EXT\.?|EXT\.?\/INT\.?)\s+(.+?)\s+-\s+(.+)$/i)
        if (match && match[2] && match[3]) {
          const location = match[2].trim().toUpperCase()
          const timeOfDay = match[3].trim().toUpperCase()
          
          if (!locationMap.has(location)) {
            locationMap.set(location, {
              name: location,
              scenes: [],
              timeOfDay: {}
            })
          }
          
          const locationData = locationMap.get(location)!
          locationData.scenes.push(sceneNumber)
          
          // Count time of day occurrences
          locationData.timeOfDay[timeOfDay] = (locationData.timeOfDay[timeOfDay] || 0) + 1
        }
      }
    })
    
    const extractedLocations = Array.from(locationMap.values()).sort((a, b) => a.name.localeCompare(b.name))
    setLocations(extractedLocations)
  }, [value])

  // Track current element type and show autocomplete on selection change
  useEffect(() => {
    const { selection } = editor
    if (!selection) return

    try {
      const [match] = Editor.nodes(editor, {
        match: n => SlateElement.isElement(n),
        at: selection,
      })

      if (match) {
        const [node] = match
        const element = node as CustomElement
        setCurrentElementType(element.type)
        
        // Show autocomplete for scene headings
        if (element.type === 'scene-heading') {
          const text = Node.string(node)
          const parts = text.split(' - ')
          
          let options: string[] = []
          let field = ''
          
          // Determine which field we're in and show relevant options
          if (parts.length === 1) {
            // Editing format (INT/EXT)
            field = 'format'
            options = FORMAT_OPTIONS.filter(opt => 
              opt.toLowerCase().includes(parts[0]?.toLowerCase() || '')
            )
          } else if (parts.length === 2) {
            // Editing location
            field = 'location'
            options = COMMON_LOCATIONS.filter(opt =>
              opt.toLowerCase().includes(parts[1]?.toLowerCase() || '')
            )
          } else if (parts.length === 3) {
            // Editing time of day
            field = 'time'
            options = TIME_OPTIONS.filter(opt =>
              opt.toLowerCase().includes(parts[2]?.toLowerCase() || '')
            )
          }
          
          if (options.length > 0 && text) {
            setAutocompleteOptions(options)
            setShowAutocomplete(true)
            setAutocompleteIndex(0)
            
            // Calculate position relative to viewport - use setTimeout to ensure DOM is updated
            setTimeout(() => {
              try {
                const domNode = ReactEditor.toDOMNode(editor, node)
                const rect = domNode.getBoundingClientRect()
                
                console.log('Autocomplete position:', {
                  top: rect.bottom + 4,
                  left: rect.left,
                  rect
                })
                
                setAutocompletePosition({
                  top: rect.bottom + 4, // Small offset below the element
                  left: rect.left
                })
              } catch (e) {
                console.error('Error calculating autocomplete position:', e)
              }
            }, 0)
          } else {
            setShowAutocomplete(false)
            setAutocompletePosition(null)
          }
        } else {
          setShowAutocomplete(false)
          setAutocompletePosition(null)
        }
      }
    } catch (error) {
      // Ignore errors during selection tracking
    }
  }, [editor.selection, editor, value])

  // Save to localStorage
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem('screenplay-pro', JSON.stringify(value))
      alert('Screenplay saved successfully!')
    } catch (error) {
      console.error('Error saving screenplay:', error)
      alert('Error saving screenplay')
    }
  }, [value])

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('screenplay-pro')
      if (saved) {
        setValue(JSON.parse(saved))
      }
      
      const savedProfiles = localStorage.getItem('screenplay-pro-character-profiles')
      if (savedProfiles) {
        setCharacterProfiles(JSON.parse(savedProfiles))
      }
    } catch (error) {
      console.error('Error loading screenplay:', error)
    }
  }, [])

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (value.length > 0) {
        localStorage.setItem('screenplay-pro', JSON.stringify(value))
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [value])

  // Auto-save character profiles
  useEffect(() => {
    if (Object.keys(characterProfiles).length > 0) {
      localStorage.setItem('screenplay-pro-character-profiles', JSON.stringify(characterProfiles))
    }
  }, [characterProfiles])

  // Export as text
  const handleExportText = useCallback(() => {
    console.log('Exporting plain text...')
    try {
      const text = value
        .map(node => {
          if (SlateElement.isElement(node)) {
            return Node.string(node)
          }
          return ''
        })
        .join('\n')
      
      console.log('Text content:', text.substring(0, 100))
      
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'screenplay.txt'
      a.click()
      URL.revokeObjectURL(url)
      
      console.log('Plain text export completed')
    } catch (error) {
      console.error('Error exporting plain text:', error)
      alert('Error exporting text file. Please try again.')
    }
  }, [value])

  // Export as formatted screenplay
  const handleExportFormatted = useCallback(() => {
    console.log('Exporting formatted text...')
    try {
      // Create title page
      const titlePage = `



${''.padStart(35)}${screenplayTitle.toUpperCase()}



${''.padStart(40)}Written By

${''.padStart(40)}${authorName}








\f
`
      
      const formatted = value
        .map(node => {
          if (SlateElement.isElement(node)) {
            const text = Node.string(node)
            const type = node.type
            
            switch (type) {
              case 'scene-heading':
                return `\n${text.toUpperCase()}\n`
              case 'action':
                return `\n${text}\n`
              case 'character':
                return `\n${''.padStart(35)}${text.toUpperCase()}\n`
              case 'dialogue':
                return `${''.padStart(25)}${text}\n`
              case 'parenthetical':
                return `${''.padStart(30)}(${text})\n`
              case 'transition':
                return `\n${''.padStart(60)}${text.toUpperCase()}\n`
              default:
                return text
            }
          }
          return ''
        })
        .join('')
      
      const fullContent = titlePage + formatted
      
      console.log('Formatted content length:', fullContent.length)
      
      const blob = new Blob([fullContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'screenplay-formatted.txt'
      a.click()
      URL.revokeObjectURL(url)
      
      console.log('Formatted text export completed')
    } catch (error) {
      console.error('Error exporting formatted text:', error)
      alert('Error exporting formatted text file. Please try again.')
    }
  }, [value, screenplayTitle, authorName])

  // Export as PDF
  const handleExportPDF = useCallback(async () => {
    console.log('Exporting PDF...')
    try {
      // Dynamically import jsPDF to avoid SSR issues
      const { jsPDF } = await import('jspdf')
      
      const doc = new jsPDF({
        unit: 'pt',
        format: 'letter',
        orientation: 'portrait'
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 72 // 1 inch margin
      const lineHeight = 12
      let yPosition = margin

      // Create Title Page
      doc.setFont('courier', 'bold')
      doc.setFontSize(14)
      
      // Title - centered vertically and horizontally
      const titleY = pageHeight / 2 - 40
      const titleLines = doc.splitTextToSize(screenplayTitle.toUpperCase(), pageWidth - 2 * margin)
      titleLines.forEach((line: string, index: number) => {
        const titleWidth = doc.getTextWidth(line)
        const titleX = (pageWidth - titleWidth) / 2
        doc.text(line, titleX, titleY + (index * 20))
      })
      
      // "Written By" - below title
      doc.setFont('courier', 'normal')
      doc.setFontSize(12)
      const writtenByY = titleY + (titleLines.length * 20) + 40
      const writtenByText = 'Written By'
      const writtenByWidth = doc.getTextWidth(writtenByText)
      const writtenByX = (pageWidth - writtenByWidth) / 2
      doc.text(writtenByText, writtenByX, writtenByY)
      
      // Author Name - below "Written By"
      const authorY = writtenByY + 24
      const authorWidth = doc.getTextWidth(authorName)
      const authorX = (pageWidth - authorWidth) / 2
      doc.text(authorName, authorX, authorY)
      
      // Add new page for screenplay content
      doc.addPage()
      yPosition = margin

      // Helper function to add new page if needed
      const checkPageBreak = () => {
        if (yPosition > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }
      }

      // Process each element
      value.forEach((node) => {
        if (SlateElement.isElement(node)) {
          const text = Node.string(node)
          if (!text.trim()) return

          const type = node.type
          let fontSize = 12
          let fontStyle: 'normal' | 'bold' = 'normal'
          let xPosition = margin
          let alignment: 'left' | 'center' | 'right' = 'left'

          switch (type) {
            case 'scene-heading':
              fontSize = 12
              fontStyle = 'bold'
              xPosition = margin
              yPosition += lineHeight * 2
              checkPageBreak()
              doc.setFont('courier', 'bold')
              doc.setFontSize(fontSize)
              doc.text(text.toUpperCase(), xPosition, yPosition)
              yPosition += lineHeight
              break

            case 'action':
              fontSize = 12
              fontStyle = 'normal'
              xPosition = margin
              yPosition += lineHeight
              checkPageBreak()
              doc.setFont('courier', 'normal')
              doc.setFontSize(fontSize)
              const actionLines = doc.splitTextToSize(text, pageWidth - (2 * margin))
              actionLines.forEach((line: string) => {
                checkPageBreak()
                doc.text(line, xPosition, yPosition)
                yPosition += lineHeight
              })
              break

            case 'character':
              fontSize = 12
              fontStyle = 'normal'
              xPosition = pageWidth / 2 - 50
              yPosition += lineHeight * 2
              checkPageBreak()
              doc.setFont('courier', 'normal')
              doc.setFontSize(fontSize)
              doc.text(text.toUpperCase(), xPosition, yPosition)
              yPosition += lineHeight
              break

            case 'dialogue':
              fontSize = 12
              fontStyle = 'normal'
              xPosition = pageWidth / 2 - 100
              checkPageBreak()
              doc.setFont('courier', 'normal')
              doc.setFontSize(fontSize)
              const dialogueLines = doc.splitTextToSize(text, 250)
              dialogueLines.forEach((line: string) => {
                checkPageBreak()
                doc.text(line, xPosition, yPosition)
                yPosition += lineHeight
              })
              break

            case 'parenthetical':
              fontSize = 12
              fontStyle = 'normal'
              xPosition = pageWidth / 2 - 80
              checkPageBreak()
              doc.setFont('courier', 'normal')
              doc.setFontSize(fontSize)
              doc.text(`(${text})`, xPosition, yPosition)
              yPosition += lineHeight
              break

            case 'transition':
              fontSize = 12
              fontStyle = 'normal'
              alignment = 'right'
              yPosition += lineHeight * 2
              checkPageBreak()
              doc.setFont('courier', 'normal')
              doc.setFontSize(fontSize)
              doc.text(text.toUpperCase(), pageWidth - margin, yPosition, { align: 'right' })
              yPosition += lineHeight
              break

            default:
              break
          }
        }
      })

      // Save the PDF
      doc.save('screenplay.pdf')
      console.log('PDF export completed successfully')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error exporting PDF. Please try again.')
    }
  }, [value, screenplayTitle, authorName])

  // Get inline placeholder text for empty elements
  const getPlaceholderForElement = useCallback((elementType: ScreenplayElementType): string => {
    switch (elementType) {
      case 'scene-heading':
        return 'INT. LOCATION - TIME OF DAY' // Always uppercase
      case 'action':
        return 'Describe the action...'
      case 'character':
        return 'CHARACTER NAME' // Always uppercase
      case 'dialogue':
        return 'Character dialogue...'
      case 'parenthetical':
        return '(direction)'
      case 'transition':
        return 'CUT TO:' // Always uppercase
      default:
        return ''
    }
  }, [])

  // Render different screenplay elements
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props
    const customElement = element as CustomElement
    const style = elementStyles[customElement.type]
    
    // Check if element is empty for placeholder
    const isEmpty = Node.string(element).length === 0

    // Special handling for scene headings with autocomplete
    if (customElement.type === 'scene-heading') {
      return (
        <div 
          {...attributes} 
          style={{
            ...style,
            borderBottom: undefined, // Remove from inline style
          }} 
          className="outline-none relative group border-b-2 border-primary/20 bg-primary/5 px-2 py-1 rounded-sm"
        >
          {isEmpty && (
            <span
              contentEditable={false}
              className="absolute left-2 top-1 pointer-events-none text-muted-foreground/50 select-none"
            >
              INT. LOCATION - DAY (use Tab to navigate)
            </span>
          )}
          {children}
        </div>
      )
    }

    return (
      <div {...attributes} style={style} className="outline-none relative">
        {isEmpty && (
          <span
            contentEditable={false}
            className="absolute left-0 top-0 pointer-events-none text-muted-foreground/50 select-none"
          >
            {getPlaceholderForElement(customElement.type)}
          </span>
        )}
        {children}
      </div>
    )
  }, [getPlaceholderForElement])

  // Render leaf (text formatting)
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { attributes, children, leaf } = props
    const customLeaf = leaf as CustomText

    if (customLeaf.bold) {
      children = <strong>{children}</strong>
    }
    if (customLeaf.italic) {
      children = <em>{children}</em>
    }
    if (customLeaf.underline) {
      children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
  }, [])

  // Handle autocomplete selection
  const selectAutocomplete = useCallback((option: string) => {
    const { selection } = editor
    if (!selection) return

    try {
      const [match] = Editor.nodes(editor, {
        match: n => SlateElement.isElement(n),
        at: selection,
      })

      if (match) {
        const [node, path] = match
        const text = Node.string(node)
        const parts = text.split(' - ')

        let newText = ''
        if (parts.length === 1 && !parts[0].includes('.')) {
          // Selected format - add the format with period and space
          const format = option.endsWith('.') ? option + ' ' : option + '. '
          newText = format
        } else if (parts.length === 1 && parts[0].includes('.')) {
          // Already have format with period, adding location with separator
          newText = `${parts[0]} - ${option} - `
        } else if (parts.length === 2) {
          // Selected location, adding separator for time
          newText = `${parts[0]} - ${option} - `
        } else if (parts.length === 3) {
          // Selected time
          newText = `${parts[0]} - ${parts[1]} - ${option}`
        }

        // Replace text
        Transforms.delete(editor, { at: path })
        Transforms.insertNodes(editor, {
          type: 'scene-heading',
          children: [{ text: newText }],
        }, { at: path })
        
        // Move cursor to end
        setTimeout(() => {
          Transforms.select(editor, Editor.end(editor, path))
        }, 0)
      }
    } catch (error) {
      console.error('Error selecting autocomplete:', error)
    }

    setShowAutocomplete(false)
    setAutocompletePosition(null)
  }, [editor])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { selection } = editor

      if (!selection) return

      // Handle autocomplete navigation
      if (showAutocomplete && autocompleteOptions.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          setAutocompleteIndex((prev) => 
            (prev + 1) % autocompleteOptions.length
          )
          return
        }
        
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          setAutocompleteIndex((prev) => 
            (prev - 1 + autocompleteOptions.length) % autocompleteOptions.length
          )
          return
        }
        
        if (event.key === 'Enter') {
          event.preventDefault()
          selectAutocomplete(autocompleteOptions[autocompleteIndex])
          return
        }
        
        if (event.key === 'Escape') {
          event.preventDefault()
          setShowAutocomplete(false)
          setAutocompletePosition(null)
          return
        }
      }

      // Save with Cmd/Ctrl+S
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        handleSave()
        return
      }

      // Create new scene heading with Cmd/Ctrl+H
      if ((event.metaKey || event.ctrlKey) && event.key === 'h') {
        event.preventDefault()
        
        try {
          const [match] = Editor.nodes(editor, {
            match: n => SlateElement.isElement(n),
            at: selection,
          })

          if (match) {
            const [node, path] = match
            const element = node as CustomElement
            
            // If current line is empty or an action, convert to scene heading
            if (element.type === 'action' || Node.string(node).length === 0) {
              Transforms.setNodes(
                editor,
                { type: 'scene-heading' },
                { at: path }
              )
              console.log('Converted to scene heading')
              return
            }
          }
          
          // Otherwise insert a new scene heading
          Transforms.insertNodes(editor, {
            type: 'scene-heading',
            children: [{ text: '' }],
          })
        } catch (error) {
          console.error('Error creating scene heading:', error)
        }
        return
      }

      // Handle Tab key
      if (event.key === 'Tab') {
        event.preventDefault()

        try {
          const [match] = Editor.nodes(editor, {
            match: n => SlateElement.isElement(n),
            at: selection,
          })

          if (match) {
            const [node, path] = match
            const element = node as CustomElement
            const currentText = Node.string(node)

            // Special handling for scene headings - Tab navigates between parts
            if (element.type === 'scene-heading') {
              const parts = currentText.split(' - ')
              
              // Determine current field based on content
              if (parts.length === 1 && parts[0] && !parts[0].includes('.')) {
                // Typing format (INT/EXT), add period and space
                let format = parts[0].trim().toUpperCase()
                
                // Add period if not present
                if (!format.endsWith('.')) {
                  format = format + '. '
                } else {
                  format = format + ' '
                }
                
                const newText = format
                Transforms.delete(editor, { at: path })
                Transforms.insertNodes(editor, {
                  type: 'scene-heading',
                  children: [{ text: newText }],
                }, { at: path })
                // Move cursor to end
                setTimeout(() => {
                  Transforms.select(editor, Editor.end(editor, path))
                }, 0)
              } else if (parts.length === 1 && parts[0].includes('.')) {
                // Have format with period, check if location is present
                const trimmed = parts[0].trim()
                
                // Skip if just "INT. " (nothing after the space)
                if (trimmed.endsWith('.')) {
                  return
                }
                
                // Have location after the period, uppercase it and add separator for time
                const newText = `${parts[0].toUpperCase()} - `
                Transforms.delete(editor, { at: path })
                Transforms.insertNodes(editor, {
                  type: 'scene-heading',
                  children: [{ text: newText }],
                }, { at: path })
                // Move cursor to end
                setTimeout(() => {
                  Transforms.select(editor, Editor.end(editor, path))
                }, 0)
              } else if (parts.length === 2 && parts[1]) {
                // Have format and location, uppercase time and add separator
                const newText = `${parts[0]} - ${parts[1].toUpperCase()} - `
                Transforms.delete(editor, { at: path })
                Transforms.insertNodes(editor, {
                  type: 'scene-heading',
                  children: [{ text: newText }],
                }, { at: path })
                // Move cursor to end
                setTimeout(() => {
                  Transforms.select(editor, Editor.end(editor, path))
                }, 0)
              }
              
              console.log('Scene heading Tab navigation:', { parts, currentText })
              return
            }
            
            // Special handling for action lines with Shift+Tab
            if (element.type === 'action' && event.shiftKey) {
              // Convert action to scene heading
              Transforms.setNodes(
                editor,
                { type: 'scene-heading' },
                { at: path }
              )
              console.log('Converted action to scene heading')
              return
            }
            
            // Standard Tab behavior for other elements
            const nextType = getNextElementType(element.type, 'Tab', event.shiftKey)

            console.log('Tab pressed:', {
              currentType: element.type,
              shiftKey: event.shiftKey,
              nextType,
            })

            if (nextType) {
              // If changing to a different type, update the node
              Transforms.setNodes(
                editor,
                { type: nextType },
                { at: path }
              )
              
              // Move cursor to end of line
              Transforms.select(editor, Editor.end(editor, path))
            }
          }
        } catch (error) {
          console.error('Error handling Tab:', error)
        }
        return
      }
    },
    [editor, handleSave, showAutocomplete, autocompleteOptions, autocompleteIndex, selectAutocomplete]
  )

  // Navigate to scene
  const navigateToScene = useCallback((lineNumber: number) => {
    Transforms.select(editor, {
      anchor: { path: [lineNumber, 0], offset: 0 },
      focus: { path: [lineNumber, 0], offset: 0 },
    })
    // Focus editor
    ReactEditor.focus(editor)
  }, [editor])

  // Navigate to character's first appearance
  const navigateToCharacter = useCallback((lineNumber: number) => {
    Transforms.select(editor, {
      anchor: { path: [lineNumber, 0], offset: 0 },
      focus: { path: [lineNumber, 0], offset: 0 },
    })
    // Focus editor
    ReactEditor.focus(editor)
  }, [editor])

  // Rename character throughout screenplay
  const renameCharacter = useCallback((oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) return
    
    const newNameUpper = newName.trim().toUpperCase()
    const oldNameUpper = oldName.trim().toUpperCase()
    
    console.log(`Renaming character from ${oldNameUpper} to ${newNameUpper}`)
    
    // Create a new value array with updated character names
    const updatedValue = value.map((node, index) => {
      if (SlateElement.isElement(node) && node.type === 'character') {
        const currentName = Node.string(node).trim().toUpperCase()
        if (currentName === oldNameUpper) {
          // Return a new node with the updated name
          return {
            type: 'character',
            children: [{ text: newNameUpper }],
          } as CustomElement
        }
      }
      return node
    })
    
    // Update the editor value
    setValue(updatedValue)
    
    // Update character profiles mapping
    if (characterProfiles[oldNameUpper]) {
      const profile = characterProfiles[oldNameUpper]
      setCharacterProfiles(prev => {
        const newProfiles = { ...prev }
        delete newProfiles[oldNameUpper]
        newProfiles[newNameUpper] = profile
        return newProfiles
      })
    }
    
    console.log(`Successfully renamed character from ${oldNameUpper} to ${newNameUpper}`)
  }, [value, characterProfiles])

  // Rename location throughout screenplay
  const renameLocation = useCallback((oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) return
    
    const newNameUpper = newName.trim().toUpperCase()
    const oldNameUpper = oldName.trim().toUpperCase()
    
    console.log(`Renaming location from ${oldNameUpper} to ${newNameUpper}`)
    
    // Create a new value array with updated location names in scene headings
    const updatedValue = value.map((node) => {
      if (SlateElement.isElement(node) && node.type === 'scene-heading') {
        const currentText = Node.string(node).trim().toUpperCase()
        if (currentText.includes(oldNameUpper)) {
          const updatedText = currentText.replace(oldNameUpper, newNameUpper)
          return {
            type: 'scene-heading',
            children: [{ text: updatedText }],
          } as CustomElement
        }
      }
      return node
    })
    
    // Update the editor value
    setValue(updatedValue)
    
    // Update location profiles mapping
    if (locationProfiles[oldNameUpper]) {
      const profile = locationProfiles[oldNameUpper]
      setLocationProfiles(prev => {
        const newProfiles = { ...prev }
        delete newProfiles[oldNameUpper]
        newProfiles[newNameUpper] = profile
        return newProfiles
      })
    }
    
    console.log(`Successfully renamed location from ${oldNameUpper} to ${newNameUpper}`)
  }, [value, locationProfiles])

  // Get placeholder text based on current element type
  const getPlaceholderText = (elementType: ScreenplayElementType): string => {
    switch (elementType) {
      case 'scene-heading':
        return 'Type scene heading (e.g., INT. COFFEE SHOP - DAY)...'
      case 'action':
        return 'Describe the action or setting...'
      case 'character':
        return 'Enter character name (all caps)...'
      case 'dialogue':
        return 'Enter dialogue...'
      case 'parenthetical':
        return 'Enter parenthetical direction (e.g., nervous, laughing)...'
      case 'transition':
        return 'Enter transition (e.g., CUT TO:, FADE OUT)...'
      default:
        return 'Start typing your screenplay...'
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b bg-card p-2 flex items-center gap-1 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (showCharacters || showLocations || showHelp) {
              // Return to editor
              setShowCharacters(false)
              setShowLocations(false)
              setShowHelp(false)
            } else {
              // Toggle outliner
              setShowOutliner(!showOutliner)
            }
          }}
          title={showCharacters || showLocations || showHelp ? "Return to Editor" : "Toggle Outliner"}
          className="h-7 px-2 text-xs"
        >
          <List className="h-3 w-3 mr-1" />
          {showCharacters || showLocations || showHelp ? 'Editor' : 'Outliner'}
        </Button>
        
        <Separator orientation="vertical" className="h-4" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowCharacters(!showCharacters)
            setShowLocations(false)
            setShowHelp(false)
          }}
          title="View Characters"
          className="h-7 px-2 text-xs"
        >
          <Users className="h-3 w-3 mr-1" />
          Characters
        </Button>
        
        <Separator orientation="vertical" className="h-4" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowLocations(!showLocations)
            setShowCharacters(false)
            setShowHelp(false)
          }}
          title="View Locations"
          className="h-7 px-2 text-xs"
        >
          <MapPin className="h-3 w-3 mr-1" />
          Locations
        </Button>
        
        <Separator orientation="vertical" className="h-4" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowHelp(!showHelp)
            setShowCharacters(false)
            setShowLocations(false)
          }}
          title="Help & Keyboard Shortcuts"
          className="h-7 px-2 text-xs"
        >
          <Keyboard className="h-3 w-3 mr-1" />
          Help
        </Button>
        
        <div className="ml-auto flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Current:</span>
            <span className="font-semibold capitalize bg-primary/10 px-2 py-1 rounded">
              {currentElementType.replace('-', ' ')}
            </span>
          </div>
          <span className="text-muted-foreground">
            {scenes.length} scenes • {characters.length} characters • Auto-save enabled
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Scene Outliner - Hide when viewing Characters/Locations/Help */}
        {showOutliner && !showCharacters && !showLocations && !showHelp && (
          <Card className="w-64 m-2 p-0 overflow-hidden flex flex-col border">
            <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Scene Outliner</h3>
              <p className="text-xs text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''}</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {scenes.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No scenes yet. Type a scene heading to get started.
                  </p>
                ) : (
                  scenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      onClick={() => navigateToScene(scene.lineNumber)}
                      className="w-full text-left p-2 rounded hover:bg-accent text-sm transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            Scene {index + 1}
                          </div>
                          <div className="text-xs text-muted-foreground truncate uppercase font-semibold">
                            {scene.text.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        )}

        {/* Editor */}
        <div className={`flex-1 flex flex-col overflow-hidden ${(showCharacters || showLocations || showHelp) ? '' : 'm-2 gap-2'}`}>
          {/* Quick Help Bar and Export Panel - Only show when in editor mode */}
          {!showCharacters && !showLocations && !showHelp && (
            <div className="flex flex-wrap gap-2">
              {/* Quick Help Bar */}
              <Card className="flex-1 px-3 py-1 bg-muted/30 min-w-[300px] flex items-center">
                <div className="flex items-center gap-3 text-xs w-full leading-none">
                  <span className="font-semibold text-[10px]">Quick Actions:</span>
                  {currentElementType === 'scene-heading' && (
                    <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> to add Action</span>
                  )}
                  {currentElementType === 'action' && (
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-background rounded border">Tab</kbd> for Character | 
                      <kbd className="px-1.5 py-0.5 bg-background rounded border ml-1">Shift+Tab</kbd> for Scene Heading | 
                      Type <kbd className="px-1.5 py-0.5 bg-background rounded border ml-1">INT.</kbd> or <kbd className="px-1.5 py-0.5 bg-background rounded border">EXT.</kbd> to auto-convert
                    </span>
                  )}
                  {currentElementType === 'character' && (
                    <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> to add Dialogue</span>
                  )}
                  {currentElementType === 'dialogue' && (
                    <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Tab</kbd> for Parenthetical or <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> for Action</span>
                  )}
                  {currentElementType === 'parenthetical' && (
                    <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> to return to Dialogue</span>
                  )}
                  {currentElementType === 'transition' && (
                    <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> to add Action</span>
                  )}
                </div>
              </Card>
              
              {/* Export Panel */}
              <Card className="px-1.5 py-1 bg-muted/30 flex-shrink-0 flex items-center">
                <div className="flex items-center leading-none">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Export Screenplay"
                      className="h-5 px-1 text-[10px] gap-0.5"
                      onClick={() => setShowExportMenu(!showExportMenu)}
                    >
                      <FileDown className="h-2.5 w-2.5" />
                      Export
                      <ChevronDown className="h-2 w-2" />
                    </Button>
                    
                    {showExportMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowExportMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-56 bg-popover text-popover-foreground rounded-md border shadow-lg z-50">
                          <div className="p-2">
                            <div className="px-2 py-1.5 text-sm font-medium">Export Options</div>
                            <div className="my-1 h-px bg-border" />
                            
                            <button
                              onClick={() => {
                                handleExportFormatted()
                                setShowExportMenu(false)
                              }}
                              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            >
                              <FileDown className="h-3.5 w-3.5" />
                              Text File (.txt)
                            </button>
                            
                            <button
                              onClick={() => {
                                handleExportPDF()
                                setShowExportMenu(false)
                              }}
                              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            >
                              <FileDown className="h-3.5 w-3.5" />
                              PDF Document (.pdf)
                            </button>
                            
                            <div className="my-1 h-px bg-border" />
                            
                            <button
                              disabled
                              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm opacity-50 cursor-not-allowed"
                            >
                              <FileDown className="h-3.5 w-3.5" />
                              Final Draft (.fdx) (Coming Soon)
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          <Card className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {showCharacters ? (
                // Characters Content
                <div className="p-8 pb-24 max-w-6xl mx-auto">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Characters</h2>
                        <p className="text-muted-foreground mb-6">
                          View all characters and their editable profiles.
                        </p>
                      </div>
                      {characterDetails.length > 0 && (
                        <Card className="px-1.5 py-1 bg-muted/30 flex-shrink-0 flex items-center">
                          <div className="flex items-center leading-none">
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Export Characters"
                                className="h-5 px-1 text-[10px] gap-0.5"
                                onClick={() => setShowCharacterExportMenu(!showCharacterExportMenu)}
                              >
                                <FileDown className="h-2.5 w-2.5" />
                                Export
                                <ChevronDown className="h-2 w-2" />
                              </Button>
                              
                              {showCharacterExportMenu && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setShowCharacterExportMenu(false)}
                                  />
                                  <div className="absolute right-0 top-full mt-1 w-48 bg-popover border rounded-md shadow-md z-50">
                                    <div className="p-1">
                                      <div className="px-2 py-1.5 text-sm font-medium">Export Options</div>
                                      <div className="my-1 h-px bg-border" />
                                      
                                      <button
                                        onClick={() => {
                                          const exportData = characterDetails.map((character) => ({
                                            name: character.name,
                                            type: characterTypes[character.name] || 'Not Mentioned',
                                            dialogues: character.appearances,
                                            scenes: character.scenes.length,
                                            sceneNumbers: character.scenes,
                                            profile: characterProfiles[character.name] || '',
                                            dialogueLines: character.dialogues
                                          }))
                                          
                                          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
                                          const url = URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_characters.json`
                                          document.body.appendChild(a)
                                          a.click()
                                          document.body.removeChild(a)
                                          URL.revokeObjectURL(url)
                                          setShowCharacterExportMenu(false)
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                      >
                                        <FileDown className="h-3.5 w-3.5" />
                                        JSON File (.json)
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>

                    {characterDetails.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No characters yet. Add characters to your screenplay to see them here.</p>
                      </div>
                    ) : (
                      <Accordion type="single" collapsible className="space-y-1.5">
                        {characterDetails.map((character) => (
                          <AccordionItem key={character.name} value={character.name} className="border rounded-lg px-2.5">
                            <AccordionTrigger className="hover:no-underline py-1">
                              <div className="flex items-center justify-between w-full pr-1">
                                <div className="flex items-center gap-1.5">
                                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="font-medium text-xs uppercase tracking-wide">{character.name}</span>
                                </div>
                                <div className="flex items-center h-5 rounded-full overflow-hidden border border-border">
                                  <span className="px-2 py-0.5 bg-primary/10 text-[10px] font-medium">
                                    {character.appearances} dialogue{character.appearances !== 1 ? 's' : ''}
                                  </span>
                                  <div className="w-px h-full bg-border"></div>
                                  <span className="px-2 py-0.5 bg-secondary/10 text-[10px] font-medium">
                                    {character.scenes.length} scene{character.scenes.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-2">
                              <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-1 space-y-3">
                                  <div>
                                    <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                                      Edit Character Name:
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <Edit3 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <Input
                                        defaultValue={character.name}
                                        onBlur={(e) => {
                                          const newName = e.target.value.trim().toUpperCase()
                                          if (newName && newName !== character.name) {
                                            renameCharacter(character.name, newName)
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.currentTarget.blur()
                                          }
                                        }}
                                        className="font-bold border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 focus:border-primary uppercase"
                                        placeholder="Character Name"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                                      Character Type:
                                    </label>
                                    <Select
                                      value={characterTypes[character.name] || ''}
                                      onValueChange={(value) => {
                                        setCharacterTypes(prev => ({
                                          ...prev,
                                          [character.name]: value
                                        }))
                                      }}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Not Mentioned" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="protagonist">Protagonist</SelectItem>
                                        <SelectItem value="antagonist">Antagonist</SelectItem>
                                        <SelectItem value="supporting">Supporting Character</SelectItem>
                                        <SelectItem value="minor">Minor Character</SelectItem>
                                        <SelectItem value="love-interest">Love Interest</SelectItem>
                                        <SelectItem value="mentor">Mentor</SelectItem>
                                        <SelectItem value="sidekick">Sidekick</SelectItem>
                                        <SelectItem value="comic-relief">Comic Relief</SelectItem>
                                        <SelectItem value="foil">Foil</SelectItem>
                                        <SelectItem value="guest">Guest</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                                    Character Profile:
                                  </label>
                                  <Textarea
                                    value={characterProfiles[character.name] || ''}
                                    onChange={(e) => {
                                      setCharacterProfiles(prev => ({
                                        ...prev,
                                        [character.name]: e.target.value
                                      }))
                                    }}
                                    placeholder="Add character description, backstory, traits, personality, motivations, etc..."
                                    className="min-h-[200px] w-full"
                                  />
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </div>
                </div>
              ) : showLocations ? (
                // Locations Content
                <div className="p-8 pb-24 max-w-6xl mx-auto">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Locations</h2>
                        <p className="text-muted-foreground mb-6">
                          View all locations and their editable details.
                        </p>
                      </div>
                      {locations.length > 0 && (
                        <Card className="px-1.5 py-1 bg-muted/30 flex-shrink-0 flex items-center">
                          <div className="flex items-center leading-none">
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Export Locations"
                                className="h-5 px-1 text-[10px] gap-0.5"
                                onClick={() => setShowLocationExportMenu(!showLocationExportMenu)}
                              >
                                <FileDown className="h-2.5 w-2.5" />
                                Export
                                <ChevronDown className="h-2 w-2" />
                              </Button>
                              
                              {showLocationExportMenu && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setShowLocationExportMenu(false)}
                                  />
                                  <div className="absolute right-0 top-full mt-1 w-48 bg-popover border rounded-md shadow-md z-50">
                                    <div className="p-1">
                                      <div className="px-2 py-1.5 text-sm font-medium">Export Options</div>
                                      <div className="my-1 h-px bg-border" />
                                      
                                      <button
                                        onClick={() => {
                                          const exportData = locations.map((location) => ({
                                            name: location.name,
                                            totalScenes: location.scenes.length,
                                            sceneNumbers: location.scenes,
                                            timeOfDayBreakdown: location.timeOfDay,
                                            description: locationProfiles[location.name] || ''
                                          }))
                                          
                                          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
                                          const url = URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_locations.json`
                                          document.body.appendChild(a)
                                          a.click()
                                          document.body.removeChild(a)
                                          URL.revokeObjectURL(url)
                                          setShowLocationExportMenu(false)
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                      >
                                        <FileDown className="h-3.5 w-3.5" />
                                        JSON File (.json)
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>

                    {locations.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No locations yet. Add scene headings to see locations here.</p>
                      </div>
                    ) : (
                      <Accordion type="single" collapsible className="space-y-1.5">
                        {locations.map((location) => (
                          <AccordionItem key={location.name} value={location.name} className="border rounded-lg px-2.5">
                            <AccordionTrigger className="hover:no-underline py-1">
                              <div className="flex items-center justify-between w-full pr-1">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="font-medium text-xs uppercase tracking-wide">{location.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {Object.entries(location.timeOfDay).sort(([a], [b]) => a.localeCompare(b)).map(([time, count]) => (
                                    <div key={time} className="flex items-center h-5 rounded-full overflow-hidden border border-border">
                                      <span className="px-2 py-0.5 bg-primary/10 text-[10px] font-medium">
                                        {count} {time}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-2">
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                                    Edit Location Name:
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <Edit3 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <Input
                                      defaultValue={location.name}
                                      onBlur={(e) => {
                                        const newName = e.target.value.trim().toUpperCase()
                                        if (newName && newName !== location.name) {
                                          renameLocation(location.name, newName)
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.currentTarget.blur()
                                        }
                                      }}
                                      className="font-bold border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 focus:border-primary uppercase"
                                      placeholder="Location Name"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                                    Location Description:
                                  </label>
                                  <Textarea
                                    value={locationProfiles[location.name] || ''}
                                    onChange={(e) => {
                                      setLocationProfiles(prev => ({
                                        ...prev,
                                        [location.name]: e.target.value
                                      }))
                                    }}
                                    placeholder="Add location description, atmosphere, important details, visual elements, etc..."
                                    className="min-h-[100px] w-full"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                                    Scene Numbers:
                                  </label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {location.scenes.map((sceneNum, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                                        Scene {sceneNum}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </div>
                </div>
              ) : showHelp ? (
                // Help Content
                <div className="p-8 pb-16 max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Screenplay Editor Help</h2>
                      <p className="text-muted-foreground mb-6">
                        Learn how to use the professional screenplay editor with keyboard shortcuts and element types.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Keyboard Shortcuts</h3>
                      <div className="space-y-3">
                        {Object.entries(keyboardShortcuts).map(([shortcut, description]) => (
                          <div key={shortcut} className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg">
                            <code className="text-sm bg-background px-3 py-1.5 rounded font-mono whitespace-nowrap font-semibold">
                              {shortcut}
                            </code>
                            <span className="text-sm text-muted-foreground flex-1 pt-1">
                              {description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Element Types</h3>
                      <div className="space-y-3 text-sm">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <strong className="text-base">Scene Heading:</strong>
                          <p className="text-muted-foreground mt-1">INT/EXT location and time (all caps, bold)</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <strong className="text-base">Action:</strong>
                          <p className="text-muted-foreground mt-1">Description of what's happening</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <strong className="text-base">Character:</strong>
                          <p className="text-muted-foreground mt-1">Character name (all caps, centered)</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <strong className="text-base">Dialogue:</strong>
                          <p className="text-muted-foreground mt-1">What the character says (centered)</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <strong className="text-base">Parenthetical:</strong>
                          <p className="text-muted-foreground mt-1">Actor direction (centered, italics)</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <strong className="text-base">Transition:</strong>
                          <p className="text-muted-foreground mt-1">Scene transition (all caps, right-aligned)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Editor Content
                <div className="p-8 max-w-4xl mx-auto">
                  <Slate
                    editor={editor}
                    initialValue={value}
                    onValueChange={setValue}
                    onSelectionChange={() => {
                      // Track current element type when selection changes
                      const { selection } = editor
                      if (!selection) return

                      try {
                        const [match] = Editor.nodes(editor, {
                          match: n => SlateElement.isElement(n),
                          at: selection,
                        })

                        if (match) {
                          const [node] = match
                          const element = node as CustomElement
                          setCurrentElementType(element.type)
                        }
                      } catch (error) {
                        // Ignore errors during selection tracking
                      }
                    }}
                  >
                    <Editable
                      renderElement={renderElement}
                      renderLeaf={renderLeaf}
                      onKeyDown={handleKeyDown}
                      placeholder={getPlaceholderText(currentElementType)}
                      className="outline-none min-h-[600px] font-mono text-base leading-relaxed [&>div[data-slate-placeholder]]:text-muted-foreground/60 [&>div[data-slate-placeholder]]:italic"
                      spellCheck
                      autoFocus
                    />
                  </Slate>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {showAutocomplete && autocompleteOptions.length > 0 && autocompletePosition && (
        <div 
          className="fixed bg-popover border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
          style={{
            top: `${autocompletePosition.top}px`,
            left: `${autocompletePosition.left}px`,
            minWidth: '250px'
          }}
        >
          <div className="p-2 border-b text-xs text-muted-foreground bg-muted/30">
            {currentElementType === 'scene-heading' && '↑↓ Navigate | Enter Select | Esc Close'}
          </div>
          {autocompleteOptions.map((option, index) => (
            <button
              key={option}
              onClick={() => selectAutocomplete(option)}
              onMouseEnter={() => setAutocompleteIndex(index)}
              className={`w-full text-left px-3 py-2 text-sm font-semibold uppercase transition-colors ${
                index === autocompleteIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

