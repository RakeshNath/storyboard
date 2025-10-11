"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Users } from "lucide-react"
import type { ScreenplayHeaderProps } from "./types"

export function ScreenplayHeader({ 
  scriptName, 
  onTitleChange, 
  onSave, 
  onCharactersClick,
  onBack
}: ScreenplayHeaderProps) {
  return (
    <div className="border-b bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack || (() => window.history.back())}>
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
                border: 'none',
                borderRadius: '0',
                padding: '2px 12px',
                fontSize: '10px',
                fontWeight: '600',
                letterSpacing: '0.05em'
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
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-xl font-bold border-none !bg-transparent p-0 h-auto"
              placeholder="Screenplay Title"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="default"
            onClick={onSave}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onCharactersClick}
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)'
            }}
          >
            <Users className="h-4 w-4 mr-2" />
            Characters
          </Button>
        </div>
      </div>
    </div>
  )
}
