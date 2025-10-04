import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table'

describe('Table Components', () => {
  describe('Table', () => {
    it('renders with default props', () => {
      render(
        <Table>
          <tbody>
            <tr>
              <td>Content</td>
            </tr>
          </tbody>
        </Table>
      )
      
      const container = document.querySelector('[data-slot="table-container"]')
      const table = document.querySelector('[data-slot="table"]')
      
      expect(container).toBeInTheDocument()
      expect(table).toBeInTheDocument()
      expect(table?.tagName).toBe('TABLE')
    })

    it('applies correct CSS classes to container', () => {
      render(
        <Table>
          <tbody>
            <tr><td>Content</td></tr>
          </tbody>
        </Table>
      )
      
      const container = document.querySelector('[data-slot="table-container"]')
      expect(container).toHaveClass('relative', 'w-full', 'overflow-x-auto')
    })

    it('applies correct CSS classes to table', () => {
      render(
        <Table>
          <tbody>
            <tr><td>Content</td></tr>
          </tbody>
        </Table>
      )
      
      const table = document.querySelector('[data-slot="table"]')
      expect(table).toHaveClass('w-full', 'caption-bottom', 'text-sm')
    })

    it('renders with custom className', () => {
      render(
        <Table className="custom-table">
          <tbody>
            <tr><td>Content</td></tr>
          </tbody>
        </Table>
      )
      
      const table = document.querySelector('[data-slot="table"]')
      expect(table).toHaveClass('custom-table')
    })

    it('renders with children', () => {
      render(
        <Table>
          <tbody>
            <tr>
              <td data-testid="cell">Test Content</td>
            </tr>
          </tbody>
        </Table>
      )
      
      expect(screen.getByTestId('cell')).toBeInTheDocument()
      expect(screen.getByTestId('cell')).toHaveTextContent('Test Content')
    })
  })

  describe('TableHeader', () => {
    it('renders with default props', () => {
      render(
        <Table>
          <TableHeader>
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </Table>
      )
      
      const header = document.querySelector('[data-slot="table-header"]')
      expect(header).toBeInTheDocument()
      expect(header?.tagName).toBe('THEAD')
    })

    it('applies correct CSS classes', () => {
      render(
        <Table>
          <TableHeader>
            <tr><th>Header</th></tr>
          </TableHeader>
        </Table>
      )
      
      const header = document.querySelector('[data-slot="table-header"]')
      expect(header).toHaveClass('[&_tr]:border-b')
    })

    it('renders with custom className', () => {
      render(
        <Table>
          <TableHeader className="custom-header">
            <tr><th>Header</th></tr>
          </TableHeader>
        </Table>
      )
      
      const header = document.querySelector('[data-slot="table-header"]')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('TableBody', () => {
    it('renders with default props', () => {
      render(
        <Table>
          <TableBody>
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </Table>
      )
      
      const body = document.querySelector('[data-slot="table-body"]')
      expect(body).toBeInTheDocument()
      expect(body?.tagName).toBe('TBODY')
    })

    it('applies correct CSS classes', () => {
      render(
        <Table>
          <TableBody>
            <tr><td>Body</td></tr>
          </TableBody>
        </Table>
      )
      
      const body = document.querySelector('[data-slot="table-body"]')
      expect(body).toHaveClass('[&_tr:last-child]:border-0')
    })

    it('renders with custom className', () => {
      render(
        <Table>
          <TableBody className="custom-body">
            <tr><td>Body</td></tr>
          </TableBody>
        </Table>
      )
      
      const body = document.querySelector('[data-slot="table-body"]')
      expect(body).toHaveClass('custom-body')
    })
  })

  describe('TableFooter', () => {
    it('renders with default props', () => {
      render(
        <Table>
          <TableFooter>
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </Table>
      )
      
      const footer = document.querySelector('[data-slot="table-footer"]')
      expect(footer).toBeInTheDocument()
      expect(footer?.tagName).toBe('TFOOT')
    })

    it('applies correct CSS classes', () => {
      render(
        <Table>
          <TableFooter>
            <tr><td>Footer</td></tr>
          </TableFooter>
        </Table>
      )
      
      const footer = document.querySelector('[data-slot="table-footer"]')
      expect(footer).toHaveClass(
        'bg-muted/50',
        'border-t',
        'font-medium',
        '[&>tr]:last:border-b-0'
      )
    })

    it('renders with custom className', () => {
      render(
        <Table>
          <TableFooter className="custom-footer">
            <tr><td>Footer</td></tr>
          </TableFooter>
        </Table>
      )
      
      const footer = document.querySelector('[data-slot="table-footer"]')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('TableRow', () => {
    it('renders with default props', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <td>Row</td>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const row = document.querySelector('[data-slot="table-row"]')
      expect(row).toBeInTheDocument()
      expect(row?.tagName).toBe('TR')
    })

    it('applies correct CSS classes', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <td>Row</td>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const row = document.querySelector('[data-slot="table-row"]')
      expect(row).toHaveClass(
        'hover:bg-muted/50',
        'data-[state=selected]:bg-muted',
        'border-b',
        'transition-colors'
      )
    })

    it('renders with custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow className="custom-row">
              <td>Row</td>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const row = document.querySelector('[data-slot="table-row"]')
      expect(row).toHaveClass('custom-row')
    })
  })

  describe('TableHead', () => {
    it('renders with default props', () => {
      render(
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Header Cell</TableHead>
            </tr>
          </TableHeader>
        </Table>
      )
      
      const head = document.querySelector('[data-slot="table-head"]')
      expect(head).toBeInTheDocument()
      expect(head?.tagName).toBe('TH')
      expect(head).toHaveTextContent('Header Cell')
    })

    it('applies correct CSS classes', () => {
      render(
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Header</TableHead>
            </tr>
          </TableHeader>
        </Table>
      )
      
      const head = document.querySelector('[data-slot="table-head"]')
      expect(head).toHaveClass(
        'text-foreground',
        'h-10',
        'px-2',
        'text-left',
        'align-middle',
        'font-medium',
        'whitespace-nowrap',
        '[&:has([role=checkbox])]:pr-0',
        '[&>[role=checkbox]]:translate-y-[2px]'
      )
    })

    it('renders with custom className', () => {
      render(
        <Table>
          <TableHeader>
            <tr>
              <TableHead className="custom-head">Header</TableHead>
            </tr>
          </TableHeader>
        </Table>
      )
      
      const head = document.querySelector('[data-slot="table-head"]')
      expect(head).toHaveClass('custom-head')
    })
  })

  describe('TableCell', () => {
    it('renders with default props', () => {
      render(
        <Table>
          <TableBody>
            <tr>
              <TableCell>Cell Content</TableCell>
            </tr>
          </TableBody>
        </Table>
      )
      
      const cell = document.querySelector('[data-slot="table-cell"]')
      expect(cell).toBeInTheDocument()
      expect(cell?.tagName).toBe('TD')
      expect(cell).toHaveTextContent('Cell Content')
    })

    it('applies correct CSS classes', () => {
      render(
        <Table>
          <TableBody>
            <tr>
              <TableCell>Cell</TableCell>
            </tr>
          </TableBody>
        </Table>
      )
      
      const cell = document.querySelector('[data-slot="table-cell"]')
      expect(cell).toHaveClass(
        'p-2',
        'align-middle',
        'whitespace-nowrap',
        '[&:has([role=checkbox])]:pr-0',
        '[&>[role=checkbox]]:translate-y-[2px]'
      )
    })

    it('renders with custom className', () => {
      render(
        <Table>
          <TableBody>
            <tr>
              <TableCell className="custom-cell">Cell</TableCell>
            </tr>
          </TableBody>
        </Table>
      )
      
      const cell = document.querySelector('[data-slot="table-cell"]')
      expect(cell).toHaveClass('custom-cell')
    })
  })

  describe('TableCaption', () => {
    it('renders with default props', () => {
      render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <tbody>
            <tr><td>Content</td></tr>
          </tbody>
        </Table>
      )
      
      const caption = document.querySelector('[data-slot="table-caption"]')
      expect(caption).toBeInTheDocument()
      expect(caption?.tagName).toBe('CAPTION')
      expect(caption).toHaveTextContent('Table Caption')
    })

    it('applies correct CSS classes', () => {
      render(
        <Table>
          <TableCaption>Caption</TableCaption>
          <tbody>
            <tr><td>Content</td></tr>
          </tbody>
        </Table>
      )
      
      const caption = document.querySelector('[data-slot="table-caption"]')
      expect(caption).toHaveClass('text-muted-foreground', 'mt-4', 'text-sm')
    })

    it('renders with custom className', () => {
      render(
        <Table>
          <TableCaption className="custom-caption">Caption</TableCaption>
          <tbody>
            <tr><td>Content</td></tr>
          </tbody>
        </Table>
      )
      
      const caption = document.querySelector('[data-slot="table-caption"]')
      expect(caption).toHaveClass('custom-caption')
    })
  })

  describe('Complete Table Structure', () => {
    it('renders a complete table with all components', () => {
      render(
        <Table>
          <TableCaption>User Data</TableCaption>
          <TableHeader>
            <tr>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <tr>
              <TableCell colSpan={2}>Total: 2 users</TableCell>
            </tr>
          </TableFooter>
        </Table>
      )
      
      // Check all components are rendered
      expect(document.querySelector('[data-slot="table-container"]')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="table"]')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="table-caption"]')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="table-header"]')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="table-body"]')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="table-footer"]')).toBeInTheDocument()
      
      // Check content
      expect(screen.getByText('User Data')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('Total: 2 users')).toBeInTheDocument()
      
      // Check we have 2 rows in body
      const bodyRows = document.querySelectorAll('[data-slot="table-body"] [data-slot="table-row"]')
      expect(bodyRows).toHaveLength(2)
      
      // Check we have 2 header cells
      const headerCells = document.querySelectorAll('[data-slot="table-header"] [data-slot="table-head"]')
      expect(headerCells).toHaveLength(2)
    })

    it('handles table with checkboxes', () => {
      render(
        <Table>
          <TableHeader>
            <tr>
              <TableHead>
                <input type="checkbox" role="checkbox" />
              </TableHead>
              <TableHead>Name</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <input type="checkbox" role="checkbox" />
              </TableCell>
              <TableCell>John Doe</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(2)
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
})
