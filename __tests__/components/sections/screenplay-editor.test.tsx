import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Edit3: () => <div data-testid="edit3-icon">Edit3</div>,
  Trash2: () => <div data-testid="trash2-icon">Trash2</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  FileText: () => <div data-testid="filetext-icon">FileText</div>,
  HelpCircle: () => <div data-testid="helpcircle-icon">HelpCircle</div>,
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

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('uses window.history.back when onBack is not provided', async () => {
    const user = userEvent.setup()
    const mockHistoryBack = jest.fn()
    window.history.back = mockHistoryBack
    
    render(<ScreenplayEditor {...defaultProps} onBack={undefined} />)
    
    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)
    
    expect(mockHistoryBack).toHaveBeenCalled()
  })

  it('calls onTitleChange when title is modified', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    const titleInput = screen.getByDisplayValue('Test Screenplay')
    await user.clear(titleInput)
    await user.type(titleInput, 'New Title')
    
    expect(mockOnTitleChange).toHaveBeenCalled()
  })

  it('renders save button', () => {
    render(<ScreenplayEditor {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('calls handleSave when save button is clicked', async () => {
    const user = userEvent.setup()
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    render(<ScreenplayEditor {...defaultProps} />)
    
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    
    expect(consoleSpy).toHaveBeenCalledWith('Screenplay saved:', {
      screenplayId: 'test-screenplay-1',
      title: 'Test Screenplay'
    })
    
    consoleSpy.mockRestore()
  })
})
