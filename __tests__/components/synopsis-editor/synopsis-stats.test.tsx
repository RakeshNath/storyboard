import { calculatePageStats } from '@/components/sections/synopsis-editor/synopsis-stats'

describe('Synopsis Stats Utilities', () => {
  describe('calculatePageStats', () => {
    it('calculates page count correctly for short content', () => {
      const content = 'This is a short synopsis.'
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1)
      expect(result.words).toBe(5) // "This", "is", "a", "short", "synopsis."
      expect(result.characters).toBe(25) // Actual character count
      expect(result.lines).toBe(1)
    })

    it('calculates page count correctly for medium content', () => {
      const content = 'This is a medium length synopsis that contains more words and should span multiple pages when it gets long enough to test the page calculation logic properly.'
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1) // Still only 1 page for this content
      expect(result.words).toBeGreaterThan(20)
      expect(result.characters).toBeGreaterThan(100)
      expect(result.lines).toBe(1)
    })

    it('calculates page count correctly for long content', () => {
      const content = Array(1000).fill('This is a long synopsis with many words to test the page calculation.').join(' ')
      const result = calculatePageStats(content)
      
      expect(result.pages).toBeGreaterThan(1)
      expect(result.words).toBeGreaterThan(1000)
      expect(result.characters).toBeGreaterThan(5000)
      expect(result.lines).toBe(1)
    })

    it('handles empty content', () => {
      const content = ''
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1)
      expect(result.words).toBe(0)
      expect(result.characters).toBe(0)
      expect(result.lines).toBe(1)
    })

    it('handles content with only whitespace', () => {
      const content = '   \n\t  \n  '
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1)
      expect(result.words).toBe(0)
      expect(result.characters).toBe(10) // Includes all whitespace characters
      expect(result.lines).toBe(3)
    })

    it('handles content with multiple lines', () => {
      const content = 'Line 1\nLine 2\nLine 3\nLine 4'
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1)
      expect(result.words).toBe(8)
      expect(result.characters).toBe(27) // Includes newline characters
      expect(result.lines).toBe(4)
    })

    it('handles content with special characters', () => {
      const content = 'This is a synopsis with special characters: @#$%^&*()_+-=[]{}|;:,.<>?'
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1)
      expect(result.words).toBe(8) // Words are split by whitespace, special chars are part of words
      expect(result.characters).toBe(69) // Actual character count
      expect(result.lines).toBe(1)
    })

    it('handles content with numbers', () => {
      const content = 'The year 2024 was significant with 100 events and 50 characters.'
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1)
      expect(result.words).toBe(11) // Numbers are counted as separate words
      expect(result.characters).toBe(64) // Actual character count
      expect(result.lines).toBe(1)
    })

    it('handles very long single word', () => {
      const content = 'supercalifragilisticexpialidocious'
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1)
      expect(result.words).toBe(1)
      expect(result.characters).toBe(34)
      expect(result.lines).toBe(1)
    })

    it('handles content with mixed line lengths', () => {
      const content = 'Short line\nThis is a much longer line that contains many more words and characters\nAnother short one'
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1)
      expect(result.words).toBe(18) // Actual word count
      expect(result.characters).toBe(100) // Actual character count
      expect(result.lines).toBe(3)
    })

    it('calculates page count based on words per page (750)', () => {
      const content = Array(800).fill('word').join(' ')
      const result = calculatePageStats(content)
      
      // Should be at least 2 pages based on word count
      expect(result.pages).toBeGreaterThanOrEqual(2)
      expect(result.words).toBe(800)
    })

    it('calculates page count based on characters per page (3750)', () => {
      const content = Array(4000).fill('a').join('')
      const result = calculatePageStats(content)
      
      // Should be at least 2 pages based on character count
      expect(result.pages).toBeGreaterThanOrEqual(2)
      expect(result.characters).toBe(4000)
    })

    it('calculates page count based on lines per page (75)', () => {
      const content = Array(80).fill('line').join('\n')
      const result = calculatePageStats(content)
      
      // Should be at least 2 pages based on line count
      expect(result.pages).toBeGreaterThanOrEqual(2)
      expect(result.lines).toBe(80)
    })

    it('uses the most conservative estimate (highest page count)', () => {
      // Create content that would result in different page counts for different methods
      const content = Array(1000).fill('word').join(' ') + '\n' + Array(100).fill('line').join('\n')
      const result = calculatePageStats(content)
      
      // Should use the highest of the three calculations
      expect(result.pages).toBeGreaterThanOrEqual(2)
      expect(result.words).toBe(1100) // 1000 words + 100 lines = 1100 words
      expect(result.lines).toBe(101) // 100 lines + 1 from the word array
    })

    it('handles minimum page count of 1', () => {
      const content = 'a'
      const result = calculatePageStats(content)
      
      expect(result.pages).toBe(1)
      expect(result.words).toBe(1)
      expect(result.characters).toBe(1)
      expect(result.lines).toBe(1)
    })
  })
})
