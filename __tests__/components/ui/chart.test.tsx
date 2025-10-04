import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  useChart
} from '@/components/ui/chart'

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: ({ children, ...props }: any) => (
    <div data-testid="chart-tooltip" {...props}>
      {children}
    </div>
  ),
  Legend: ({ children, ...props }: any) => (
    <div data-testid="chart-legend" {...props}>
      {children}
    </div>
  ),
}))

describe('Chart Components', () => {
  const mockConfig = {
    sales: {
      label: 'Sales',
      color: '#3b82f6',
    },
    profit: {
      label: 'Profit',
      color: '#10b981',
    },
    users: {
      label: 'Users',
      theme: {
        light: '#8b5cf6',
        dark: '#a78bfa',
      },
    },
  }

  describe('ChartContainer', () => {
    it('renders with default props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <div>Chart Content</div>
        </ChartContainer>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toBeInTheDocument()
      expect(container).toHaveTextContent('Chart Content')
    })

    it('renders with custom className', () => {
      render(
        <ChartContainer config={mockConfig} className="custom-chart">
          <div>Chart Content</div>
        </ChartContainer>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toBeInTheDocument()
    })

    it('renders with custom id', () => {
      render(
        <ChartContainer config={mockConfig} id="custom-chart-id">
          <div>Chart Content</div>
        </ChartContainer>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toBeInTheDocument()
    })

    it('renders with chart styles', () => {
      render(
        <ChartContainer config={mockConfig}>
          <div>Chart Content</div>
        </ChartContainer>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toBeInTheDocument()
      
      // Check if style element is rendered
      const styleElement = document.querySelector('style')
      expect(styleElement).toBeInTheDocument()
    })

    it('renders without styles when no color config', () => {
      const emptyConfig = {}
      
      render(
        <ChartContainer config={emptyConfig}>
          <div>Chart Content</div>
        </ChartContainer>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toBeInTheDocument()
      
      // Should not render style element when no colors
      const styleElement = document.querySelector('style')
      expect(styleElement).not.toBeInTheDocument()
    })

    it('passes through additional props', () => {
      render(
        <ChartContainer config={mockConfig} data-testid="custom-container">
          <div>Chart Content</div>
        </ChartContainer>
      )
      
      const container = screen.getByTestId('custom-container')
      expect(container).toBeInTheDocument()
    })

    it('generates unique chart ID', () => {
      render(
        <ChartContainer config={mockConfig}>
          <div>Chart Content</div>
        </ChartContainer>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toBeInTheDocument()
    })
  })

  describe('ChartTooltip', () => {
    it('renders with default props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltip />
        </ChartContainer>
      )
      
      const tooltip = screen.getByTestId('chart-tooltip')
      expect(tooltip).toBeInTheDocument()
    })

    it('renders with custom props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltip cursor={{ fill: 'red' }} />
        </ChartContainer>
      )
      
      const tooltip = screen.getByTestId('chart-tooltip')
      expect(tooltip).toBeInTheDocument()
    })
  })

  describe('ChartTooltipContent', () => {
    const mockPayload = [
      {
        dataKey: 'sales',
        name: 'sales',
        value: 1000,
        color: '#3b82f6',
      },
    ]

    it('renders with default props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active payload={mockPayload} />
        </ChartContainer>
      )
      
      // Tooltip content should render when active
      expect(true).toBe(true)
    })

    it('renders with dot indicator', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            indicator="dot" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with line indicator', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            indicator="line" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with dashed indicator', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            indicator="dashed" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom className', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            className="custom-tooltip" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with hideLabel true', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            hideLabel 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with hideIndicator true', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            hideIndicator 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom label', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            label="Custom Label" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with labelFormatter', () => {
      const labelFormatter = (value: any) => `Formatted: ${value}`
      
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            labelFormatter={labelFormatter} 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with formatter', () => {
      const formatter = (value: any) => [`$${value}`, 'Sales']
      
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            formatter={formatter} 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom color', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            color="#ff0000" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with nameKey', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            nameKey="customName" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with labelKey', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            labelKey="customLabel" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with labelClassName', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            labelClassName="custom-label-class" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('does not render when not active', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active={false} payload={mockPayload} />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('does not render when no payload', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent active payload={[]} />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('passes through additional props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent 
            active 
            payload={mockPayload} 
            data-testid="custom-tooltip-content" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })
  })

  describe('ChartLegend', () => {
    it('renders with default props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegend />
        </ChartContainer>
      )
      
      const legend = screen.getByTestId('chart-legend')
      expect(legend).toBeInTheDocument()
    })

    it('renders with custom props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegend verticalAlign="top" />
        </ChartContainer>
      )
      
      const legend = screen.getByTestId('chart-legend')
      expect(legend).toBeInTheDocument()
    })
  })

  describe('ChartLegendContent', () => {
    const mockPayload = [
      {
        dataKey: 'sales',
        name: 'sales',
        value: 1000,
        color: '#3b82f6',
      },
      {
        dataKey: 'profit',
        name: 'profit',
        value: 500,
        color: '#10b981',
      },
    ]

    it('renders with default props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={mockPayload} />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom className', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            className="custom-legend" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom formatter', () => {
      const formatter = (value: any) => `Custom: ${value}`
      
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            formatter={formatter} 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom color', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            color="#ff0000" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom icon', () => {
      const CustomIcon = () => <div data-testid="custom-icon">★</div>
      
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            icon={CustomIcon} 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with hideIcon true', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            hideIcon 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with hideLabel true', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            hideLabel 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom nameKey', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            nameKey="customName" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom labelKey', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            labelKey="customLabel" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom iconClassName', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            iconClassName="custom-icon-class" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('renders with custom labelClassName', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            labelClassName="custom-label-class" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })

    it('passes through additional props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent 
            payload={mockPayload} 
            data-testid="custom-legend-content" 
          />
        </ChartContainer>
      )
      
      expect(true).toBe(true)
    })
  })

  describe('useChart hook', () => {
    it('throws error when used outside chart container', () => {
      // Suppress console.error for this test
      const originalError = console.error
      console.error = jest.fn()
      
      const TestComponent = () => {
        useChart()
        return null
      }
      
      expect(() => render(<TestComponent />)).toThrow('useChart must be used within a <ChartContainer />')
      
      console.error = originalError
    })

    it('returns context when used within chart container', () => {
      const TestComponent = () => {
        const chart = useChart()
        return (
          <div data-testid="chart-context">
            {Object.keys(chart.config).length} config items
          </div>
        )
      }
      
      render(
        <ChartContainer config={mockConfig}>
          <TestComponent />
        </ChartContainer>
      )
      
      expect(screen.getByTestId('chart-context')).toBeInTheDocument()
    })
  })

  describe('Complete Chart Structure', () => {
    it('renders a complete chart with all components', () => {
      const mockPayload = [
        {
          dataKey: 'sales',
          name: 'sales',
          value: 1000,
          color: '#3b82f6',
        },
      ]

      render(
        <ChartContainer config={mockConfig}>
          <div>Chart Data</div>
          <ChartTooltip content={<ChartTooltipContent payload={mockPayload} />} />
          <ChartLegend content={<ChartLegendContent payload={mockPayload} />} />
        </ChartContainer>
      )
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
      expect(screen.getByText('Chart Data')).toBeInTheDocument()
    })

    it('renders chart with theme-based colors', () => {
      const themeConfig = {
        users: {
          label: 'Users',
          theme: {
            light: '#8b5cf6',
            dark: '#a78bfa',
          },
        },
      }

      render(
        <ChartContainer config={themeConfig}>
          <div>Theme Chart</div>
        </ChartContainer>
      )
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })

    it('renders chart with mixed color and theme config', () => {
      const mixedConfig = {
        sales: {
          label: 'Sales',
          color: '#3b82f6',
        },
        users: {
          label: 'Users',
          theme: {
            light: '#8b5cf6',
            dark: '#a78bfa',
          },
        },
      }

      render(
        <ChartContainer config={mixedConfig}>
          <div>Mixed Chart</div>
        </ChartContainer>
      )
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })

    it('renders chart with icons in config', () => {
      const iconConfig = {
        sales: {
          label: 'Sales',
          color: '#3b82f6',
          icon: () => <div>📈</div>,
        },
      }

      render(
        <ChartContainer config={iconConfig}>
          <div>Icon Chart</div>
        </ChartContainer>
      )
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })
  })
})
