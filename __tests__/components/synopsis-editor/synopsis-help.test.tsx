import React from 'react'
import { render, screen } from '@testing-library/react'
import { SynopsisHelp } from '@/components/sections/synopsis-editor/synopsis-help'

describe('SynopsisHelp Component', () => {
  describe('Rendering', () => {
    it('renders help content with help message and button', () => {
      render(<SynopsisHelp />)
      
      expect(screen.getByText('Need help? Check out our writing guide')).toBeInTheDocument()
      expect(screen.getByText('View Guide')).toBeInTheDocument()
    })

    it('renders help icon', () => {
      render(<SynopsisHelp />)
      
      // Check for help circle icon (lucide-react icon)
      const helpIcon = screen.getByRole('button', { name: /view guide/i }).closest('div')?.querySelector('svg')
      expect(helpIcon).toBeInTheDocument()
    })
  })

  describe('Content Structure', () => {
    it('has proper button structure', () => {
      render(<SynopsisHelp />)
      
      const viewGuideButton = screen.getByRole('button', { name: /view guide/i })
      expect(viewGuideButton).toBeInTheDocument()
      expect(viewGuideButton).toHaveClass('inline-flex', 'items-center', 'justify-center')
    })

    it('has proper help message structure', () => {
      render(<SynopsisHelp />)
      
      const helpMessage = screen.getByText('Need help? Check out our writing guide')
      expect(helpMessage).toBeInTheDocument()
      expect(helpMessage.closest('div')).toHaveClass('flex', 'items-center', 'gap-2', 'text-sm', 'text-muted-foreground')
    })
  })

  describe('Accessibility', () => {
    it('has proper button accessibility', () => {
      render(<SynopsisHelp />)
      
      const viewGuideButton = screen.getByRole('button', { name: /view guide/i })
      expect(viewGuideButton).toBeInTheDocument()
    })

    it('has accessible help message', () => {
      render(<SynopsisHelp />)
      
      expect(screen.getByText('Need help? Check out our writing guide')).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('has proper container structure', () => {
      render(<SynopsisHelp />)
      
      const container = screen.getByText('Need help? Check out our writing guide').closest('div')?.parentElement?.parentElement
      expect(container).toHaveClass('p-4', 'border-t', 'bg-muted/10')
    })

    it('has proper flex layout', () => {
      render(<SynopsisHelp />)
      
      const mainContainer = screen.getByText('Need help? Check out our writing guide').closest('div')?.parentElement
      expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-between')
    })
  })
})
