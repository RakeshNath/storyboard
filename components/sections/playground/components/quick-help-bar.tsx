"use client"

import { Card } from '@/components/ui/card'

type ElementType = 'scene-heading' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition'

interface QuickHelpBarProps {
  currentElementType: ElementType
}

export function QuickHelpBar({ currentElementType }: QuickHelpBarProps) {
  const getHelpText = () => {
    switch (currentElementType) {
      case 'scene-heading':
        return (
          <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> to add Action</span>
        )
      case 'action':
        return (
          <span>
            <kbd className="px-1.5 py-0.5 bg-background rounded border">Tab</kbd> for Character | 
            <kbd className="px-1.5 py-0.5 bg-background rounded border ml-1">Shift+Tab</kbd> for Scene Heading | 
            Type <kbd className="px-1.5 py-0.5 bg-background rounded border ml-1">INT.</kbd> or <kbd className="px-1.5 py-0.5 bg-background rounded border">EXT.</kbd> to auto-convert
          </span>
        )
      case 'character':
        return (
          <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> to add Dialogue</span>
        )
      case 'dialogue':
        return (
          <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Tab</kbd> for Parenthetical or <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> for Action</span>
        )
      case 'parenthetical':
        return (
          <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Tab</kbd> for Transition or <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> to return to Dialogue</span>
        )
      case 'transition':
        return (
          <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd> to add Action</span>
        )
      default:
        return null
    }
  }

  return (
    <Card className="flex-1 px-3 py-1 bg-muted/30 min-w-[300px] flex items-center">
      <div className="flex items-center gap-3 text-xs w-full leading-none">
        <span className="font-semibold text-[10px]">Quick Actions:</span>
        {getHelpText()}
      </div>
    </Card>
  )
}

