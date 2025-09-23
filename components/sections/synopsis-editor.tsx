"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, FileText, Hash, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Minus, Strikethrough, Type, Highlighter, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import UnderlineExt from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlock from '@tiptap/extension-code-block'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Strike from '@tiptap/extension-strike'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Highlight from '@tiptap/extension-highlight'

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

  // Rich text editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your synopsis here...\n\nA synopsis is a brief summary of your story that captures the main plot points, character arcs, and key events. It should be concise yet comprehensive, giving readers a clear understanding of your story\'s structure and themes.\n\nKey elements to include:\n• Main characters and their goals\n• Central conflict and obstacles\n• Key plot points and turning points\n• Character development and relationships\n• Story resolution and themes\n\nStart writing your synopsis below...',
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      UnderlineExt,
      Strike,
      Superscript,
      Subscript,
      Highlight.configure({
        multicolor: true,
      }),
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
      HorizontalRule,
    ],
    content: '',
    immediatelyRender: false,
    editable: true,
    onUpdate: ({ editor }) => {
      const content = editor.getText()
      setSynopsisContent(content)
      setHasUnsavedChanges(true)
      
      // Update page statistics
      const stats = calculatePageStats(content)
      setPageCount(stats.pages)
      setWordCount(stats.words)
      setCharacterCount(stats.characters)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[600px] p-4',
        style: 'font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace; line-height: 1.6;'
      },
    },
  })

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

  // Update editor content when synopsisContent changes (only from localStorage)
  useEffect(() => {
    if (editor && synopsisContent && synopsisContent !== editor.getText()) {
      editor.commands.setContent(synopsisContent, false)
    }
  }, [editor]) // Only run when editor is ready

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
            
            {/* Rich Text Editor Toolbar */}
            {editor && (
              <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20 rounded-t-lg">
                {/* Headings */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={editor.isActive('heading', { level: 1 }) ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Text Formatting */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={editor.isActive('underline') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={editor.isActive('strike') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Lists */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Block Elements */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={editor.isActive('blockquote') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Quote className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={editor.isActive('codeBlock') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Code className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Alignment */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-accent-foreground' : ''}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-accent-foreground' : ''}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-accent-foreground' : ''}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Text Effects */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleSuperscript().run()}
                  className={editor.isActive('superscript') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Type className="h-4 w-4" />
                  <sup className="text-xs">x</sup>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleSubscript().run()}
                  className={editor.isActive('subscript') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Type className="h-4 w-4" />
                  <sub className="text-xs">x</sub>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  className={editor.isActive('highlight') ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Color */}
                <input
                  type="color"
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                  title="Text color"
                />
              </div>
            )}
            
            {/* Rich Text Editor */}
            <div 
              className="h-full min-h-[600px] border border-t-0 rounded-b-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              style={{
                backgroundImage: pageCount > 1 ? `repeating-linear-gradient(
                  transparent,
                  transparent 24px,
                  rgba(255, 0, 0, 0.1) 24px,
                  rgba(255, 0, 0, 0.1) 25px
                )` : 'none'
              }}
            >
              {editor ? (
                <EditorContent editor={editor} />
              ) : (
                <div className="p-4 text-muted-foreground">
                  Loading editor...
                </div>
              )}
            </div>
            
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
