/**
 * Lighthouse CI configuration
 * 
 * This file configures Lighthouse CI for performance testing.
 * https://github.com/GoogleChrome/lighthouse-ci
 */

module.exports = {
  ci: {
    collect: {
      // Use Puppeteer to collect metrics
      method: 'node',
      headful: false,
      numberOfRuns: 3,
      // List of URLs to test
      url: [
        'http://web:3000/',
        'http://web:3000/waitlist',
        'http://web:3000/feedback'
      ],
      settings: {
        // Specific device emulation
        preset: 'desktop',
        // Skip audits that require user interaction
        skipAudits: ['uses-http2'],
        // Set throttling to be more realistic for CI
        throttlingMethod: 'devtools',
        // Reduce throttling to make tests faster in CI
        throttling: {
          cpuSlowdownMultiplier: 2,
          downloadThroughputKbps: 1500,
          uploadThroughputKbps: 750,
          rttMs: 40
        }
      }
    },
    upload: {
      // Upload results to temporary public storage or to your own server
      target: process.env.LHCI_SERVER_BASE_URL ? 'lhci' : 'temporary-public-storage',
      serverBaseUrl: process.env.LHCI_SERVER_BASE_URL || undefined,
      token: process.env.LHCI_SERVER_TOKEN || undefined,
    },
    assert: {
      // Performance budget assertions
      // These should be adjusted based on your project's requirements
      assertions: {
        // Performance scores
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Critical performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Core web vitals
        'interactive': ['error', { maxNumericValue: 3500 }],
        'max-potential-fid': ['error', { maxNumericValue: 100 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Resource budgets
        'resource-summary:document:size': ['error', { maxNumericValue: 30000 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 200000 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:third-party:size': ['error', { maxNumericValue: 200000 }],
      }
    },
    server: {
      // Server configuration for running Lighthouse CI locally
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './.lighthouseci/db.sql'
      }
    }
  }
}; 