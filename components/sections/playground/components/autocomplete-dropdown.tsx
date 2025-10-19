"use client"

type ElementType = 'scene-heading' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition'

interface AutocompleteDropdownProps {
  show: boolean
  options: string[]
  selectedIndex: number
  position: { top: number; left: number } | null
  currentElementType: ElementType
  onSelect: (option: string) => void
  onHoverIndex: (index: number) => void
}

export function AutocompleteDropdown({
  show,
  options,
  selectedIndex,
  position,
  currentElementType,
  onSelect,
  onHoverIndex
}: AutocompleteDropdownProps) {
  if (!show || options.length === 0 || !position) {
    return null
  }

  return (
    <div 
      className="fixed bg-popover border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: '250px'
      }}
    >
      <div className="p-2 border-b text-xs text-muted-foreground bg-muted/30">
        {currentElementType === 'scene-heading' && '↑↓ Navigate | Enter Select | Esc Close'}
      </div>
      {options.map((option, index) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          onMouseEnter={() => onHoverIndex(index)}
          className={`w-full text-left px-3 py-2 text-sm font-semibold uppercase transition-colors ${
            index === selectedIndex
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

