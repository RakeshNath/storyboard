"use client"

import { EditorContent } from "@tiptap/react"
import { SynopsisContentProps } from "./types"

export function SynopsisContent({ editor, pageCount, wordCount, characterCount }: SynopsisContentProps) {
  if (!editor) return null

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <EditorContent 
        editor={editor} 
        className="flex-1 prose prose-sm max-w-none p-4 focus:outline-none"
        style={{ 
          backgroundColor: 'white',
          color: 'black'
        }}
        data-testid="synopsis-editor-content"
      />
      
      {/* Statistics Footer */}
      <div className="flex items-center justify-between p-3 bg-muted/30 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{pageCount} page{pageCount !== 1 ? 's' : ''}</span>
          <span>{wordCount} words</span>
          <span>{characterCount} characters</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Auto-saved
        </div>
      </div>
    </div>
  )
}
