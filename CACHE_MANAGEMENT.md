# Cache Management System

## Problem Solved

Previously, when you made changes to components during development, you had to manually refresh or clear cache to see changes. This was because components use `localStorage` to persist data (screenplays, synopses, character profiles, etc.), and **old data would be loaded with new code**.

## Solution

We've implemented an **automatic cache versioning system** that:
1. ✅ Automatically clears outdated cache when code changes
2. ✅ Preserves user authentication and theme preferences
3. ✅ Provides developer tools for manual cache control
4. ✅ Works seamlessly with Next.js Hot Module Replacement (HMR)

## How It Works

### Automatic Version Checking

The `StorageVersionChecker` component runs on app startup and checks if the localStorage version matches the current code version. If not, it automatically clears outdated data.

```typescript
// In lib/storage.ts
const STORAGE_VERSION = '1.0.0' // Increment to invalidate all cache
```

### When Cache is Automatically Cleared

- ✅ When you first load the app after a code update
- ✅ When the STORAGE_VERSION in `lib/storage.ts` changes
- ❌ NOT cleared: User authentication, theme preferences

### Manual Cache Control

#### Method 1: Developer Panel (Recommended)
Press `Ctrl+Shift+D` anywhere in the dashboard to open the Dev Panel:
- View current cache version
- See all stored keys and size
- Clear cache with one click
- Perform hard reload (clear + refresh)

#### Method 2: Clear Cache Button
Click the "Clear Cache" navigation item in the sidebar to clear all application data and refresh.

#### Method 3: Programmatic
```typescript
import { clearAppStorage } from '@/lib/storage'

// Clear all app data (preserves auth)
clearAppStorage()
```

## For Developers

### Forcing Cache Invalidation

When you make breaking changes to data structures, increment the version:

```typescript
// lib/storage.ts
const STORAGE_VERSION = '1.0.1' // Changed from '1.0.0'
```

All users will automatically have their cache cleared on next visit.

### Using the Storage Utilities

Instead of using `localStorage` directly, use the utility functions:

```typescript
import { setStorageJSON, getStorageJSON, setStorageItem, getStorageItem } from '@/lib/storage'

// Save JSON data
setStorageJSON('my-key', { data: 'value' })

// Load JSON data
const data = getStorageJSON<MyType>('my-key')

// Save string data
setStorageItem('my-string', 'value')

// Load string data
const str = getStorageItem('my-string')
```

### Benefits

1. **Better Error Handling**: Catches and logs localStorage errors
2. **Type Safety**: TypeScript generics for JSON data
3. **SSR Safe**: Checks for `window` availability
4. **Version Awareness**: Works with the versioning system

## Development Tips

### Seeing Changes Immediately

Your changes should now reflect immediately thanks to:
- Next.js HMR reloading component code
- Automatic cache version checking
- Dev panel for quick manual overrides

### Debugging Cache Issues

1. Press `Ctrl+Shift+D` to open Dev Panel
2. Check what keys are stored
3. See the current version
4. Clear cache if needed

### Production Behavior

- Dev Panel is **not visible** in production (automatically hidden)
- Cache versioning **still works** - users get updated data
- Manual cache clear button **still available** in sidebar

## Files Modified

- `lib/storage.ts` - New storage utility with versioning
- `components/storage-version-checker.tsx` - Auto-check on app load
- `components/dev-cache-panel.tsx` - Developer tools panel
- `components/dashboard-layout.tsx` - Integrated dev panel
- `app/layout.tsx` - Added storage version checker

## Migration Guide

If you have existing code using `localStorage`:

**Before:**
```typescript
localStorage.setItem('data', JSON.stringify(myData))
const data = JSON.parse(localStorage.getItem('data') || '{}')
```

**After:**
```typescript
import { setStorageJSON, getStorageJSON } from '@/lib/storage'

setStorageJSON('data', myData)
const data = getStorageJSON<MyDataType>('data')
```

## FAQ

### Q: Will users lose their data?
A: Only when you increment `STORAGE_VERSION` to force a cache clear. Authentication and theme are always preserved.

### Q: How do I test cache invalidation?
A: Open Dev Panel (`Ctrl+Shift+D`), note the version, increment it in `lib/storage.ts`, then refresh. Cache should clear.

### Q: What if I want to keep some data during version changes?
A: Add it to the preservation list in `clearAppStorage()` function in `lib/storage.ts`.

### Q: Does this work in production?
A: Yes! The version checking works everywhere. Dev Panel is development-only.

## Summary

✅ **Problem Solved**: Changes now reflect immediately without manual cache clearing  
✅ **Developer Tools**: Quick access via `Ctrl+Shift+D`  
✅ **Production Ready**: Automatic version management for all users  
✅ **Safe**: Preserves authentication and user preferences  

