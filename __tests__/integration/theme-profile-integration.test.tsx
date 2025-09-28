import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemesContent } from '@/components/sections/themes-content'
import { ProfileContent } from '@/components/sections/profile-content'
import { createMockUser } from '../utils/test-utils'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: (props: any) => <svg {...props} data-testid="check-icon" />,
  ChevronDown: (props: any) => <svg {...props} data-testid="chevron-down-icon" />,
  ChevronUp: (props: any) => <svg {...props} data-testid="chevron-up-icon" />,
  Palette: (props: any) => <svg {...props} data-testid="palette-icon" />,
}))

// Mock auth functions
const mockGetUserTheme = jest.fn(() => 'minimalist')
const mockUpdateUserTheme = jest.fn()

jest.mock('@/lib/auth', () => ({
  getUserTheme: () => mockGetUserTheme(),
  updateUserTheme: (theme: string) => mockUpdateUserTheme(theme),
}))

// Mock document.documentElement.style.setProperty
Object.defineProperty(document.documentElement, 'style', {
  value: {
    setProperty: jest.fn(),
  },
  writable: true,
})

describe('Theme-Profile Integration', () => {
  const mockUser = createMockUser()
  const user = userEvent.setup()

  beforeEach(() => {
    mockGetUserTheme.mockClear()
    mockUpdateUserTheme.mockClear()
    mockGetUserTheme.mockReturnValue('minimalist')
  })

  it('theme changes in ThemesContent are reflected in ProfileContent', async () => {
    // Render both components
    render(
      <div>
        <ThemesContent />
        <ProfileContent user={mockUser} />
      </div>
    )

    // Verify initial state
    expect(screen.getByText('Themes')).toBeInTheDocument()
    expect(screen.getByText('Profile Information')).toBeInTheDocument()
    expect(screen.getAllByText('Minimalist')).toHaveLength(2) // One in ThemesContent, one in ProfileContent

    // Click on a different theme in ThemesContent
    const professionalButton = screen.getByText('Professional').closest('[class*="card"]')?.querySelector('button')
    await user.click(professionalButton!)

    // Wait for theme change to be applied
    await waitFor(() => {
      expect(mockUpdateUserTheme).toHaveBeenCalledWith('professional')
    })

    // Verify ProfileContent shows the new theme
    await waitFor(() => {
      expect(screen.getAllByText('Professional')).toHaveLength(2) // One in ThemesContent, one in ProfileContent
      expect(screen.getByText('professional')).toBeInTheDocument()
    })
  })

  it('multiple theme changes are properly reflected', async () => {
    render(
      <div>
        <ThemesContent />
        <ProfileContent user={mockUser} />
      </div>
    )

    const themes = [
      { name: 'Professional', id: 'professional' },
      { name: 'Cyberpunk', id: 'cyberpunk' },
      { name: 'Classic', id: 'classic' }
    ]

    for (const theme of themes) {
      // Click on theme
      const themeButton = screen.getByText(theme.name).closest('[class*="card"]')?.querySelector('button')
      await user.click(themeButton!)

      // Verify ProfileContent updates
      await waitFor(() => {
        expect(screen.getAllByText(theme.name)).toHaveLength(2) // One in ThemesContent, one in ProfileContent
        expect(screen.getByText(theme.id)).toBeInTheDocument()
      })

      // Verify theme was saved
      expect(mockUpdateUserTheme).toHaveBeenCalledWith(theme.id)
    }
  })

  it('theme preview in ThemesContent does not affect ProfileContent', async () => {
    render(
      <div>
        <ThemesContent />
        <ProfileContent user={mockUser} />
      </div>
    )

    // Hover over a theme to preview (this should not change the actual theme)
    const professionalCard = screen.getByText('Professional').closest('[class*="card"]')
    fireEvent.mouseEnter(professionalCard!)

    // ProfileContent should still show the original theme
    expect(screen.getAllByText('Minimalist')).toHaveLength(2) // One in ThemesContent, one in ProfileContent
    expect(screen.getByText('minimalist')).toBeInTheDocument()

    // Mouse leave should not affect ProfileContent either
    fireEvent.mouseLeave(professionalCard!)
    expect(screen.getAllByText('Minimalist')).toHaveLength(2) // One in ThemesContent, one in ProfileContent
  })

  it('theme change events are properly dispatched and received', async () => {
    const eventListener = jest.fn()
    window.addEventListener('themeChanged', eventListener)

    render(
      <div>
        <ThemesContent />
        <ProfileContent user={mockUser} />
      </div>
    )

    // Click on a theme
    const cyberpunkButton = screen.getByText('Cyberpunk').closest('[class*="card"]')?.querySelector('button')
    await user.click(cyberpunkButton!)

    // Verify event was dispatched
    await waitFor(() => {
      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { theme: 'cyberpunk' }
        })
      )
    })

    // Verify ProfileContent received the event
    await waitFor(() => {
      expect(screen.getAllByText('Cyberpunk')).toHaveLength(2) // One in ThemesContent, one in ProfileContent
    })

    window.removeEventListener('themeChanged', eventListener)
  })

  it('handles rapid theme switching without issues', async () => {
    render(
      <div>
        <ThemesContent />
        <ProfileContent user={mockUser} />
      </div>
    )

    const themes = ['professional', 'cyberpunk', 'classic', 'minimalist']
    
    // Rapidly switch between themes
    for (const themeId of themes) {
      const themeButton = screen.getByText(themeId === 'noir' ? 'Film Noir' : 
        themeId === 'indie' ? 'Indie Spirit' : 
        themeId.charAt(0).toUpperCase() + themeId.slice(1)).closest('[class*="card"]')?.querySelector('button')
      
      if (themeButton) {
        await user.click(themeButton!)
      }
    }

    // Should handle all changes without errors
    expect(screen.getByText('Themes')).toBeInTheDocument()
    expect(screen.getByText('Profile Information')).toBeInTheDocument()
  })

  it('theme persistence works across component re-renders', async () => {
    const { rerender } = render(
      <div>
        <ThemesContent />
        <ProfileContent user={mockUser} />
      </div>
    )

    // Change theme
    const professionalButton = screen.getByText('Professional').closest('[class*="card"]')?.querySelector('button')
    await user.click(professionalButton!)

    await waitFor(() => {
      expect(screen.getAllByText('Professional')).toHaveLength(2) // One in ThemesContent, one in ProfileContent
    })

    // Re-render components
    rerender(
      <div>
        <ThemesContent />
        <ProfileContent user={mockUser} />
      </div>
    )

    // Theme should persist
    expect(screen.getAllByText('Professional')).toHaveLength(2) // One in ThemesContent, one in ProfileContent
  })
})
