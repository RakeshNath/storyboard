"use client"

import { useCallback } from 'react'
import { Element as SlateElement, Node } from 'slate'
import { ReactEditor } from 'slate-react'
import { CustomElement } from '../screenplay-types'

interface SlateElementRendererProps {
  editor: any
  value: any[]
  onSceneDelete: (element: CustomElement) => void
  getPlaceholderForElement: (elementType: any) => string
  showOutliner?: boolean
}

export function useSlateElementRenderer({
  editor,
  value,
  onSceneDelete,
  getPlaceholderForElement,
  showOutliner = true
}: SlateElementRendererProps) {
  // Render element
  const renderElement = useCallback((props: any) => {
    const { attributes, children, element } = props
    const customElement = element as CustomElement
    
    // Check if element is empty for placeholder
    const isEmpty = Node.string(element).length === 0

    // Special handling for scene headings with delete button
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
            className={`outline-none relative group border-b-2 border-primary/20 bg-primary/5 rounded-sm text-left uppercase font-bold text-lg tracking-wider mb-4`}
            style={{
              paddingLeft: showOutliner ? '48px' : '60px',
              paddingRight: showOutliner ? '16px' : '20px',
              paddingTop: showOutliner ? '8px' : '10px',
              paddingBottom: showOutliner ? '8px' : '10px'
            }}
          >
            {/* Delete button */}
            <button
              contentEditable={false}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onSceneDelete(customElement)
              }}
              className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
              title="Delete scene"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {isEmpty && (
              <span
                contentEditable={false}
                className="absolute pointer-events-none text-muted-foreground/50 select-none"
                style={{
                  left: showOutliner ? '48px' : '60px',
                  top: showOutliner ? '8px' : '10px'
                }}
              >
                INT. LOCATION - DAY (use Tab to navigate)
              </span>
            )}
            {children}
          </div>
        </div>
      )
    }

    // Apply proper screenplay formatting based on element type
    // Scale margins and spacing based on outliner state
    const scaleFactor = showOutliner ? 1 : 1.2
    const baseMargin = 12
    const scaledMargin = Math.round(baseMargin * scaleFactor)
    
    let elementClasses = "outline-none relative"
    let placeholderClasses = "absolute left-0 top-0 pointer-events-none text-muted-foreground/50 select-none"
    
    switch (customElement.type) {
      case 'action':
        elementClasses += ` text-left mb-3 leading-relaxed text-gray-700`
        break
      case 'character':
        elementClasses += " text-center mb-1 font-semibold uppercase tracking-wide"
        placeholderClasses += " left-1/2 -translate-x-1/2"
        break
      case 'dialogue':
        elementClasses += ` mb-3 leading-relaxed text-gray-800`
        break
      case 'parenthetical':
        elementClasses += ` mb-1 text-sm italic`
        break
      case 'transition':
        elementClasses += " text-right mb-4 font-semibold uppercase tracking-wider"
        placeholderClasses += " right-0"
        break
      default:
        elementClasses += " text-left mb-2"
    }

    // Apply inline styles for proper screenplay formatting
    let inlineStyles: React.CSSProperties = {}
    let placeholderStyles: React.CSSProperties = {}
    
    if (customElement.type === 'dialogue') {
      // Industry standard: dialogue should be centered with wider margins
      inlineStyles = {
        margin: '0 auto', // Center the dialogue block
        maxWidth: '70%', // Smaller width for better fit in outliner mode
        width: '70%', // Use percentage for responsive behavior
        textAlign: 'left',
        padding: '8px 12px',
        backgroundColor: 'rgba(0, 0, 0, 0.02)', // Very subtle background
        borderRadius: '4px',
        border: '1px solid rgba(0, 0, 0, 0.05)' // Very subtle border
      }
      placeholderStyles = {
        left: '50%',
        transform: 'translateX(-50%)'
      }
    } else if (customElement.type === 'parenthetical') {
      // Parenthetical should be indented within the dialogue block
      inlineStyles = {
        margin: '0 auto', // Center like dialogue
        maxWidth: '70%', // Same responsive width as dialogue
        width: '70%', // Use percentage for responsive behavior
        paddingLeft: '40px', // Indent from the left edge of the dialogue block
        paddingRight: '12px',
        paddingTop: '2px',
        paddingBottom: '2px',
        backgroundColor: 'rgba(0, 0, 0, 0.01)', // Even more subtle background
        borderRadius: '3px'
      }
      placeholderStyles = {
        left: '50%',
        transform: 'translateX(-50%)',
        paddingLeft: '40px' // Match the indent
      }
    } else if (customElement.type === 'action') {
      // Action should span the full width with minimal margins
      const actionMargin = Math.round(12 * scaleFactor)
      inlineStyles = {
        marginLeft: `${actionMargin}px`,
        marginRight: `${actionMargin}px`,
        maxWidth: 'none' // Action can span full width
      }
      placeholderStyles = {
        left: `${actionMargin}px`
      }
    }

    return (
      <div {...attributes} className={elementClasses} style={inlineStyles}>
        {isEmpty && (
          <span
            contentEditable={false}
            className={placeholderClasses}
            style={placeholderStyles}
          >
            {getPlaceholderForElement(customElement.type)}
          </span>
        )}
        {children}
      </div>
    )
  }, [editor, value, onSceneDelete, getPlaceholderForElement, showOutliner])

  return { renderElement }
}
