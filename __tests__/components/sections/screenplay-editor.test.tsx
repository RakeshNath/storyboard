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
})

describe.skip('ScreenplayEditor Component - Old Tests (Legacy Editor)', () => {
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

  it.skip('displays default characters', async () => {
    // Character dialog tests have rendering issues with Dialog + Tooltip interaction in test environment
    // Character functionality is tested in dedicated screenplay-characters.test.tsx
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Click the Characters button in header to open the dialog
    const charactersButton = screen.getByRole('button', { name: /characters/i })
    await user.click(charactersButton)
    
    // Characters should now be visible in the dialog
    await waitFor(() => {
      const johnInputs = screen.getAllByDisplayValue('JOHN')
      expect(johnInputs.length).toBeGreaterThan(0)
      const sarahInputs = screen.getAllByDisplayValue('SARAH')
      expect(sarahInputs.length).toBeGreaterThan(0)
      const antagonistInputs = screen.getAllByDisplayValue('ANTAGONIST')
      expect(antagonistInputs.length).toBeGreaterThan(0)
      const detectiveInputs = screen.getAllByDisplayValue('DETECTIVE')
      expect(detectiveInputs.length).toBeGreaterThan(0)
    })
  })

  it.skip('displays default character list with descriptions', async () => {
    // Character dialog tests have rendering issues with Dialog + Tooltip interaction in test environment
    // Character functionality is tested in dedicated screenplay-characters.test.tsx
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Click the Characters button in header to open the dialog
    const charactersButton = screen.getByRole('button', { name: /characters/i })
    await user.click(charactersButton)
    
    // Character descriptions should be visible in the dialog
    await waitFor(() => {
      expect(screen.getAllByDisplayValue('JOHN').length).toBeGreaterThan(0)
      expect(screen.getAllByDisplayValue('Main protagonist').length).toBeGreaterThan(0)
      expect(screen.getAllByDisplayValue('SARAH').length).toBeGreaterThan(0)
      expect(screen.getAllByDisplayValue('Supporting character').length).toBeGreaterThan(0)
    })
  })

  it('allows editing screenplay title', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    const titleInput = screen.getByDisplayValue('Test Screenplay')
    await user.clear(titleInput)
    await user.type(titleInput, 'New Title')
    
    expect(titleInput).toHaveValue('New Title')
  })

  it('calls onTitleChange when title is modified', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    const titleInput = screen.getByDisplayValue('Test Screenplay')
    await user.clear(titleInput)
    await user.type(titleInput, 'New Title')
    
    // Trigger blur to call onTitleChange
    await user.tab()
    
    expect(mockOnTitleChange).toHaveBeenCalledWith('New Title')
  })

  it('adds new scene when Add Scene button is clicked', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    const addSceneButton = screen.getByRole('button', { name: /add scene/i })
    await user.click(addSceneButton)
    
    // Should show new scene in the scenes list (appears twice - in sidebar and main editor)
    await waitFor(() => {
      const sceneInputs = screen.getAllByDisplayValue('Scene 1')
      expect(sceneInputs.length).toBeGreaterThan(0)
    })
  })

  it('allows editing scene title', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Add a scene first
    const addSceneButton = screen.getByRole('button', { name: /add scene/i })
    await user.click(addSceneButton)
    
    // Edit the scene title (get the first input which is in the sidebar)
    const sceneTitleInputs = screen.getAllByDisplayValue('Scene 1')
    const sceneTitleInput = sceneTitleInputs[0]
    await user.clear(sceneTitleInput)
    await user.type(sceneTitleInput, 'Opening Scene')
    
    expect(sceneTitleInput).toHaveValue('Opening Scene')
  })

  it('allows editing scene description', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Add a scene first
    const addSceneButton = screen.getByRole('button', { name: /add scene/i })
    await user.click(addSceneButton)
    
    // Find and edit scene description
    const sceneDescriptionInput = screen.getByPlaceholderText(/scene description/i)
    await user.type(sceneDescriptionInput, 'A cozy living room with warm lighting')
    
    expect(sceneDescriptionInput).toHaveValue('A cozy living room with warm lighting')
  })

  it('deletes scene when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Add a scene first
    const addSceneButton = screen.getByRole('button', { name: /add scene/i })
    await user.click(addSceneButton)
    
    // Find and click delete button
    const deleteButton = screen.getByTestId('trash2-icon').closest('button')
    expect(deleteButton).toBeInTheDocument()
    
    if (deleteButton) {
      await user.click(deleteButton)
    }
    
    // Confirm deletion in dialog
    const confirmButton = screen.getByRole('button', { name: /delete/i })
    await user.click(confirmButton)
    
    // Scene should be removed
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Scene 1')).not.toBeInTheDocument()
    })
  })

  it.skip('adds new character when Add Character button is clicked', async () => {
    // Character dialog tests have rendering issues with Dialog + Tooltip interaction in test environment
    // Character functionality is tested in dedicated screenplay-characters.test.tsx
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Open characters dialog
    const charactersButton = screen.getByRole('button', { name: /characters/i })
    await user.click(charactersButton)
    
    // Find and fill new character form
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/character name/i)).toBeInTheDocument()
    })
    
    const characterNameInput = screen.getByPlaceholderText(/character name/i)
    const characterDescriptionInput = screen.getByPlaceholderText(/character description/i)
    
    await user.type(characterNameInput, 'NEW CHARACTER')
    await user.type(characterDescriptionInput, 'A new character')
    
    const addCharacterButton = screen.getByRole('button', { name: /add character/i })
    await user.click(addCharacterButton)
    
    // Should show new character in the list
    await waitFor(() => {
      expect(screen.getAllByDisplayValue('NEW CHARACTER').length).toBeGreaterThan(0)
      expect(screen.getAllByDisplayValue('A new character').length).toBeGreaterThan(0)
    })
  })

  it.skip('edits existing character', async () => {
    // Character dialog tests have rendering issues with Dialog + Tooltip interaction in test environment
    // Character functionality is tested in dedicated screenplay-characters.test.tsx
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Open characters dialog
    const charactersButton = screen.getByRole('button', { name: /characters/i })
    await user.click(charactersButton)
    
    // Edit existing character
    await waitFor(() => {
      expect(screen.getAllByDisplayValue('JOHN').length).toBeGreaterThan(0)
    })
    
    const characterNameInput = screen.getAllByDisplayValue('JOHN')[0]
    await user.clear(characterNameInput)
    await user.type(characterNameInput, 'JOHN DOE')
    
    const characterDescriptionInput = screen.getAllByDisplayValue('Main protagonist')[0]
    await user.clear(characterDescriptionInput)
    await user.type(characterDescriptionInput, 'Updated protagonist')
    
    expect(characterNameInput).toHaveValue('JOHN DOE')
    expect(characterDescriptionInput).toHaveValue('Updated protagonist')
  })

  it.skip('deletes character when delete button is clicked', async () => {
    // Character dialog tests have rendering issues with Dialog + Tooltip interaction in test environment
    // Character functionality is tested in dedicated screenplay-characters.test.tsx
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Open characters dialog
    const charactersButton = screen.getByRole('button', { name: /characters/i })
    await user.click(charactersButton)
    
    // Wait for dialog to open and find delete buttons
    await waitFor(() => {
      expect(screen.getAllByTestId('trash2-icon').length).toBeGreaterThan(0)
    })
    
    const deleteButtons = screen.getAllByTestId('trash2-icon')
    const firstDeleteButton = deleteButtons[0].closest('button')
    
    if (firstDeleteButton) {
      await user.click(firstDeleteButton)
      
      // Confirm deletion
      const confirmButtons = screen.getAllByRole('button', { name: /delete/i })
      const confirmButton = confirmButtons[confirmButtons.length - 1]
      await user.click(confirmButton)
      
      // Character should be removed
      await waitFor(() => {
        expect(screen.queryByDisplayValue('JOHN')).not.toBeInTheDocument()
      })
    }
  })

  it('adds action item when Add Action button is clicked', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Add a scene first so we can add actions to it
    const addSceneButton = screen.getByRole('button', { name: /add scene/i })
    await user.click(addSceneButton)
    
    // Click the Add Action button
    const addActionButton = screen.getByRole('button', { name: /add action/i })
    await user.click(addActionButton)
    
    // Action should be added and rendered (default placeholder: "Enter action description...")
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter action description/i)).toBeInTheDocument()
    })
  })

  it('adds dialogue item when Add Dialogue button is clicked', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Add a scene first so we can add dialogue to it
    const addSceneButton = screen.getByRole('button', { name: /add scene/i })
    await user.click(addSceneButton)
    
    // Click the Add Dialogue button
    const addDialogueButton = screen.getByRole('button', { name: /add dialogue/i })
    await user.click(addDialogueButton)
    
    // Dialogue item should be added and rendered
    await waitFor(() => {
      // Look for the character input that was created
      const characterInputs = screen.getAllByPlaceholderText(/character/i)
      expect(characterInputs.length).toBeGreaterThan(0)
      
      // Look for the dialogue textarea
      const dialogueInputs = screen.getAllByPlaceholderText(/dialogue text/i)
      expect(dialogueInputs.length).toBeGreaterThan(0)
    })
  })

  it('adds transition item when Add Transition button is clicked', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Add a scene first so we can add transition to it
    const addSceneButton = screen.getByRole('button', { name: /add scene/i })
    await user.click(addSceneButton)
    
    // Click the Add Transition button
    const addTransitionButton = screen.getByRole('button', { name: /add transition/i })
    await user.click(addTransitionButton)
    
    // Transition should be added and rendered (default value: "CUT TO")
    await waitFor(() => {
      expect(screen.getByDisplayValue('CUT TO')).toBeInTheDocument()
    })
  })

  it('switches between tabs', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Click on Help tab
    const helpTab = screen.getByRole('tab', { name: /help/i })
    await user.click(helpTab)
    
    // Should show help content
    await waitFor(() => {
      expect(screen.getByText(/screenplay writing guide/i)).toBeInTheDocument()
    })
    
    // Click back on Script tab
    const scriptTab = screen.getByRole('tab', { name: /script/i })
    await user.click(scriptTab)
    
    // Should show script interface
    expect(screen.getByRole('button', { name: /add scene/i })).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('displays help content when help tab is clicked', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Click on Help tab
    const helpTab = screen.getByRole('tab', { name: /help/i })
    await user.click(helpTab)
    
    // Should show help content
    await waitFor(() => {
      expect(screen.getByText(/screenplay writing guide/i)).toBeInTheDocument()
    })
  })

  it.skip('handles empty character name validation', async () => {
    // Character dialog tests have rendering issues with Dialog + Tooltip interaction in test environment
    // Character functionality is tested in dedicated screenplay-characters.test.tsx
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Open characters dialog
    const charactersButton = screen.getByRole('button', { name: /characters/i })
    await user.click(charactersButton)
    
    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/character name/i)).toBeInTheDocument()
    })
    
    // Count existing characters
    const initialCharacters = screen.getAllByDisplayValue(/JOHN|SARAH|ANTAGONIST|DETECTIVE/)
    const initialCount = initialCharacters.length
    
    // Try to add character with empty name
    const addCharacterButton = screen.getByRole('button', { name: /add character/i })
    await user.click(addCharacterButton)
    
    // Should not add character with empty name (count should remain the same)
    const currentCharacters = screen.getAllByDisplayValue(/JOHN|SARAH|ANTAGONIST|DETECTIVE/)
    expect(currentCharacters.length).toBe(initialCount)
  })

  it('handles empty scene title validation', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Add a scene
    const addSceneButton = screen.getByRole('button', { name: /add scene/i })
    await user.click(addSceneButton)
    
    // Clear the scene title (get the first input which is in the sidebar)
    const sceneTitleInputs = screen.getAllByDisplayValue('Scene 1')
    const sceneTitleInput = sceneTitleInputs[0]
    await user.clear(sceneTitleInput)
    
    // Should handle empty title gracefully
    expect(sceneTitleInput).toHaveValue('')
  })

  it.skip('shows word count for screenplay', async () => {
    // Word count feature is not yet implemented in the component
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Should display word count
    expect(screen.getByText(/word count/i)).toBeInTheDocument()
  })

  it('handles keyboard shortcuts', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Test Ctrl+S for save (if implemented)
    await user.keyboard('{Control>}s{/Control}')
    
    // Should not throw error
    expect(screen.getByDisplayValue('Test Screenplay')).toBeInTheDocument()
  })

  it('persists data when switching between tabs', async () => {
    const user = userEvent.setup()
    render(<ScreenplayEditor {...defaultProps} />)
    
    // Add a scene
    const addSceneButton = screen.getByRole('button', { name: /add scene/i })
    await user.click(addSceneButton)
    
    const sceneTitleInputs = screen.getAllByDisplayValue('Scene 1')
    const sceneTitleInput = sceneTitleInputs[0]
    await user.clear(sceneTitleInput)
    await user.type(sceneTitleInput, 'My Scene')
    
    // Switch to Help tab
    const helpTab = screen.getByRole('tab', { name: /help/i })
    await user.click(helpTab)
    
    // Switch back to Script tab
    const scriptTab = screen.getByRole('tab', { name: /script/i })
    await user.click(scriptTab)
    
    // Scene data should be preserved
    const mySceneInputs = screen.getAllByDisplayValue('My Scene')
    expect(mySceneInputs.length).toBeGreaterThan(0)
  })
})
