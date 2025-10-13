'use client'

import { useEffect } from 'react'
import { checkStorageVersion } from '@/lib/storage'

/**
 * Component that checks storage version on mount and clears outdated cache
 * This ensures that when component code changes, old localStorage data doesn't cause issues
 */
export function StorageVersionChecker() {
  useEffect(() => {
    // Check storage version on mount
    checkStorageVersion()
    
    // In development, also check on HMR
    if (process.env.NODE_ENV === 'development') {
      // Listen for HMR updates
      if (typeof window !== 'undefined' && (window as any).module?.hot) {
        (window as any).module.hot.addStatusHandler((status: string) => {
          if (status === 'idle') {
            console.log('[HMR] Update complete, checking storage version...')
            checkStorageVersion()
          }
        })
      }
    }
  }, [])

  // This component doesn't render anything
  return null
}

