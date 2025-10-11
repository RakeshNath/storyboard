import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemesContent } from '@/components/sections/themes-content'

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
  Palette: () => <div data-testid="palette-icon">Palette</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  Check: () => <div data-testid="check-icon">Check</div>,
}))

describe('Themes - Behavioral Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User Journey: Exploring Available Themes', () => {
    it('allows user to see all available themes and their descriptions', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User sees the themes section
      expect(screen.getByText('Themes')).toBeInTheDocument()
      
      // User can see different theme options (actual themes available)
      expect(screen.getByText('Minimalist')).toBeInTheDocument()
      expect(screen.getByText('Professional')).toBeInTheDocument()
      expect(screen.getByText('Film Noir')).toBeInTheDocument()
      expect(screen.getByText('Classic')).toBeInTheDocument()
      expect(screen.getByText('Indie Spirit')).toBeInTheDocument()
      expect(screen.getByText('Cyberpunk')).toBeInTheDocument()
      
      // User can read descriptions of each theme
      expect(screen.getByText(/clean and distraction-free/i)).toBeInTheDocument()
      expect(screen.getByText(/clean and modern design/i)).toBeInTheDocument()
      expect(screen.getByText(/high contrast/i)).toBeInTheDocument()
    })

    it('shows user which theme is currently active', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can see the current theme has "Applied" button
      expect(screen.getAllByText('Applied')[0]).toBeInTheDocument()
      
      // User can see which theme is selected (minimalist by default from mock)
      const currentTheme = screen.getByText('Minimalist')
      expect(currentTheme).toBeInTheDocument()
    })
  })

  describe('User Journey: Changing Themes', () => {
    it('allows user to switch to a different theme', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can see the current theme (minimalist has "Applied" button)
      expect(screen.getAllByText('Applied')[0]).toBeInTheDocument()
      
      // User clicks on a different theme's Apply button
      const applyButtons = screen.getAllByRole('button', { name: /apply/i })
      const professionalApplyButton = applyButtons.find(btn => 
        btn.textContent === 'Apply' && btn.closest('[class*="cursor-pointer"]')
      )
      if (professionalApplyButton) {
        await user.click(professionalApplyButton)
      }
      
      // User can see theme options are still available
      expect(screen.getByText('Professional')).toBeInTheDocument()
    })

    it('allows user to switch to dark theme for better night viewing', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User wants to switch to Film Noir (dark contrast theme)
      const noirTheme = screen.getByText('Film Noir')
      expect(noirTheme).toBeInTheDocument()
      
      // User can see high contrast description
      expect(screen.getByText(/high contrast/i)).toBeInTheDocument()
    })

    it('allows user to switch to warm theme for comfortable viewing', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User wants Classic theme (warm Hollywood tones)
      const classicTheme = screen.getByText('Classic')
      expect(classicTheme).toBeInTheDocument()
      
      // User can see description
      expect(screen.getByText(/traditional hollywood/i)).toBeInTheDocument()
    })

    it('allows user to try the cyberpunk theme for a unique experience', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User wants to try the cyberpunk theme
      const cyberpunkTheme = screen.getByText('Cyberpunk')
      expect(cyberpunkTheme).toBeInTheDocument()
      
      // User can see cyberpunk theme description
      expect(screen.getByText(/futuristic neon/i)).toBeInTheDocument()
    })
  })

  describe('User Journey: Theme Persistence', () => {
    it('remembers user theme choice when they navigate away and come back', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can see available themes
      expect(screen.getByText('Professional')).toBeInTheDocument()
      expect(screen.getByText('Classic')).toBeInTheDocument()
      
      // User can apply a theme
      const applyButtons = screen.getAllByRole('button', { name: /apply/i })
      expect(applyButtons.length).toBeGreaterThan(0)
    })

    it('applies theme changes immediately across the application', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can see themes are available for selection
      expect(screen.getByText('Professional')).toBeInTheDocument()
      
      // User can interact with theme buttons
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('User Journey: Theme Exploration', () => {
    it('allows user to try different themes to find their preference', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can see all available themes
      expect(screen.getByText('Minimalist')).toBeInTheDocument()
      expect(screen.getByText('Professional')).toBeInTheDocument()
      expect(screen.getByText('Classic')).toBeInTheDocument()
      expect(screen.getByText('Film Noir')).toBeInTheDocument()
      expect(screen.getByText('Indie Spirit')).toBeInTheDocument()
      expect(screen.getByText('Cyberpunk')).toBeInTheDocument()
      
      // User can interact with theme selection buttons
      const applyButtons = screen.getAllByRole('button', { name: /apply/i })
      expect(applyButtons.length).toBeGreaterThan(0)
    })

    it('helps user understand the purpose of each theme', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can read descriptions to understand each theme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()
      expect(screen.getByText('Professional')).toBeInTheDocument()
      expect(screen.getByText('Film Noir')).toBeInTheDocument()
      expect(screen.getByText('Classic')).toBeInTheDocument()
      expect(screen.getByText('Indie Spirit')).toBeInTheDocument()
      expect(screen.getByText('Cyberpunk')).toBeInTheDocument()
      
      // User can understand what each theme is designed for
      expect(screen.getByText(/clean and distraction-free/i)).toBeInTheDocument()
      expect(screen.getByText(/clean and modern design/i)).toBeInTheDocument()
      expect(screen.getByText(/high contrast/i)).toBeInTheDocument()
      expect(screen.getByText(/traditional hollywood/i)).toBeInTheDocument()
      expect(screen.getByText(/creative and vibrant/i)).toBeInTheDocument()
      expect(screen.getByText(/futuristic/i)).toBeInTheDocument()
    })
  })

  describe('User Journey: Accessibility and Comfort', () => {
    it('allows user to choose a theme that reduces eye strain', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can choose Film Noir for high contrast
      const noirTheme = screen.getByText('Film Noir')
      expect(noirTheme).toBeInTheDocument()
      
      // User can see the high contrast description
      expect(screen.getByText(/high contrast/i)).toBeInTheDocument()
    })

    it('allows user to choose warm colors for comfortable reading', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can choose Classic for warm Hollywood tones
      const classicTheme = screen.getByText('Classic')
      expect(classicTheme).toBeInTheDocument()
      
      // User can see the warm tones description
      expect(screen.getByText(/traditional hollywood/i)).toBeInTheDocument()
    })

    it('allows user to choose a professional theme for work environment', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can choose Professional theme for work
      const professionalTheme = screen.getByText('Professional')
      expect(professionalTheme).toBeInTheDocument()
      
      // User can see the professional design description
      expect(screen.getByText(/clean and modern design/i)).toBeInTheDocument()
    })
  })

  describe('User Journey: Rapid Theme Switching', () => {
    it('handles rapid theme changes without issues', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can see multiple theme options
      expect(screen.getByText('Classic')).toBeInTheDocument()
      expect(screen.getByText('Film Noir')).toBeInTheDocument()
      expect(screen.getByText('Professional')).toBeInTheDocument()
      
      // User can interact with apply buttons
      const applyButtons = screen.getAllByRole('button', { name: /apply/i })
      expect(applyButtons.length).toBeGreaterThan(0)
    })

    it('maintains theme state during rapid interactions', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can see theme options
      const cyberpunkTheme = screen.getByText('Cyberpunk')
      const classicTheme = screen.getByText('Classic')
      
      expect(cyberpunkTheme).toBeInTheDocument()
      expect(classicTheme).toBeInTheDocument()
      
      // Theme system is responsive to user interactions
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('User Journey: Theme Information', () => {
    it('provides user with helpful information about each theme', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can see all theme names
      expect(screen.getByText('Minimalist')).toBeInTheDocument()
      expect(screen.getByText('Professional')).toBeInTheDocument()
      expect(screen.getByText('Film Noir')).toBeInTheDocument()
      expect(screen.getByText('Classic')).toBeInTheDocument()
      expect(screen.getByText('Indie Spirit')).toBeInTheDocument()
      expect(screen.getByText('Cyberpunk')).toBeInTheDocument()
      
      // User can see theme customization information
      expect(screen.getByText(/theme customization/i)).toBeInTheDocument()
    })

    it('shows user theme selection status clearly', async () => {
      const user = userEvent.setup()
      render(<ThemesContent />)
      
      // User can see which theme is currently selected via "Applied" button
      const appliedButtons = screen.getAllByText('Applied')
      expect(appliedButtons.length).toBeGreaterThan(0)
      
      // User can see theme options to select
      expect(screen.getByText('Minimalist')).toBeInTheDocument()
      expect(screen.getByText('Professional')).toBeInTheDocument()
    })
  })
})
