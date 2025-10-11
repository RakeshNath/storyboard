"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, FileText, Hash } from "lucide-react"
import type { SynopsisHeaderProps } from "./types"

export function SynopsisHeader({
  synopsisTitle,
  onBack,
  pageCount,
  wordCount,
  characterCount,
  hasUnsavedChanges,
  onSave
}: SynopsisHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-background">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Storyboards
        </Button>
        
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-xl font-semibold">{synopsisTitle}</h1>
            <p className="text-sm text-muted-foreground">Synopsis Editor</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Page Statistics */}
        <div className="flex items-center gap-2">
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: 'var(--accent, #3b82f6)',
              color: 'var(--accent-foreground, #ffffff)',
              border: '1px solid var(--accent, #3b82f6)'
            }}
          >
            <Hash style={{ width: '12px', height: '12px' }} />
            {pageCount} page{pageCount !== 1 ? 's' : ''}
          </div>
        </div>

        {hasUnsavedChanges && (
          <span className="text-xs text-muted-foreground">Unsaved changes</span>
        )}
        <Button
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  )
}
