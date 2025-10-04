'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ expand, richColors, closeButton, position, duration, ...props }: ToasterProps) => {
  const { theme: themeValue } = useTheme()
  const theme = themeValue || 'system'

  const dataAttrs: any = {}
  if (expand !== undefined) dataAttrs.expand = String(expand)
  if (richColors !== undefined) dataAttrs.richColors = String(richColors)
  if (closeButton !== undefined) dataAttrs.closeButton = String(closeButton)
  if (position !== undefined) dataAttrs.position = position
  if (duration !== undefined) dataAttrs.duration = String(duration)
  dataAttrs['data-theme'] = theme

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      data-testid="sonner-toaster"
      expand={expand}
      richColors={richColors}
      closeButton={closeButton}
      position={position}
      duration={duration}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...dataAttrs}
      {...props}
    />
  )
}

export { Toaster }
