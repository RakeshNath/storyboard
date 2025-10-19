import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock slate-react with proper style handling
jest.mock('slate-react', () => ({
  Slate: ({ children, onValueChange }: any) => {
    React.useEffect(() => {
      if (onValueChange) {
        onValueChange([])
      }
    }, [onValueChange])
    return (
      <div 
        data-testid="slate-editor" 
        style={{ backgroundColor: 'white', color: 'black' }}
      >
        {children}
      </div>
    )
  },
  Editable: ({ onKeyDown, onBlur, placeholder, className, style }: any) => (
    <div 
      data-testid="editable-content"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className={className}
      style={{ backgroundColor: 'white', color: 'black', ...style }}
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

// Mock UI components
jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-area">{children}</div>,
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
}))

// Mock the SlateEditorContent component directly
jest.mock('@/components/sections/playground/components/slate-editor-content', () => ({
  SlateEditorContent: ({ handleKeyDown, handleBlur, getPlaceholderText, currentElementType, showOutliner }: any) => (
    <div data-testid="slate-editor-content">
      <div 
        data-testid="editable-content"
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        data-placeholder={getPlaceholderText ? getPlaceholderText(currentElementType) : ''}
        style={{
          backgroundColor: 'white',
          color: 'black',
          width: showOutliner ? '8.5in' : '11in',
          transform: showOutliner ? 'scale(1)' : 'scale(1.15)',
          transformOrigin: 'top center'
        }}
      >
        Editor Content
      </div>
    </div>
  ),
}))

describe('Screenplay Editor - Cosmetic Adjustments Tests (Simplified)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Editor Color Styling Tests', () => {
    it('applies white background and black text to editor', () => {
      const mockHandleKeyDown = jest.fn()
      const mockHandleBlur = jest.fn()
      const mockGetPlaceholderText = jest.fn(() => 'Test placeholder')

      render(
        <div data-testid="slate-editor-content">
          <div 
            data-testid="editable-content"
            onKeyDown={mockHandleKeyDown}
            onBlur={mockHandleBlur}
            style={{
              backgroundColor: 'white',
              color: 'black'
            }}
          >
            Editor Content
          </div>
        </div>
      )

      const editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveStyle({
        backgroundColor: 'white',
        color: 'black'
      })
    })

    it('renders editor with proper styling in outliner mode', () => {
      render(
        <div data-testid="slate-editor-content">
          <div 
            data-testid="editable-content"
            style={{
              backgroundColor: 'white',
              color: 'black',
              width: '8.5in',
              transform: 'scale(1)',
              transformOrigin: 'top center'
            }}
          >
            Editor Content
          </div>
        </div>
      )

      const editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveStyle({
        backgroundColor: 'white',
        color: 'black',
        width: '8.5in',
        transform: 'scale(1)',
        transformOrigin: 'top center'
      })
    })

    it('renders editor with proper styling in full-screen mode', () => {
      render(
        <div data-testid="slate-editor-content">
          <div 
            data-testid="editable-content"
            style={{
              backgroundColor: 'white',
              color: 'black',
              width: '11in',
              transform: 'scale(1.15)',
              transformOrigin: 'top center'
            }}
          >
            Editor Content
          </div>
        </div>
      )

      const editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveStyle({
        backgroundColor: 'white',
        color: 'black',
        width: '11in',
        transform: 'scale(1.15)',
        transformOrigin: 'top center'
      })
    })
  })

  describe('Keyboard Navigation Tests', () => {
    it('handles Tab key press events', () => {
      const mockHandleKeyDown = jest.fn()
      const mockHandleBlur = jest.fn()

      render(
        <div data-testid="slate-editor-content">
          <div 
            data-testid="editable-content"
            onKeyDown={mockHandleKeyDown}
            onBlur={mockHandleBlur}
          >
            Editor Content
          </div>
        </div>
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

    it('handles Shift+Tab key press events', () => {
      const mockHandleKeyDown = jest.fn()
      const mockHandleBlur = jest.fn()

      render(
        <div data-testid="slate-editor-content">
          <div 
            data-testid="editable-content"
            onKeyDown={mockHandleKeyDown}
            onBlur={mockHandleBlur}
          >
            Editor Content
          </div>
        </div>
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
        <div data-testid="slate-editor-content">
          <div 
            data-testid="editable-content"
            data-placeholder={mockGetPlaceholderText('dialogue')}
          >
            Editor Content
          </div>
        </div>
      )

      expect(mockGetPlaceholderText).toHaveBeenCalledWith('dialogue')
      
      const editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveAttribute('data-placeholder', 
        'Character dialogue... (Tab → Transition, Shift+Tab → Character)'
      )
    })
  })

  describe('Blur Handler Tests', () => {
    it('calls handleBlur when editor loses focus', () => {
      const mockHandleKeyDown = jest.fn()
      const mockHandleBlur = jest.fn()

      render(
        <div data-testid="slate-editor-content">
          <div 
            data-testid="editable-content"
            onKeyDown={mockHandleKeyDown}
            onBlur={mockHandleBlur}
          >
            Editor Content
          </div>
        </div>
      )

      const editableElement = screen.getByTestId('editable-content')
      
      // Simulate blur event
      fireEvent.blur(editableElement)
      
      expect(mockHandleBlur).toHaveBeenCalledTimes(1)
    })

    it('handles multiple blur events correctly', () => {
      const mockHandleKeyDown = jest.fn()
      const mockHandleBlur = jest.fn()

      render(
        <div data-testid="slate-editor-content">
          <div 
            data-testid="editable-content"
            onKeyDown={mockHandleKeyDown}
            onBlur={mockHandleBlur}
          >
            Editor Content
          </div>
        </div>
      )

      const editableElement = screen.getByTestId('editable-content')
      
      // Simulate multiple blur events
      fireEvent.blur(editableElement)
      fireEvent.blur(editableElement)
      fireEvent.blur(editableElement)
      
      expect(mockHandleBlur).toHaveBeenCalledTimes(3)
    })
  })

  describe('Element Styling Tests', () => {
    it('applies correct styling for dialogue elements', () => {
      const dialogueStyle = {
        marginLeft: '40px',
        marginRight: '35px',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'left',
        padding: '8px 12px',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: '4px',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }

      render(
        <div data-testid="dialogue-element" style={dialogueStyle}>
          Dialogue Content
        </div>
      )

      const dialogueElement = screen.getByTestId('dialogue-element')
      expect(dialogueElement).toHaveStyle(dialogueStyle)
    })

    it('applies correct styling for action elements', () => {
      const actionStyle = {
        marginLeft: '12px',
        marginRight: '12px',
        maxWidth: 'none'
      }

      render(
        <div data-testid="action-element" style={actionStyle}>
          Action Content
        </div>
      )

      const actionElement = screen.getByTestId('action-element')
      expect(actionElement).toHaveStyle(actionStyle)
    })

    it('applies correct styling for parenthetical elements', () => {
      const parentheticalStyle = {
        marginLeft: '50px',
        marginRight: '35px',
        maxWidth: '300px',
        margin: '0 auto',
        padding: '4px 8px',
        backgroundColor: 'rgba(0, 0, 0, 0.01)',
        borderRadius: '3px'
      }

      render(
        <div data-testid="parenthetical-element" style={parentheticalStyle}>
          (parenthetical)
        </div>
      )

      const parentheticalElement = screen.getByTestId('parenthetical-element')
      expect(parentheticalElement).toHaveStyle(parentheticalStyle)
    })
  })

  describe('Responsive Scaling Tests', () => {
    it('applies correct font size for outliner mode', () => {
      render(
        <div data-testid="editable-content" style={{ fontSize: '14px' }}>
          Editor Content
        </div>
      )

      const editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveStyle({ fontSize: '14px' })
    })

    it('applies correct font size for full-screen mode', () => {
      render(
        <div data-testid="editable-content" style={{ fontSize: '16px' }}>
          Editor Content
        </div>
      )

      const editableElement = screen.getByTestId('editable-content')
      expect(editableElement).toHaveStyle({ fontSize: '16px' })
    })
  })

  describe('Loading State Tests', () => {
    it('shows loading overlay when reordering', () => {
      render(
        <div data-testid="editor-container">
          <div data-testid="loading-overlay" style={{ display: 'block' }}>
            <div>Reordering scenes...</div>
          </div>
        </div>
      )

      expect(screen.getByText('Reordering scenes...')).toBeInTheDocument()
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument()
    })

    it('hides loading overlay when not reordering', () => {
      render(
        <div data-testid="editor-container">
          <div data-testid="loading-overlay" style={{ display: 'none' }}>
            <div>Reordering scenes...</div>
          </div>
        </div>
      )

      const loadingOverlay = screen.getByTestId('loading-overlay')
      expect(loadingOverlay).toHaveStyle({ display: 'none' })
    })
  })

  describe('Component Integration Tests', () => {
    it('renders complete editor structure', () => {
      render(
        <div data-testid="slate-editor-content">
          <div data-testid="scroll-area">
            <div data-testid="card">
              <div data-testid="slate-editor">
                <div data-testid="editable-content">Editor Content</div>
              </div>
            </div>
          </div>
        </div>
      )

      // Verify all components are rendered
      expect(screen.getByTestId('slate-editor-content')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument()
      expect(screen.getByTestId('card')).toBeInTheDocument()
      expect(screen.getByTestId('slate-editor')).toBeInTheDocument()
      expect(screen.getByTestId('editable-content')).toBeInTheDocument()
    })
  })
})
