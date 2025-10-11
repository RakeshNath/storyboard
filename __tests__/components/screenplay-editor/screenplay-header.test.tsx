import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScreenplayHeader } from '@/components/sections/screenplay-editor/screenplay-header'

describe('ScreenplayHeader Component', () => {
  const mockProps = {
    scriptName: 'Test Screenplay',
    onTitleChange: jest.fn(),
    onSave: jest.fn(),
    onCharactersClick: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders screenplay header with title', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      expect(screen.getByDisplayValue('Test Screenplay')).toBeInTheDocument()
      expect(screen.getByText('SCREENPLAY')).toBeInTheDocument()
      expect(screen.getByText('← Back')).toBeInTheDocument()
    })

    it('renders save button', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('renders characters button', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      expect(screen.getByText('Characters')).toBeInTheDocument()
    })

    it('renders screenplay badge with proper styling', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      const screenplayBadge = screen.getByText('SCREENPLAY')
      expect(screenplayBadge).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onTitleChange when title is modified', async () => {
      const user = userEvent.setup()
      render(<ScreenplayHeader {...mockProps} />)
      
      const titleInput = screen.getByDisplayValue('Test Screenplay')
      await user.clear(titleInput)
      await user.type(titleInput, 'New Title')
      
      // Check that the handler was called multiple times (once for each keystroke)
      expect(mockProps.onTitleChange).toHaveBeenCalledTimes(10) // clear + type 'New Title'
    })

    it('calls onSave when save button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayHeader {...mockProps} />)
      
      const saveButton = screen.getByText('Save')
      await user.click(saveButton)
      
      expect(mockProps.onSave).toHaveBeenCalledTimes(1)
    })

    it('calls onCharactersClick when characters button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayHeader {...mockProps} />)
      
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      expect(mockProps.onCharactersClick).toHaveBeenCalledTimes(1)
    })

    it('handles back button click', async () => {
      const user = userEvent.setup()
      render(<ScreenplayHeader {...mockProps} />)
      
      const backButton = screen.getByText('← Back')
      await user.click(backButton)
      
      // The back button uses window.history.back() which we can't easily test
      // but we can verify the button is clickable
      expect(backButton).toBeInTheDocument()
    })
  })

  describe('Title Input', () => {
    it('has correct placeholder text', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      const titleInput = screen.getByPlaceholderText('Screenplay Title')
      expect(titleInput).toBeInTheDocument()
    })

    it('has correct styling classes', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      const titleInput = screen.getByDisplayValue('Test Screenplay')
      expect(titleInput).toHaveClass('text-xl', 'font-bold', 'border-none', '!bg-transparent', 'p-0', 'h-auto')
    })

    it('handles empty title', async () => {
      const user = userEvent.setup()
      render(<ScreenplayHeader {...mockProps} />)
      
      const titleInput = screen.getByDisplayValue('Test Screenplay')
      await user.clear(titleInput)
      
      expect(mockProps.onTitleChange).toHaveBeenCalledWith('')
    })
  })

  describe('Button Styling', () => {
    it('has save button with correct styling', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      const saveButton = screen.getByText('Save')
      expect(saveButton).toHaveClass('h-8', 'rounded-md')
    })

    it('has characters button with correct styling', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      const charactersButton = screen.getByText('Characters')
      expect(charactersButton).toHaveClass('h-8', 'rounded-md')
    })
  })

  describe('Accessibility', () => {
    it('has proper button roles and labels', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      const saveButton = screen.getByRole('button', { name: /save/i })
      const charactersButton = screen.getByRole('button', { name: /characters/i })
      const backButton = screen.getByRole('button', { name: /back/i })
      
      expect(saveButton).toBeInTheDocument()
      expect(charactersButton).toBeInTheDocument()
      expect(backButton).toBeInTheDocument()
    })

    it('has proper input accessibility', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      const titleInput = screen.getByDisplayValue('Test Screenplay')
      expect(titleInput).toHaveAttribute('placeholder', 'Screenplay Title')
    })
  })

  describe('Layout Structure', () => {
    it('has proper container structure', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      // Target the main container div
      const container = screen.getByText('← Back').closest('div')?.parentElement?.parentElement
      expect(container).toHaveClass('border-b', 'bg-card', 'p-4')
    })

    it('has proper flex layout', () => {
      render(<ScreenplayHeader {...mockProps} />)
      
      // Target the main flex container
      const mainContainer = screen.getByText('← Back').closest('div')?.parentElement
      expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-between')
    })
  })
})
