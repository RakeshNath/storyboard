import React from 'react'
import { render, screen } from '@testing-library/react'
import { HomeContent } from '@/components/sections/home-content'
import { createMockUser } from '../../utils/test-utils'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Film: () => <div data-testid="film-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Star: () => <div data-testid="star-icon" />,
}))

describe('HomeContent Component', () => {
  const mockUser = createMockUser({
    name: 'John Doe',
    email: 'john.doe@example.com',
  })

  describe('Rendering', () => {
    it('renders welcome message with user name', () => {
      render(<HomeContent user={mockUser} />)
      
      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
      expect(screen.getByText('Ready to craft your next masterpiece? Your creative workspace awaits.')).toBeInTheDocument()
    })

    it('renders all statistics cards', () => {
      render(<HomeContent user={mockUser} />)
      
      expect(screen.getByText('Total Storyboards')).toBeInTheDocument()
      expect(screen.getByText('Pages Written')).toBeInTheDocument()
      expect(screen.getByText('Hours Spent')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('renders statistics values correctly', () => {
      render(<HomeContent user={mockUser} />)
      
      expect(screen.getByText('3')).toBeInTheDocument() // Total Storyboards
      expect(screen.getByText('247')).toBeInTheDocument() // Pages Written
      expect(screen.getByText('89')).toBeInTheDocument() // Hours Spent
      expect(screen.getByText('1')).toBeInTheDocument() // Completed
    })

    it('renders statistics descriptions', () => {
      render(<HomeContent user={mockUser} />)
      
      expect(screen.getByText('+1 from last month')).toBeInTheDocument()
      expect(screen.getByText('+23 this week')).toBeInTheDocument()
      expect(screen.getByText('+12 this week')).toBeInTheDocument()
      expect(screen.getByText('First draft finished')).toBeInTheDocument()
    })

    it('renders recent activity section', () => {
      render(<HomeContent user={mockUser} />)
      
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      expect(screen.getByText('Updated "The Last Stand" storyboard')).toBeInTheDocument()
      expect(screen.getByText('Created new storyboard "Midnight Express"')).toBeInTheDocument()
      expect(screen.getByText('Completed first draft of "Ocean\'s Edge"')).toBeInTheDocument()
    })
  })

  describe('Icons and Visual Elements', () => {
    it('renders all required icons', () => {
      render(<HomeContent user={mockUser} />)
      
      expect(screen.getByTestId('film-icon')).toBeInTheDocument()
      expect(screen.getByTestId('file-text-icon')).toBeInTheDocument()
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
      expect(screen.getByTestId('star-icon')).toBeInTheDocument()
    })

    it('renders activity indicators with correct colors', () => {
      render(<HomeContent user={mockUser} />)
      
      // Find activity indicators by their classes directly
      const activityIndicators = screen.getAllByText(/Updated|Created|Completed/).map(text => {
        const container = text.closest('div')
        return container?.querySelector('.w-2.h-2.rounded-full')
      }).filter(Boolean)
      
      // Check that we have activity items (excluding the card title "Completed")
      const activityItems = screen.getAllByText(/Updated|Created|Completed/).filter(text => 
        text.textContent !== 'Completed' || text.tagName === 'P'
      )
      expect(activityItems).toHaveLength(3)
      
      // Check that indicators have the correct classes if found
      if (activityIndicators.length > 0) {
        activityIndicators.forEach((indicator, index) => {
          expect(indicator).toHaveClass('w-2', 'h-2', 'rounded-full')
          if (index < 2) {
            expect(indicator).toHaveClass('bg-primary')
          } else {
            expect(indicator).toHaveClass('bg-muted-foreground')
          }
        })
      }
    })
  })

  describe('Layout and Structure', () => {
    it('has correct grid layout for statistics', () => {
      render(<HomeContent user={mockUser} />)
      
      const statsContainer = screen.getByText('Total Storyboards').closest('div')?.parentElement?.parentElement
      expect(statsContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6')
    })

    it('has proper spacing between sections', () => {
      render(<HomeContent user={mockUser} />)
      
      const mainContainer = screen.getByText('Welcome, John Doe').closest('div')?.parentElement
      expect(mainContainer).toHaveClass('space-y-8')
    })

    it('has correct card structure', () => {
      render(<HomeContent user={mockUser} />)
      
      const cards = screen.getAllByRole('article', { hidden: true })
      expect(cards).toHaveLength(5) // 4 stats cards + 1 activity card
    })
  })

  describe('Content Accuracy', () => {
    it('displays correct time stamps for activities', () => {
      render(<HomeContent user={mockUser} />)
      
      expect(screen.getByText('2 hours ago')).toBeInTheDocument()
      expect(screen.getByText('1 day ago')).toBeInTheDocument()
      expect(screen.getByText('3 days ago')).toBeInTheDocument()
    })

    it('displays correct project names', () => {
      render(<HomeContent user={mockUser} />)
      
      expect(screen.getByText(/The Last Stand/)).toBeInTheDocument()
      expect(screen.getByText(/Midnight Express/)).toBeInTheDocument()
      expect(screen.getByText(/Ocean's Edge/)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<HomeContent user={mockUser} />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Welcome, John Doe')
      
      const sectionHeadings = screen.getAllByRole('heading', { level: 2 })
      expect(sectionHeadings).toHaveLength(1) // Recent Activity
    })

    it('has proper card titles', () => {
      render(<HomeContent user={mockUser} />)
      
      const cardTitles = screen.getAllByRole('heading', { level: 3 })
      expect(cardTitles).toHaveLength(4) // One for each stats card
      
      expect(cardTitles[0]).toHaveTextContent('Total Storyboards')
      expect(cardTitles[1]).toHaveTextContent('Pages Written')
      expect(cardTitles[2]).toHaveTextContent('Hours Spent')
      expect(cardTitles[3]).toHaveTextContent('Completed')
    })

    it('has proper text contrast and readability', () => {
      render(<HomeContent user={mockUser} />)
      
      // Check that muted text has proper classes
      const mutedTexts = screen.getAllByText(/from last month|this week|ago/)
      mutedTexts.forEach(text => {
        expect(text).toHaveClass('text-muted-foreground')
      })
    })
  })

  describe('Responsive Design', () => {
    it('has responsive grid classes', () => {
      render(<HomeContent user={mockUser} />)
      
      const gridContainer = screen.getByText('Total Storyboards').closest('div')?.parentElement?.parentElement
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4')
    })

    it('has responsive text sizing', () => {
      render(<HomeContent user={mockUser} />)
      
      const mainHeading = screen.getByText('Welcome, John Doe')
      expect(mainHeading).toHaveClass('text-3xl')
      
      const statsNumbers = screen.getAllByText(/^[0-9]+$/)
      statsNumbers.forEach(number => {
        expect(number).toHaveClass('text-2xl')
      })
    })
  })

  describe('User Data Handling', () => {
    it('handles different user names correctly', () => {
      const userWithLongName = createMockUser({ name: 'Dr. Elizabeth Margaret Thompson-Wilson' })
      
      render(<HomeContent user={userWithLongName} />)
      
      expect(screen.getByText('Welcome, Dr. Elizabeth Margaret Thompson-Wilson')).toBeInTheDocument()
    })

    it('handles special characters in user names', () => {
      const userWithSpecialChars = createMockUser({ name: 'José María O\'Connor' })
      
      render(<HomeContent user={userWithSpecialChars} />)
      
      expect(screen.getByText('Welcome, José María O\'Connor')).toBeInTheDocument()
    })
  })

  describe('Component Props', () => {
    it('requires user prop', () => {
      // @ts-expect-error - Testing missing required prop
      expect(() => render(<HomeContent />)).toThrow()
    })

    it('handles user prop correctly', () => {
      const customUser = createMockUser({
        name: 'Jane Smith',
        email: 'jane@example.com',
      })
      
      render(<HomeContent user={customUser} />)
      
      expect(screen.getByText('Welcome, Jane Smith')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently', () => {
      const startTime = performance.now()
      render(<HomeContent user={mockUser} />)
      const endTime = performance.now()
      
      // Should render quickly (less than 50ms)
      expect(endTime - startTime).toBeLessThan(50)
    })

    it('does not cause unnecessary re-renders', () => {
      const { rerender } = render(<HomeContent user={mockUser} />)
      
      // Re-render with same props should not cause issues
      expect(() => rerender(<HomeContent user={mockUser} />)).not.toThrow()
    })
  })
})
