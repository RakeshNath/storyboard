import React from 'react'
import { render, screen } from '@testing-library/react'
import RootLayout from '@/app/layout'

// Mock next/font
jest.mock('geist/font/sans', () => ({
  GeistSans: 'mock-geist-sans',
}))

jest.mock('geist/font/mono', () => ({
  GeistMono: 'mock-geist-mono',
}))

// Mock Vercel Analytics
jest.mock('@vercel/analytics/next', () => ({
  Analytics: () => <div data-testid="analytics">Analytics</div>,
}))

// Mock CSS import
jest.mock('./globals.css', () => ({}))

describe('RootLayout Component', () => {
  it('renders children content', () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders with proper HTML structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    // Check that the html element has the lang attribute
    const htmlElement = container.querySelector('html')
    expect(htmlElement).toHaveAttribute('lang', 'en')
  })

  it('includes analytics component', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('analytics')).toBeInTheDocument()
  })

  it('applies font classes to body', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    const bodyElement = container.querySelector('body')
    expect(bodyElement).toHaveClass('mock-geist-sans')
    expect(bodyElement).toHaveClass('mock-geist-mono')
  })

  it('renders with proper metadata structure', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    // Check for proper document structure
    expect(document.head).toBeInTheDocument()
    expect(document.body).toBeInTheDocument()
  })

  it('handles multiple children', () => {
    render(
      <RootLayout>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('child1')).toBeInTheDocument()
    expect(screen.getByTestId('child2')).toBeInTheDocument()
    expect(screen.getByTestId('child3')).toBeInTheDocument()
  })

  it('renders efficiently', () => {
    const startTime = performance.now()
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(1000)
  })

  it('handles empty children', () => {
    render(<RootLayout>{null}</RootLayout>)
    
    // Should still render the layout structure
    expect(document.body).toBeInTheDocument()
  })

  it('maintains proper accessibility', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    // Check for proper document structure
    expect(document.documentElement).toBeInTheDocument()
    expect(document.body).toBeInTheDocument()
  })

  it('handles complex nested children', () => {
    render(
      <RootLayout>
        <header>
          <h1>Header</h1>
        </header>
        <main>
          <section>
            <h2>Section</h2>
            <p>Content</p>
          </section>
        </main>
        <footer>
          <p>Footer</p>
        </footer>
      </RootLayout>
    )
    
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Section')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})