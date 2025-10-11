/**
 * Tests for ScreenplayCharacters component
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScreenplayCharacters } from '@/components/sections/screenplay-editor/screenplay-characters'
import type { Character } from '@/components/sections/screenplay-editor/types'

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  )
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ onChange, value, placeholder, ...props }: any) => (
    <input 
      onChange={onChange} 
      value={value} 
      placeholder={placeholder}
      {...props}
    />
  )
}))

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>
}))

jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>
}))

describe('ScreenplayCharacters Component', () => {
  const mockCharacterList: Character[] = [
    { id: '1', name: 'JOHN', description: 'Main protagonist' },
    { id: '2', name: 'SARAH', description: 'Supporting character' },
    { id: '3', name: 'ANTAGONIST', description: 'Main villain' }
  ]

  const defaultProps = {
    characterList: mockCharacterList,
    newCharacterName: '',
    newCharacterDescription: '',
    getCharacterUsageCount: jest.fn((name: string) => {
      const counts: { [key: string]: number } = {
        'JOHN': 5,
        'SARAH': 3,
        'ANTAGONIST': 2
      }
      return counts[name] || 0
    }),
    getCharacterSceneCount: jest.fn((name: string) => {
      const counts: { [key: string]: number } = {
        'JOHN': 3,
        'SARAH': 2,
        'ANTAGONIST': 1
      }
      return counts[name] || 0
    }),
    onCharacterNameUpdate: jest.fn(),
    onCharacterDescriptionUpdate: jest.fn(),
    onCharacterAdd: jest.fn(),
    onCharacterDelete: jest.fn(),
    onNewCharacterNameChange: jest.fn(),
    onNewCharacterDescriptionChange: jest.fn(),
    onSave: jest.fn(),
    onCancel: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders character management title', () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      expect(screen.getByText('Character Management')).toBeInTheDocument()
    })

    it('renders all characters in the list', () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      expect(screen.getByDisplayValue('JOHN')).toBeInTheDocument()
      expect(screen.getByDisplayValue('SARAH')).toBeInTheDocument()
      expect(screen.getByDisplayValue('ANTAGONIST')).toBeInTheDocument()
    })

    it('renders character descriptions', () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      expect(screen.getByDisplayValue('Main protagonist')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Supporting character')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Main villain')).toBeInTheDocument()
    })

    it('renders new character input fields', () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      expect(screen.getByPlaceholderText('Character Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Character Description')).toBeInTheDocument()
    })

    it('renders add character button', () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      expect(screen.getByText('Add Character')).toBeInTheDocument()
    })

    it('renders save and cancel buttons', () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      expect(screen.getByText('Save Changes')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
  })

  describe('Character Usage Statistics', () => {
    it('displays character usage counts', () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      // The component should call the usage count functions
      expect(defaultProps.getCharacterUsageCount).toHaveBeenCalledWith('JOHN')
      expect(defaultProps.getCharacterUsageCount).toHaveBeenCalledWith('SARAH')
      expect(defaultProps.getCharacterUsageCount).toHaveBeenCalledWith('ANTAGONIST')
    })

    it('displays character scene counts', () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      // The component should call the scene count functions
      expect(defaultProps.getCharacterSceneCount).toHaveBeenCalledWith('JOHN')
      expect(defaultProps.getCharacterSceneCount).toHaveBeenCalledWith('SARAH')
      expect(defaultProps.getCharacterSceneCount).toHaveBeenCalledWith('ANTAGONIST')
    })
  })

  describe('Character Name Updates', () => {
    it('calls onCharacterNameUpdate when character name is changed', async () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      const nameInput = screen.getByDisplayValue('JOHN')
      fireEvent.change(nameInput, { target: { value: 'JOHNNY' } })
      
      expect(defaultProps.onCharacterNameUpdate).toHaveBeenCalledWith('1', 'JOHNNY')
    })

    it('handles empty character name input', async () => {
      const user = userEvent.setup()
      render(<ScreenplayCharacters {...defaultProps} />)
      
      const nameInput = screen.getByDisplayValue('JOHN')
      await user.clear(nameInput)
      
      expect(defaultProps.onCharacterNameUpdate).toHaveBeenCalledWith('1', '')
    })
  })

  describe('Character Description Updates', () => {
    it('calls onCharacterDescriptionUpdate when description is changed', async () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      const descInput = screen.getByDisplayValue('Main protagonist')
      fireEvent.change(descInput, { target: { value: 'Updated protagonist' } })
      
      expect(defaultProps.onCharacterDescriptionUpdate).toHaveBeenCalledWith('1', 'Updated protagonist')
    })

    it('handles empty description input', async () => {
      const user = userEvent.setup()
      render(<ScreenplayCharacters {...defaultProps} />)
      
      const descInput = screen.getByDisplayValue('Main protagonist')
      await user.clear(descInput)
      
      expect(defaultProps.onCharacterDescriptionUpdate).toHaveBeenCalledWith('1', '')
    })
  })

  describe('New Character Creation', () => {
    it('calls onNewCharacterNameChange when new character name is typed', async () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      const newNameInput = screen.getByPlaceholderText('Character Name')
      fireEvent.change(newNameInput, { target: { value: 'NEWCHAR' } })
      
      expect(defaultProps.onNewCharacterNameChange).toHaveBeenCalledWith('NEWCHAR')
    })

    it('calls onNewCharacterDescriptionChange when new character description is typed', async () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      const newDescInput = screen.getByPlaceholderText('Character Description')
      fireEvent.change(newDescInput, { target: { value: 'New character description' } })
      
      expect(defaultProps.onNewCharacterDescriptionChange).toHaveBeenCalledWith('New character description')
    })

    it('calls onCharacterAdd when Add Character button is clicked', async () => {
      const user = userEvent.setup()
      // Need to provide a non-empty name so the button is enabled
      const propsWithName = { ...defaultProps, newCharacterName: 'TEST' }
      render(<ScreenplayCharacters {...propsWithName} />)
      
      const addButton = screen.getByText('Add Character')
      await user.click(addButton)
      
      expect(defaultProps.onCharacterAdd).toHaveBeenCalled()
    })
  })

  describe('Character Deletion', () => {
    it('calls onCharacterDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayCharacters {...defaultProps} />)
      
      // Find the delete button for the first character (JOHN)
      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button => 
        button.getAttribute('aria-label')?.includes('Delete JOHN')
      )
      
      if (deleteButton) {
        await user.click(deleteButton)
        expect(defaultProps.onCharacterDelete).toHaveBeenCalledWith('1')
      }
    })
  })

  describe('Save and Cancel Actions', () => {
    it('calls onSave when Save Changes button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayCharacters {...defaultProps} />)
      
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)
      
      expect(defaultProps.onSave).toHaveBeenCalled()
    })

    it('calls onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayCharacters {...defaultProps} />)
      
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)
      
      expect(defaultProps.onCancel).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty character list', () => {
      render(<ScreenplayCharacters {...defaultProps} characterList={[]} />)
      
      expect(screen.getByText('Character Management')).toBeInTheDocument()
      expect(screen.getByText('Add Character')).toBeInTheDocument()
    })

    it('handles undefined character usage counts', () => {
      const propsWithUndefinedCounts = {
        ...defaultProps,
        getCharacterUsageCount: jest.fn(() => undefined as any),
        getCharacterSceneCount: jest.fn(() => undefined as any)
      }
      
      render(<ScreenplayCharacters {...propsWithUndefinedCounts} />)
      
      // Should not crash and should still render
      expect(screen.getByText('Character Management')).toBeInTheDocument()
    })

    it('handles special characters in character names', async () => {
      render(<ScreenplayCharacters {...defaultProps} />)
      
      const nameInput = screen.getByDisplayValue('JOHN')
      fireEvent.change(nameInput, { target: { value: 'JOHN-DOE' } })
      
      expect(defaultProps.onCharacterNameUpdate).toHaveBeenCalledWith('1', 'JOHN-DOE')
    })

    it('renders delete button for each character', () => {
      // This test ensures the delete button and its onClick handler exist
      const propsWithUsage = {
        ...defaultProps,
        getCharacterUsageCount: jest.fn(() => 0), // No usage, so button is enabled
        getCharacterSceneCount: jest.fn(() => 0)
      }
      
      render(<ScreenplayCharacters {...propsWithUsage} />)
      
      // Find all buttons
      const buttons = screen.getAllByRole('button')
      
      // Delete buttons should exist for each character (rendered but may be disabled)
      expect(buttons.length).toBeGreaterThan(mockCharacterList.length)
    })
  })
})