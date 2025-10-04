import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '@/components/ui/use-mobile'

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
    mockMatchMedia.mockReturnValue({
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns false for desktop screen size', () => {
    window.innerWidth = 1024
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('returns true for mobile screen size', () => {
    window.innerWidth = 600
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('returns false for tablet screen size at breakpoint', () => {
    window.innerWidth = 768
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('returns true for mobile screen size below breakpoint', () => {
    window.innerWidth = 767
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('sets up media query listener', () => {
    renderHook(() => useIsMobile())
    
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('removes event listener on cleanup', () => {
    const { unmount } = renderHook(() => useIsMobile())
    
    unmount()
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('handles media query change events', () => {
    window.innerWidth = 1024
    
    const { result } = renderHook(() => useIsMobile())
    
    // Initially desktop
    expect(result.current).toBe(false)
    
    // Simulate media query change to mobile
    act(() => {
      window.innerWidth = 600
      const changeHandler = mockAddEventListener.mock.calls[0][1]
      changeHandler()
    })
    
    expect(result.current).toBe(true)
  })

  it('handles multiple resize events', () => {
    window.innerWidth = 1024
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
    
    // First change to mobile
    act(() => {
      window.innerWidth = 600
      const changeHandler = mockAddEventListener.mock.calls[0][1]
      changeHandler()
    })
    
    expect(result.current).toBe(true)
    
    // Second change back to desktop
    act(() => {
      window.innerWidth = 1024
      const changeHandler = mockAddEventListener.mock.calls[0][1]
      changeHandler()
    })
    
    expect(result.current).toBe(false)
  })

  it('handles edge case at exact breakpoint', () => {
    window.innerWidth = 767
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('handles very small screen sizes', () => {
    window.innerWidth = 320
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('handles very large screen sizes', () => {
    window.innerWidth = 1920
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('maintains correct breakpoint constant', () => {
    // Test that the breakpoint is exactly 768
    window.innerWidth = 768
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
    
    window.innerWidth = 767
    
    const { result: result2 } = renderHook(() => useIsMobile())
    
    expect(result2.current).toBe(true)
  })

  it('handles rapid resize events', () => {
    window.innerWidth = 1024
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
    
    const changeHandler = mockAddEventListener.mock.calls[0][1]
    
    // Simulate rapid resize events
    act(() => {
      window.innerWidth = 600
      changeHandler()
    })
    
    expect(result.current).toBe(true)
    
    act(() => {
      window.innerWidth = 800
      changeHandler()
    })
    
    expect(result.current).toBe(false)
    
    act(() => {
      window.innerWidth = 400
      changeHandler()
    })
    
    expect(result.current).toBe(true)
  })

  it('returns boolean value consistently', () => {
    window.innerWidth = 1024
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(typeof result.current).toBe('boolean')
    expect(result.current).toBe(false)
    
    window.innerWidth = 600
    
    const { result: result2 } = renderHook(() => useIsMobile())
    
    expect(typeof result2.current).toBe('boolean')
    expect(result2.current).toBe(true)
  })

  it('handles window.innerWidth changes correctly', () => {
    // Test various window sizes
    const testCases = [
      { width: 320, expected: true },
      { width: 480, expected: true },
      { width: 600, expected: true },
      { width: 767, expected: true },
      { width: 768, expected: false },
      { width: 1024, expected: false },
      { width: 1440, expected: false },
      { width: 1920, expected: false },
    ]
    
    testCases.forEach(({ width, expected }) => {
      window.innerWidth = width
      
      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(expected)
    })
  })
})
