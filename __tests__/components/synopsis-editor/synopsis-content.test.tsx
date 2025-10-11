import React from 'react'
import { render, screen } from '@testing-library/react'
import { SynopsisContent } from '@/components/sections/synopsis-editor/synopsis-content'

// Mock EditorContent
jest.mock('@tiptap/react', () => ({
  EditorContent: ({ editor, className, ...props }: any) => (
    <div 
      data-testid="synopsis-editor-content" 
      className={className}
      data-editor={editor ? 'present' : 'null'}
      {...props}
    >
      Editor Content
    </div>
  )
}))

describe('SynopsisContent Component', () => {
  const mockEditor = {
    commands: {
      setContent: jest.fn(),
      focus: jest.fn()
    },
    getText: jest.fn(() => 'Test content'),
    isActive: jest.fn(() => false)
  }

  const mockProps = {
    editor: mockEditor,
    pageCount: 5,
    wordCount: 100,
    characterCount: 500
  }

  describe('Rendering', () => {
    it('renders content when editor is provided', () => {
      render(<SynopsisContent {...mockProps} />)
      
      expect(screen.getByTestId('synopsis-editor-content')).toBeInTheDocument()
      expect(screen.getByText('Editor Content')).toBeInTheDocument()
    })

    it('does not render when editor is null', () => {
      render(<SynopsisContent {...mockProps} editor={null} />)
      
      expect(screen.queryByTestId('synopsis-editor-content')).not.toBeInTheDocument()
    })

    it('renders statistics footer', () => {
      render(<SynopsisContent {...mockProps} />)
      
      expect(screen.getByText('5 pages')).toBeInTheDocument()
      expect(screen.getByText('100 words')).toBeInTheDocument()
      expect(screen.getByText('500 characters')).toBeInTheDocument()
    })

    it('shows auto-saved indicator', () => {
      render(<SynopsisContent {...mockProps} />)
      
      expect(screen.getByText('Auto-saved')).toBeInTheDocument()
    })
  })

  describe('Statistics Display', () => {
    it('displays singular page count correctly', () => {
      render(<SynopsisContent {...mockProps} pageCount={1} />)
      
      expect(screen.getByText('1 page')).toBeInTheDocument()
    })

    it('displays plural page count correctly', () => {
      render(<SynopsisContent {...mockProps} pageCount={5} />)
      
      expect(screen.getByText('5 pages')).toBeInTheDocument()
    })

    it('displays word count correctly', () => {
      render(<SynopsisContent {...mockProps} wordCount={150} />)
      
      expect(screen.getByText('150 words')).toBeInTheDocument()
    })

    it('displays character count correctly', () => {
      render(<SynopsisContent {...mockProps} characterCount={750} />)
      
      expect(screen.getByText('750 characters')).toBeInTheDocument()
    })

    it('handles zero values', () => {
      render(<SynopsisContent {...mockProps} pageCount={0} wordCount={0} characterCount={0} />)
      
      expect(screen.getByText('0 pages')).toBeInTheDocument()
      expect(screen.getByText('0 words')).toBeInTheDocument()
      expect(screen.getByText('0 characters')).toBeInTheDocument()
    })

    it('handles large values', () => {
      render(<SynopsisContent {...mockProps} pageCount={100} wordCount={10000} characterCount={50000} />)
      
      expect(screen.getByText('100 pages')).toBeInTheDocument()
      expect(screen.getByText('10000 words')).toBeInTheDocument()
      expect(screen.getByText('50000 characters')).toBeInTheDocument()
    })
  })

  describe('Editor Integration', () => {
    it('passes editor to EditorContent', () => {
      render(<SynopsisContent {...mockProps} />)
      
      const editorContent = screen.getByTestId('synopsis-editor-content')
      expect(editorContent).toHaveAttribute('data-editor', 'present')
    })

    it('applies correct CSS classes to EditorContent', () => {
      render(<SynopsisContent {...mockProps} />)
      
      const editorContent = screen.getByTestId('synopsis-editor-content')
      expect(editorContent).toHaveClass('flex-1', 'prose', 'prose-sm', 'max-w-none', 'p-4', 'focus:outline-none')
    })

    it('handles missing editor gracefully', () => {
      render(<SynopsisContent {...mockProps} editor={null} />)
      
      expect(screen.queryByTestId('synopsis-editor-content')).not.toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('has proper flex layout structure', () => {
      render(<SynopsisContent {...mockProps} />)
      
      const container = screen.getByTestId('synopsis-editor-content').parentElement
      expect(container).toHaveClass('flex-1', 'flex', 'flex-col', 'min-h-0')
    })

    it('has statistics footer with proper styling', () => {
      render(<SynopsisContent {...mockProps} />)
      
      const statsContainer = screen.getByText('5 pages').closest('div')?.parentElement
      expect(statsContainer).toHaveClass('flex', 'items-center', 'justify-between', 'p-3', 'bg-muted/30', 'border-t', 'text-xs', 'text-muted-foreground')
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<SynopsisContent {...mockProps} />)
      
      // Check that the editor content is properly structured
      const editorContent = screen.getByTestId('synopsis-editor-content')
      expect(editorContent).toBeInTheDocument()
    })

    it('has accessible statistics display', () => {
      render(<SynopsisContent {...mockProps} />)
      
      // Check that statistics are properly displayed
      expect(screen.getByText('5 pages')).toBeInTheDocument()
      expect(screen.getByText('100 words')).toBeInTheDocument()
      expect(screen.getByText('500 characters')).toBeInTheDocument()
    })
  })
})
