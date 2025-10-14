import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

// Mock window.matchMedia
const mockMatchMedia = jest.fn()
const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024,
})

describe('useIsMobile Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Create a proper media query list mock
    const mediaQueryListMock = {
      matches: false,
      media: '(max-width: 768px)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: jest.fn(),
    }
    
    mockMatchMedia.mockReturnValue(mediaQueryListMock)
    
    // Reset window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    })
  })

  describe('Initial State', () => {
    it('returns false for desktop width initially', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(false)
    })

    it('returns true for mobile width initially', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 600,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(true)
    })

    it('returns false for tablet width initially', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 768,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(false)
    })

    it('returns true for width just below breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 767,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(true)
    })
  })

  describe('Media Query Setup', () => {
    it('sets up media query listener on mount', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      renderHook(() => useIsMobile())
      
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('removes media query listener on unmount', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      const { unmount } = renderHook(() => useIsMobile())
      
      unmount()
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })

  describe('Responsive Behavior', () => {
    it('updates when window width changes to mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(false)
      
      // Simulate window resize to mobile
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          value: 600,
        })
        
        // Get the change handler that was registered
        const changeHandler = mockAddEventListener.mock.calls[0][1]
        changeHandler()
      })
      
      expect(result.current).toBe(true)
    })

    it('updates when window width changes to desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 600,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(true)
      
      // Simulate window resize to desktop
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          value: 1024,
        })
        
        // Get the change handler that was registered
        const changeHandler = mockAddEventListener.mock.calls[0][1]
        changeHandler()
      })
      
      expect(result.current).toBe(false)
    })

    it('handles multiple resize events', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(false)
      
      // Simulate multiple resize events
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          value: 600,
        })
        
        const changeHandler = mockAddEventListener.mock.calls[0][1]
        changeHandler()
      })
      
      expect(result.current).toBe(true)
      
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          value: 1024,
        })
        
        const changeHandler = mockAddEventListener.mock.calls[0][1]
        changeHandler()
      })
      
      expect(result.current).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('handles exact breakpoint width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 768,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(false)
    })

    it('handles very small width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 320,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(true)
    })

    it('handles very large width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 2560,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(false)
    })

    it('handles zero width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 0,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(true)
    })
  })

  describe('Hook Re-renders', () => {
    it('does not cause unnecessary re-renders', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      let renderCount = 0
      const { result } = renderHook(() => {
        renderCount++
        return useIsMobile()
      })
      
      expect(renderCount).toBeLessThanOrEqual(2) // Allow for initial render + potential re-render
      expect(result.current).toBe(false)
    })

    it('updates state only when width actually changes', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(false)
      
      // Simulate resize event with same width
      act(() => {
        const changeHandler = mockAddEventListener.mock.calls[0][1]
        changeHandler()
      })
      
      expect(result.current).toBe(false)
    })
  })

  describe('Multiple Hook Instances', () => {
    it('works with multiple hook instances', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      const { result: result1 } = renderHook(() => useIsMobile())
      const { result: result2 } = renderHook(() => useIsMobile())
      
      expect(result1.current).toBe(false)
      expect(result2.current).toBe(false)
      
      // Simulate window resize
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          value: 600,
        })
        
        // Trigger resize for both hook instances
        const changeHandler1 = mockAddEventListener.mock.calls[0][1]
        const changeHandler2 = mockAddEventListener.mock.calls[1][1]
        changeHandler1()
        changeHandler2()
      })
      
      expect(result1.current).toBe(true)
      expect(result2.current).toBe(true) // Both should be true for mobile width
    })
  })

  describe('Cleanup', () => {
    it('cleans up event listeners on unmount', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      const { unmount } = renderHook(() => useIsMobile())
      
      expect(mockAddEventListener).toHaveBeenCalledTimes(1)
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(0)
      
      unmount()
      
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(1)
    })

    it('handles cleanup gracefully', () => {
      const { unmount } = renderHook(() => useIsMobile())
      
      // Should not throw error
      expect(() => unmount()).not.toThrow()
    })
  })

  describe.skip('Performance', () => {
    it('does not cause memory leaks', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      })

      const { unmount } = renderHook(() => useIsMobile())
      
      // Simulate multiple mount/unmount cycles
      for (let i = 0; i < 10; i++) {
        const { unmount: unmount2 } = renderHook(() => useIsMobile())
        unmount2()
      }
      
      unmount()
      
      // Should have cleaned up all listeners
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(11) // 10 + 1
    })
  })
})
