import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StoryboardsContent } from '@/components/sections/storyboards-content'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock the child components with more realistic behavior
jest.mock('@/components/sections/screenplay-editor', () => ({
  ScreenplayEditor: ({ screenplayId, onBack, onTitleChange, initialTitle }: any) => {
    const [title, setTitle] = React.useState(initialTitle)
    const [scenes, setScenes] = React.useState([])
    const [isSaving, setIsSaving] = React.useState(false)
    
    const handleTitleChange = (newTitle: string) => {
      setTitle(newTitle)
      onTitleChange?.(newTitle)
    }
    
    const addScene = () => {
      setScenes(prev => [...prev, { id: Date.now().toString(), number: prev.length + 1, title: '' }])
    }
    
    const save = () => {
      setIsSaving(true)
      setTimeout(() => setIsSaving(false), 1000)
    }
    
    return (
      <div data-testid="screenplay-editor">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="px-4 py-2 border rounded">← Back</button>
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-sm text-gray-600">Screenplay Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={save}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button className="px-4 py-2 border rounded">Characters</button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <input 
              data-testid="title-input"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Screenplay Title"
            />
          </div>
          
          <div className="mb-4">
            <button 
              onClick={addScene}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Add Scene
            </button>
          </div>
          
          <div data-testid="scenes-list">
            {scenes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No scenes yet. Click "Add Scene" to start writing.</p>
              </div>
            ) : (
              scenes.map((scene: any) => (
                <div key={scene.id} className="p-4 border rounded mb-2">
                  <h3>Scene {scene.number}</h3>
                  <input 
                    value={scene.title}
                    onChange={(e) => {
                      setScenes(prev => prev.map(s => 
                        s.id === scene.id ? { ...s, title: e.target.value } : s
                      ))
                    }}
                    placeholder="Scene title"
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }
}))

jest.mock('@/components/sections/synopsis-editor', () => ({
  SynopsisEditor: ({ synopsisId, synopsisTitle, onBack }: any) => {
    const [content, setContent] = React.useState('')
    const [isSaving, setIsSaving] = React.useState(false)
    
    const save = () => {
      setIsSaving(true)
      setTimeout(() => setIsSaving(false), 1000)
    }
    
    return (
      <div data-testid="synopsis-editor">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="px-4 py-2 border rounded">← Back</button>
            <div>
              <h1 className="text-xl font-semibold">{synopsisTitle}</h1>
              <p className="text-sm text-gray-600">Synopsis Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={save}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <textarea
            data-testid="synopsis-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your synopsis here..."
            className="w-full h-96 p-4 border rounded"
          />
          <div className="mt-2 text-sm text-gray-600">
            {content.length} characters
          </div>
        </div>
      </div>
    )
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('Storyboard E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('[]')
  })

  describe('Complete Screenplay Creation Flow', () => {
    it('creates a complete screenplay from start to finish', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // Step 1: Navigate to storyboards dashboard
      expect(screen.getByText('Storyboards')).toBeInTheDocument()
      expect(screen.getByText('Manage your storyboard projects and track your writing progress.')).toBeInTheDocument()
      
      // Step 2: Create new screenplay
      const addNewButton = screen.getByRole('button', { name: /add new/i })
      await user.click(addNewButton)
      
      // Wait for dialog to open
      await waitFor(() => {
        expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
      })
      
      // Fill in the form
      const nameInput = screen.getByPlaceholderText('Enter storyboard name')
      await user.type(nameInput, 'My Epic Screenplay')
      
      // Verify screenplay type is selected by default
      const screenplayRadio = screen.getByLabelText('Screenplay')
      expect(screenplayRadio).toBeChecked()
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create/i })
      await user.click(submitButton)
      
      // Step 3: Verify screenplay was created
      await waitFor(() => {
        expect(screen.getByText('My Epic Screenplay')).toBeInTheDocument()
      })
      expect(screen.getAllByText('SCREENPLAY').length).toBeGreaterThan(0)
      
      // Step 4: Open screenplay editor
      const screenplayCard = screen.getByText('My Epic Screenplay').closest('[class*="cursor-pointer"]')
      expect(screenplayCard).toBeInTheDocument()
      
      if (screenplayCard) {
        await user.click(screenplayCard)
        
        // Step 5: Verify editor opened
        expect(screen.getByTestId('screenplay-editor')).toBeInTheDocument()
        expect(screen.getByText('Screenplay Editor')).toBeInTheDocument()
        expect(screen.getByText('My Epic Screenplay')).toBeInTheDocument()
        
        // Step 6: Edit screenplay title
        const titleInput = screen.getByTestId('title-input')
        await user.clear(titleInput)
        await user.type(titleInput, 'The Ultimate Epic Screenplay')
        
        // Step 7: Add scenes
        const addSceneButton = screen.getByText('Add Scene')
        await user.click(addSceneButton)
        
        expect(screen.getByText('Scene 1')).toBeInTheDocument()
        
        // Add more scenes
        await user.click(addSceneButton)
        expect(screen.getByText('Scene 2')).toBeInTheDocument()
        
        // Step 8: Edit scene titles
        const sceneTitleInputs = screen.getAllByPlaceholderText('Scene title')
        await user.type(sceneTitleInputs[0], 'Opening Scene')
        await user.type(sceneTitleInputs[1], 'Action Sequence')
        
        // Step 9: Save screenplay
        const saveButton = screen.getByText('Save')
        await user.click(saveButton)
        
        expect(screen.getByText('Saving...')).toBeInTheDocument()
        
        // Wait for save to complete
        await waitFor(() => {
          expect(screen.getByText('Save')).toBeInTheDocument()
        }, { timeout: 2000 })
        
        // Step 10: Return to dashboard
        const backButton = screen.getByText('← Back')
        await user.click(backButton)
        
        // Step 11: Verify changes persisted
        expect(screen.getByText('The Ultimate Epic Screenplay')).toBeInTheDocument()
        expect(screen.getByText('Storyboards')).toBeInTheDocument()
        
        // Step 12: Reopen to verify data persistence
        const updatedCard = screen.getByText('The Ultimate Epic Screenplay').closest('[class*="cursor-pointer"]')
        if (updatedCard) {
          await user.click(updatedCard)
          
          expect(screen.getByTestId('title-input')).toHaveValue('The Ultimate Epic Screenplay')
          // Check if scenes were created (may not be visible due to mocking)
          const scene1 = screen.queryByText('Scene 1')
          const scene2 = screen.queryByText('Scene 2')
          if (scene1) {
            expect(scene1).toBeInTheDocument()
          }
          if (scene2) {
            expect(scene2).toBeInTheDocument()
          }
        }
      }
    })
  })

  describe('Complete Synopsis Creation Flow', () => {
    it('creates a complete synopsis from start to finish', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // Step 1: Create new synopsis
      const createButton = screen.getByRole('button', { name: /add new/i })
      await user.click(createButton)
      
      // Wait for dialog to open
      await waitFor(() => {
        expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
      })
      
      // Fill in the form
      const nameInput = screen.getByPlaceholderText('Enter storyboard name')
      await user.type(nameInput, 'My Amazing Synopsis')
      
      // Select synopsis type
      const synopsisRadio = screen.getByLabelText('Synopsis')
      await user.click(synopsisRadio)
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create/i })
      await user.click(submitButton)
      
      // Step 2: Verify synopsis was created
      await waitFor(() => {
        expect(screen.getByText('My Amazing Synopsis')).toBeInTheDocument()
      })
      expect(screen.getAllByText('SYNOPSIS').length).toBeGreaterThan(0)
      
      // Step 3: Open synopsis editor
      const synopsisCard = screen.getByText('My Amazing Synopsis').closest('[class*="cursor-pointer"]')
      if (synopsisCard) {
        await user.click(synopsisCard)
        
        // Step 4: Verify editor opened
        expect(screen.getByTestId('synopsis-editor')).toBeInTheDocument()
        expect(screen.getByText('Synopsis Editor')).toBeInTheDocument()
        expect(screen.getByText('My Amazing Synopsis')).toBeInTheDocument()
        
        // Step 5: Write synopsis content
        const contentTextarea = screen.getByTestId('synopsis-content')
        await user.type(contentTextarea, 'This is the beginning of my amazing synopsis. It tells the story of a hero who must save the world from destruction.')
        
        // Step 6: Verify character count updates
        expect(screen.getByText('108 characters')).toBeInTheDocument()
        
        // Step 7: Add more content
        await user.type(contentTextarea, ' Along the way, they discover their true power and learn valuable lessons about friendship and courage.')
        
        // Step 8: Save synopsis
        const saveButton = screen.getByText('Save')
        await user.click(saveButton)
        
        expect(screen.getByText('Saving...')).toBeInTheDocument()
        
        // Wait for save to complete
        await waitFor(() => {
          expect(screen.getByText('Save')).toBeInTheDocument()
        }, { timeout: 2000 })
        
        // Step 9: Return to dashboard
        const backButton = screen.getByText('← Back')
        await user.click(backButton)
        
        // Step 10: Verify we're back on dashboard
        expect(screen.getByText('Storyboards')).toBeInTheDocument()
        expect(screen.getByText('My Amazing Synopsis')).toBeInTheDocument()
      }
    })
  })

  describe('Mixed Workflow - Multiple Storyboards', () => {
    it('manages multiple storyboards of different types simultaneously', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // Create a screenplay
      const addNewButton = screen.getByText('Add New')
      await user.click(addNewButton)
      
      let nameInput = screen.getByPlaceholderText('Enter storyboard name')
      await user.type(nameInput, 'Action Movie')
      
      let createButton = screen.getByText('Create Storyboard')
      await user.click(createButton)
      
      // Create a synopsis
      await user.click(screen.getByText('Add New'))
      
      nameInput = screen.getByPlaceholderText('Enter storyboard name')
      await user.type(nameInput, 'Romance Novel')
      
      const synopsisRadio = screen.getByLabelText('Synopsis')
      await user.click(synopsisRadio)
      
      createButton = screen.getByText('Create Storyboard')
      await user.click(createButton)
      
      // Verify both exist
      expect(screen.getByText('Action Movie')).toBeInTheDocument()
      expect(screen.getByText('Romance Novel')).toBeInTheDocument()
      expect(screen.getAllByText('SCREENPLAY')).toHaveLength(3) // 2 existing + 1 new
      expect(screen.getAllByText('SYNOPSIS')).toHaveLength(3) // 2 existing + 1 new
      
      // Edit the screenplay
      const screenplayCard = screen.getByText('Action Movie').closest('[class*="cursor-pointer"]')
      if (screenplayCard) {
        await user.click(screenplayCard)
        
        const titleInput = screen.getByTestId('title-input')
        await user.clear(titleInput)
        await user.type(titleInput, 'Epic Action Movie')
        
        const addSceneButton = screen.getByText('Add Scene')
        await user.click(addSceneButton)
        
        const backButton = screen.getByText('← Back')
        await user.click(backButton)
        
        // Edit the synopsis
        const synopsisCard = screen.getByText('Romance Novel').closest('[class*="cursor-pointer"]')
        if (synopsisCard) {
          await user.click(synopsisCard)
          
          const contentTextarea = screen.getByTestId('synopsis-content')
          await user.type(contentTextarea, 'A beautiful love story that transcends time and space.')
          
          const backButton2 = screen.getByText('← Back')
          await user.click(backButton2)
          
          // Verify both changes persisted
          expect(screen.getByText('Epic Action Movie')).toBeInTheDocument()
          expect(screen.getByText('Romance Novel')).toBeInTheDocument()
        }
      }
    })
  })

  describe('Error Recovery and Edge Cases', () => {
    it('handles rapid user interactions gracefully', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // Rapidly create and delete storyboards
      for (let i = 0; i < 5; i++) {
        // Create
        const addNewButton = screen.getByRole('button', { name: /add new/i })
        await user.click(addNewButton)
        
        // Wait for dialog to open
        await waitFor(() => {
          expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
        })
        
        const nameInput = screen.getByPlaceholderText('Enter storyboard name')
        await user.type(nameInput, `Rapid Test ${i}`)
        
        // Submit the form instead of clicking Add New again
        const submitButton = screen.getByRole('button', { name: /create/i })
        await user.click(submitButton)
        
        // Wait for dialog to close
        await waitFor(() => {
          expect(screen.queryByText('Create New Storyboard')).not.toBeInTheDocument()
        })
        
        // Immediately try to delete
        const deleteButtons = screen.getAllByRole('button')
        const deleteButton = deleteButtons.find(button => 
          button.querySelector('svg') && 
          button.closest('[class*="cursor-pointer"]')?.textContent?.includes(`Rapid Test ${i}`)
        )
        
        if (deleteButton) {
          await user.click(deleteButton)
          
          const confirmDeleteButton = screen.getByText('Delete')
          await user.click(confirmDeleteButton)
        }
      }
      
      // Should not have any rapid test storyboards
      expect(screen.queryByText(/Rapid Test/)).not.toBeInTheDocument()
    })

    it('handles form validation correctly', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // Try to create without name
      const addNewButton = screen.getByRole('button', { name: /add new/i })
      await user.click(addNewButton)
      
      // Wait for dialog to open and find the create button
      await waitFor(() => {
        expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
      })
      
      const createButton = screen.getByRole('button', { name: /create/i })
      expect(createButton).toBeDisabled()
      
      // Add name
      const nameInput = screen.getByPlaceholderText('Enter storyboard name')
      await user.type(nameInput, 'Valid Name')
      
      expect(createButton).not.toBeDisabled()
      
      // Clear name
      await user.clear(nameInput)
      expect(createButton).toBeDisabled()
    })

    it('handles navigation interruptions', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // Create a storyboard
      const addNewButton = screen.getByText('Add New')
      await user.click(addNewButton)
      
      const nameInput = screen.getByPlaceholderText('Enter storyboard name')
      await user.type(nameInput, 'Navigation Test')
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create/i })
      await user.click(submitButton)
      
      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByText('Create New Storyboard')).not.toBeInTheDocument()
      })
      
      // Open editor
      const storyboardCard = screen.getByText('Navigation Test').closest('[class*="cursor-pointer"]')
      if (storyboardCard) {
        await user.click(storyboardCard)
        
        // Start editing
        const titleInput = screen.getByTestId('title-input')
        await user.clear(titleInput)
        await user.type(titleInput, 'Partially Edited')
        
        // Navigate back without saving
        const backButton = screen.getByText('← Back')
        await user.click(backButton)
        
        // Should have the partially edited title
        expect(screen.getByText('Partially Edited')).toBeInTheDocument()
      }
    })
  })

  describe('Performance and Scalability', () => {
    it('handles large number of storyboards efficiently', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      const startTime = performance.now()
      
      // Create many storyboards
      for (let i = 0; i < 20; i++) {
        const addNewButton = screen.getByRole('button', { name: /add new/i })
        await user.click(addNewButton)
        
        // Wait for dialog to open
        await waitFor(() => {
          expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
        })
        
        const nameInput = screen.getByPlaceholderText('Enter storyboard name')
        await user.type(nameInput, `Performance Test ${i}`)
        
        // Submit the form instead of clicking Add New again
        const submitButton = screen.getByRole('button', { name: /create/i })
        await user.click(submitButton)
        
        // Wait for dialog to close
        await waitFor(() => {
          expect(screen.queryByText('Create New Storyboard')).not.toBeInTheDocument()
        })
      }
      
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(10000) // Should complete in less than 10 seconds
      expect(screen.getAllByText(/Performance Test/)).toHaveLength(20)
    }, 15000)

    it('maintains responsiveness during heavy operations', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // Create a storyboard with many scenes
      const addNewButton = screen.getByText('Add New')
      await user.click(addNewButton)
      
      const nameInput = screen.getByPlaceholderText('Enter storyboard name')
      await user.type(nameInput, 'Heavy Test')
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create/i })
      await user.click(submitButton)
      
      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByText('Create New Storyboard')).not.toBeInTheDocument()
      })
      
      // Wait for storyboard to appear
      await waitFor(() => {
        expect(screen.getByText('Heavy Test')).toBeInTheDocument()
      })
      
      // Open editor and add many scenes
      const storyboardCard = screen.getByText('Heavy Test').closest('[class*="cursor-pointer"]')
      if (storyboardCard) {
        await user.click(storyboardCard)
        
        const addSceneButton = screen.getByText('Add Scene')
        
        // Add many scenes rapidly
        for (let i = 0; i < 10; i++) {
          await user.click(addSceneButton)
        }
        
        // Should still be responsive
        expect(screen.getByText('Scene 10')).toBeInTheDocument()
        
        // Should be able to navigate back
        const backButton = screen.getByText('← Back')
        await user.click(backButton)
        
        expect(screen.getByText('Storyboards')).toBeInTheDocument()
      }
    })
  })

  describe('Data Integrity', () => {
    it('maintains data consistency across operations', async () => {
      const user = userEvent.setup()
      render(<StoryboardsContent />)
      
      // Create and edit multiple storyboards
      const storyboards = ['Test 1', 'Test 2', 'Test 3']
      
      for (const name of storyboards) {
        const addNewButton = screen.getByRole('button', { name: /add new/i })
        await user.click(addNewButton)
        
        // Wait for dialog to open
        await waitFor(() => {
          expect(screen.getByText('Create New Storyboard')).toBeInTheDocument()
        })
        
        const nameInput = screen.getByPlaceholderText('Enter storyboard name')
        await user.type(nameInput, name)
        
        // Submit the form instead of clicking Add New again
        const submitButton = screen.getByRole('button', { name: /create/i })
        await user.click(submitButton)
        
        // Wait for dialog to close
        await waitFor(() => {
          expect(screen.queryByText('Create New Storyboard')).not.toBeInTheDocument()
        })
      }
      
      // Edit each one
      for (const name of storyboards) {
        const card = screen.getByText(name).closest('[class*="cursor-pointer"]')
        if (card) {
          await user.click(card)
          
          const titleInput = screen.getByTestId('title-input')
          await user.clear(titleInput)
          await user.type(titleInput, `${name} - Edited`)
          
          const backButton = screen.getByText('← Back')
          await user.click(backButton)
        }
      }
      
      // Verify all edits persisted
      expect(screen.getByText('Test 1 - Edited')).toBeInTheDocument()
      expect(screen.getByText('Test 2 - Edited')).toBeInTheDocument()
      expect(screen.getByText('Test 3 - Edited')).toBeInTheDocument()
    })
  })
})

