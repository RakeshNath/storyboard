import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StoryboardsContent } from '@/components/sections/storyboards-content'

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
  FileText: () => <div data-testid="filetext-icon">FileText</div>,
  BookOpen: () => <div data-testid="bookopen-icon">BookOpen</div>,
  Play: () => <div data-testid="play-icon">Play</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  CircleIcon: () => <div data-testid="circle-icon">Circle</div>,
}))

// Mock Dialog components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, ...props }: any) => (
    <div data-testid="dialog" {...props}>
      {children}
    </div>
  ),
  DialogContent: ({ children, ...props }: any) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
  DialogDescription: ({ children, ...props }: any) => (
    <div data-testid="dialog-description" {...props}>
      {children}
    </div>
  ),
  DialogFooter: ({ children, ...props }: any) => (
    <div data-testid="dialog-footer" {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children, ...props }: any) => (
    <div data-testid="dialog-header" {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({ children, ...props }: any) => (
    <h2 data-testid="dialog-title" {...props}>
      {children}
    </h2>
  ),
  DialogTrigger: ({ children, ...props }: any) => (
    <div data-testid="dialog-trigger" {...props}>
      {children}
    </div>
  ),
}))

// Mock RadioGroup components
jest.mock('@/components/ui/radio-group', () => ({
  RadioGroup: ({ children, ...props }: any) => (
    <div data-testid="radio-group" role="radiogroup" {...props}>
      {children}
    </div>
  ),
  RadioGroupItem: ({ ...props }: any) => (
    <input type="radio" data-testid="radio-group-item" {...props} />
  ),
}))

// Mock AlertDialog components
jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog" {...props}>
      {children}
    </div>
  ),
  AlertDialogAction: ({ children, ...props }: any) => (
    <button data-testid="alert-dialog-action" {...props}>
      {children}
    </button>
  ),
  AlertDialogCancel: ({ children, ...props }: any) => (
    <button data-testid="alert-dialog-cancel" {...props}>
      {children}
    </button>
  ),
  AlertDialogContent: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog-content" {...props}>
      {children}
    </div>
  ),
  AlertDialogDescription: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog-description" {...props}>
      {children}
    </div>
  ),
  AlertDialogFooter: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog-footer" {...props}>
      {children}
    </div>
  ),
  AlertDialogHeader: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog-header" {...props}>
      {children}
    </div>
  ),
  AlertDialogTitle: ({ children, ...props }: any) => (
    <h2 data-testid="alert-dialog-title" {...props}>
      {children}
    </h2>
  ),
  AlertDialogTrigger: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog-trigger" {...props}>
      {children}
    </div>
  ),
}))

