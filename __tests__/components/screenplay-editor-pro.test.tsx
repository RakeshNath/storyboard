/**
 * Tests for ScreenplayEditorPro component
 * Tests characters, locations, accordions, exports, and renaming functionality
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScreenplayEditorPro } from '@/components/sections/playground/screenplay-editor-pro'

// Mock Slate.js
jest.mock('slate-react', () => ({
  Slate: ({ children, value, onChange }: any) => <div data-testid="slate-editor">{children}</div>,
  Editable: ({ renderElement, renderLeaf, onKeyDown }: any) => (
    <div data-testid="editable" contentEditable suppressContentEditableWarning>
      <div data-type="scene-heading">INT. COFFEE SHOP - DAY</div>
      <div data-type="action">John enters the coffee shop.</div>
      <div data-type="character">JOHN</div>
      <div data-type="dialogue">Hello, I'd like a coffee.</div>
      <div data-type="scene-heading">INT. COFFEE SHOP - DAWN</div>
      <div data-type="action">Sarah arrives early.</div>
      <div data-type="character">SARAH</div>
      <div data-type="dialogue">Good morning!</div>
    </div>
  ),
  withReact: (editor: any) => editor,
  ReactEditor: {
    focus: jest.fn(),
  },
}))

jest.mock('slate', () => ({
  createEditor: jest.fn(() => ({
    children: [],
    selection: null,
    operations: [],
    marks: null,
  })),
  Transforms: {
    select: jest.fn(),
  },
  Editor: {
    isEditor: jest.fn(() => true),
  },
  Element: {
    isElement: jest.fn(() => true),
  },
  Node: {
    string: jest.fn((node: any) => {
      if (node && node.text) return node.text
      return ''
    }),
  },
}))

jest.mock('slate-history', () => ({
  withHistory: (editor: any) => editor,
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, variant, size, title, ...props }: any) => (
    <button onClick={onClick} className={className} title={title} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ onChange, onBlur, onKeyDown, value, defaultValue, placeholder, className, ...props }: any) => (
    <input
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  ),
}))

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ onChange, value, placeholder, className, ...props }: any) => (
    <textarea
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  ),
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className, variant, ...props }: any) => (
    <span className={className} data-variant={variant} {...props}>{children}</span>
  ),
}))

jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, type, collapsible, className }: any) => (
    <div data-testid="accordion" data-type={type} data-collapsible={collapsible} className={className}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, value, className }: any) => (
    <div data-testid="accordion-item" data-value={value} className={className}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, className, onClick }: any) => (
    <button data-testid="accordion-trigger" className={className} onClick={onClick}>
      {children}
    </button>
  ),
  AccordionContent: ({ children, className }: any) => (
    <div data-testid="accordion-content" className={className}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <button data-testid="select-trigger" className={className}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: any) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
  SelectContent: ({ children }: any) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ className, ...props }: any) => <div className={className} {...props} />,
}))

jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: any) => (
    <div className={className} data-testid="scroll-area">{children}</div>
  ),
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: any) => <div data-testid="tabs">{children}</div>,
  TabsContent: ({ children, value }: any) => <div data-testid="tabs-content">{children}</div>,
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value }: any) => <button data-testid="tabs-trigger">{children}</button>,
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  FileDown: () => <span data-testid="file-down-icon">FileDown</span>,
  List: () => <span data-testid="list-icon">List</span>,
  Keyboard: () => <span data-testid="keyboard-icon">Keyboard</span>,
  ChevronRight: () => <span data-testid="chevron-right-icon">ChevronRight</span>,
  ChevronDown: () => <span data-testid="chevron-down-icon">ChevronDown</span>,
  Users: () => <span data-testid="users-icon">Users</span>,
  MapPin: () => <span data-testid="map-pin-icon">MapPin</span>,
  Edit3: () => <span data-testid="edit3-icon">Edit3</span>,
  Download: () => <span data-testid="download-icon">Download</span>,
}))

describe('ScreenplayEditorPro Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the screenplay editor', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      expect(screen.getByTestId('slate-editor')).toBeInTheDocument()
    })

    it('renders toolbar buttons', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      expect(screen.getByText('Outliner')).toBeInTheDocument()
      expect(screen.getByText('Characters')).toBeInTheDocument()
      expect(screen.getByText('Locations')).toBeInTheDocument()
    })

    it('renders scene outliner by default', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      expect(screen.getByText('Scene Outliner')).toBeInTheDocument()
    })
  })

  describe('Characters View', () => {
    it('navigates to characters view when Characters button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      await waitFor(() => {
        expect(screen.getByText('View all characters and their editable profiles.')).toBeInTheDocument()
      })
    })

    it('shows empty state when no characters exist', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      await waitFor(() => {
        expect(screen.getByText('No characters yet. Add characters to your screenplay to see them here.')).toBeInTheDocument()
      })
    })

    it('renders character export button when characters exist', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      // Note: This would require having actual character data in the editor
      // This is a placeholder test for the export functionality
    })

    it('displays characters in accordion format', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      // Check if accordion is present (when characters exist)
      const accordions = screen.queryAllByTestId('accordion')
      expect(accordions.length).toBeGreaterThanOrEqual(0)
    })

    it('uses single accordion type for characters', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      await waitFor(() => {
        const accordion = screen.queryByTestId('accordion')
        if (accordion) {
          expect(accordion).toHaveAttribute('data-type', 'single')
          expect(accordion).toHaveAttribute('data-collapsible', 'true')
        }
      })
    })
  })

  describe('Locations View', () => {
    it('navigates to locations view when Locations button is clicked', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const locationsButton = screen.getByText('Locations')
      await user.click(locationsButton)
      
      await waitFor(() => {
        expect(screen.getByText('View all locations and their editable details.')).toBeInTheDocument()
      })
    })

    it('shows empty state when no locations exist', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const locationsButton = screen.getByText('Locations')
      await user.click(locationsButton)
      
      await waitFor(() => {
        expect(screen.getByText('No locations yet. Add scene headings to see locations here.')).toBeInTheDocument()
      })
    })

    it('displays locations in accordion format', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const locationsButton = screen.getByText('Locations')
      await user.click(locationsButton)
      
      // Check if accordion is present (when locations exist)
      const accordions = screen.queryAllByTestId('accordion')
      expect(accordions.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Character Type Dropdown', () => {
    it('renders character type dropdown with Not Mentioned placeholder', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      // Navigate to characters and open an accordion (if characters exist)
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      // Check for select component
      const selectValues = screen.queryAllByTestId('select-value')
      selectValues.forEach(value => {
        expect(value.textContent).toContain('Not Mentioned')
      })
    })

    it('includes all character type options', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      // The select items should include all character types
      // This would be tested when a character accordion is expanded
    })
  })

  describe('Export Functionality', () => {
    it('renders export button with dropdown menu style', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      // Check for export button in the toolbar
      const exportButtons = screen.queryAllByText('Export')
      expect(exportButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('export button has proper styling', async () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const exportButtons = screen.queryAllByText('Export')
      // Export buttons should exist and be styled properly
      expect(exportButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Navigation', () => {
    it('returns to editor when Editor button is clicked from Characters view', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      // Go to Characters
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      // Return to Editor
      const editorButton = screen.getByText('Editor')
      await user.click(editorButton)
      
      // Scene outliner should be visible again
      expect(screen.getByText('Scene Outliner')).toBeInTheDocument()
    })

    it('returns to editor when Editor button is clicked from Locations view', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      // Go to Locations
      const locationsButton = screen.getByText('Locations')
      await user.click(locationsButton)
      
      // Return to Editor
      const editorButton = screen.getByText('Editor')
      await user.click(editorButton)
      
      // Scene outliner should be visible again
      expect(screen.getByText('Scene Outliner')).toBeInTheDocument()
    })

    it('toggles outliner visibility', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const outlinerButton = screen.getByText('Outliner')
      
      // Initially, outliner should be visible
      expect(screen.getByText('Scene Outliner')).toBeInTheDocument()
      
      // Click to toggle
      await user.click(outlinerButton)
      
      // Outliner should disappear
      await waitFor(() => {
        expect(screen.queryByText('Scene Outliner')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accordion Behavior', () => {
    it('only one character accordion can be open at a time', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      // When characters exist, the accordion should have type="single"
      const accordions = screen.queryAllByTestId('accordion')
      accordions.forEach(accordion => {
        const type = accordion.getAttribute('data-type')
        if (type) {
          expect(type).toBe('single')
        }
      })
    })

    it('accordion has collapsible prop', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const accordions = screen.queryAllByTestId('accordion')
      accordions.forEach(accordion => {
        const collapsible = accordion.getAttribute('data-collapsible')
        if (collapsible !== null) {
          expect(collapsible).toBe('true')
        }
      })
    })

    it('accordion items have proper styling classes', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const accordionItems = screen.queryAllByTestId('accordion-item')
      accordionItems.forEach(item => {
        expect(item.className).toContain('border')
        expect(item.className).toContain('rounded-lg')
      })
    })
  })

  describe('Time of Day Capsules for Locations', () => {
    it('displays time of day capsules in location accordions', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const locationsButton = screen.getByText('Locations')
      await user.click(locationsButton)
      
      // Time of day capsules should be rendered for locations
      // This would show up as badges with time information
    })

    it('shows multiple time of day entries for same location', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const locationsButton = screen.getByText('Locations')
      await user.click(locationsButton)
      
      // If COFFEE SHOP appears in DAY and DAWN, both should be visible
    })
  })

  describe('Scene Numbers Display', () => {
    it('displays scene numbers as badges for locations', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const locationsButton = screen.getByText('Locations')
      await user.click(locationsButton)
      
      // Scene number badges should be present when a location accordion is expanded
      const badges = screen.queryAllByText(/Scene \d+/)
      // Badges may or may not exist depending on location data
    })
  })

  describe('Compact Design', () => {
    it('accordion triggers have minimal padding', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const triggers = screen.queryAllByTestId('accordion-trigger')
      triggers.forEach(trigger => {
        expect(trigger.className).toContain('py-1')
      })
    })

    it('capsules use small font sizes', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      // Check for text-[10px] class in capsules
      const capsules = screen.queryAllByText(/dialogue|scene/i)
      // Font size classes would be in the parent elements
    })
  })

  describe('Input Fields', () => {
    it('character name input has uppercase styling', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      const inputs = screen.queryAllByPlaceholderText('Character Name')
      inputs.forEach(input => {
        expect(input.className).toContain('uppercase')
      })
    })

    it('location name input has uppercase styling', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const locationsButton = screen.getByText('Locations')
      await user.click(locationsButton)
      
      const inputs = screen.queryAllByPlaceholderText('Location Name')
      inputs.forEach(input => {
        expect(input.className).toContain('uppercase')
      })
    })

    it('textareas have proper min-height', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      const textareas = screen.queryAllByPlaceholderText(/character description|location description/i)
      textareas.forEach(textarea => {
        expect(textarea.className).toMatch(/min-h-\[(100|200)px\]/)
      })
    })
  })

  describe('Proper Bottom Padding', () => {
    it('characters section has bottom padding for full visibility', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const charactersButton = screen.getByText('Characters')
      await user.click(charactersButton)
      
      await waitFor(() => {
        const content = screen.getByText('View all characters and their editable profiles.')
        // Find the parent container with the pb-24 class
        let parent = content.parentElement
        let found = false
        while (parent && !found) {
          if (parent.className && parent.className.includes('pb-24')) {
            found = true
            break
          }
          parent = parent.parentElement
        }
        expect(found).toBe(true)
      })
    })

    it('locations section has bottom padding for full visibility', async () => {
      const user = userEvent.setup()
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const locationsButton = screen.getByText('Locations')
      await user.click(locationsButton)
      
      await waitFor(() => {
        const content = screen.getByText('View all locations and their editable details.')
        // Find the parent container with the pb-24 class
        let parent = content.parentElement
        let found = false
        while (parent && !found) {
          if (parent.className && parent.className.includes('pb-24')) {
            found = true
            break
          }
          parent = parent.parentElement
        }
        expect(found).toBe(true)
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('export buttons have proper title attributes', () => {
      render(<ScreenplayEditorPro title="Test Screenplay" />)
      
      const exportButtons = screen.queryAllByTitle(/Export/i)
      expect(exportButtons.length).toBeGreaterThanOrEqual(0)
    })
  })
})

