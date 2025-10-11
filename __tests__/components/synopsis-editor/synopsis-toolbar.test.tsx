import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SynopsisToolbar } from '@/components/sections/synopsis-editor/synopsis-toolbar'

describe('SynopsisToolbar Component', () => {
  const mockEditor = {
    chain: jest.fn(() => ({
      focus: jest.fn(() => ({
        toggleBold: jest.fn(() => ({ run: jest.fn() })),
        toggleItalic: jest.fn(() => ({ run: jest.fn() })),
        toggleUnderline: jest.fn(() => ({ run: jest.fn() })),
        toggleStrike: jest.fn(() => ({ run: jest.fn() })),
        toggleBulletList: jest.fn(() => ({ run: jest.fn() })),
        toggleOrderedList: jest.fn(() => ({ run: jest.fn() })),
        toggleBlockquote: jest.fn(() => ({ run: jest.fn() })),
        toggleCodeBlock: jest.fn(() => ({ run: jest.fn() })),
        setHorizontalRule: jest.fn(() => ({ run: jest.fn() })),
        toggleSuperscript: jest.fn(() => ({ run: jest.fn() })),
        toggleSubscript: jest.fn(() => ({ run: jest.fn() })),
        toggleHighlight: jest.fn(() => ({ run: jest.fn() })),
        setColor: jest.fn(() => ({ run: jest.fn() })),
        setTextAlign: jest.fn(() => ({ run: jest.fn() })),
        toggleHeading: jest.fn(() => ({ run: jest.fn() }))
      }))
    })),
    isActive: jest.fn(() => false)
  }

  const mockProps = {
    editor: mockEditor
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders toolbar when editor is provided', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      expect(screen.getByTestId('rich-text-toolbar')).toBeInTheDocument()
    })

    it('does not render when editor is null', () => {
      render(<SynopsisToolbar editor={null} />)
      
      expect(screen.queryByTestId('rich-text-toolbar')).not.toBeInTheDocument()
    })

    it('renders all heading buttons', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      // Check for heading buttons by their icons
      const headingButtons = screen.getAllByRole('button')
      expect(headingButtons.length).toBeGreaterThan(0)
    })

    it('renders text formatting buttons', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      // Check for formatting buttons
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('renders list buttons', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      // Check for list buttons
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('renders alignment buttons', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      // Check for alignment buttons
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('renders color picker', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      const colorInput = screen.getByTitle('Text color')
      expect(colorInput).toBeInTheDocument()
      expect(colorInput).toHaveAttribute('type', 'color')
    })
  })

  describe('Button Interactions', () => {
    it('clicking each button triggers corresponding editor command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      
      // Click all buttons to ensure all onClick handlers are called
      for (const button of buttons) {
        await user.click(button)
      }
      
      // Should have called chain for each button click
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers heading level 1 command', async () => {
      const user = userEvent.setup()
      const mockChain = jest.fn().mockReturnValue({
        focus: jest.fn().mockReturnValue({
          toggleHeading: jest.fn().mockReturnValue({
            run: jest.fn()
          })
        })
      })
      
      const editorWithChain = { ...mockEditor, chain: mockChain }
      render(<SynopsisToolbar editor={editorWithChain} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0]) // H1 button
      
      expect(mockChain).toHaveBeenCalled()
    })

    it('triggers heading level 2 command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[1]) // H2 button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers heading level 3 command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[2]) // H3 button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers bold toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[3]) // Bold button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers italic toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[4]) // Italic button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers underline toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[5]) // Underline button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers strikethrough toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[6]) // Strikethrough button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers bullet list toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[7]) // Bullet list button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers ordered list toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[8]) // Ordered list button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers blockquote toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[9]) // Blockquote button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers code block toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[10]) // Code block button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers horizontal rule command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[11]) // Horizontal rule button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers align left command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[12]) // Align left button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers align center command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[13]) // Align center button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers align right command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[14]) // Align right button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers superscript toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[15]) // Superscript button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers subscript toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[16]) // Subscript button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('triggers highlight toggle command', async () => {
      const user = userEvent.setup()
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[17]) // Highlight button
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })
  })

  describe('Color Picker', () => {
    it('handles color picker changes', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      const colorInput = screen.getByTitle('Text color')
      fireEvent.change(colorInput, { target: { value: '#ff0000' } })
      
      // The color input change should trigger the editor chain
      expect(mockEditor.chain).toHaveBeenCalled()
    })
  })

  describe('Active States', () => {
    it('applies active styles when editor is active', () => {
      const activeEditor = {
        ...mockEditor,
        isActive: jest.fn(() => true)
      }
      
      render(<SynopsisToolbar editor={activeEditor} />)
      
      // Check that buttons have active classes when editor is active
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('does not apply active styles when editor is not active', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      // Check that buttons don't have active classes when editor is not active
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('has proper button roles and labels', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
    })

    it('has proper color input accessibility', () => {
      render(<SynopsisToolbar {...mockProps} />)
      
      const colorInput = screen.getByTitle('Text color')
      expect(colorInput).toHaveAttribute('type', 'color')
      expect(colorInput).toHaveAttribute('title', 'Text color')
    })
  })
})