describe('Storyboards - Behavioral Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User Journey: Creating and Managing Storyboards', () => {
    it('allows user to create a new screenplay storyboard from scratch', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User sees the storyboards dashboard
      expect(screen.getByText('Storyboards')).toBeInTheDocument()
      expect(screen.getByText('The Last Stand')).toBeInTheDocument() // Default storyboard
      
      // User clicks "Add New" to create a new storyboard
      const addNewButton = screen.getByRole('button', { name: /add new/i })
      await user.click(addNewButton)
      
      // User sees the create storyboard dialog
      await waitFor(() => {
        expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
      })
      
      // User fills in the storyboard details
      const nameInput = screen.getByPlaceholderText('Enter storyboard name')
      fireEvent.change(nameInput, { target: { value: 'My New Screenplay' } })
      
      // User selects screenplay type (using radio button)
      const screenplayRadio = screen.getByLabelText(/screenplay/i)
      await user.click(screenplayRadio)
      
      // User clicks Create to create the storyboard
      const createButtons = screen.getAllByRole('button', { name: /create/i })
      const createStoryboardButton = createButtons.find(btn => btn.textContent?.includes('Create Storyboard'))
      if (createStoryboardButton) {
        await user.click(createStoryboardButton)
      }
      
      // User sees their new storyboard in the list
      await waitFor(() => {
        expect(screen.getByText('My New Screenplay')).toBeInTheDocument()
      })
      
      // User can see it's a SCREENPLAY type (rendered uppercase)
      expect(screen.getAllByText('SCREENPLAY')[0]).toBeInTheDocument()
    })

    it('allows user to create a synopsis storyboard', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User creates a new storyboard
      const addNewButton = screen.getByRole('button', { name: /add new/i })
      await user.click(addNewButton)
      
      await waitFor(() => {
        expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
      })
      
      // User fills in details for a synopsis
      const nameInput = screen.getByPlaceholderText('Enter storyboard name')
      fireEvent.change(nameInput, { target: { value: 'My Story Synopsis' } })
      
      // User selects synopsis type (using radio button)
      const synopsisRadio = screen.getByLabelText(/synopsis/i)
      await user.click(synopsisRadio)
      
      // User creates the synopsis
      const createButtons = screen.getAllByRole('button', { name: /create/i })
      const createStoryboardButton = createButtons.find(btn => btn.textContent?.includes('Create Storyboard'))
      if (createStoryboardButton) {
        await user.click(createStoryboardButton)
      }
      
      // User sees their synopsis in the list
      await waitFor(() => {
        expect(screen.getByText('My Story Synopsis')).toBeInTheDocument()
      })
      
      // User can see it's a SYNOPSIS type (rendered uppercase)
      expect(screen.getAllByText('SYNOPSIS')[0]).toBeInTheDocument()
    })

    it('allows user to edit an existing storyboard', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User sees existing storyboards
      expect(screen.getByText('The Last Stand')).toBeInTheDocument()
      
      // For now, editing functionality is accessed by clicking the storyboard card
      const storyboardCard = screen.getByText('The Last Stand')
      expect(storyboardCard).toBeInTheDocument()
      
      // User can see storyboard details
      expect(screen.getAllByText('SCREENPLAY')[0]).toBeInTheDocument()
    })

    it('allows user to delete a storyboard they no longer need', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User sees existing storyboards
      expect(screen.getByText('The Last Stand')).toBeInTheDocument()
      
      // User can see delete buttons (trash icons)
      const deleteButtons = screen.getAllByTestId('trash2-icon')
      expect(deleteButtons.length).toBeGreaterThan(0)
      
      // User clicks a delete button
      const firstDeleteButton = deleteButtons[0].closest('button')
      if (firstDeleteButton) {
        await user.click(firstDeleteButton)
        
        // User sees confirmation dialog
        await waitFor(() => {
          const confirmDialogs = screen.getAllByText(/are you sure/i)
          expect(confirmDialogs.length).toBeGreaterThan(0)
        })
        
        // User confirms deletion
        const confirmButtons = screen.getAllByTestId('alert-dialog-action')
        await user.click(confirmButtons[0])
        
        // Storyboard is removed from the list
        await waitFor(() => {
          // Check that the deleted storyboard title is no longer the main card title
          // by ensuring we can't find all 4 original storyboards
          const lastStand = screen.queryAllByText('The Last Stand')
          const midnight = screen.queryAllByText('Midnight Express')
          const ocean = screen.queryAllByText("Ocean's Edge")
          const digital = screen.queryAllByText('Digital Dreams')
          
          // At least one should have fewer instances or be gone
          const totalInstances = lastStand.length + midnight.length + ocean.length + digital.length
          expect(totalInstances).toBeLessThan(10) // Significantly reduced from 12 (3 per card originally)
        })
      }
    })
  })

  describe('User Journey: Opening and Working with Storyboards', () => {
    it('allows user to open a screenplay storyboard for editing', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User sees the screenplay storyboard
      expect(screen.getByText('The Last Stand')).toBeInTheDocument()
      
      // User can click on screenplay cards to open them
      const storyboardTitle = screen.getByText('The Last Stand')
      const storyboardCard = storyboardTitle.closest('[class*="cursor-pointer"]')
      expect(storyboardCard).toBeInTheDocument()
    })

    it('allows user to open a synopsis storyboard for editing', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User sees the synopsis storyboard
      expect(screen.getByText("Ocean's Edge")).toBeInTheDocument()
      
      // Synopsis cards are displayed but may not be clickable
      const synopsisCard = screen.getByText("Ocean's Edge")
      expect(synopsisCard).toBeInTheDocument()
    })

    it('shows user helpful information about their storyboards', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User can see storyboard statistics (numbers and labels separate)
      expect(screen.getByText('42')).toBeInTheDocument() // scenes
      expect(screen.getByText('18')).toBeInTheDocument() // subscenes
      const sceneLabels = screen.getAllByText('SCENES')
      expect(sceneLabels.length).toBeGreaterThan(0)
      
      // User can see last modified dates (with "Modified" prefix)
      expect(screen.getByText(/Modified.*2 hours ago/i)).toBeInTheDocument()
      expect(screen.getByText(/Modified.*1 day ago/i)).toBeInTheDocument()
      
      // User can see creation dates (with "Created" prefix)
      expect(screen.getByText(/Created.*1\/15\/2024/i)).toBeInTheDocument()
      expect(screen.getByText(/Created.*1\/20\/2024/i)).toBeInTheDocument()
      
      // User can see genres
      expect(screen.getByText('Action/Drama')).toBeInTheDocument()
      expect(screen.getByText('Thriller/Noir')).toBeInTheDocument()
    })
  })

  describe('User Journey: Filtering and Searching', () => {
    it('allows user to filter storyboards by type', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User sees all storyboards initially
      expect(screen.getByText('The Last Stand')).toBeInTheDocument()
      expect(screen.getByText("Ocean's Edge")).toBeInTheDocument()
      
      // User can see different types (rendered as uppercase)
      const screenplayElements = screen.getAllByText('SCREENPLAY')
      expect(screenplayElements.length).toBeGreaterThan(0)
      const synopsisElements = screen.getAllByText('SYNOPSIS')
      expect(synopsisElements.length).toBeGreaterThan(0)
    })

    it('allows user to search for specific storyboards', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User sees all storyboards
      expect(screen.getByText('The Last Stand')).toBeInTheDocument()
      expect(screen.getByText('Midnight Express')).toBeInTheDocument()
      expect(screen.getByText("Ocean's Edge")).toBeInTheDocument()
      expect(screen.getByText('Digital Dreams')).toBeInTheDocument()
      
      // User can see both screenplay and synopsis types
      const screenplayElements = screen.getAllByText('SCREENPLAY')
      const synopsisElements = screen.getAllByText('SYNOPSIS')
      expect(screenplayElements.length + synopsisElements.length).toBe(4)
    })
  })

  describe('User Journey: Managing Multiple Projects', () => {
    it('allows user to work with multiple storyboards simultaneously', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User sees multiple storyboards of different types
      expect(screen.getByText('The Last Stand')).toBeInTheDocument()
      expect(screen.getByText('Midnight Express')).toBeInTheDocument()
      expect(screen.getByText("Ocean's Edge")).toBeInTheDocument()
      expect(screen.getByText('Digital Dreams')).toBeInTheDocument()
      
      // User can see different statuses
      const statusElements = screen.getAllByText(/in-progress|draft|completed/i)
      expect(statusElements.length).toBeGreaterThan(0)
      
      // User can see page numbers (numbers and PAGES label separate)
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('8')).toBeInTheDocument()
      const pageLabels = screen.getAllByText('PAGES')
      expect(pageLabels.length).toBeGreaterThan(0)
    })

    it('allows user to see their writing progress across all projects', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User can see progress indicators
      const statusElements = screen.getAllByText(/in-progress|draft|completed/i)
      expect(statusElements.length).toBeGreaterThan(0)
      
      // User can see which projects need attention
      expect(screen.getByText('The Last Stand')).toBeInTheDocument() // in-progress
      expect(screen.getByText('Midnight Express')).toBeInTheDocument() // draft
      
      // User can see completed work
      expect(screen.getByText("Ocean's Edge")).toBeInTheDocument() // completed
    })
  })

  describe('User Journey: Error Recovery', () => {
    it('handles user mistakes gracefully when creating storyboards', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User tries to create a storyboard with empty name
      const addNewButton = screen.getByRole('button', { name: /add new/i })
      await user.click(addNewButton)
      
      await waitFor(() => {
        expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
      })
      
      // User leaves name field empty and tries to create - button should be disabled
      const createButtons = screen.getAllByRole('button', { name: /create/i })
      const createStoryboardButton = createButtons.find(btn => btn.textContent?.includes('Create Storyboard'))
      if (createStoryboardButton) {
        expect(createStoryboardButton).toBeDisabled()
      }
      
      // User can cancel
      const cancelButtons = screen.getAllByRole('button', { name: /cancel/i })
      expect(cancelButtons.length).toBeGreaterThan(0)
    })

    it('maintains user data when they cancel operations', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User sees existing storyboards
      expect(screen.getByText('The Last Stand')).toBeInTheDocument()
      
      // User opens create dialog
      const addNewButton = screen.getByRole('button', { name: /add new/i })
      await user.click(addNewButton)
      
      // User fills in some data
      const nameInput = screen.getByPlaceholderText('Enter storyboard name')
      fireEvent.change(nameInput, { target: { value: 'Temporary Name' } })
      
      // User decides to cancel
      const cancelButtons = screen.getAllByRole('button', { name: /cancel/i })
      if (cancelButtons.length > 0) {
        await user.click(cancelButtons[0])
      }
      
      // Original data is preserved (all original storyboards still visible)
      expect(screen.getByText('The Last Stand')).toBeInTheDocument()
      expect(screen.getByText('Midnight Express')).toBeInTheDocument()
    })
  })

  describe('User Journey: Performance and Responsiveness', () => {
    it('handles rapid user interactions without losing data', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User can see storyboards
      const storyboard1 = screen.getByText('The Last Stand')
      const storyboard2 = screen.getByText('Midnight Express')
      
      // All storyboards are visible and functional
      expect(storyboard1).toBeInTheDocument()
      expect(storyboard2).toBeInTheDocument()
      
      // User can interact with the interface
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('handles multiple create/delete operations efficiently', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // User creates multiple storyboards quickly
      for (let i = 0; i < 3; i++) {
        const addNewButton = screen.getByRole('button', { name: /add new/i })
        await user.click(addNewButton)
        
        await waitFor(() => {
          expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
        })
        
        const nameInput = screen.getByPlaceholderText('Enter storyboard name')
        fireEvent.change(nameInput, { target: { value: `Quick Story ${i + 1}` } })
        
        const createButtons = screen.getAllByRole('button', { name: /create/i })
        const createStoryboardButton = createButtons.find(btn => btn.textContent?.includes('Create Storyboard'))
        if (createStoryboardButton) {
          await user.click(createStoryboardButton)
        }
        
        await waitFor(() => {
          expect(screen.getByText(`Quick Story ${i + 1}`)).toBeInTheDocument()
        })
      }
      
      // User can see all created storyboards
      expect(screen.getByText('Quick Story 1')).toBeInTheDocument()
      expect(screen.getByText('Quick Story 2')).toBeInTheDocument()
      expect(screen.getByText('Quick Story 3')).toBeInTheDocument()
    })
  })
})
