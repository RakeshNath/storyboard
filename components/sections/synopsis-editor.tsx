"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, FileText, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

interface SynopsisEditorProps {
  synopsisId: string
  synopsisTitle: string
  onBack: () => void
}

export function SynopsisEditor({ synopsisId, synopsisTitle, onBack }: SynopsisEditorProps) {
  const [synopsisContent, setSynopsisContent] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [pageCount, setPageCount] = useState(1)
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Page calculation constants (industry standards)
  const WORDS_PER_PAGE = 750
  const CHARACTERS_PER_PAGE = 3750
  const LINES_PER_PAGE = 75

  // Calculate page count and statistics
  const calculatePageStats = (content: string) => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length
    const characters = content.length
    const lines = content.split('\n').length
    
    // Calculate page count based on multiple methods and take the highest
    const pagesByWords = Math.max(1, Math.ceil(words / WORDS_PER_PAGE))
    const pagesByCharacters = Math.max(1, Math.ceil(characters / CHARACTERS_PER_PAGE))
    const pagesByLines = Math.max(1, Math.ceil(lines / LINES_PER_PAGE))
    
    // Use the most conservative estimate (highest page count)
    const estimatedPages = Math.max(pagesByWords, pagesByCharacters, pagesByLines)
    
    return {
      pages: estimatedPages,
      words,
      characters,
      lines
    }
  }

  // Load synopsis content when component mounts
  useEffect(() => {
    // For now, we'll use localStorage to persist synopsis content
    // In a real app, this would fetch from a backend
    const savedContent = localStorage.getItem(`synopsis-${synopsisId}`)
    if (savedContent) {
      setSynopsisContent(savedContent)
      // Initialize stats for loaded content
      const stats = calculatePageStats(savedContent)
      setPageCount(stats.pages)
      setWordCount(stats.words)
      setCharacterCount(stats.characters)
    } else {
      // Initialize stats even for empty content
      const stats = calculatePageStats("")
      setPageCount(stats.pages)
      setWordCount(stats.words)
      setCharacterCount(stats.characters)
    }
  }, [synopsisId])

  // Auto-save when content changes (debounced)
  useEffect(() => {
    if (synopsisContent) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`synopsis-${synopsisId}`, synopsisContent)
        setHasUnsavedChanges(false)
      }, 1000) // 1 second debounce
      
      return () => clearTimeout(timeoutId)
    }
  }, [synopsisContent, synopsisId])

  const handleContentChange = (value: string) => {
    setSynopsisContent(value)
    setHasUnsavedChanges(true)
    
    // Update page statistics
    const stats = calculatePageStats(value)
    setPageCount(stats.pages)
    setWordCount(stats.words)
    setCharacterCount(stats.characters)
  }

  const handleSave = () => {
    localStorage.setItem(`synopsis-${synopsisId}`, synopsisContent)
    setHasUnsavedChanges(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
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
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-foreground)',
                border: '1px solid var(--accent)',
                borderRadius: '6px'
              }}
            >
              <Hash className="h-3 w-3" />
              {pageCount} page{pageCount !== 1 ? 's' : ''}
            </div>
            
          </div>

          {hasUnsavedChanges && (
            <span className="text-xs text-muted-foreground">Unsaved changes</span>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            size="sm"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Synopsis Content
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full pb-6 relative">
            {/* Plain Text Counters */}
            <div className="flex justify-end gap-4 mb-2 text-sm text-muted-foreground">
              <span>{wordCount} words</span>
              <span>{characterCount} characters</span>
            </div>
            
            <Textarea
              ref={textareaRef}
              value={synopsisContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your synopsis here...

A synopsis is a brief summary of your story that captures the main plot points, character arcs, and key events. It should be concise yet comprehensive, giving readers a clear understanding of your story's structure and themes.

Key elements to include:
• Main characters and their goals
• Central conflict and obstacles
• Key plot points and turning points
• Character development and relationships
• Story resolution and themes

Start writing your synopsis below..."
              className="h-full min-h-[600px] resize-none border-0 focus-visible:ring-0 text-base leading-relaxed"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                backgroundImage: pageCount > 1 ? `repeating-linear-gradient(
                  transparent,
                  transparent 24px,
                  rgba(255, 0, 0, 0.1) 24px,
                  rgba(255, 0, 0, 0.1) 25px
                )` : 'none'
              }}
            />
            
            {/* Page Break Indicators */}
            {pageCount > 1 && (
              <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
                {Array.from({ length: pageCount }, (_, i) => (
                  <Badge 
                    key={i} 
                    variant="destructive" 
                    className="text-xs px-2 py-1"
                  >
                    Page {i + 1}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
