import React from 'react'
import { render, screen } from '@testing-library/react'
import { ScreenplayHelp } from '@/components/sections/screenplay-editor/screenplay-help'

describe('ScreenplayHelp Component', () => {
  describe('Rendering', () => {
    it('renders help content with all sections', () => {
      render(<ScreenplayHelp />)
      
      // Check for main heading
      expect(screen.getByText('Screenplay Writing Guide')).toBeInTheDocument()
      expect(screen.getByText('Learn how to write professional screenplays using this editor')).toBeInTheDocument()
    })

    it('renders getting started section', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText(/Welcome to the Screenplay Editor/)).toBeInTheDocument()
    })

    it('renders scene structure section', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText('Scene Structure')).toBeInTheDocument()
      expect(screen.getByText(/Each scene should include/)).toBeInTheDocument()
    })

    it('renders content types section', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText('Content Types')).toBeInTheDocument()
      expect(screen.getByText(/Action/)).toBeInTheDocument()
      expect(screen.getByText(/Dialogue/)).toBeInTheDocument()
      expect(screen.getByText(/Transitions/)).toBeInTheDocument()
    })

    it('renders character management section', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText('Character Management')).toBeInTheDocument()
      expect(screen.getByText(/Use the Characters button/)).toBeInTheDocument()
    })

    it('renders tips for success section', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText('Tips for Success')).toBeInTheDocument()
      expect(screen.getByText(/Keep action descriptions concise/)).toBeInTheDocument()
    })
  })

  describe('Content Structure', () => {
    it('has proper heading hierarchy', () => {
      render(<ScreenplayHelp />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Screenplay Writing Guide')
      
      const sectionHeadings = screen.getAllByRole('heading', { level: 2 })
      expect(sectionHeadings.length).toBeGreaterThan(0)
    })

    it('has proper list structures', () => {
      render(<ScreenplayHelp />)
      
      const lists = screen.getAllByRole('list')
      expect(lists.length).toBeGreaterThan(0)
      
      const listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    it('has proper paragraph content', () => {
      render(<ScreenplayHelp />)
      
      const paragraphs = screen.getAllByText(/Welcome to the Screenplay Editor|Each scene should include|Keep action descriptions concise/)
      expect(paragraphs.length).toBeGreaterThan(0)
    })
  })

  describe('Scene Structure Information', () => {
    it('explains scene format requirements', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText('Format:')).toBeInTheDocument()
      expect(screen.getByText('INT (interior) or EXT (exterior)')).toBeInTheDocument()
    })

    it('explains location requirements', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText('Location:')).toBeInTheDocument()
      expect(screen.getByText('Where the scene takes place')).toBeInTheDocument()
    })

    it('explains time of day requirements', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText('Time of Day:')).toBeInTheDocument()
      expect(screen.getByText('DAY, NIGHT, DAWN, DUSK, or CONTINUOUS')).toBeInTheDocument()
    })

    it('explains description requirements', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText('Description:')).toBeInTheDocument()
      expect(screen.getByText('Brief description of the scene')).toBeInTheDocument()
    })
  })

  describe('Content Types Information', () => {
    it('explains action content', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText(/Describe what happens in the scene/)).toBeInTheDocument()
      expect(screen.getByText(/Use present tense/)).toBeInTheDocument()
    })

    it('explains dialogue content', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText(/Character speech/)).toBeInTheDocument()
      expect(screen.getByText(/Character names are automatically capitalized/)).toBeInTheDocument()
    })

    it('explains transition content', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText(/Scene transitions like CUT TO/)).toBeInTheDocument()
      expect(screen.getByText(/Only one transition per scene is allowed/)).toBeInTheDocument()
    })
  })

  describe('Character Management Information', () => {
    it('explains character management features', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText(/Add new characters with names and descriptions/)).toBeInTheDocument()
      expect(screen.getByText(/View dialogue and scene counts/)).toBeInTheDocument()
    })

    it('explains character deletion rules', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText(/Characters with dialogue cannot be deleted/)).toBeInTheDocument()
    })

    it('explains character autocomplete', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText(/Character names are automatically suggested/)).toBeInTheDocument()
    })
  })

  describe('Tips for Success', () => {
    it('provides writing tips', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText(/Keep action descriptions concise and visual/)).toBeInTheDocument()
      expect(screen.getByText(/Use character names consistently/)).toBeInTheDocument()
      expect(screen.getByText(/Save your work regularly/)).toBeInTheDocument()
    })

    it('provides organization tips', () => {
      render(<ScreenplayHelp />)
      
      expect(screen.getByText(/Organize scenes logically/)).toBeInTheDocument()
      expect(screen.getByText(/Use transitions sparingly/)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<ScreenplayHelp />)
      
      // Check for proper heading structure
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
      
      // Check for proper list structure
      const lists = screen.getAllByRole('list')
      expect(lists.length).toBeGreaterThan(0)
    })

    it('has accessible content', () => {
      render(<ScreenplayHelp />)
      
      // Check that all important content is accessible
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Scene Structure')).toBeInTheDocument()
      expect(screen.getByText('Content Types')).toBeInTheDocument()
      expect(screen.getByText('Character Management')).toBeInTheDocument()
      expect(screen.getByText('Tips for Success')).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('has proper container structure', () => {
      render(<ScreenplayHelp />)
      
      // Target the main container div
      const container = screen.getByText('Screenplay Writing Guide').closest('div')?.parentElement?.parentElement
      expect(container).toHaveClass('h-full', 'overflow-y-auto')
    })

    it('has proper spacing and layout', () => {
      render(<ScreenplayHelp />)
      
      // Target the main content container
      const mainContainer = screen.getByText('Screenplay Writing Guide').closest('div')?.parentElement
      expect(mainContainer).toHaveClass('max-w-4xl', 'mx-auto', 'space-y-6')
    })
  })
})
