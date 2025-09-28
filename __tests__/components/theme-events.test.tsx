import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { ProfileContent } from '@/components/sections/profile-content'
import { getUserTheme, updateUserTheme } from '@/lib/auth'

// Mock the auth functions
jest.mock('@/lib/auth', () => ({
  getUserTheme: jest.fn(),
  updateUserTheme: jest.fn(),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Palette: (props: any) => <svg {...props} data-testid="palette-icon" />,
  Check: (props: any) => <svg {...props} data-testid="check-icon" />,
  ChevronDown: (props: any) => <svg {...props} data-testid="chevron-down-icon" />,
  ChevronUp: (props: any) => <svg {...props} data-testid="chevron-up-icon" />,
}))

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  dateOfBirth: '1990-01-01',
  location: 'New York',
  phoneNumber: '+1234567890',
  subscription: 'premium',
}

describe('Theme Event Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getUserTheme as jest.Mock).mockReturnValue('minimalist')
    ;(updateUserTheme as jest.Mock).mockResolvedValue(undefined)
  })

  describe('Theme Change Events', () => {
    it('should listen for themeChanged events and update current theme', async () => {
      render(<ProfileContent user={mockUser} />)

      // Initial theme should be set
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Simulate theme change event
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: { theme: 'professional' }
        })
        window.dispatchEvent(themeChangeEvent)
      })

      // Wait for the theme to update
      await waitFor(() => {
        expect(screen.getByText('Professional')).toBeInTheDocument()
      })
    })

    it('should handle multiple theme change events', async () => {
      render(<ProfileContent user={mockUser} />)

      // Initial theme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Change to professional
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: { theme: 'professional' }
        })
        window.dispatchEvent(themeChangeEvent)
      })

      await waitFor(() => {
        expect(screen.getByText('Professional')).toBeInTheDocument()
      })

      // Change to cyberpunk
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: { theme: 'cyberpunk' }
        })
        window.dispatchEvent(themeChangeEvent)
      })

      await waitFor(() => {
        expect(screen.getByText('Cyberpunk')).toBeInTheDocument()
      })
    })

    it('should handle theme change events with invalid theme names', async () => {
      render(<ProfileContent user={mockUser} />)

      // Initial theme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Try to change to invalid theme
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: { theme: 'invalid-theme' }
        })
        window.dispatchEvent(themeChangeEvent)
      })

      // Should not crash and should maintain current theme
      await waitFor(() => {
        expect(screen.getByText('Minimalist')).toBeInTheDocument()
      })
    })

    it('should handle theme change events without detail', async () => {
      render(<ProfileContent user={mockUser} />)

      // Initial theme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Try to change theme without detail
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: undefined
        })
        window.dispatchEvent(themeChangeEvent)
      })

      // Should not crash and should maintain current theme
      await waitFor(() => {
        expect(screen.getByText('Minimalist')).toBeInTheDocument()
      })
    })

    it('should handle theme change events with null detail', async () => {
      render(<ProfileContent user={mockUser} />)

      // Initial theme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Try to change theme with null detail
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: null
        })
        window.dispatchEvent(themeChangeEvent)
      })

      // Should not crash and should maintain current theme
      await waitFor(() => {
        expect(screen.getByText('Minimalist')).toBeInTheDocument()
      })
    })

    it('should clean up event listeners on component unmount', () => {
      const { unmount } = render(<ProfileContent user={mockUser} />)

      // Spy on removeEventListener
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      // Unmount component
      unmount()

      // Verify removeEventListener was called for themeChanged event
      expect(removeEventListenerSpy).toHaveBeenCalledWith('themeChanged', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })

    it('should handle rapid theme changes', async () => {
      render(<ProfileContent user={mockUser} />)

      // Initial theme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Rapidly change themes
      const themes = ['professional', 'cyberpunk', 'noir', 'indie', 'classic']
      
      for (const theme of themes) {
        act(() => {
          const themeChangeEvent = new CustomEvent('themeChanged', {
            detail: { theme }
          })
          window.dispatchEvent(themeChangeEvent)
        })
      }

      // Should end up with the last theme
      await waitFor(() => {
        expect(screen.getByText('Classic')).toBeInTheDocument()
      })
    })
  })

  describe('Theme Event Integration', () => {
    it('should update theme display when theme changes via event', async () => {
      render(<ProfileContent user={mockUser} />)

      // Verify initial theme display
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Change theme via event
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: { theme: 'professional' }
        })
        window.dispatchEvent(themeChangeEvent)
      })

      // Verify theme display updates
      await waitFor(() => {
        expect(screen.getByText('Professional')).toBeInTheDocument()
      })

      // Verify the theme is reflected in the select component
      const selectElement = screen.getByDisplayValue('Professional')
      expect(selectElement).toBeInTheDocument()
    })

    it('should handle theme changes from different components', async () => {
      const { rerender } = render(<ProfileContent user={mockUser} />)

      // Initial theme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Simulate theme change from ThemesContent component
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: { theme: 'cyberpunk' }
        })
        window.dispatchEvent(themeChangeEvent)
      })

      await waitFor(() => {
        expect(screen.getByText('Cyberpunk')).toBeInTheDocument()
      })

      // Re-render component to simulate page refresh
      rerender(<ProfileContent user={mockUser} />)

      // Theme should persist (mocked getUserTheme returns 'minimalist', but event should override)
      await waitFor(() => {
        expect(screen.getByText('Cyberpunk')).toBeInTheDocument()
      })
    })

    it('should handle theme change events during component initialization', async () => {
      // Change theme before component mounts
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: { theme: 'professional' }
        })
        window.dispatchEvent(themeChangeEvent)
      })

      // Render component after theme change
      render(<ProfileContent user={mockUser} />)

      // Component should still initialize with its own theme from getUserTheme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()
    })
  })

  describe('Theme Event Error Handling', () => {
    it('should handle theme change events with malformed data', async () => {
      render(<ProfileContent user={mockUser} />)

      // Initial theme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Try various malformed events
      const malformedEvents = [
        new CustomEvent('themeChanged', { detail: { theme: '' } }),
        new CustomEvent('themeChanged', { detail: { theme: 123 } }),
        new CustomEvent('themeChanged', { detail: { theme: {} } }),
        new CustomEvent('themeChanged', { detail: { theme: [] } }),
        new CustomEvent('themeChanged', { detail: { theme: null } }),
        new CustomEvent('themeChanged', { detail: { theme: undefined } }),
      ]

      for (const event of malformedEvents) {
        act(() => {
          window.dispatchEvent(event)
        })
      }

      // Should not crash and should maintain current theme
      await waitFor(() => {
        expect(screen.getByText('Minimalist')).toBeInTheDocument()
      })
    })

    it('should handle theme change events with missing theme property', async () => {
      render(<ProfileContent user={mockUser} />)

      // Initial theme
      expect(screen.getByText('Minimalist')).toBeInTheDocument()

      // Try event with missing theme property
      act(() => {
        const themeChangeEvent = new CustomEvent('themeChanged', {
          detail: { otherProperty: 'value' }
        })
        window.dispatchEvent(themeChangeEvent)
      })

      // Should not crash and should maintain current theme
      await waitFor(() => {
        expect(screen.getByText('Minimalist')).toBeInTheDocument()
      })
    })
  })
})
