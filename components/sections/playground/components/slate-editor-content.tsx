"use client"

import { Slate, Editable } from 'slate-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Descendant, Editor } from 'slate'
import { CustomElement, ScreenplayElementType } from '../screenplay-types'

interface SlateEditorContentProps {
  editor: Editor
  value: Descendant[]
  onValueChange: (value: Descendant[]) => void
  renderElement: (props: any) => JSX.Element
  renderLeaf: (props: any) => JSX.Element
  handleKeyDown: (event: React.KeyboardEvent) => void
  handleBlur: () => void
  getPlaceholderText: (elementType: ScreenplayElementType) => string
  currentElementType: ScreenplayElementType
  isReordering: boolean
  onSelectionChange: () => void
  showOutliner?: boolean
}

export function SlateEditorContent({
  editor,
  value,
  onValueChange,
  renderElement,
  renderLeaf,
  handleKeyDown,
  handleBlur,
  getPlaceholderText,
  currentElementType,
  isReordering,
  onSelectionChange,
  showOutliner = true
}: SlateEditorContentProps) {
  return (
    <Card className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        {/* Editor Content */}
        <div className="p-8 relative flex justify-center">
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
            onValueChange={onValueChange}
            onSelectionChange={onSelectionChange}
          >
            <div 
              className="bg-white shadow-lg border rounded-sm overflow-hidden transition-all duration-300" 
              style={{ 
                width: showOutliner ? '8.5in' : '11in', 
                maxWidth: '100%',
                transform: showOutliner ? 'scale(1)' : 'scale(1.15)',
                transformOrigin: 'top center',
                backgroundColor: 'white',
                color: 'black'
              }}
            >
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={getPlaceholderText(currentElementType)}
                className="outline-none min-h-[600px] font-mono leading-relaxed [&>div[data-slate-placeholder]]:text-muted-foreground/60 [&>div[data-slate-placeholder]]:italic"
                style={{ 
                  fontSize: showOutliner ? '14px' : '16px',
                  padding: showOutliner ? '64px' : '80px',
                  color: 'black',
                  backgroundColor: 'white'
                }}
                spellCheck
                autoFocus
              />
            </div>
          </Slate>
        </div>
      </ScrollArea>
    </Card>
  )
}
