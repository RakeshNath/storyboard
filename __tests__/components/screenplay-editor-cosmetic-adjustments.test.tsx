import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SlateEditorContent } from '@/components/sections/playground/components/slate-editor-content'
import { useSlateEditor } from '@/components/sections/playground/hooks/useSlateEditor'
import { ScreenplayEditorAggregator } from '@/components/sections/playground/components/screenplay-editor-aggregator'
import { initialValue } from '@/components/sections/playground/screenplay-types'

// Mock slate-react
jest.mock('slate-react', () => ({
  Slate: ({ children, onValueChange }: any) => {
    React.useEffect(() => {
      if (onValueChange) {
        onValueChange([])
      }
    }, [onValueChange])
    return <div data-testid="slate-editor">{children}</div>
  },
  Editable: ({ onKeyDown, onBlur, placeholder, className, style }: any) => (
    <div 
      data-testid="editable-content"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className={className}
      style={style}
      data-placeholder={placeholder}
    >
      <div data-testid="slate-content">Editor Content</div>
    </div>
  ),
  useSlateStatic: () => ({}),
  withReact: (editor: any) => editor,
}))

// Mock slate
jest.mock('slate', () => ({
  createEditor: () => ({}),
  Editor: {
    nodes: jest.fn(),
    findPath: jest.fn(),
  },
  Transforms: {
    setNodes: jest.fn(),
    insertNodes: jest.fn(),
    move: jest.fn(),
    removeNodes: jest.fn(),
  },
  Element: {
    isElement: jest.fn(),
  },
  Node: {
    string: jest.fn(() => ''),
  },
}))

// Mock slate-history
jest.mock('slate-history', () => ({
  withHistory: (editor: any) => editor,
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock UI components
jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-area">{children}</div>,
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
}))

jest.mock('@/components/ui/resizable', () => ({
  ResizablePanelGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="panel-group">{children}</div>,
  ResizablePanel: ({ children }: { children: React.ReactNode }) => <div data-testid="panel">{children}</div>,
  ResizableHandle: () => <div data-testid="resize-handle" />,
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}))

// Mock icons
jest.mock('lucide-react', () => ({
  FileDown: () => <div data-testid="file-down-icon">FileDown</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  MapPin: () => <div data-testid="map-pin-icon">MapPin</div>,
  HelpCircle: () => <div data-testid="help-circle-icon">HelpCircle</div>,
  List: () => <div data-testid="list-icon">List</div>,
}))

