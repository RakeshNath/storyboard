"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, FileText, Hash, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Minus, Strikethrough, Type, Highlighter, HelpCircle } from "lucide-react"
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
        editor.commands.setContent(synopsisContent)
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

      {/* Main Content with Tabs */}
      <div className="flex-1">
        <Tabs defaultValue="synopsis" className="h-full flex flex-col" data-testid="synopsis-tabs">
              <div className="relative border-b" data-testid="tabs-container">
                <TabsList className="relative bg-transparent h-10 p-0 border-0 grid-cols-2" data-testid="tabs-list">
                  <TabsTrigger 
                    value="synopsis" 
                    className="relative bg-muted/50 border border-b-0 border-border rounded-t-lg rounded-b-none px-4 py-2 data-[state=active]:bg-background data-[state=active]:border-b-background data-[state=active]:z-10 data-[state=active]:shadow-none"
                    data-testid="synopsis-tab"
                  >
                    Synopsis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="help"
                    className="relative bg-muted/50 border border-b-0 border-border rounded-t-lg rounded-b-none px-4 py-2 data-[state=active]:bg-background data-[state=active]:border-b-background data-[state=active]:z-10 data-[state=active]:shadow-none"
                    data-testid="help-tab"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="synopsis" className="flex-1 border border-t-0 rounded-t-none rounded-lg bg-background p-4" data-testid="synopsis-content">
                {/* Plain Text Counters */}
                <div className="flex justify-end gap-4 mb-2 text-sm text-muted-foreground" data-testid="word-character-counters">
                  <span data-testid="word-count">{wordCount} words</span>
                  <span data-testid="character-count">{characterCount} characters</span>
                </div>
            
            {/* Rich Text Editor Toolbar */}
            {editor && (
              <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20 rounded-t-lg" data-testid="rich-text-toolbar">
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
              data-testid="rich-text-editor-container"
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
                <EditorContent editor={editor} data-testid="editor-content" />
              ) : (
                <div className="p-4 text-muted-foreground" data-testid="editor-loading">
                  Loading editor...
                </div>
              )}
            </div>
            
                {/* Page Break Indicators */}
                {pageCount > 1 && (
                  <div className="absolute top-4 right-4 flex flex-col gap-1 z-10" data-testid="page-break-indicators">
                    {Array.from({ length: pageCount }, (_, i) => (
                      <div 
                        key={i}
                        className="text-xs px-2 py-1 rounded-md font-medium"
                        data-testid={`page-indicator-${i + 1}`}
                        style={{
                          backgroundColor: 'var(--accent)',
                          color: 'var(--accent-foreground)',
                          border: '1px solid var(--accent)'
                        }}
                      >
                        Page {i + 1}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="help" className="flex-1 border border-t-0 rounded-t-none rounded-lg bg-background p-6" data-testid="help-content">
                <div className="h-full overflow-y-auto" data-testid="help-container">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="text-center mb-8">
                      <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h1 className="text-3xl font-bold mb-2">Rich Text Editor Tutorial</h1>
                      <p className="text-muted-foreground text-lg">Learn how to use all the formatting features in your synopsis editor</p>
                    </div>

                    {/* Getting Started */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                        Getting Started
                      </h2>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Click in the editor area and start typing your synopsis. The placeholder text will disappear as you begin writing.
                        </p>
                        <div className="bg-background p-3 rounded border-l-4 border-primary">
                          <p className="text-sm"><strong>Tip:</strong> You can select text and apply formatting, or apply formatting first and then type.</p>
                        </div>
                      </div>
                    </div>

                    {/* Text Formatting */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                        Text Formatting
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h3 className="font-medium">Basic Formatting</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3">
                              <Bold className="h-4 w-4" />
                              <span><strong>Bold</strong> - Make text bold for emphasis</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Italic className="h-4 w-4" />
                              <span><em>Italic</em> - Italicize text for emphasis</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Underline className="h-4 w-4" />
                              <span><u>Underline</u> - Underline important text</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Strikethrough className="h-4 w-4" />
                              <span><s>Strikethrough</s> - Cross out text</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-medium">Text Effects</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3">
                              <Type className="h-4 w-4" />
                              <span>Superscript - x² style text</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Type className="h-4 w-4" />
                              <span>Subscript - H₂O style text</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Highlighter className="h-4 w-4" />
                              <span><mark>Highlight</mark> - Background highlighting</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Palette className="h-4 w-4" />
                              <span>Text Color - Custom text colors</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Headings */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                        Headings & Structure
                      </h2>
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3">
                            <Heading1 className="h-4 w-4" />
                            <span className="text-sm">Heading 1 - Main sections</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Heading2 className="h-4 w-4" />
                            <span className="text-sm">Heading 2 - Subsections</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Heading3 className="h-4 w-4" />
                            <span className="text-sm">Heading 3 - Minor sections</span>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Use headings to organize your synopsis into clear sections like "Act 1", "Act 2", "Character Development", etc.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lists */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                        Lists & Organization
                      </h2>
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <List className="h-4 w-4" />
                              <span className="text-sm">Bullet Lists - Unordered lists</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <ListOrdered className="h-4 w-4" />
                              <span className="text-sm">Numbered Lists - Ordered lists</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Quote className="h-4 w-4" />
                              <span className="text-sm">Blockquotes - Quote sections</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Code className="h-4 w-4" />
                              <span className="text-sm">Code Blocks - Monospace text</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alignment */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                        Text Alignment
                      </h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <AlignLeft className="h-4 w-4" />
                          <span className="text-sm">Left Align - Default alignment</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlignCenter className="h-4 w-4" />
                          <span className="text-sm">Center Align - Centered text</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlignRight className="h-4 w-4" />
                          <span className="text-sm">Right Align - Right-aligned text</span>
                        </div>
                      </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</span>
                        Keyboard Shortcuts
                      </h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h3 className="font-medium">Formatting</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Bold</span>
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+B</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Italic</span>
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+I</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Underline</span>
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+U</kbd>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Structure</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Heading 1</span>
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Alt+1</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Heading 2</span>
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Alt+2</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Bullet List</span>
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+8</kbd>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pro Tips */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">7</span>
                        Pro Tips
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                          <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Writing Tips</h3>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• Start with a clear logline (one-sentence summary)</li>
                            <li>• Use headings to organize your synopsis</li>
                            <li>• Keep paragraphs short and focused</li>
                            <li>• Highlight key plot points</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Editor Tips</h3>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Use the word counter to track length</li>
                            <li>• Save frequently (auto-save enabled)</li>
                            <li>• Use lists for character descriptions</li>
                            <li>• Highlight important dialogue</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 border-t">
                      <p className="text-sm text-muted-foreground">
                        Need more help? The editor auto-saves your work as you type, and you can always use the formatting toolbar above the editor.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
    </div>
  )
}
