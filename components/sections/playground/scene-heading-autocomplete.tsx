"use client"

import { useState, useEffect, useRef } from 'react'

export interface SceneHeadingPart {
  format: string // INT, EXT, INT./EXT.
  location: string
  timeOfDay: string // DAY, NIGHT, etc.
}

export interface SceneHeadingAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  style?: React.CSSProperties
  className?: string
}

const FORMAT_OPTIONS = ['INT.', 'EXT.', 'INT./EXT.', 'EXT./INT.']
const TIME_OPTIONS = [
  'DAY',
  'NIGHT',
  'DAWN',
  'DUSK',
  'MORNING',
  'AFTERNOON',
  'EVENING',
  'CONTINUOUS',
  'LATER',
  'SAME TIME',
  'MOMENTS LATER',
]

const COMMON_LOCATIONS = [
  'COFFEE SHOP',
  'APARTMENT',
  'BEDROOM',
  'LIVING ROOM',
  'KITCHEN',
  'OFFICE',
  'STREET',
  'CAR',
  'RESTAURANT',
  'BAR',
  'HOSPITAL',
  'SCHOOL',
  'PARK',
  'HOTEL ROOM',
  'BATHROOM',
]

export function parseSceneHeading(text: string): SceneHeadingPart {
  const parts = text.split(/\s+-\s+/)
  
  return {
    format: parts[0] || '',
    location: parts[1] || '',
    timeOfDay: parts[2] || '',
  }
}

export function formatSceneHeading(parts: SceneHeadingPart): string {
  const formatted: string[] = []
  
  if (parts.format) formatted.push(parts.format)
  if (parts.location) formatted.push(parts.location)
  if (parts.timeOfDay) formatted.push(parts.timeOfDay)
  
  return formatted.join(' - ')
}

export function SceneHeadingAutocomplete({
  value,
  onChange,
  onKeyDown,
  style,
  className,
}: SceneHeadingAutocompleteProps) {
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [activeField, setActiveField] = useState<'format' | 'location' | 'timeOfDay'>('format')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLDivElement>(null)
  
  const parts = parseSceneHeading(value)
  
  // Determine which field is being edited based on cursor position
  useEffect(() => {
    if (!value) {
      setActiveField('format')
      return
    }
    
    const formatEnd = parts.format.length
    const locationStart = formatEnd + (parts.format ? 3 : 0) // " - "
    const locationEnd = locationStart + parts.location.length
    const timeStart = locationEnd + (parts.location ? 3 : 0) // " - "
    
    // Simple heuristic: if we have format but no location, editing location
    if (parts.format && !parts.location) {
      setActiveField('location')
    } else if (parts.format && parts.location && !parts.timeOfDay) {
      setActiveField('timeOfDay')
    } else if (!parts.format) {
      setActiveField('format')
    }
  }, [value, parts])
  
  const getAutocompleteOptions = (): string[] => {
    switch (activeField) {
      case 'format':
        return FORMAT_OPTIONS.filter(opt => 
          opt.toLowerCase().includes(parts.format.toLowerCase())
        )
      case 'location':
        return COMMON_LOCATIONS.filter(opt =>
          opt.toLowerCase().includes(parts.location.toLowerCase())
        )
      case 'timeOfDay':
        return TIME_OPTIONS.filter(opt =>
          opt.toLowerCase().includes(parts.timeOfDay.toLowerCase())
        )
      default:
        return []
    }
  }
  
  const options = getAutocompleteOptions()
  
  const handleTabKey = (e: React.KeyboardEvent) => {
    e.preventDefault()
    
    // Tab moves between fields in scene heading
    if (activeField === 'format' && parts.format) {
      // Move to location
      const newValue = `${parts.format} - ${parts.location || ''}`
      onChange(newValue)
      setActiveField('location')
    } else if (activeField === 'location' && parts.location) {
      // Move to time of day
      const newValue = `${parts.format} - ${parts.location} - ${parts.timeOfDay || ''}`
      onChange(newValue)
      setActiveField('timeOfDay')
    }
  }
  
  const handleSelect = (option: string) => {
    const newParts = { ...parts }
    
    switch (activeField) {
      case 'format':
        newParts.format = option
        onChange(`${option} - `)
        setActiveField('location')
        break
      case 'location':
        newParts.location = option
        onChange(formatSceneHeading(newParts) + ' - ')
        setActiveField('timeOfDay')
        break
      case 'timeOfDay':
        newParts.timeOfDay = option
        onChange(formatSceneHeading(newParts))
        setShowAutocomplete(false)
        break
    }
    
    setSelectedIndex(0)
  }
  
  const handleKeyDownInternal = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      handleTabKey(e)
      return
    }
    
    if (showAutocomplete && options.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % options.length)
        return
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + options.length) % options.length)
        return
      }
      
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSelect(options[selectedIndex])
        return
      }
      
      if (e.key === 'Escape') {
        e.preventDefault()
        setShowAutocomplete(false)
        return
      }
    }
    
    onKeyDown(e)
  }
  
  return (
    <div className="relative" style={style}>
      <div
        ref={inputRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => {
          onChange(e.currentTarget.textContent || '')
          setShowAutocomplete(true)
        }}
        onKeyDown={handleKeyDownInternal}
        onFocus={() => setShowAutocomplete(true)}
        onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
        className={className}
        style={{ minHeight: '1.5em' }}
      >
        {value}
      </div>
      
      {showAutocomplete && options.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[300px] bg-popover border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
          <div className="p-2 border-b text-xs text-muted-foreground">
            {activeField === 'format' && 'Select format (INT/EXT)'}
            {activeField === 'location' && 'Select or type location'}
            {activeField === 'timeOfDay' && 'Select time of day'}
          </div>
          {options.map((option, index) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-3 py-2 text-sm ${
                index === selectedIndex
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

