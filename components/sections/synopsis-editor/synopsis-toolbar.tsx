"use client"

import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Minus, 
  Strikethrough, 
  Type, 
  Highlighter, 
  Palette
} from "lucide-react"
import type { SynopsisToolbarProps } from "./types"

export function SynopsisToolbar({ editor }: SynopsisToolbarProps) {
  if (!editor) return null

  return (
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
        onClick={() => editor?.chain()?.focus()?.toggleSuperscript()?.run()}
        className={editor.isActive('superscript') ? 'bg-accent text-accent-foreground' : ''}
      >
        <Type className="h-4 w-4" />
        <sup className="text-xs">x</sup>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor?.chain()?.focus()?.toggleSubscript()?.run()}
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
  )
}
