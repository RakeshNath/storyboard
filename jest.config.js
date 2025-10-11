const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/playground-content.tsx', // Exclude playground from coverage
    '!**/playground/**', // Exclude any playground directory
  ],
  
  // Enhanced debugging and monitoring
  verbose: false, // Set to false for faster runs, use --verbose flag when needed
  detectLeaks: false, // Skip in development for speed
  detectOpenHandles: false, // Skip in development for speed
  forceExit: true,
  maxWorkers: '100%', // Use all CPU cores for maximum speed
  
  // Coverage reporting
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageDirectory: 'coverage',
  
  // Test reporting
  reporters: ['default'],

  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}

module.exports = createJestConfig(customJestConfig)