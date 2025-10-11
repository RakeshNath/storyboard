// Statistics calculation utilities for Synopsis Editor

export interface SynopsisStats {
  pages: number
  words: number
  characters: number
  lines: number
}

// Page calculation constants (industry standards)
const WORDS_PER_PAGE = 750
const CHARACTERS_PER_PAGE = 3750
const LINES_PER_PAGE = 75

/**
 * Calculate page count and statistics for synopsis content
 */
export const calculatePageStats = (content: string): SynopsisStats => {
  const words = content.trim().split(/\s+/).filter(word => word.length > 0).length
  const characters = content.length
  const lines = content.split('\n').length
  
  // Calculate page count based on multiple methods and take the highest
  const pagesByWords = Math.max(1, Math.ceil(words / WORDS_PER_PAGE))
  const pagesByCharacters = Math.max(1, Math.ceil(characters / CHARACTERS_PER_PAGE))
  const pagesByLines = Math.max(1, Math.ceil(lines / LINES_PER_PAGE))
  
  // Use the most conservative estimate (highest page count)
  const estimatedPages = Math.max(pagesByWords, pagesByCharacters, pagesByLines)
  
  return {
    pages: estimatedPages,
    words,
    characters,
    lines
  }
}
