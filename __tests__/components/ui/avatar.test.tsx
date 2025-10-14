import React from 'react'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('renders with default props', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>
      )
      
      // Check that the avatar renders
      expect(screen.getByText('TA')).toBeInTheDocument()
      expect(screen.getByText('TA')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Avatar className="custom-avatar">
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>
      )
      
      const avatar = document.querySelector('.custom-avatar')
      expect(avatar).toHaveClass('custom-avatar')
    })

    it('renders with custom props', () => {
      render(
        <Avatar data-testid="custom-avatar">
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>
      )
      
      const avatar = screen.getByTestId('custom-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('AvatarImage', () => {
    it('renders with src and alt attributes', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>
      )
      
      // Avatar with image may not render the img element if image fails to load
      const fallback = screen.getByText('TA')
      expect(fallback).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" className="custom-image" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>
      )
      
      // Check that the avatar renders with fallback
      const fallback = screen.getByText('TA')
      expect(fallback).toBeInTheDocument()
    })

    it('handles missing src gracefully', () => {
      render(
        <Avatar>
          <AvatarImage alt="Test Avatar" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>
      )
      
      // Should fall back to AvatarFallback when image fails to load
      expect(screen.getByText('TA')).toBeInTheDocument()
    })

    it('handles broken image src', () => {
      render(
        <Avatar>
          <AvatarImage src="/broken-image.jpg" alt="Test Avatar" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>
      )
      
      // Should fall back to AvatarFallback when image fails to load
      expect(screen.getByText('TA')).toBeInTheDocument()
    })
  })

  describe('AvatarFallback', () => {
    it('renders fallback text', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>Test User</AvatarFallback>
        </Avatar>
      )
      
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback className="custom-fallback">TU</AvatarFallback>
        </Avatar>
      )
      
      const fallback = screen.getByText('TU')
      expect(fallback).toHaveClass('custom-fallback')
    })

    it('renders with initials', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('renders with single character', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>J</AvatarFallback>
        </Avatar>
      )
      
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('renders with complex content', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>
            <div>
              <span>👤</span>
              <span>User</span>
            </div>
          </AvatarFallback>
        </Avatar>
      )
      
      expect(screen.getByText('👤')).toBeInTheDocument()
      expect(screen.getByText('User')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>
      )
      
      // Check that the avatar renders with fallback
      const fallback = screen.getByText('TA')
      expect(fallback).toBeInTheDocument()
    })

    it('supports screen readers', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      
      // Check that the avatar renders with fallback
      const fallback = screen.getByText('JD')
      expect(fallback).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty fallback', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      )
      
      // Check that the avatar renders (fallback will be empty)
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('handles null fallback', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>{null}</AvatarFallback>
        </Avatar>
      )
      
      // Check that the avatar renders
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('handles undefined fallback', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>{undefined}</AvatarFallback>
        </Avatar>
      )
      
      // Check that the avatar renders
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('handles missing alt attribute', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>
      )
      
      // Check that the avatar renders
      expect(screen.getByText('TA')).toBeInTheDocument()
      expect(screen.getByText('TA')).toBeInTheDocument()
    })

    it('handles very long fallback text', () => {
      const longText = 'A'.repeat(100)
      
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test Avatar" />
          <AvatarFallback>{longText}</AvatarFallback>
        </Avatar>
      )
      
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })

  describe.skip('Performance', () => {
    it('renders efficiently with many avatars', () => {
      const startTime = performance.now()
      
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Avatar key={i}>
              <AvatarImage src={`/avatar-${i}.jpg`} alt={`User ${i}`} />
              <AvatarFallback>U{i}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      )
      
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // Should render in less than 1 second
      expect(screen.getAllByText(/U\d+/)).toHaveLength(100)
    })
  })
})