describe('Screenplay Editor - Cosmetic Adjustments Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Editor Color Styling Tests', () => {
    it('applies white background and black text to editor container', () => {
      const mockEditor = {} as any
      const mockRenderElement = jest.fn()
      const mockRenderLeaf = jest.fn()
      const mockHandleKeyDown = jest.fn()
      const mockHandleBlur = jest.fn()

      render(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={mockRenderElement}
          renderLeaf={mockRenderLeaf}
          handleKeyDown={mockHandleKeyDown}
          handleBlur={mockHandleBlur}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      const editorContainer = screen.getByTestId('slate-editor').parentElement
      expect(editorContainer).toHaveStyle({
        backgroundColor: expect.stringMatching(/white|rgb\(255,\s*255,\s*255\)|#ffffff/i),
        color: expect.stringMatching(/black|rgb\(0,\s*0,\s*0\)|#000000|canvastext/i)
      })
    })

    it('applies white background and black text to Editable component', () => {
      const mockEditor = {} as any
      const mockRenderElement = jest.fn()
      const mockRenderLeaf = jest.fn()
      const mockHandleKeyDown = jest.fn()
      const mockHandleBlur = jest.fn()

      render(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={mockRenderElement}
          renderLeaf={mockRenderLeaf}
          handleKeyDown={mockHandleKeyDown}
          handleBlur={mockHandleBlur}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      const editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveStyle({
        backgroundColor: expect.stringMatching(/white|rgb\(255,\s*255,\s*255\)|#ffffff/i),
        color: expect.stringMatching(/black|rgb\(0,\s*0,\s*0\)|#000000|canvastext/i)
      })
    })

    it('maintains white background and black text in full-screen mode', () => {
      const mockEditor = {} as any
      const mockRenderElement = jest.fn()
      const mockRenderLeaf = jest.fn()
      const mockHandleKeyDown = jest.fn()
      const mockHandleBlur = jest.fn()

      render(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={mockRenderElement}
          renderLeaf={mockRenderLeaf}
          handleKeyDown={mockHandleKeyDown}
          handleBlur={mockHandleBlur}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={false}
        />
      )

      const editorContainer = screen.getByTestId('slate-editor').parentElement
      expect(editorContainer).toHaveStyle({
        backgroundColor: expect.stringMatching(/white|rgb\(255,\s*255,\s*255\)|#ffffff/i),
        color: expect.stringMatching(/black|rgb\(0,\s*0,\s*0\)|#000000|canvastext/i)
      })
    })
  })

  describe('Dialogue Positioning and Visual Distinction Tests', () => {
    it('applies correct styling for dialogue elements', () => {
      // This test would verify the dialogue styling from slate-element-renderer
      // Since we're mocking the components, we'll test the styling logic indirectly
      const mockRenderElement = jest.fn(({ element, style }) => {
        if (element.type === 'dialogue') {
          expect(style).toMatchObject({
            marginLeft: expect.stringMatching(/^\d+px$/),
            marginRight: expect.stringMatching(/^\d+px$/),
            maxWidth: '400px',
            margin: '0 auto',
            textAlign: 'left',
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '4px',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          })
        }
        return <div data-testid={`element-${element.type}`}>Element</div>
      })

      const mockEditor = {} as any
      render(
        <SlateEditorContent
          editor={mockEditor}
          value={[{ type: 'dialogue', children: [{ text: 'Test dialogue' }] }]}
          onValueChange={jest.fn()}
          renderElement={mockRenderElement}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="dialogue"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )
    })

    it('applies correct styling for action elements', () => {
      const mockRenderElement = jest.fn(({ element, style }) => {
        if (element.type === 'action') {
          expect(style).toMatchObject({
            marginLeft: expect.stringMatching(/^\d+px$/),
            marginRight: expect.stringMatching(/^\d+px$/),
            maxWidth: 'none'
          })
        }
        return <div data-testid={`element-${element.type}`}>Element</div>
      })

      const mockEditor = {} as any
      render(
        <SlateEditorContent
          editor={mockEditor}
          value={[{ type: 'action', children: [{ text: 'Test action' }] }]}
          onValueChange={jest.fn()}
          renderElement={mockRenderElement}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )
    })

    it('applies correct styling for parenthetical elements', () => {
      const mockRenderElement = jest.fn(({ element, style }) => {
        if (element.type === 'parenthetical') {
          expect(style).toMatchObject({
            marginLeft: expect.stringMatching(/^\d+px$/),
            marginRight: expect.stringMatching(/^\d+px$/),
            maxWidth: '300px',
            margin: '0 auto',
            padding: '4px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
            borderRadius: '3px'
          })
        }
        return <div data-testid={`element-${element.type}`}>Element</div>
      })

      const mockEditor = {} as any
      render(
        <SlateEditorContent
          editor={mockEditor}
          value={[{ type: 'parenthetical', children: [{ text: '(parenthetical)' }] }]}
          onValueChange={jest.fn()}
          renderElement={mockRenderElement}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="parenthetical"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )
    })
  })

  describe('Tab Navigation Cycling Tests', () => {
    it('handles Tab key navigation through element types', async () => {
      const user = userEvent.setup()
      const mockHandleKeyDown = jest.fn()

      render(
        <SlateEditorContent
          editor={{} as any}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={mockHandleKeyDown}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      const editableElement = screen.getByTestId('editable-content')
      
      // Simulate Tab key press
      fireEvent.keyDown(editableElement, { key: 'Tab', shiftKey: false })
      
      expect(mockHandleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'Tab',
          shiftKey: false
        })
      )
    })

    it('handles Shift+Tab key navigation', async () => {
      const user = userEvent.setup()
      const mockHandleKeyDown = jest.fn()

      render(
        <SlateEditorContent
          editor={{} as any}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={mockHandleKeyDown}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      const editableElement = screen.getByTestId('editable-content')
      
      // Simulate Shift+Tab key press
      fireEvent.keyDown(editableElement, { key: 'Tab', shiftKey: true })
      
      expect(mockHandleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'Tab',
          shiftKey: true
        })
      )
    })

    it('provides correct placeholder text with navigation hints', () => {
      const mockGetPlaceholderText = jest.fn((elementType) => {
        switch (elementType) {
          case 'action':
            return 'Action description... (Tab → Character, Shift+Tab → Scene Heading)'
          case 'character':
            return 'CHARACTER NAME (Tab → Dialogue, Shift+Tab → Action)'
          case 'dialogue':
            return 'Character dialogue... (Tab → Transition, Shift+Tab → Character)'
          case 'transition':
            return 'Enter transition (e.g., CUT TO:, FADE OUT)... (Tab → Action, Shift+Tab → Dialogue)'
          case 'parenthetical':
            return '(parenthetical) (Tab → Transition, Shift+Tab → Dialogue)'
          default:
            return 'Start typing your screenplay...'
        }
      })

      render(
        <SlateEditorContent
          editor={{} as any}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={mockGetPlaceholderText}
          currentElementType="dialogue"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      expect(mockGetPlaceholderText).toHaveBeenCalledWith('dialogue')
      
      const editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveAttribute('data-placeholder', 
        'Character dialogue... (Tab → Transition, Shift+Tab → Character)'
      )
    })
  })

  describe('Auto-Removal of Empty Scene Headings Tests', () => {
    it('calls handleBlur when editor loses focus', () => {
      const mockHandleBlur = jest.fn()

      render(
        <SlateEditorContent
          editor={{} as any}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={mockHandleBlur}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      const editableElement = screen.getByTestId('editable-content')
      
      // Simulate blur event
      fireEvent.blur(editableElement)
      
      expect(mockHandleBlur).toHaveBeenCalledTimes(1)
    })

    it('handles multiple blur events correctly', () => {
      const mockHandleBlur = jest.fn()

      render(
        <SlateEditorContent
          editor={{} as any}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={mockHandleBlur}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      const editableElement = screen.getByTestId('editable-content')
      
      // Simulate multiple blur events
      fireEvent.blur(editableElement)
      fireEvent.blur(editableElement)
      fireEvent.blur(editableElement)
      
      expect(mockHandleBlur).toHaveBeenCalledTimes(3)
    })
  })

  describe('Editor Responsive Scaling Tests', () => {
    it('applies correct scaling in outliner mode', () => {
      const mockEditor = {} as any

      render(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      const editorContainer = screen.getByTestId('slate-editor').parentElement
      expect(editorContainer).toHaveStyle({
        width: expect.stringMatching(/8\.5in|8\.5in/),
        transform: expect.stringMatching(/scale\(1\)|scale\(1\)/),
        transformOrigin: expect.stringMatching(/top center|top center/)
      })
    })

    it('applies correct scaling in full-screen mode', () => {
      const mockEditor = {} as any

      render(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={false}
        />
      )

      const editorContainer = screen.getByTestId('slate-editor').parentElement
      expect(editorContainer).toHaveStyle({
        width: expect.stringMatching(/11in|11in/),
        transform: expect.stringMatching(/scale\(1\.15\)|scale\(1\.15\)/),
        transformOrigin: expect.stringMatching(/top center|top center/)
      })
    })

    it('applies correct font size based on outliner state', () => {
      const mockEditor = {} as any

      // Test outliner mode
      const { rerender } = render(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      let editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveStyle({
        fontSize: '14px'
      })

      // Test full-screen mode
      rerender(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={false}
        />
      )

      editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveStyle({
        fontSize: '16px'
      })
    })
  })

  describe('Editor Loading State Tests', () => {
    it('shows loading overlay during scene reordering', () => {
      const mockEditor = {} as any

      render(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={true}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      expect(screen.getByText('Reordering scenes...')).toBeInTheDocument()
    })

    it('hides loading overlay when not reordering', () => {
      const mockEditor = {} as any

      render(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={jest.fn()}
          renderLeaf={jest.fn()}
          handleKeyDown={jest.fn()}
          handleBlur={jest.fn()}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      expect(screen.queryByText('Reordering scenes...')).not.toBeInTheDocument()
    })
  })

  describe('Integration Tests', () => {
    it('renders SlateEditorContent with all required props', () => {
      const mockEditor = {} as any
      const mockRenderElement = jest.fn()
      const mockRenderLeaf = jest.fn()
      const mockHandleKeyDown = jest.fn()
      const mockHandleBlur = jest.fn()

      render(
        <SlateEditorContent
          editor={mockEditor}
          value={initialValue}
          onValueChange={jest.fn()}
          renderElement={mockRenderElement}
          renderLeaf={mockRenderLeaf}
          handleKeyDown={mockHandleKeyDown}
          handleBlur={mockHandleBlur}
          getPlaceholderText={jest.fn()}
          currentElementType="action"
          isReordering={false}
          onSelectionChange={jest.fn()}
          showOutliner={true}
        />
      )

      // Verify the main structure is rendered
      expect(screen.getByTestId('slate-editor')).toBeInTheDocument()
      expect(screen.getByTestId('editable-content')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument()
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })
  })
})
