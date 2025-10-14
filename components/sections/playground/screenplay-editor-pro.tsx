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
  ChevronDown,
  Users,
  MapPin,
  Edit3,
  Download,
  X,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
        case 'transition':
          return 'action'
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
        case 'parenthetical':
          return 'transition'
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
  type?: string
}

interface LocationData {
  name: string
  scenes: number[]
  timeOfDay: Record<string, number>
  description?: string
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
  const [draggedSceneIndex, setDraggedSceneIndex] = useState<number | null>(null)
  const [dragOverSceneIndex, setDragOverSceneIndex] = useState<number | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  const [currentElementType, setCurrentElementType] = useState<ScreenplayElementType>('action')
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompleteIndex, setAutocompleteIndex] = useState(0)
  const [autocompletePosition, setAutocompletePosition] = useState<{ top: number; left: number } | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<CustomElement | null>(null)
  const screenplayTitle = title
  const [authorName, setAuthorName] = useState('Rakesh Raveendranath')
  
  const editor = useMemo(() => withScreenplay(withHistory(withReact(createEditor()))), [])

  // Load pen name from profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('userProfile')
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          const penName = parsed.penName || `${parsed.firstName || 'Rakesh'} ${parsed.lastName || 'Raveendranath'}`.trim()
          setAuthorName(penName)
        } catch (error) {
          console.error('Error loading author name:', error)
        }
      }
    }
  }, [])

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
                profile: characterProfiles[characterName] || '',
                type: characterTypes[characterName]
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
    
    // Sort characters by type importance
    const typeRanking: { [key: string]: number } = {
      'Protagonist': 1,
      'Antagonist': 2,
      'Supporting': 3,
      'Minor': 4,
      'Cameo': 5,
      'Not Mentioned': 6
    }
    
    const details = Array.from(characterDetailsMap.values()).sort((a, b) => {
      const typeA = a.type || 'Not Mentioned'
      const typeB = b.type || 'Not Mentioned'
      const rankA = typeRanking[typeA] || 999
      const rankB = typeRanking[typeB] || 999
      
      if (rankA !== rankB) {
        return rankA - rankB
      }
      
      return a.name.localeCompare(b.name)
    })
    setCharacterDetails(details)
  }, [value, characterProfiles, characterTypes])

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
              timeOfDay: {},
              description: locationProfiles[location]
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
  }, [value, locationProfiles])

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
          // New format is: INT. LOCATION - TIME (no hyphen between format and location)
          if (parts.length === 1) {
            // Could be editing format or location
            const formatMatch = parts[0].match(/^(INT\.?|EXT\.?|INT\.?\/EXT\.?|EXT\.?\/INT\.?)$/i)
            const hasFormatWithLocation = parts[0].match(/^(INT\.?|EXT\.?|INT\.?\/EXT\.?|EXT\.?\/INT\.?)\s+(.+)$/i)
            
            if (formatMatch) {
              // Just format, no location yet - show format options
              field = 'format'
              options = FORMAT_OPTIONS.filter(opt => 
                opt.toLowerCase().includes(parts[0]?.toLowerCase() || '')
              )
            } else if (hasFormatWithLocation) {
              // Has format and partial location - show location options
              field = 'location'
              const locationPart = hasFormatWithLocation[2] || ''
              options = COMMON_LOCATIONS.filter(opt =>
                opt.toLowerCase().includes(locationPart.toLowerCase())
              )
            } else {
              // Editing format
              field = 'format'
              options = FORMAT_OPTIONS.filter(opt => 
                opt.toLowerCase().includes(parts[0]?.toLowerCase() || '')
              )
            }
          } else if (parts.length === 2) {
            // Editing time of day (parts[1] is time)
            field = 'time'
            options = TIME_OPTIONS.filter(opt =>
              opt.toLowerCase().includes(parts[1]?.toLowerCase() || '')
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
      
      const savedTypes = localStorage.getItem('screenplay-pro-character-types')
      if (savedTypes) {
        setCharacterTypes(JSON.parse(savedTypes))
      }
      
      const savedLocationProfiles = localStorage.getItem('screenplay-pro-location-profiles')
      if (savedLocationProfiles) {
        setLocationProfiles(JSON.parse(savedLocationProfiles))
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

  // Auto-save character types
  useEffect(() => {
    if (Object.keys(characterTypes).length > 0) {
      localStorage.setItem('screenplay-pro-character-types', JSON.stringify(characterTypes))
    }
  }, [characterTypes])

  // Auto-save location profiles
  useEffect(() => {
    if (Object.keys(locationProfiles).length > 0) {
      localStorage.setItem('screenplay-pro-location-profiles', JSON.stringify(locationProfiles))
    }
  }, [locationProfiles])

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
      const fileName = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft.txt`
      a.download = fileName
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
      const fileName = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_formatted.txt`
      a.download = fileName
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
      const fileName = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft.pdf`
      doc.save(fileName)
      console.log('PDF export completed successfully')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error exporting PDF. Please try again.')
    }
  }, [value, screenplayTitle, authorName])

  // Check if scene has content
  const checkSceneHasContent = useCallback((element: CustomElement): boolean => {
    try {
      const path = ReactEditor.findPath(editor, element)
      const nodeIndex = path[0]
      
      // Check if scene heading has content
      const sceneHeadingText = Node.string(element).trim()
      
      // Find all nodes until the next scene heading or end
      let hasContent = sceneHeadingText.length > 0
      
      for (let i = nodeIndex + 1; i < value.length; i++) {
        const node = value[i]
        if (SlateElement.isElement(node) && node.type === 'scene-heading') {
          // Hit next scene heading, stop here
          break
        }
        // Check if this node has content
        if (Node.string(node).trim().length > 0) {
          hasContent = true
          break
        }
      }
      
      return hasContent
    } catch (error) {
      console.error('Error checking scene content:', error)
      return false
    }
  }, [editor, value])

  // Delete scene heading and its content
  const deleteSceneHeading = useCallback((element: CustomElement) => {
    // Check if scene has content
    const hasContent = checkSceneHasContent(element)
    
    if (hasContent) {
      // Show confirmation dialog
      setSceneToDelete(element)
      setShowDeleteDialog(true)
    } else {
      // Delete immediately if empty
      performSceneDeletion(element)
    }
  }, [checkSceneHasContent])

  // Actually perform the deletion
  const performSceneDeletion = useCallback((element: CustomElement) => {
    try {
      const path = ReactEditor.findPath(editor, element)
      const nodeIndex = path[0]
      
      // Find all nodes until the next scene heading or end
      let nodesToDelete = 1 // Start with the scene heading itself
      
      for (let i = nodeIndex + 1; i < value.length; i++) {
        const node = value[i]
        if (SlateElement.isElement(node) && node.type === 'scene-heading') {
          // Hit next scene heading, stop here
          break
        }
        nodesToDelete++
      }
      
      // Delete the scene heading and all its content
      for (let i = 0; i < nodesToDelete; i++) {
        Transforms.removeNodes(editor, { at: [nodeIndex] })
      }
      
      // If we deleted everything, add a default action node
      if (value.length === nodesToDelete) {
        Transforms.insertNodes(editor, {
          type: 'action',
          children: [{ text: '' }],
        }, { at: [0] })
      }
      
      console.log(`Deleted scene with ${nodesToDelete} nodes`)
    } catch (error) {
      console.error('Error deleting scene:', error)
    }
  }, [editor, value])

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(() => {
    if (sceneToDelete) {
      performSceneDeletion(sceneToDelete)
    }
    setShowDeleteDialog(false)
    setSceneToDelete(null)
  }, [sceneToDelete, performSceneDeletion])

  // Handle delete cancel
  const handleDeleteCancel = useCallback(() => {
    setShowDeleteDialog(false)
    setSceneToDelete(null)
  }, [])

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
      // Calculate scene number
      let sceneNumber = 1
      const path = ReactEditor.findPath(editor, element)
      const nodeIndex = path[0]
      
      // Count how many scene headings come before this one
      for (let i = 0; i < nodeIndex; i++) {
        const node = value[i]
        if (SlateElement.isElement(node) && node.type === 'scene-heading') {
          sceneNumber++
        }
      }
      
      return (
        <div className="relative">
          {/* Scene separator - horizontal rule before scene heading (skip for first scene) */}
          {sceneNumber > 1 && (
            <div 
              contentEditable={false}
              className="mb-8 mt-12 flex items-center gap-4 select-none pointer-events-none"
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                <span>SCENE {sceneNumber}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>
          )}
          
          <div 
            {...attributes} 
            style={{
              ...style,
              borderBottom: undefined, // Remove from inline style
            }} 
            className="outline-none relative group border-b-2 border-primary/20 bg-primary/5 pl-8 pr-2 py-1 rounded-sm"
          >
            {/* Delete button */}
            <button
              contentEditable={false}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                deleteSceneHeading(customElement)
              }}
              className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
              title="Delete scene"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            
            {isEmpty && (
              <span
                contentEditable={false}
                className="absolute left-8 top-1 pointer-events-none text-muted-foreground/50 select-none"
              >
                INT. LOCATION - DAY (use Tab to navigate)
              </span>
            )}
            {children}
          </div>
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
  }, [getPlaceholderForElement, editor, value, deleteSceneHeading])

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
        
        // New format: INT. LOCATION - TIME (no hyphen between format and location)
        if (parts.length === 1) {
          // Either selecting format or location
          const formatMatch = parts[0].match(/^(INT\.?|EXT\.?|INT\.?\/EXT\.?|EXT\.?\/INT\.?)$/i)
          const hasFormatWithLocation = parts[0].match(/^(INT\.?|EXT\.?|INT\.?\/EXT\.?|EXT\.?\/INT\.?)\s+(.+)$/i)
          
          if (formatMatch) {
            // Selected format - add the format with period and space
            const format = option.endsWith('.') ? option + ' ' : option + '. '
            newText = format
          } else if (hasFormatWithLocation) {
            // Has format and partial location - replace with selected location and add separator
            const format = hasFormatWithLocation[1].trim()
            newText = `${format} ${option} - `
          } else {
            // Just typing format - add period and space
            const format = option.endsWith('.') ? option + ' ' : option + '. '
            newText = format
          }
        } else if (parts.length === 2) {
          // Selecting time of day - complete the scene heading
          newText = `${parts[0]} - ${option}`
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
                
                // Extract format (INT./EXT.) and location
                const match = trimmed.match(/^((?:INT|EXT|INT\.?\/EXT|EXT\.?\/INT)\.?\s*)(.*)$/i)
                if (match && match[2]) {
                  // Have both format and location
                  const format = match[1].trim().toUpperCase()
                  const location = match[2].trim().toUpperCase()
                  
                  // Format: INT. LOCATION - (ready for time of day)
                  const newText = `${format} ${location} - `
                  Transforms.delete(editor, { at: path })
                  Transforms.insertNodes(editor, {
                    type: 'scene-heading',
                    children: [{ text: newText }],
                  }, { at: path })
                  // Move cursor to end
                  setTimeout(() => {
                    Transforms.select(editor, Editor.end(editor, path))
                  }, 0)
                } else {
                  // Just format, no location yet
                  return
                }
              }
              // Note: With new format (INT. LOCATION - TIME), if parts.length === 2,
              // we already have the full structure, so Tab does nothing special here
              
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

  // Reorder scenes via drag and drop
  const reorderScenes = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    
    setIsReordering(true)
    
    // Use setTimeout to ensure UI updates
    setTimeout(() => {
      try {
        console.log(`Reordering scene from index ${fromIndex} to ${toIndex}`)
        
        // Get the scene heading nodes and their positions
        const sceneNodes: Array<{ node: CustomElement; position: number }> = []
        value.forEach((node, index) => {
          if (SlateElement.isElement(node) && node.type === 'scene-heading') {
            sceneNodes.push({ node: node as CustomElement, position: index })
          }
        })
        
        console.log(`Found ${sceneNodes.length} scenes`)
        
        if (fromIndex < 0 || fromIndex >= sceneNodes.length || toIndex < 0 || toIndex >= sceneNodes.length) {
          console.log('Invalid indices')
          setIsReordering(false)
          return
        }
        
        // Find the start and end of each scene
        const getSceneContent = (sceneIndex: number) => {
          const startPos = sceneNodes[sceneIndex].position
          const endPos = sceneIndex + 1 < sceneNodes.length 
            ? sceneNodes[sceneIndex + 1].position 
            : value.length
          return { start: startPos, end: endPos, nodes: value.slice(startPos, endPos) }
        }
        
        const fromSceneContent = getSceneContent(fromIndex)
        console.log(`From scene: lines ${fromSceneContent.start} to ${fromSceneContent.end}, nodes: ${fromSceneContent.nodes.length}`)
        
        // Collect all scenes
        const allScenes = sceneNodes.map((_, idx) => getSceneContent(idx))
        
        // Create new order
        const newOrder = [...allScenes]
        const [movedScene] = newOrder.splice(fromIndex, 1)
        newOrder.splice(toIndex, 0, movedScene)
        
        // Build the new value from reordered scenes
        const newValue: Descendant[] = []
        newOrder.forEach(scene => {
          // Simply copy all nodes from each scene - they already have correct structure
          newValue.push(...scene.nodes)
        })
        
        console.log(`Old length: ${value.length}, New length: ${newValue.length}`)
        
        // Validate the new value has at least some content
        if (newValue.length === 0) {
          console.error('New value is empty, aborting reorder')
          setIsReordering(false)
          return
        }
        
        // Replace all children in the Slate editor by directly setting children
        // This avoids path errors when deleting/inserting nodes
        editor.children = newValue as any[]
        
        // Normalize the editor to ensure it's in a valid state
        Editor.normalize(editor, { force: true })
        
        // Trigger a re-render
        editor.onChange()
        
        console.log('Scene reordering complete')
        
        // Update state to keep in sync
        setValue(newValue)
        
        setIsReordering(false)
      } catch (error) {
        console.error('Error reordering scenes:', error)
        setIsReordering(false)
      }
    }, 100)
  }, [value, editor])

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
        {/* Scene Outliner with Resizable Panel */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Show outliner only in editor mode (not Characters/Locations/Help) and when showOutliner is true */}
          {showOutliner && !showCharacters && !showLocations && !showHelp && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="m-2">
                <Card className="h-full p-0 overflow-hidden flex flex-col border">
                <div className="p-3 border-b bg-muted/30 flex items-center justify-between flex-shrink-0">
                  <h3 className="font-semibold text-sm">Scene Outliner</h3>
                  <p className="text-xs text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-1.5 space-y-0.5">
                {scenes.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No scenes yet. Type a scene heading to get started.
                  </p>
                ) : (
                  scenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      draggable
                      onDragStart={() => {
                        setDraggedSceneIndex(index)
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOverSceneIndex(index)
                      }}
                      onDragLeave={() => {
                        setDragOverSceneIndex(null)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (draggedSceneIndex !== null && draggedSceneIndex !== index) {
                          reorderScenes(draggedSceneIndex, index)
                        }
                        setDraggedSceneIndex(null)
                        setDragOverSceneIndex(null)
                      }}
                      onDragEnd={() => {
                        setDraggedSceneIndex(null)
                        setDragOverSceneIndex(null)
                      }}
                      onClick={() => navigateToScene(scene.lineNumber)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 rounded hover:bg-accent text-sm transition-all duration-200 cursor-move",
                        draggedSceneIndex === index && "opacity-50 scale-95",
                        dragOverSceneIndex === index && draggedSceneIndex !== index && "border-2 border-primary bg-primary/10"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-xs text-foreground truncate uppercase font-semibold leading-tight">
                            {scene.text.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
          </Card>
              </ResizablePanel>
        
              <ResizableHandle withHandle />
            </>
          )}
        
          <ResizablePanel 
            defaultSize={showOutliner && !showCharacters && !showLocations && !showHelp ? 80 : 100} 
            minSize={60}
          >
          <div className={`h-full flex flex-col overflow-hidden ${(showCharacters || showLocations || showHelp) ? '' : 'm-2 gap-2'}`}>
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
                    <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Tab</kbd> for Transition or <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> to return to Dialogue</span>
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
                                          a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_characters.json`
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
                                      
                                      <button
                                        onClick={() => {
                                          const text = characterDetails.map((character) => {
                                            const profile = characterProfiles[character.name] || 'No profile'
                                            const type = characterTypes[character.name] || 'Not Mentioned'
                                            return `CHARACTER: ${character.name}\nType: ${type}\nAppearances: ${character.appearances}\nScenes: ${character.scenes.join(', ')}\nProfile: ${profile}\n\nDialogue Lines:\n${character.dialogues.map((d, i) => `  ${i + 1}. (Line ${d.lineNumber}) ${d.text}`).join('\n')}\n\n${'='.repeat(80)}\n`
                                          }).join('\n')
                                          
                                          const blob = new Blob([text], { type: 'text/plain' })
                                          const url = URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_characters.txt`
                                          document.body.appendChild(a)
                                          a.click()
                                          document.body.removeChild(a)
                                          URL.revokeObjectURL(url)
                                          setShowCharacterExportMenu(false)
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                      >
                                        <FileDown className="h-3.5 w-3.5" />
                                        Text File (.txt)
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          const csv = [
                                            ['Name', 'Type', 'Appearances', 'Scenes', 'Profile'],
                                            ...characterDetails.map((character) => [
                                              character.name,
                                              characterTypes[character.name] || 'Not Mentioned',
                                              character.appearances.toString(),
                                              character.scenes.join('; '),
                                              (characterProfiles[character.name] || 'No profile').replace(/,/g, ';')
                                            ])
                                          ].map(row => row.join(',')).join('\n')
                                          
                                          const blob = new Blob([csv], { type: 'text/csv' })
                                          const url = URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_characters.csv`
                                          document.body.appendChild(a)
                                          a.click()
                                          document.body.removeChild(a)
                                          URL.revokeObjectURL(url)
                                          setShowCharacterExportMenu(false)
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                      >
                                        <FileDown className="h-3.5 w-3.5" />
                                        CSV File (.csv)
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          import('jspdf').then(({ jsPDF }) => {
                                            const doc = new jsPDF()
                                            const margin = 20
                                            let yPosition = margin
                                            
                                            // Title
                                            doc.setFontSize(18)
                                            doc.setFont('helvetica', 'bold')
                                            doc.text(`${screenplayTitle} - Characters`, margin, yPosition)
                                            yPosition += 15
                                            
                                            doc.setFontSize(10)
                                            doc.setFont('helvetica', 'normal')
                                            
                                            characterDetails.forEach((character) => {
                                              // Check if we need a new page
                                              if (yPosition > 270) {
                                                doc.addPage()
                                                yPosition = margin
                                              }
                                              
                                              doc.setFont('helvetica', 'bold')
                                              doc.text(`${character.name}`, margin, yPosition)
                                              yPosition += 6
                                              
                                              doc.setFont('helvetica', 'normal')
                                              const type = characterTypes[character.name] || 'Not Mentioned'
                                              doc.text(`Type: ${type}`, margin + 5, yPosition)
                                              yPosition += 5
                                              doc.text(`Appearances: ${character.appearances}`, margin + 5, yPosition)
                                              yPosition += 5
                                              doc.text(`Scenes: ${character.scenes.join(', ')}`, margin + 5, yPosition)
                                              yPosition += 5
                                              
                                              const profile = characterProfiles[character.name] || 'No profile'
                                              const profileLines = doc.splitTextToSize(`Profile: ${profile}`, 170)
                                              doc.text(profileLines, margin + 5, yPosition)
                                              yPosition += profileLines.length * 5 + 5
                                            })
                                            
                                            doc.save(`${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_characters.pdf`)
                                            setShowCharacterExportMenu(false)
                                          })
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                      >
                                        <FileDown className="h-3.5 w-3.5" />
                                        PDF Document (.pdf)
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
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div>
                                          {character.type && character.profile ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                          ) : (
                                            <XCircle className="h-3.5 w-3.5 text-yellow-500" />
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{character.type && character.profile ? 'Profile Complete' : 'Character Profile Incomplete'}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
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
                                        <SelectItem value="Protagonist">Protagonist</SelectItem>
                                        <SelectItem value="Antagonist">Antagonist</SelectItem>
                                        <SelectItem value="Supporting">Supporting</SelectItem>
                                        <SelectItem value="Minor">Minor</SelectItem>
                                        <SelectItem value="Cameo">Cameo</SelectItem>
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
                                          a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_locations.json`
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
                                      
                                      <button
                                        onClick={() => {
                                          const text = locations.map((location) => {
                                            const description = locationProfiles[location.name] || 'No description'
                                            const timeOfDayStr = Object.entries(location.timeOfDay)
                                              .map(([time, count]) => `${time}: ${count}x`)
                                              .join(', ')
                                            return `LOCATION: ${location.name}\nTotal Scenes: ${location.scenes.length}\nScene Numbers: ${location.scenes.join(', ')}\nTime of Day: ${timeOfDayStr}\nDescription: ${description}\n\n${'='.repeat(80)}\n`
                                          }).join('\n')
                                          
                                          const blob = new Blob([text], { type: 'text/plain' })
                                          const url = URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_locations.txt`
                                          document.body.appendChild(a)
                                          a.click()
                                          document.body.removeChild(a)
                                          URL.revokeObjectURL(url)
                                          setShowLocationExportMenu(false)
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                      >
                                        <FileDown className="h-3.5 w-3.5" />
                                        Text File (.txt)
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          const csv = [
                                            ['Name', 'Total Scenes', 'Scene Numbers', 'Time of Day', 'Description'],
                                            ...locations.map((location) => [
                                              location.name,
                                              location.scenes.length.toString(),
                                              location.scenes.join('; '),
                                              Object.entries(location.timeOfDay).map(([time, count]) => `${time}:${count}`).join('; '),
                                              (locationProfiles[location.name] || 'No description').replace(/,/g, ';')
                                            ])
                                          ].map(row => row.join(',')).join('\n')
                                          
                                          const blob = new Blob([csv], { type: 'text/csv' })
                                          const url = URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_locations.csv`
                                          document.body.appendChild(a)
                                          a.click()
                                          document.body.removeChild(a)
                                          URL.revokeObjectURL(url)
                                          setShowLocationExportMenu(false)
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                      >
                                        <FileDown className="h-3.5 w-3.5" />
                                        CSV File (.csv)
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          import('jspdf').then(({ jsPDF }) => {
                                            const doc = new jsPDF()
                                            const margin = 20
                                            let yPosition = margin
                                            
                                            // Title
                                            doc.setFontSize(18)
                                            doc.setFont('helvetica', 'bold')
                                            doc.text(`${screenplayTitle} - Locations`, margin, yPosition)
                                            yPosition += 15
                                            
                                            doc.setFontSize(10)
                                            doc.setFont('helvetica', 'normal')
                                            
                                            locations.forEach((location) => {
                                              // Check if we need a new page
                                              if (yPosition > 270) {
                                                doc.addPage()
                                                yPosition = margin
                                              }
                                              
                                              doc.setFont('helvetica', 'bold')
                                              doc.text(`${location.name}`, margin, yPosition)
                                              yPosition += 6
                                              
                                              doc.setFont('helvetica', 'normal')
                                              doc.text(`Total Scenes: ${location.scenes.length}`, margin + 5, yPosition)
                                              yPosition += 5
                                              doc.text(`Scene Numbers: ${location.scenes.join(', ')}`, margin + 5, yPosition)
                                              yPosition += 5
                                              
                                              const timeOfDayStr = Object.entries(location.timeOfDay)
                                                .map(([time, count]) => `${time}: ${count}x`)
                                                .join(', ')
                                              doc.text(`Time of Day: ${timeOfDayStr}`, margin + 5, yPosition)
                                              yPosition += 5
                                              
                                              const description = locationProfiles[location.name] || 'No description'
                                              const descLines = doc.splitTextToSize(`Description: ${description}`, 170)
                                              doc.text(descLines, margin + 5, yPosition)
                                              yPosition += descLines.length * 5 + 5
                                            })
                                            
                                            doc.save(`${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_locations.pdf`)
                                            setShowLocationExportMenu(false)
                                          })
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                      >
                                        <FileDown className="h-3.5 w-3.5" />
                                        PDF Document (.pdf)
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
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div>
                                          {location.description ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                          ) : (
                                            <XCircle className="h-3.5 w-3.5 text-yellow-500" />
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{location.description ? 'Profile Complete' : 'Location Profile Incomplete'}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
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
                <div className="p-8 pb-16 max-w-5xl mx-auto">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-4">How to Write a Screenplay from Scratch</h2>
                      <p className="text-muted-foreground mb-6">
                        A complete beginner's guide to professional screenplay writing. This editor helps you format your screenplay automatically using industry-standard formatting.
                      </p>
                    </div>

                    {/* What is a Screenplay */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">What is a Screenplay?</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm">
                          A screenplay (also called a script) is the written blueprint for a film or TV show. It describes everything that will appear on screen: what characters say, what they do, where scenes take place, and how the story unfolds.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Unlike a novel, a screenplay is meant to be visual and concise. You're writing what the <strong>audience will see and hear</strong>, not what characters think or feel internally. Every page of a properly formatted screenplay equals approximately one minute of screen time.
                        </p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Step 1: Scene Headings */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Step 1: Start with a Scene Heading</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm font-semibold">What is a Scene Heading?</p>
                        <p className="text-sm">
                          A scene heading (also called a "slug line") tells us <strong>where</strong> and <strong>when</strong> the scene takes place. It's always in ALL CAPS and appears at the start of every new scene.
                        </p>
                        <div className="mt-3 p-3 bg-background rounded border-l-4 border-primary">
                          <p className="text-sm font-mono font-bold">Format: INT./EXT. LOCATION - TIME OF DAY</p>
                        </div>
                        <div className="space-y-2 mt-3">
                          <p className="text-sm"><strong>INT.</strong> = Interior (indoors)</p>
                          <p className="text-sm"><strong>EXT.</strong> = Exterior (outdoors)</p>
                          <p className="text-sm"><strong>INT./EXT.</strong> = Scene moves between interior and exterior</p>
                        </div>
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Examples:</p>
                          <div className="space-y-1 font-mono text-xs">
                            <p>INT. COFFEE SHOP - DAY</p>
                            <p>EXT. CITY STREET - NIGHT</p>
                            <p>INT. BEDROOM - MORNING</p>
                            <p>INT./EXT. CAR - SUNSET</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-sm font-semibold">🎬 How to Create:</p>
                          <p className="text-sm mt-2">1. Type "INT. " or "EXT. " in an action line - it auto-converts to a scene heading!</p>
                          <p className="text-sm">2. Press Tab to move through: Scene Type → Location → Time of Day</p>
                          <p className="text-sm">3. Press Enter when done to start writing action</p>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Action Lines */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Step 2: Write Action Lines</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm font-semibold">What are Action Lines?</p>
                        <p className="text-sm">
                          Action lines describe what's happening on screen - what we SEE and HEAR. This includes character movements, facial expressions, sounds, and anything visual. Write in <strong>present tense</strong>, as if it's happening right now.
                        </p>
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Example:</p>
                          <div className="space-y-2 text-sm font-mono">
                            <p>Sarah enters the dimly lit room, her eyes darting nervously.</p>
                            <p>She approaches the desk and picks up a dusty photograph.</p>
                            <p>Her hands tremble as she recognizes the face.</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <p className="text-sm font-semibold">💡 Tips:</p>
                          <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                            <li>Keep paragraphs short (2-4 lines max) for better pacing</li>
                            <li>Write what we SEE, not what characters think or feel</li>
                            <li>Use active, vivid language to create visual images</li>
                            <li>Don't describe camera angles (unless absolutely necessary)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Character Names and Dialogue */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Step 3: Add Character Dialogue</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm font-semibold">How to Write Dialogue</p>
                        <p className="text-sm">
                          When a character speaks, first write their name in ALL CAPS (centered), then their dialogue on the next line.
                        </p>
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Example:</p>
                          <div className="space-y-2 text-sm font-mono text-center">
                            <p className="font-bold">SARAH</p>
                            <p>I've been looking for this for years.</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-sm font-semibold">🎬 How to Create:</p>
                          <p className="text-sm mt-2">1. From an action line, press Tab - it converts to a character name</p>
                          <p className="text-sm">2. Type the character's name (it will auto-capitalize)</p>
                          <p className="text-sm">3. Press Enter to move to dialogue</p>
                          <p className="text-sm">4. Type what the character says</p>
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Parentheticals */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Step 4: Use Parentheticals (Optional)</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm font-semibold">What are Parentheticals?</p>
                        <p className="text-sm">
                          Parentheticals (also called "wrylies") are brief directions that tell the actor <strong>how</strong> to deliver a line. They appear in parentheses below the character name, before the dialogue.
                        </p>
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Example:</p>
                          <div className="space-y-1 text-sm font-mono text-center">
                            <p className="font-bold">SARAH</p>
                            <p className="italic">(whispering)</p>
                            <p>We need to get out of here.</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-sm font-semibold">🎬 How to Create:</p>
                          <p className="text-sm mt-2">While in dialogue, press Tab → adds a parenthetical</p>
                          <p className="text-sm">Press Enter to return to dialogue</p>
                        </div>
                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <p className="text-sm font-semibold">💡 When to Use:</p>
                          <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                            <li>When tone isn't clear from dialogue: (sarcastic), (angry), (crying)</li>
                            <li>For physical actions during speech: (stands up), (looks away)</li>
                            <li>Use sparingly - trust your actors to interpret the lines!</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Step 5: Transitions */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Step 5: Add Transitions Between Scenes</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm font-semibold">What are Transitions?</p>
                        <p className="text-sm">
                          Transitions tell us how one scene ends and the next begins. They're written in ALL CAPS and appear on the right side of the page. Most modern screenplays use them sparingly.
                        </p>
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Common Transitions:</p>
                          <div className="space-y-1 text-sm font-mono">
                            <p>CUT TO:</p>
                            <p>FADE OUT.</p>
                            <p>DISSOLVE TO:</p>
                            <p>SMASH CUT TO:</p>
                            <p>MATCH CUT TO:</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-sm font-semibold">🎬 How to Create:</p>
                          <p className="text-sm mt-2">From a parenthetical, press Tab → creates a transition</p>
                          <p className="text-sm">Type the transition (e.g., "CUT TO:")</p>
                          <p className="text-sm">Press Enter to start a new action line</p>
                        </div>
                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <p className="text-sm font-semibold">💡 Pro Tip:</p>
                          <p className="text-sm mt-2">
                            Modern screenplays rarely use transitions. The default "CUT TO:" is assumed between every scene. Only use them for special effects like FADE OUT, DISSOLVE, or SMASH CUT.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Complete Workflow Example */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Complete Workflow: Writing Your First Scene</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-4">
                        <p className="text-sm font-semibold">Follow these steps to write a complete scene:</p>
                        
                        <div className="space-y-3">
                          <div className="p-3 bg-background rounded border-l-4 border-blue-500">
                            <p className="text-sm font-semibold">1️⃣ Create Scene Heading</p>
                            <p className="text-xs text-muted-foreground mt-1">Type "INT. " - editor auto-converts to scene heading</p>
                            <p className="text-xs text-muted-foreground">Press Tab to add location, Tab again for time</p>
                            <p className="text-xs font-mono mt-2">Example: INT. DETECTIVE'S OFFICE - NIGHT</p>
                          </div>

                          <div className="p-3 bg-background rounded border-l-4 border-green-500">
                            <p className="text-sm font-semibold">2️⃣ Write Action</p>
                            <p className="text-xs text-muted-foreground mt-1">Press Enter after scene heading</p>
                            <p className="text-xs text-muted-foreground">Describe what we see happening</p>
                            <p className="text-xs font-mono mt-2">Example: Detective Morgan sits at his desk, reviewing case files.</p>
                          </div>

                          <div className="p-3 bg-background rounded border-l-4 border-purple-500">
                            <p className="text-sm font-semibold">3️⃣ Add Character</p>
                            <p className="text-xs text-muted-foreground mt-1">Press Tab from action line</p>
                            <p className="text-xs text-muted-foreground">Type character name (auto-capitalizes)</p>
                            <p className="text-xs font-mono mt-2">Example: MORGAN</p>
                          </div>

                          <div className="p-3 bg-background rounded border-l-4 border-orange-500">
                            <p className="text-sm font-semibold">4️⃣ Write Dialogue</p>
                            <p className="text-xs text-muted-foreground mt-1">Press Enter after character name</p>
                            <p className="text-xs text-muted-foreground">Type what the character says</p>
                            <p className="text-xs font-mono mt-2">Example: Something doesn't add up here.</p>
                          </div>

                          <div className="p-3 bg-background rounded border-l-4 border-pink-500">
                            <p className="text-sm font-semibold">5️⃣ Add Parenthetical (Optional)</p>
                            <p className="text-xs text-muted-foreground mt-1">While in dialogue, press Tab</p>
                            <p className="text-xs text-muted-foreground">Type actor direction</p>
                            <p className="text-xs font-mono mt-2">Example: (looking up)</p>
                          </div>

                          <div className="p-3 bg-background rounded border-l-4 border-red-500">
                            <p className="text-sm font-semibold">6️⃣ Continue Scene</p>
                            <p className="text-xs text-muted-foreground mt-1">Press Enter from dialogue → returns to action</p>
                            <p className="text-xs text-muted-foreground">Continue describing what happens next</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Keyboard Shortcuts Reference */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Keyboard Shortcuts Reference</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        The editor automatically formats your screenplay as you type. Here are all the shortcuts:
                      </p>
                      <div className="space-y-2">
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

                    {/* Element Types Detailed */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">All Element Types Explained</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-sm">1</span>
                            </div>
                            <div className="flex-1">
                              <strong className="text-base">Scene Heading (Slug Line)</strong>
                              <p className="text-sm text-muted-foreground mt-1">
                                Format: INT./EXT. LOCATION - TIME
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Style: ALL CAPS, left-aligned, bold
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Purpose: Establishes where and when the scene takes place
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-sm">2</span>
                            </div>
                            <div className="flex-1">
                              <strong className="text-base">Action</strong>
                              <p className="text-sm text-muted-foreground mt-1">
                                Format: Normal sentence case
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Style: Left-aligned, regular text
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Purpose: Describes visual action, sounds, and events on screen
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-sm">3</span>
                            </div>
                            <div className="flex-1">
                              <strong className="text-base">Character Name</strong>
                              <p className="text-sm text-muted-foreground mt-1">
                                Format: ALL CAPS
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Style: Centered, appears above dialogue
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Purpose: Identifies who is speaking
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-sm">4</span>
                            </div>
                            <div className="flex-1">
                              <strong className="text-base">Dialogue</strong>
                              <p className="text-sm text-muted-foreground mt-1">
                                Format: Normal sentence case
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Style: Centered (narrower column than action)
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Purpose: The words spoken by the character
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-sm">5</span>
                            </div>
                            <div className="flex-1">
                              <strong className="text-base">Parenthetical</strong>
                              <p className="text-sm text-muted-foreground mt-1">
                                Format: (lowercase in parentheses)
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Style: Centered, italicized, within dialogue
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Purpose: Brief acting direction for line delivery
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-sm">6</span>
                            </div>
                            <div className="flex-1">
                              <strong className="text-base">Transition</strong>
                              <p className="text-sm text-muted-foreground mt-1">
                                Format: ALL CAPS with colon
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Style: Right-aligned
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Purpose: Indicates special scene transitions (use rarely)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Using the Scene Outliner */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Using the Scene Outliner</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm">
                          The Scene Outliner (left panel) shows all your scenes at a glance. It helps you navigate and organize your screenplay.
                        </p>
                        <div className="mt-3 space-y-2">
                          <p className="text-sm"><strong>Click any scene</strong> to jump to it in the editor</p>
                          <p className="text-sm"><strong>Drag and drop scenes</strong> to reorder them</p>
                          <p className="text-sm"><strong>Click the ✗ button</strong> on a scene to delete it</p>
                          <p className="text-sm"><strong>Toggle Outliner button</strong> to show/hide the outliner for more writing space</p>
                          <p className="text-sm"><strong>Scene numbers</strong> update automatically as you add or remove scenes</p>
                        </div>
                      </div>
                    </div>

                    {/* Managing Characters */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Managing Characters</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm">
                          Click the <strong>Characters</strong> tab to see all characters in your screenplay. The editor automatically detects characters when you write dialogue.
                        </p>
                        <div className="mt-3 space-y-3">
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">✓/✗ Completion Icons:</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              • <strong className="text-green-600">Green ✓</strong> = Character type selected AND profile filled<br/>
                              • <strong className="text-yellow-600">Yellow ✗</strong> = Missing type or profile
                            </p>
                          </div>
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">Character Types:</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Select the role: Protagonist, Antagonist, Supporting, Minor, or Cameo
                            </p>
                          </div>
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">Character Profile:</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Add backstory, personality traits, motivations, physical description, arc, etc.
                            </p>
                          </div>
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">Rename Characters:</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Click the character name to edit it. All instances in your screenplay update automatically.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Managing Locations */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Managing Locations</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm">
                          Click the <strong>Locations</strong> tab to see all locations from your scene headings. Locations are automatically extracted as you write.
                        </p>
                        <div className="mt-3 space-y-3">
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">✓/✗ Completion Icons:</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              • <strong className="text-green-600">Green ✓</strong> = Location description filled<br/>
                              • <strong className="text-yellow-600">Yellow ✗</strong> = Description missing
                            </p>
                          </div>
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">Location Descriptions:</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Add details about the location: atmosphere, visual details, mood, significance to the story, etc.
                            </p>
                          </div>
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">Time of Day Tracking:</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              See how many times each location appears at different times (Day, Night, etc.)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Export Options */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Exporting Your Screenplay</h3>
                      <div className="p-5 bg-muted/30 rounded-lg space-y-3">
                        <p className="text-sm">
                          When you're ready to share your screenplay, click the <strong>Export</strong> button in the editor.
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">📄 Text File (.txt)</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Professional screenplay format with proper spacing and title page. Includes "_draft" suffix.
                            </p>
                          </div>
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">📕 PDF Document (.pdf)</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Industry-standard PDF with title page, proper pagination, and professional formatting.
                            </p>
                          </div>
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">👥 Characters Export</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Export character list with profiles, types, and scene appearances in JSON, TXT, CSV, or PDF format.
                            </p>
                          </div>
                          <div className="p-3 bg-background rounded">
                            <p className="text-sm font-semibold">📍 Locations Export</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Export location list with descriptions and time-of-day tracking in JSON, TXT, CSV, or PDF format.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Pro Tips */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Professional Screenplay Tips</h3>
                      <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg space-y-4 border border-primary/20">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">✍️</span>
                            <div>
                              <p className="text-sm font-semibold">Show, Don't Tell</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Instead of "Sarah is nervous," write "Sarah's hands shake as she reaches for the door."
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="text-lg">🎬</span>
                            <div>
                              <p className="text-sm font-semibold">Less is More</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Keep action paragraphs short (2-4 lines). White space makes scripts easier to read and feels faster-paced.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="text-lg">💬</span>
                            <div>
                              <p className="text-sm font-semibold">Dialogue Should Sound Natural</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Read your dialogue out loud. People speak in contractions, interrupt each other, and rarely use perfect grammar.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="text-lg">⏱️</span>
                            <div>
                              <p className="text-sm font-semibold">One Page = One Minute</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Aim for 90-120 pages for a feature film. This equals roughly 90-120 minutes of screen time.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="text-lg">🎯</span>
                            <div>
                              <p className="text-sm font-semibold">Every Scene Must Have Purpose</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Each scene should either advance the plot, reveal character, or create mood. If it doesn't, consider cutting it.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="text-lg">💾</span>
                            <div>
                              <p className="text-sm font-semibold">Auto-Save is Enabled</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Your work saves automatically every 30 seconds. You can also press Ctrl/Cmd+S to save manually anytime.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Getting Started */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Ready to Start Writing?</h3>
                      <div className="p-5 bg-primary/10 rounded-lg border-2 border-primary/30">
                        <p className="text-sm font-semibold mb-3">🚀 Your First Steps:</p>
                        <ol className="text-sm space-y-2 list-decimal list-inside">
                          <li>Close this Help tab by clicking another tab (Editor, Characters, or Locations)</li>
                          <li>In the editor, type "INT. " to start your first scene heading</li>
                          <li>Follow the autocomplete suggestions or press Tab to fill in location and time</li>
                          <li>Press Enter to start writing action - describe what we see</li>
                          <li>Press Tab when a character needs to speak</li>
                          <li>Keep writing! The editor handles all the formatting for you</li>
                        </ol>
                        <p className="text-sm mt-4 text-muted-foreground italic">
                          Remember: Every great screenplay starts with a single scene. Just start writing and let the story unfold!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Editor Content
                <div className="p-8 max-w-4xl mx-auto relative">
                  {/* Loading overlay during scene reordering */}
                  {isReordering && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                      <div className="bg-card border rounded-lg p-6 shadow-lg flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm font-medium">Reordering scenes...</p>
                      </div>
                    </div>
                  )}
                  
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
          </ResizablePanel>
        </ResizablePanelGroup>
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

      {/* Delete Scene Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scene?</DialogTitle>
            <DialogDescription>
              This scene has content. Are you sure you want to delete it? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Scene
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

