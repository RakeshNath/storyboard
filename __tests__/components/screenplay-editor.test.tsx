import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScreenplayEditor } from '@/components/sections/screenplay-editor'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  FileText: () => <div data-testid="filetext-icon">FileText</div>,
  Save: () => <div data-testid="save-icon">Save</div>,
  List: () => <div data-testid="list-icon">List</div>,
  Keyboard: () => <div data-testid="keyboard-icon">Keyboard</div>,
  X: () => <div data-testid="x-icon">X</div>,
  ChevronRight: () => <div data-testid="chevron-right-icon">ChevronRight</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
  FileDown: () => <div data-testid="file-down-icon">FileDown</div>,
}))

// Mock the professional screenplay editor
jest.mock('@/components/sections/playground/screenplay-editor-pro', () => ({
  ScreenplayEditorPro: () => <div data-testid="screenplay-editor-pro">Professional Screenplay Editor</div>
}))

describe('ScreenplayEditor Component - Professional Editor Integration', () => {
  const mockOnBack = jest.fn()
  const mockOnTitleChange = jest.fn()
  
  const defaultProps = {
    screenplayId: 'test-screenplay-1',
    onBack: mockOnBack,
    onTitleChange: mockOnTitleChange,
    initialTitle: 'Test Screenplay',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with initial title', () => {
      render(<ScreenplayEditor {...defaultProps} />)
      
      expect(screen.getByDisplayValue('Test Screenplay')).toBeInTheDocument()
      expect(screen.getByText('SCREENPLAY')).toBeInTheDocument()
      expect(screen.getByTestId('screenplay-editor-pro')).toBeInTheDocument()
    })

    it('renders with default title when no initial title provided', () => {
      render(<ScreenplayEditor {...defaultProps} initialTitle={undefined} />)
      
      expect(screen.getByDisplayValue('Untitled Screenplay')).toBeInTheDocument()
      expect(screen.getByTestId('screenplay-editor-pro')).toBeInTheDocument()
    })

    it('renders back button', () => {
      render(<ScreenplayEditor {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    })

    it('renders save button', () => {
      render(<ScreenplayEditor {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('renders professional editor', () => {
      render(<ScreenplayEditor {...defaultProps} />)
      
      expect(screen.getByTestId('screenplay-editor-pro')).toBeInTheDocument()
      expect(screen.getByText('Professional Screenplay Editor')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('calls onBack when back button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditor {...defaultProps} />)
      
      const backButton = screen.getByRole('button', { name: /back/i })
      await user.click(backButton)
      
      expect(mockOnBack).toHaveBeenCalled()
    })

    it('calls onTitleChange when title is modified', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditor {...defaultProps} />)
      
      const titleInput = screen.getByDisplayValue('Test Screenplay')
      await user.clear(titleInput)
      await user.type(titleInput, 'New Title')
      
      expect(mockOnTitleChange).toHaveBeenCalled()
    })

    it('updates title state when input changes', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditor {...defaultProps} />)
      
      const titleInput = screen.getByDisplayValue('Test Screenplay')
      await user.clear(titleInput)
      await user.type(titleInput, 'My Screenplay')
      
      expect(titleInput).toHaveValue('My Screenplay')
    })
  })

  describe('Props Handling', () => {
    it('uses provided screenplayId', () => {
      render(<ScreenplayEditor {...defaultProps} screenplayId="custom-id" />)
      
      expect(screen.getByTestId('screenplay-editor-pro')).toBeInTheDocument()
    })

    it('handles missing onBack gracefully', () => {
      render(<ScreenplayEditor {...defaultProps} onBack={undefined} />)
      
      const backButton = screen.getByRole('button', { name: /back/i })
      expect(backButton).toBeInTheDocument()
    })

    it('handles missing onTitleChange gracefully', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditor {...defaultProps} onTitleChange={undefined} />)
      
      const titleInput = screen.getByDisplayValue('Test Screenplay')
      await user.type(titleInput, ' Updated')
      
      // Should not crash
      expect(titleInput).toHaveValue('Test Screenplay Updated')
    })
  })
})
