"use client"

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { List, Users, MapPin, Keyboard } from 'lucide-react'

interface EditorToolbarProps {
  showCharacters: boolean
  showLocations: boolean
  showHelp: boolean
  showOutliner: boolean
  currentElementType: string
  scenesCount: number
  charactersCount: number
  onToggleOutliner: () => void
  onShowCharacters: () => void
  onShowLocations: () => void
  onShowHelp: () => void
}

export function EditorToolbar({
  showCharacters,
  showLocations,
  showHelp,
  showOutliner,
  currentElementType,
  scenesCount,
  charactersCount,
  onToggleOutliner,
  onShowCharacters,
  onShowLocations,
  onShowHelp
}: EditorToolbarProps) {
  const isInSpecialView = showCharacters || showLocations || showHelp

  return (
    <div className="border-b bg-card p-2 flex items-center gap-1 flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleOutliner}
        title={isInSpecialView ? "Return to Editor" : "Toggle Outliner"}
        className="h-7 px-2 text-xs"
      >
        <List className="h-3 w-3 mr-1" />
        {isInSpecialView ? 'Editor' : 'Outliner'}
      </Button>
      
      <Separator orientation="vertical" className="h-4" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onShowCharacters}
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
        onClick={onShowLocations}
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
        onClick={onShowHelp}
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
          {scenesCount} scenes • {charactersCount} characters • Auto-save enabled
        </span>
      </div>
    </div>
  )
}

