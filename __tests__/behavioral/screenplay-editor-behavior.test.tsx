import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
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

describe('Screenplay Editor - Behavioral Tests', () => {
  const mockOnBack = jest.fn()
  const mockOnTitleChange = jest.fn()
  
  const defaultProps = {
    screenplayId: 'test-screenplay',
    onBack: mockOnBack,
    onTitleChange: mockOnTitleChange,
    initialTitle: 'My Screenplay',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User Journey: Opening Screenplay Editor', () => {
    it('loads the screenplay editor with title and professional editor', () => {
      render(<ScreenplayEditor {...defaultProps} />)
      
      expect(screen.getByDisplayValue('My Screenplay')).toBeInTheDocument()
      expect(screen.getByText('SCREENPLAY')).toBeInTheDocument()
      expect(screen.getByTestId('screenplay-editor-pro')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('allows user to navigate back', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditor {...defaultProps} />)
      
      const backButton = screen.getByRole('button', { name: /back/i })
      await user.click(backButton)
      
      expect(mockOnBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('User Journey: Editing Screenplay Title', () => {
    it('allows user to update the screenplay title', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditor {...defaultProps} />)
      
      const titleInput = screen.getByDisplayValue('My Screenplay')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Screenplay Title')
      
      expect(titleInput).toHaveValue('Updated Screenplay Title')
      expect(mockOnTitleChange).toHaveBeenCalled()
    })

    it('retains title value across interactions', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditor {...defaultProps} />)
      
      const titleInput = screen.getByDisplayValue('My Screenplay')
      await user.type(titleInput, ' - Draft 2')
      
      expect(titleInput).toHaveValue('My Screenplay - Draft 2')
    })
  })

  describe('User Journey: Using Professional Editor', () => {
    it('renders the professional Slate.js editor for screenplay writing', () => {
      render(<ScreenplayEditor {...defaultProps} />)
      
      // Verify the professional editor is rendered
      expect(screen.getByTestId('screenplay-editor-pro')).toBeInTheDocument()
      expect(screen.getByText('Professional Screenplay Editor')).toBeInTheDocument()
    })

    it('provides save functionality', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditor {...defaultProps} />)
      
      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)
      
      // Save button should be clickable (no crash)
      expect(saveButton).toBeInTheDocument()
    })
  })

  describe('User Journey: Complete Workflow', () => {
    it('allows user to open editor, update title, and navigate back', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditor {...defaultProps} />)
      
      // Editor loads
      expect(screen.getByTestId('screenplay-editor-pro')).toBeInTheDocument()
      
      // Update title
      const titleInput = screen.getByDisplayValue('My Screenplay')
      await user.clear(titleInput)
      await user.type(titleInput, 'The Great Adventure')
      expect(titleInput).toHaveValue('The Great Adventure')
      
      // Navigate back
      const backButton = screen.getByRole('button', { name: /back/i })
      await user.click(backButton)
      expect(mockOnBack).toHaveBeenCalled()
    })
  })
})
