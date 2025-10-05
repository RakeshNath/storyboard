import React from 'react'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormItemContext,
  FormFieldContext,
} from '@/components/ui/form'

// Mock react-hook-form
const mockGetFieldState = jest.fn(() => ({ error: null }))
const mockUseFormContext = jest.fn(() => ({
  getFieldState: mockGetFieldState,
}))

jest.mock('react-hook-form', () => {
  const mockGetFieldState = jest.fn(() => ({ error: null }))
  const mockUseFormContext = jest.fn(() => ({
    getFieldState: mockGetFieldState,
  }))
  
  return {
    useForm: jest.fn(() => ({
      control: {},
      handleSubmit: jest.fn(),
      formState: { errors: {} },
      getFieldState: mockGetFieldState,
      register: jest.fn(),
    })),
    FormProvider: ({ children }: any) => <div data-testid="form-provider">{children}</div>,
    Controller: ({ render: renderProp }: any) => renderProp({ field: {} }),
    useFormContext: mockUseFormContext,
    useFormState: jest.fn(() => ({ errors: {} })),
  }
})

// Mock Radix UI components
jest.mock('@radix-ui/react-label', () => ({
  Root: ({ children, ...props }: any) => (
    <label data-testid="label-root" {...props}>
      {children}
    </label>
  ),
}))

jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => (
    <div data-testid="slot" {...props}>
      {children}
    </div>
  ),
}))

// Mock Label component
jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => (
    <label data-testid="label" {...props}>
      {children}
    </label>
  ),
}))

