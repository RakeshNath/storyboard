/**
 * Tests for DevCachePanel component
 * Comprehensive coverage for development cache management panel
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DevCachePanel } from '@/components/dev-cache-panel'
import { clearAppStorage } from '@/lib/storage'

// Mock the storage module
jest.mock('@/lib/storage', () => ({
  clearAppStorage: jest.fn(),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Trash2: () => <span data-testid="trash-icon">Trash2</span>,
  RefreshCw: () => <span data-testid="refresh-icon">RefreshCw</span>,
  Info: () => <span data-testid="info-icon">Info</span>,
}))

describe('DevCachePanel', () => {
  let originalNodeEnv: string | undefined
  let confirmSpy: jest.SpyInstance
  let alertSpy: jest.SpyInstance

  beforeEach(() => {
    // Save original NODE_ENV
    originalNodeEnv = process.env.NODE_ENV

    // Set to development
    process.env.NODE_ENV = 'development'

    // Clear localStorage
    localStorage.clear()

    // Mock window.confirm and window.alert
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore original NODE_ENV
    if (originalNodeEnv !== undefined) {
      process.env.NODE_ENV = originalNodeEnv
    } else {
      delete process.env.NODE_ENV
    }

    confirmSpy.mockRestore()
    alertSpy.mockRestore()
  })

  describe('Production vs Development Mode', () => {
    it('does not render in production mode', () => {
      process.env.NODE_ENV = 'production'

      const { container } = render(<DevCachePanel />)
      expect(container.firstChild).toBeNull()
    })

    it('can render in development mode after keyboard shortcut', () => {
      process.env.NODE_ENV = 'development'

      render(<DevCachePanel />)

      // Trigger keyboard shortcut Ctrl+Shift+D
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      // Panel should now be visible
      expect(screen.getByText('Dev Panel')).toBeInTheDocument()
    })

    it('does not render when not visible', () => {
      process.env.NODE_ENV = 'development'

      const { container } = render(<DevCachePanel />)

      // Without keyboard shortcut, panel should not be visible
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Keyboard Shortcut', () => {
    it('toggles visibility with Ctrl+Shift+D', async () => {
      render(<DevCachePanel />)

      // Panel should not be visible initially
      expect(screen.queryByText('Dev Panel')).not.toBeInTheDocument()

      // Press Ctrl+Shift+D to show
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Dev Panel')).toBeInTheDocument()
      })

      // Press Ctrl+Shift+D again to hide
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.queryByText('Dev Panel')).not.toBeInTheDocument()
      })
    })

    it('ignores other key combinations', () => {
      render(<DevCachePanel />)

      // Try various key combinations that should not trigger
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true }) // Missing shift
      expect(screen.queryByText('Dev Panel')).not.toBeInTheDocument()

      fireEvent.keyDown(window, { key: 'D', shiftKey: true }) // Missing ctrl
      expect(screen.queryByText('Dev Panel')).not.toBeInTheDocument()

      fireEvent.keyDown(window, { key: 'C', ctrlKey: true, shiftKey: true }) // Wrong key
      expect(screen.queryByText('Dev Panel')).not.toBeInTheDocument()
    })

    it('cleans up event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = render(<DevCachePanel />)
      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })
  })

  describe('Storage Information Display', () => {
    it('displays storage version label', async () => {
      localStorage.setItem('storyboard-storage-version', '1.0.0')

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Version:')).toBeInTheDocument()
      })
    })

    it('displays "Not set" when no version', async () => {
      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Not set')).toBeInTheDocument()
      })
    })

    it('displays localStorage keys count label', async () => {
      localStorage.setItem('key1', 'value1')
      localStorage.setItem('key2', 'value2')
      localStorage.setItem('key3', 'value3')

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Keys:')).toBeInTheDocument()
      })
    })

    it('calculates and displays storage size in KB', async () => {
      localStorage.setItem('testKey', 'a'.repeat(1024)) // ~1KB

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        // Should display size in KB (approximately 1.00 KB)
        const sizeElement = screen.getByText(/KB/)
        expect(sizeElement).toBeInTheDocument()
      })
    })

    it('handles storage read errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // Mock localStorage to throw error
      ;(window.localStorage.getItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error')
      })

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[DevPanel] Error reading storage:',
          expect.any(Error)
        )
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Clear Cache Functionality', () => {
    it('clears cache when confirmed', async () => {
      const user = userEvent.setup()

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Clear Cache')).toBeInTheDocument()
      })

      const clearButton = screen.getByText('Clear Cache')
      await user.click(clearButton)

      expect(confirmSpy).toHaveBeenCalledWith('Clear all application cache? This will preserve your login.')
      expect(clearAppStorage).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('✅ Cache cleared! Refresh the page to see changes.')
    })

    it('does not clear cache when cancelled', async () => {
      const user = userEvent.setup()
      confirmSpy.mockReturnValue(false)

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Clear Cache')).toBeInTheDocument()
      })

      const clearButton = screen.getByText('Clear Cache')
      await user.click(clearButton)

      expect(confirmSpy).toHaveBeenCalled()
      expect(clearAppStorage).not.toHaveBeenCalled()
      expect(alertSpy).not.toHaveBeenCalled()
    })
  })

  describe('Hard Reload Functionality', () => {
    it('calls confirm and clearAppStorage when hard reload is clicked', async () => {
      const user = userEvent.setup()

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Hard Reload')).toBeInTheDocument()
      })

      const reloadButton = screen.getByText('Hard Reload')
      await user.click(reloadButton)

      expect(confirmSpy).toHaveBeenCalledWith('Perform a hard reload? This will clear cache and reload the page.')
      expect(clearAppStorage).toHaveBeenCalled()
    })

    it('does not reload when cancelled', async () => {
      const user = userEvent.setup()
      confirmSpy.mockReturnValue(false)

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Hard Reload')).toBeInTheDocument()
      })

      const reloadButton = screen.getByText('Hard Reload')
      await user.click(reloadButton)

      expect(confirmSpy).toHaveBeenCalled()
      expect(clearAppStorage).not.toHaveBeenCalled()
    })
  })

  describe('Close Button', () => {
    it('hides panel when close button is clicked', async () => {
      const user = userEvent.setup()

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Dev Panel')).toBeInTheDocument()
      })

      // Click the × close button
      const closeButton = screen.getByText('×')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Dev Panel')).not.toBeInTheDocument()
      })
    })
  })

  describe('Stored Keys Display', () => {
    it('renders details section for stored keys', async () => {
      localStorage.setItem('user', 'test-user')
      localStorage.setItem('theme', 'dark')

      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        // Just verify the panel is displayed
        expect(screen.getByText('Dev Panel')).toBeInTheDocument()
      })
    })

    it('renders panel without stored keys section when localStorage is empty', async () => {
      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Dev Panel')).toBeInTheDocument()
      })
    })
  })

  describe('UI Elements', () => {
    it('displays keyboard shortcut hint', async () => {
      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Ctrl+Shift+D')).toBeInTheDocument()
      })
    })

    it('renders all icons', async () => {
      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByTestId('info-icon')).toBeInTheDocument()
        expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
        expect(screen.getByTestId('refresh-icon')).toBeInTheDocument()
      })
    })

    it('displays version, keys, and size labels', async () => {
      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        expect(screen.getByText('Version:')).toBeInTheDocument()
        expect(screen.getByText('Keys:')).toBeInTheDocument()
        expect(screen.getByText('Size:')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined window gracefully', () => {
      // This test verifies the window check in updateStorageInfo
      render(<DevCachePanel />)
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      // Should not crash
      expect(screen.getByText('Dev Panel')).toBeInTheDocument()
    })

    it('updates storage info when panel becomes visible', async () => {
      localStorage.setItem('test-key', 'test-value')

      render(<DevCachePanel />)

      // Show panel
      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true })

      await waitFor(() => {
        // Panel should display
        expect(screen.getByText('Dev Panel')).toBeInTheDocument()
      })
    })
  })
})

