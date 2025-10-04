import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const Skeleton = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        data-testid="skeleton"
        className={cn('bg-accent animate-pulse rounded-md', className)}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export { Skeleton }