describe('Form Components', () => {
  describe('Form (FormProvider)', () => {
    it('renders with children', () => {
      render(
        <Form>
          <div>Form Content</div>
        </Form>
      )
      
      const form = screen.getByTestId('form-provider')
      expect(form).toBeInTheDocument()
      expect(form).toHaveTextContent('Form Content')
    })
  })

  describe('FormItem', () => {
    it('renders with default props', () => {
      render(
        <FormItem>
          <div>Form Item Content</div>
        </FormItem>
      )
      
      const item = document.querySelector('[data-slot="form-item"]')
      expect(item).toBeInTheDocument()
      expect(item?.tagName).toBe('DIV')
      expect(item).toHaveTextContent('Form Item Content')
    })

    it('applies correct CSS classes', () => {
      render(
        <FormItem>
          <div>Content</div>
        </FormItem>
      )
      
      const item = document.querySelector('[data-slot="form-item"]')
      expect(item).toHaveClass('grid', 'gap-2')
    })

    it('renders with custom className', () => {
      render(
        <FormItem className="custom-class">
          <div>Content</div>
        </FormItem>
      )
      
      const item = document.querySelector('[data-slot="form-item"]')
      expect(item).toHaveClass('custom-class')
    })

    it('provides FormItemContext', () => {
      const TestComponent = () => {
        const context = React.useContext(FormItemContext)
        return <div data-testid="context-value">{context.id}</div>
      }
      
      render(
        <FormItem>
          <TestComponent />
        </FormItem>
      )
      
      const contextValue = screen.getByTestId('context-value')
      expect(contextValue).toBeInTheDocument()
      expect(contextValue.textContent).toBeTruthy()
    })
  })

  describe('FormLabel', () => {
    const MockFormField = ({ children }: any) => (
      <FormFieldContext.Provider value={{ name: 'testField' }}>
        <FormItemContext.Provider value={{ id: 'test-id' }}>
          {children}
        </FormItemContext.Provider>
      </FormFieldContext.Provider>
    )

    it('renders with default props', () => {
      render(
        <MockFormField>
          <FormLabel>Test Label</FormLabel>
        </MockFormField>
      )
      
      const label = document.querySelector('[data-slot="form-label"]')
      expect(label).toBeInTheDocument()
      expect(label).toHaveTextContent('Test Label')
    })

    it('applies correct CSS classes', () => {
      render(
        <MockFormField>
          <FormLabel>Label</FormLabel>
        </MockFormField>
      )
      
      const label = document.querySelector('[data-slot="form-label"]')
      expect(label).toHaveClass('data-[error=true]:text-destructive')
    })

    it('renders with custom className', () => {
      render(
        <MockFormField>
          <FormLabel className="custom-label">Label</FormLabel>
        </MockFormField>
      )
      
      const label = document.querySelector('[data-slot="form-label"]')
      expect(label).toHaveClass('custom-label')
    })

    it('sets htmlFor attribute correctly', () => {
      render(
        <MockFormField>
          <FormLabel>Label</FormLabel>
        </MockFormField>
      )
      
      const label = document.querySelector('[data-slot="form-label"]')
      expect(label).toHaveAttribute('for', 'test-id-form-item')
    })

    it('shows error state', () => {
      const mockUseFormContext = require('react-hook-form').useFormContext
      mockUseFormContext.mockReturnValue({
        getFieldState: jest.fn(() => ({ error: { message: 'Test error' } })),
      })
      
      render(
        <MockFormField>
          <FormLabel>Label</FormLabel>
        </MockFormField>
      )
      
      const label = document.querySelector('[data-slot="form-label"]')
      expect(label).toHaveAttribute('data-error', 'true')
    })
  })

  describe('FormControl', () => {
    const MockFormField = ({ children }: any) => (
      <FormFieldContext.Provider value={{ name: 'testField' }}>
        <FormItemContext.Provider value={{ id: 'test-id' }}>
          {children}
        </FormItemContext.Provider>
      </FormFieldContext.Provider>
    )

    it('renders with default props', () => {
      render(
        <MockFormField>
          <FormControl>
            <input />
          </FormControl>
        </MockFormField>
      )
      
      const control = document.querySelector('[data-slot="form-control"]')
      expect(control).toBeInTheDocument()
    })

    it('sets id attribute correctly', () => {
      render(
        <MockFormField>
          <FormControl>
            <input />
          </FormControl>
        </MockFormField>
      )
      
      const control = document.querySelector('[data-slot="form-control"]')
      expect(control).toHaveAttribute('id', 'test-id-form-item')
    })

    it('sets aria-invalid attribute', () => {
      // Reset mock to return no error
      const mockGetFieldState = require('react-hook-form').useFormContext().getFieldState
      mockGetFieldState.mockReturnValue({ error: null })
      
      render(
        <MockFormField>
          <FormControl>
            <input />
          </FormControl>
        </MockFormField>
      )
      
      const control = document.querySelector('[data-slot="form-control"]')
      expect(control).toHaveAttribute('aria-invalid', 'false')
    })

    it('sets aria-describedby without error', () => {
      // Reset mock to return no error
      const mockGetFieldState = require('react-hook-form').useFormContext().getFieldState
      mockGetFieldState.mockReturnValue({ error: null })
      
      render(
        <MockFormField>
          <FormControl>
            <input />
          </FormControl>
        </MockFormField>
      )
      
      const control = document.querySelector('[data-slot="form-control"]')
      expect(control).toHaveAttribute('aria-describedby', 'test-id-form-item-description')
    })

    it('sets aria-describedby with error', () => {
      // Set mock to return error
      const mockGetFieldState = require('react-hook-form').useFormContext().getFieldState
      mockGetFieldState.mockReturnValue({ error: { message: 'Test error' } })
      
      render(
        <MockFormField>
          <FormControl>
            <input />
          </FormControl>
        </MockFormField>
      )
      
      const control = document.querySelector('[data-slot="form-control"]')
      expect(control).toHaveAttribute('aria-describedby', 'test-id-form-item-description test-id-form-item-message')                                                                                         
      expect(control).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('FormDescription', () => {
    const MockFormField = ({ children }: any) => (
      <FormFieldContext.Provider value={{ name: 'testField' }}>
        <FormItemContext.Provider value={{ id: 'test-id' }}>
          {children}
        </FormItemContext.Provider>
      </FormFieldContext.Provider>
    )

    it('renders with default props', () => {
      render(
        <MockFormField>
          <FormDescription>Test Description</FormDescription>
        </MockFormField>
      )
      
      const description = document.querySelector('[data-slot="form-description"]')
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent('Test Description')
    })

    it('applies correct CSS classes', () => {
      render(
        <MockFormField>
          <FormDescription>Description</FormDescription>
        </MockFormField>
      )
      
      const description = document.querySelector('[data-slot="form-description"]')
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
    })

    it('renders with custom className', () => {
      render(
        <MockFormField>
          <FormDescription className="custom-description">Description</FormDescription>
        </MockFormField>
      )
      
      const description = document.querySelector('[data-slot="form-description"]')
      expect(description).toHaveClass('custom-description')
    })

    it('sets id attribute correctly', () => {
      render(
        <MockFormField>
          <FormDescription>Description</FormDescription>
        </MockFormField>
      )
      
      const description = document.querySelector('[data-slot="form-description"]')
      expect(description).toHaveAttribute('id', 'test-id-form-item-description')
    })
  })

  describe('FormMessage', () => {
    const MockFormField = ({ children }: any) => (
      <FormFieldContext.Provider value={{ name: 'testField' }}>
        <FormItemContext.Provider value={{ id: 'test-id' }}>
          {children}
        </FormItemContext.Provider>
      </FormFieldContext.Provider>
    )

    it('renders with error message', () => {
      const mockUseFormContext = require('react-hook-form').useFormContext
      mockUseFormContext.mockReturnValue({
        getFieldState: jest.fn(() => ({ error: { message: 'Test error' } })),
      })
      
      render(
        <MockFormField>
          <FormMessage />
        </MockFormField>
      )
      
      const message = document.querySelector('[data-slot="form-message"]')
      expect(message).toBeInTheDocument()
      expect(message).toHaveTextContent('Test error')
    })

    it('renders with children when no error', () => {
      // Reset mock to return no error
      const mockGetFieldState = require('react-hook-form').useFormContext().getFieldState
      mockGetFieldState.mockReturnValue({ error: null })
      
      render(
        <MockFormField>
          <FormMessage>Custom message</FormMessage>
        </MockFormField>
      )
      
      const message = document.querySelector('[data-slot="form-message"]')
      expect(message).toBeInTheDocument()
      expect(message).toHaveTextContent('Custom message')
    })

    it('returns null when no body content', () => {
      // Reset mock to return no error
      const mockGetFieldState = require('react-hook-form').useFormContext().getFieldState
      mockGetFieldState.mockReturnValue({ error: null })
      
      render(
        <MockFormField>
          <FormMessage />
        </MockFormField>
      )
      
      const message = document.querySelector('[data-slot="form-message"]')
      expect(message).toBeNull()
    })

    it('applies correct CSS classes', () => {
      const mockUseFormContext = require('react-hook-form').useFormContext
      mockUseFormContext.mockReturnValue({
        getFieldState: jest.fn(() => ({ error: { message: 'Test error' } })),
      })
      
      render(
        <MockFormField>
          <FormMessage />
        </MockFormField>
      )
      
      const message = document.querySelector('[data-slot="form-message"]')
      expect(message).toHaveClass('text-destructive', 'text-sm')
    })

    it('renders with custom className', () => {
      const mockUseFormContext = require('react-hook-form').useFormContext
      mockUseFormContext.mockReturnValue({
        getFieldState: jest.fn(() => ({ error: { message: 'Test error' } })),
      })
      
      render(
        <MockFormField>
          <FormMessage className="custom-message" />
        </MockFormField>
      )
      
      const message = document.querySelector('[data-slot="form-message"]')
      expect(message).toHaveClass('custom-message')
    })

    it('sets id attribute correctly', () => {
      const mockUseFormContext = require('react-hook-form').useFormContext
      mockUseFormContext.mockReturnValue({
        getFieldState: jest.fn(() => ({ error: { message: 'Test error' } })),
      })
      
      render(
        <MockFormField>
          <FormMessage />
        </MockFormField>
      )
      
      const message = document.querySelector('[data-slot="form-message"]')
      expect(message).toHaveAttribute('id', 'test-id-form-item-message')
    })
  })

  describe('FormField', () => {
    it('renders with Controller', () => {
      render(
        <FormField
          name="testField"
          render={({ field }) => <input {...field} data-testid="controlled-input" />}
        />
      )
      
      const input = screen.getByTestId('controlled-input')
      expect(input).toBeInTheDocument()
    })

    it('provides FormFieldContext', () => {
      const TestComponent = () => {
        const context = React.useContext(FormFieldContext)
        return <div data-testid="field-context">{context.name}</div>
      }
      
      render(
        <FormField
          name="testField"
          render={() => <TestComponent />}
        />
      )
      
      const contextValue = screen.getByTestId('field-context')
      expect(contextValue).toBeInTheDocument()
      expect(contextValue).toHaveTextContent('testField')
    })
  })

  describe('useFormField', () => {
    const MockFormField = ({ children }: any) => (
      <FormFieldContext.Provider value={{ name: 'testField' }}>
        <FormItemContext.Provider value={{ id: 'test-id' }}>
          {children}
        </FormItemContext.Provider>
      </FormFieldContext.Provider>
    )

    it('returns form field data', () => {
      const TestComponent = () => {
        const field = useFormField()
        return (
          <div>
            <span data-testid="id">{field.id}</span>
            <span data-testid="name">{field.name}</span>
            <span data-testid="form-item-id">{field.formItemId}</span>
            <span data-testid="form-description-id">{field.formDescriptionId}</span>
            <span data-testid="form-message-id">{field.formMessageId}</span>
          </div>
        )
      }
      
      render(
        <MockFormField>
          <TestComponent />
        </MockFormField>
      )
      
      expect(screen.getByTestId('id')).toHaveTextContent('test-id')
      expect(screen.getByTestId('name')).toHaveTextContent('testField')
      expect(screen.getByTestId('form-item-id')).toHaveTextContent('test-id-form-item')
      expect(screen.getByTestId('form-description-id')).toHaveTextContent('test-id-form-item-description')
      expect(screen.getByTestId('form-message-id')).toHaveTextContent('test-id-form-item-message')
    })

    it('handles useFormField with proper context', () => {
      const TestComponent = () => {
        const field = useFormField()
        return <div data-testid="field-data">{field.name}</div>
      }
      
      render(
        <FormFieldContext.Provider value={{ name: 'testField' }}>
          <FormItemContext.Provider value={{ id: 'test-id' }}>
            <TestComponent />
          </FormItemContext.Provider>
        </FormFieldContext.Provider>
      )
      
      expect(screen.getByTestId('field-data')).toHaveTextContent('testField')
    })
  })

  describe('Complete Form Structure', () => {
    it('renders a complete form with all components', () => {
      // Reset mock to ensure it returns a valid object
      const mockUseFormContext = require('react-hook-form').useFormContext
      mockUseFormContext.mockReturnValue({
        getFieldState: jest.fn(() => ({ error: null })),
      })
      
      render(
        <Form>
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input {...field} type="email" />
                </FormControl>
                <FormDescription>Enter your email address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      )
      
      expect(screen.getByTestId('form-provider')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="form-item"]')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="form-label"]')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="form-control"]')).toBeInTheDocument()
      expect(document.querySelector('[data-slot="form-description"]')).toBeInTheDocument()
      
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    })
  })
})

// Helper contexts are now imported from the component
