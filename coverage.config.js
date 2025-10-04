// Coverage configuration for different thresholds
const coverageThresholds = {
  current: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  '80': {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  '90': {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  '95': {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  '98': {
    global: {
      branches: 98,
      functions: 98,
      lines: 98,
      statements: 98,
    },
  },
}

module.exports = {
  coverageThresholds,
  getThreshold: (level = '80') => coverageThresholds[level] || coverageThresholds['80'],
}
