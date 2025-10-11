import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScreenplayEditorMain } from '@/components/sections/screenplay-editor/screenplay-editor-main'

describe('ScreenplayEditorMain Component', () => {
  const mockCurrentScene = {
    id: '1',
    number: '1',
    title: 'Opening Scene',
    content: '{}',
    characters: []
  }

  const mockProps = {
    currentScene: mockCurrentScene,
    sceneFormat: 'ext',
    sceneLocation: 'Park',
    sceneTimeOfDay: 'day',
    sceneDescription: 'A peaceful morning in the park',
    actionItems: [],
    dialogueItems: [],
    transitionItems: [],
    itemOrder: [],
    characters: ['JOHN', 'SARAH'],
    characterList: [
      { id: '1', name: 'JOHN', description: 'Main character' },
      { id: '2', name: 'SARAH', description: 'Supporting character' }
    ],
    showCharacterDropdown: null,
    characterDropdownIndex: {},
    draggedItem: null,
    dragOverItem: null,
    onSceneFormatChange: jest.fn(),
    onSceneLocationChange: jest.fn(),
    onSceneTimeOfDayChange: jest.fn(),
    onSceneDescriptionChange: jest.fn(),
    onActionAdd: jest.fn(),
    onActionUpdate: jest.fn(),
    onActionDelete: jest.fn(),
    onDialogueAdd: jest.fn(),
    onDialogueUpdate: jest.fn(),
    onDialogueDelete: jest.fn(),
    onTransitionAdd: jest.fn(),
    onTransitionUpdate: jest.fn(),
    onTransitionDelete: jest.fn(),
    onCharacterInput: jest.fn(),
    onCharacterBlur: jest.fn(),
    onCharacterSelect: jest.fn(),
    onCharacterKeyDown: jest.fn(),
    onDragStart: jest.fn(),
    onDragOver: jest.fn(),
    onDragLeave: jest.fn(),
    onDrop: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders scene editor when current scene is provided', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      expect(screen.getByText('Scene')).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Opening Scene')).toBeInTheDocument()
    })

    it('renders empty state when no current scene', () => {
      render(<ScreenplayEditorMain {...mockProps} currentScene={null} />)
      
      expect(screen.getByText('Select a scene to start writing')).toBeInTheDocument()
    })

    it('renders scene format dropdowns', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      // Check for the presence of select elements and input
      const selects = screen.getAllByRole('combobox')
      expect(selects).toHaveLength(2)
      expect(screen.getByDisplayValue('Park')).toBeInTheDocument()
    })

    it('renders scene description input', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      expect(screen.getByDisplayValue('A peaceful morning in the park')).toBeInTheDocument()
    })

    it('renders action buttons', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      expect(screen.getByText('Add Action')).toBeInTheDocument()
      expect(screen.getByText('Add Dialogue')).toBeInTheDocument()
      expect(screen.getByText('Add Transition')).toBeInTheDocument()
    })

    it('renders scene content area', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      expect(screen.getByText('Scene content will appear here as you add actions, dialogue, and transitions...')).toBeInTheDocument()
    })
  })

  describe('Scene Format Interactions', () => {
    it('calls onSceneFormatChange when format is changed', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorMain {...mockProps} />)
      
      // Find the format select (first combobox)
      const formatSelect = screen.getAllByRole('combobox')[0]
      await user.selectOptions(formatSelect, 'int')
      
      expect(mockProps.onSceneFormatChange).toHaveBeenCalledWith('int')
    })

    it('calls onSceneLocationChange when location is changed', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorMain {...mockProps} />)
      
      const locationInput = screen.getByDisplayValue('Park')
      await user.clear(locationInput)
      await user.type(locationInput, 'Office')
      
      // Check that the handler was called multiple times (once for each keystroke)
      expect(mockProps.onSceneLocationChange).toHaveBeenCalledTimes(7) // clear + type 'Office'
    })

    it('calls onSceneTimeOfDayChange when time of day is changed', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorMain {...mockProps} />)
      
      // Find the time select (second combobox)
      const timeSelect = screen.getAllByRole('combobox')[1]
      await user.selectOptions(timeSelect, 'night')
      
      expect(mockProps.onSceneTimeOfDayChange).toHaveBeenCalledWith('night')
    })

    it('calls onSceneDescriptionChange when description is changed', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorMain {...mockProps} />)
      
      const descriptionInput = screen.getByDisplayValue('A peaceful morning in the park')
      await user.clear(descriptionInput)
      await user.type(descriptionInput, 'A dark and stormy night')
      
      // Check that the handler was called multiple times (once for each keystroke)
      expect(mockProps.onSceneDescriptionChange).toHaveBeenCalledTimes(24) // 22 characters + clear + initial
    })
  })

  describe('Action Button Interactions', () => {
    it('calls onActionAdd when add action button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorMain {...mockProps} />)
      
      const addActionButton = screen.getByText('Add Action')
      await user.click(addActionButton)
      
      expect(mockProps.onActionAdd).toHaveBeenCalledTimes(1)
    })

    it('calls onDialogueAdd when add dialogue button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorMain {...mockProps} />)
      
      const addDialogueButton = screen.getByText('Add Dialogue')
      await user.click(addDialogueButton)
      
      expect(mockProps.onDialogueAdd).toHaveBeenCalledTimes(1)
    })

    it('calls onTransitionAdd when add transition button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorMain {...mockProps} />)
      
      const addTransitionButton = screen.getByText('Add Transition')
      await user.click(addTransitionButton)
      
      expect(mockProps.onTransitionAdd).toHaveBeenCalledTimes(1)
    })
  })

  describe('Transition Button State', () => {
    it('disables transition button when transition exists', () => {
      render(<ScreenplayEditorMain {...mockProps} transitionItems={[{ id: '1', content: 'CUT TO' }]} />)
      
      const addTransitionButton = screen.getByText('Add Transition')
      expect(addTransitionButton).toBeDisabled()
    })

    it('enables transition button when no transition exists', () => {
      render(<ScreenplayEditorMain {...mockProps} transitionItems={[]} />)
      
      const addTransitionButton = screen.getByText('Add Transition')
      expect(addTransitionButton).not.toBeDisabled()
    })
  })

  describe('Scene Number and Title Editing', () => {
    it('calls onSceneFormatChange when scene number is changed', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorMain {...mockProps} />)
      
      const sceneNumberInput = screen.getByDisplayValue('1')
      await user.clear(sceneNumberInput)
      await user.type(sceneNumberInput, '5')
      
      // Check that the handler was called multiple times (once for each keystroke)
      expect(mockProps.onSceneFormatChange).toHaveBeenCalledTimes(2) // clear + type '5'
    })

    it('calls onSceneLocationChange when scene title is changed', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorMain {...mockProps} />)
      
      const sceneTitleInput = screen.getByDisplayValue('Opening Scene')
      await user.clear(sceneTitleInput)
      await user.type(sceneTitleInput, 'New Scene')
      
      // Check that the handler was called multiple times (once for each keystroke)
      expect(mockProps.onSceneLocationChange).toHaveBeenCalledTimes(10) // clear + type 'New Scene'
    })
  })

  describe('Validation Styling', () => {
    it('applies error styling when format is empty', () => {
      render(<ScreenplayEditorMain {...mockProps} sceneFormat="" />)
      
      // Find the format select (first combobox)
      const formatSelect = screen.getAllByRole('combobox')[0]
      expect(formatSelect).toHaveClass('border-red-500')
    })

    it('applies error styling when location is empty', () => {
      render(<ScreenplayEditorMain {...mockProps} sceneLocation="" />)
      
      const locationInput = screen.getByDisplayValue('')
      expect(locationInput).toHaveClass('border-red-500')
    })

    it('applies error styling when time of day is empty', () => {
      render(<ScreenplayEditorMain {...mockProps} sceneTimeOfDay="" />)
      
      // Find the time select (second combobox)
      const timeSelect = screen.getAllByRole('combobox')[1]
      expect(timeSelect).toHaveClass('border-red-500')
    })
  })

  describe('Accessibility', () => {
    it('has proper button roles and labels', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      const addActionButton = screen.getByRole('button', { name: /add action/i })
      const addDialogueButton = screen.getByRole('button', { name: /add dialogue/i })
      const addTransitionButton = screen.getByRole('button', { name: /add transition/i })
      
      expect(addActionButton).toBeInTheDocument()
      expect(addDialogueButton).toBeInTheDocument()
      expect(addTransitionButton).toBeInTheDocument()
    })

    it('has proper input accessibility', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      const locationInput = screen.getByPlaceholderText('LOCATION *')
      const descriptionInput = screen.getByPlaceholderText('Scene description...')
      
      expect(locationInput).toBeInTheDocument()
      expect(descriptionInput).toBeInTheDocument()
    })

    it('has proper select accessibility', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      // Find selects by their roles
      const selects = screen.getAllByRole('combobox')
      
      expect(selects).toHaveLength(2)
      expect(selects[0]).toBeInTheDocument()
      expect(selects[1]).toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('has proper container structure', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      // Target the main container div
      const container = screen.getByText('Scene').closest('div')?.parentElement?.parentElement
      expect(container).toHaveClass('flex-1', 'flex', 'flex-col', 'bg-transparent')
    })

    it('has proper header structure', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      // Target the header div
      const header = screen.getByText('Scene').closest('div')?.parentElement
      expect(header).toHaveClass('p-4', 'border-b')
    })

    it('has proper content structure', () => {
      render(<ScreenplayEditorMain {...mockProps} />)
      
      // Target the content div
      const content = screen.getByText('Add Action').closest('div')?.parentElement
      expect(content).toHaveClass('flex-1', 'p-4', 'space-y-4')
    })
  })
})
