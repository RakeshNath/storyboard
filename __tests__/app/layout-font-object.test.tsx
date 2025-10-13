/**
 * Test for layout.tsx with font variables as objects
 * This tests the other branch of the ternary operators
 */

import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock fonts as objects with .variable property
jest.mock('geist/font/sans', () => ({
  GeistSans: { variable: '--font-geist-sans' },
}))

jest.mock('geist/font/mono', () => ({
  GeistMono: { variable: '--font-geist-mono' },
}))

// Mock Vercel Analytics
jest.mock('@vercel/analytics/next', () => ({
  Analytics: () => <div data-testid="analytics">Analytics</div>,
}))

// Must import after mocks are set up
import RootLayout from '@/app/layout'

describe('RootLayout with Font Objects', () => {
  it('uses font.variable property when fonts are objects', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    )
    
    const body = container.querySelector('body')
    
    // Should use .variable property when font is an object
    expect(body?.className).toContain('--font-geist-sans')
    expect(body?.className).toContain('--font-geist-mono')
    expect(body?.className).toContain('font-sans')
    expect(body?.className).toContain('antialiased')
  })

  it('renders children correctly with font objects', () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })
})

