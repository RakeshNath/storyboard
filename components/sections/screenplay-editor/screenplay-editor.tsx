"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText } from "lucide-react"
import { ScreenplayEditorPro } from "../playground/screenplay-editor-pro"
import type { ScreenplayEditorProps } from "./types"

export function ScreenplayEditor({ screenplayId, onBack, onTitleChange, initialTitle }: ScreenplayEditorProps) {
  const [scriptName, setScriptName] = useState(initialTitle || "Untitled Screenplay")

  const handleTitleChange = (title: string) => {
    setScriptName(title)
    if (onTitleChange) {
      onTitleChange(title)
    }
  }

  const handleSave = () => {
    console.log('Screenplay saved:', { screenplayId, title: scriptName })
    // The professional editor handles its own auto-save
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack || (() => window.history.back())}
            >
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <div
                className="relative cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300 inline-block"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  transform: 'skew(-15deg)',
                  transformOrigin: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  borderRadius: '0',
                  padding: '2px 12px',
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                }}
              >
                <span
                  className="inline-block"
                  style={{ transform: 'skew(15deg)' }}
                >
                  SCREENPLAY
                </span>
              </div>
              <Input
                value={scriptName}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-xl font-bold border-none !bg-transparent p-0 h-auto"
                placeholder="Screenplay Title"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Professional Editor */}
      <div className="flex-1 overflow-hidden">
        <ScreenplayEditorPro title={scriptName} />
      </div>
    </div>
  )
}
