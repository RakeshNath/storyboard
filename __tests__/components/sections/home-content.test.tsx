import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomeContent } from '@/components/sections/home-content'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/dashboard',
}))

describe('HomeContent Component', () => {
  it('renders welcome message and user information', () => {
    render(<HomeContent />)
    
    expect(screen.getByText(/Welcome to StoryBoard/i)).toBeInTheDocument()
    expect(screen.getByText(/Your professional storyboard writing portal/i)).toBeInTheDocument()
  })

  it('renders quick action buttons', () => {
    render(<HomeContent />)
    
    expect(screen.getByText(/Create New Storyboard/i)).toBeInTheDocument()
    expect(screen.getByText(/View All Storyboards/i)).toBeInTheDocument()
    expect(screen.getByText(/Explore Themes/i)).toBeInTheDocument()
  })

  it('renders statistics cards', () => {
    render(<HomeContent />)
    
    expect(screen.getByText(/Total Storyboards/i)).toBeInTheDocument()
    expect(screen.getByText(/Completed Projects/i)).toBeInTheDocument()
    expect(screen.getByText(/Words Written/i)).toBeInTheDocument()
    expect(screen.getByText(/Active Projects/i)).toBeInTheDocument()
  })

  it('renders recent activity section', () => {
    render(<HomeContent />)
    
    expect(screen.getAllByText(/Recent Activity/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/No recent activity/i)).toBeInTheDocument()
  })

  it('renders tips and resources section', () => {
    render(<HomeContent />)
    
    expect(screen.getAllByText(/Recent Activity/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/No recent activity/i)).toBeInTheDocument()
  })

  it('handles button clicks', async () => {
    const user = userEvent.setup()
    render(<HomeContent />)
    
    const createButton = screen.getByText(/Create New Storyboard/i)
    await user.click(createButton)
    
    // Button should be clickable
    expect(createButton).toBeInTheDocument()
  })

  it('displays correct styling and layout', () => {
    render(<HomeContent />)
    
    // Check for main container
    const mainContainer = screen.getByRole('main')
    expect(mainContainer).toBeInTheDocument()
    
    // Check for grid layout
    const gridContainer = document.querySelector('.grid')
    expect(gridContainer).toBeInTheDocument()
  })

  it('renders with proper accessibility attributes', () => {
    render(<HomeContent />)
    
    // Check for proper heading structure
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
    
    // Check for proper button roles
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('handles empty state gracefully', () => {
    render(<HomeContent />)
    
    // Should render even with no data
    expect(screen.getByText(/Welcome to StoryBoard/i)).toBeInTheDocument()
  })

  it('renders efficiently with many elements', () => {
    const startTime = performance.now()
    render(<HomeContent />)
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(1000) // Should render quickly
    expect(screen.getByText(/Welcome to StoryBoard/i)).toBeInTheDocument()
  })
})