/**
 * Storage utility with versioning support
 * Automatically invalidates cache when version changes
 */

const STORAGE_VERSION = '1.0.0' // Increment this to invalidate all stored data
const VERSION_KEY = 'storyboard-storage-version'

/**
 * Check if storage version matches, clear if outdated
 */
export function checkStorageVersion() {
  if (typeof window === 'undefined') return

  try {
    const storedVersion = localStorage.getItem(VERSION_KEY)
    
    if (storedVersion !== STORAGE_VERSION) {
      console.log(`[Storage] Version mismatch. Stored: ${storedVersion}, Current: ${STORAGE_VERSION}. Clearing cache...`)
      
      // Clear all localStorage except user authentication
      const user = localStorage.getItem('user')
      const theme = localStorage.getItem('theme')
      
      localStorage.clear()
      
      // Restore important data
      if (user) localStorage.setItem('user', user)
      if (theme) localStorage.setItem('theme', theme)
      
      // Set new version
      localStorage.setItem(VERSION_KEY, STORAGE_VERSION)
      
      console.log('[Storage] Cache cleared and version updated')
    }
  } catch (error) {
    console.error('[Storage] Error checking version:', error)
  }
}

/**
 * Get item from localStorage with version check
 */
export function getStorageItem<T = string>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const item = localStorage.getItem(key)
    return item as T
  } catch (error) {
    console.error(`[Storage] Error getting item ${key}:`, error)
    return null
  }
}

/**
 * Set item in localStorage
 */
export function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error(`[Storage] Error setting item ${key}:`, error)
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`[Storage] Error removing item ${key}:`, error)
  }
}

/**
 * Get JSON object from localStorage
 */
export function getStorageJSON<T>(key: string): T | null {
  const item = getStorageItem(key)
  if (!item) return null

  try {
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`[Storage] Error parsing JSON for ${key}:`, error)
    return null
  }
}

/**
 * Set JSON object in localStorage
 */
export function setStorageJSON<T>(key: string, value: T): void {
  try {
    const json = JSON.stringify(value)
    setStorageItem(key, json)
  } catch (error) {
    console.error(`[Storage] Error stringifying JSON for ${key}:`, error)
  }
}

/**
 * Clear all application storage (except auth)
 */
export function clearAppStorage(): void {
  if (typeof window === 'undefined') return

  try {
    // Save auth data
    const user = localStorage.getItem('user')
    const theme = localStorage.getItem('theme')
    
    localStorage.clear()
    
    // Restore auth data
    if (user) localStorage.setItem('user', user)
    if (theme) localStorage.setItem('theme', theme)
    
    // Reset version
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION)
    
    console.log('[Storage] Application cache cleared')
  } catch (error) {
    console.error('[Storage] Error clearing storage:', error)
  }
}

/**
 * Force increment storage version to invalidate all cache
 * Call this during development when data structures change
 */
export function invalidateStorageCache(): void {
  if (typeof window === 'undefined') return

  try {
    const currentVersion = STORAGE_VERSION
    const newVersion = `${parseFloat(currentVersion) + 0.1}`
    
    console.log(`[Storage] Manually invalidating cache. New version: ${newVersion}`)
    localStorage.setItem(VERSION_KEY, newVersion)
    
    // Trigger a reload
    window.location.reload()
  } catch (error) {
    console.error('[Storage] Error invalidating cache:', error)
  }
}

