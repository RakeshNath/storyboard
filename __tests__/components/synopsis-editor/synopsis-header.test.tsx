import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SynopsisHeader } from '@/components/sections/synopsis-editor/synopsis-header'

describe('SynopsisHeader Component', () => {
  const mockProps = {
    synopsisTitle: 'Test Synopsis',
    hasUnsavedChanges: false,
    pageCount: 5,
    wordCount: 100,
    characterCount: 500,
    onBack: jest.fn(),
    onSave: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders synopsis header with title', () => {
      render(<SynopsisHeader {...mockProps} />)
      
      expect(screen.getByText('Test Synopsis')).toBeInTheDocument()
      expect(screen.getByText('Synopsis Editor')).toBeInTheDocument()
      expect(screen.getByText('Back to Storyboards')).toBeInTheDocument()
    })

    it('renders page statistics', () => {
      render(<SynopsisHeader {...mockProps} />)
      
      expect(screen.getByText('5 pages')).toBeInTheDocument()
    })

    it('renders save button', () => {
      render(<SynopsisHeader {...mockProps} />)
      
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('shows unsaved changes indicator when there are unsaved changes', () => {
      render(<SynopsisHeader {...mockProps} hasUnsavedChanges={true} />)
      
      expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
    })

    it('does not show unsaved changes indicator when there are no unsaved changes', () => {
      render(<SynopsisHeader {...mockProps} hasUnsavedChanges={false} />)
      
      expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onBack when back button is clicked', async () => {
      const user = userEvent.setup()
      render(<SynopsisHeader {...mockProps} />)
      
      const backButton = screen.getByText('Back to Storyboards')
      await user.click(backButton)
      
      expect(mockProps.onBack).toHaveBeenCalledTimes(1)
    })

    it('calls onSave when save button is clicked', async () => {
      const user = userEvent.setup()
      render(<SynopsisHeader {...mockProps} hasUnsavedChanges={true} />)
      
      const saveButton = screen.getByText('Save')
      await user.click(saveButton)
      
      expect(mockProps.onSave).toHaveBeenCalledTimes(1)
    })

    it('disables save button when there are no unsaved changes', () => {
      render(<SynopsisHeader {...mockProps} hasUnsavedChanges={false} />)
      
      const saveButton = screen.getByText('Save')
      expect(saveButton).toBeDisabled()
    })

    it('enables save button when there are unsaved changes', () => {
      render(<SynopsisHeader {...mockProps} hasUnsavedChanges={true} />)
      
      const saveButton = screen.getByText('Save')
      expect(saveButton).not.toBeDisabled()
    })
  })

  describe('Page Statistics', () => {
    it('displays singular page count correctly', () => {
      render(<SynopsisHeader {...mockProps} pageCount={1} />)
      
      expect(screen.getByText('1 page')).toBeInTheDocument()
    })

    it('displays plural page count correctly', () => {
      render(<SynopsisHeader {...mockProps} pageCount={5} />)
      
      expect(screen.getByText('5 pages')).toBeInTheDocument()
    })

    it('handles zero page count', () => {
      render(<SynopsisHeader {...mockProps} pageCount={0} />)
      
      expect(screen.getByText('0 pages')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper button roles and labels', () => {
      render(<SynopsisHeader {...mockProps} />)
      
      const backButton = screen.getByRole('button', { name: /back to storyboards/i })
      const saveButton = screen.getByRole('button', { name: /save/i })
      
      expect(backButton).toBeInTheDocument()
      expect(saveButton).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(<SynopsisHeader {...mockProps} />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Test Synopsis')
    })
  })
})
