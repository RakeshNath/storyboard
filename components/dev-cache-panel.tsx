'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Trash2, RefreshCw, Info } from 'lucide-react'
import { clearAppStorage } from '@/lib/storage'

/**
 * Developer panel for cache management
 * Only shows in development mode
 * Press Ctrl+Shift+D to toggle
 */
export function DevCachePanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [storageInfo, setStorageInfo] = useState<{
    version: string | null
    keys: string[]
    size: number
  }>({
    version: null,
    keys: [],
    size: 0
  })

  // Only render in development
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (!isDevelopment) return

    // Keyboard shortcut: Ctrl+Shift+D
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isDevelopment])

  useEffect(() => {
    if (!isDevelopment || !isVisible) return

    updateStorageInfo()
  }, [isDevelopment, isVisible])

  const updateStorageInfo = () => {
    if (typeof window === 'undefined') return

    try {
      const version = localStorage.getItem('storyboard-storage-version')
      const keys = Object.keys(localStorage)
      
      // Calculate approximate size
      let size = 0
      keys.forEach(key => {
        const value = localStorage.getItem(key) || ''
        size += key.length + value.length
      })

      setStorageInfo({
        version,
        keys,
        size
      })
    } catch (error) {
      console.error('[DevPanel] Error reading storage:', error)
    }
  }

  const handleClearCache = () => {
    if (confirm('Clear all application cache? This will preserve your login.')) {
      clearAppStorage()
      updateStorageInfo()
      alert('✅ Cache cleared! Refresh the page to see changes.')
    }
  }

  const handleHardReload = () => {
    if (confirm('Perform a hard reload? This will clear cache and reload the page.')) {
      clearAppStorage()
      window.location.reload()
    }
  }

  if (!isDevelopment || !isVisible) return null

  const sizeInKB = (storageInfo.size / 1024).toFixed(2)

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-2 border-yellow-500/50 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-yellow-500" />
              <CardTitle className="text-sm">Dev Panel</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <CardDescription className="text-xs">
            Press <kbd className="px-1 bg-muted rounded">Ctrl+Shift+D</kbd> to toggle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Storage Info */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Version:</span>
              <Badge variant="outline" className="text-xs">
                {storageInfo.version || 'Not set'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Keys:</span>
              <Badge variant="outline" className="text-xs">
                {storageInfo.keys.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Size:</span>
              <Badge variant="outline" className="text-xs">
                {sizeInKB} KB
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearCache}
              className="flex-1 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear Cache
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleHardReload}
              className="flex-1 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Hard Reload
            </Button>
          </div>

          {/* Stored Keys */}
          {storageInfo.keys.length > 0 && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Stored keys ({storageInfo.keys.length})
              </summary>
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {storageInfo.keys.map(key => (
                  <div key={key} className="text-xs font-mono truncate" title={key}>
                    • {key}
                  </div>
                ))}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

