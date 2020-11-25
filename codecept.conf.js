exports.config = {
  tests: 'src/**/*.test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:6006',
      show: true,
      windowSize: '1200x900',
      useInputReactUtils: true,
      waitForAction: 10,
      waitForTimeout: 5000,
    },
  },
  include: {},
  bootstrap: null,
  mocha: {},
  name: 'fast-codeceptjs',
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
    getMetrics: {
      require: './utils/get-metrics.js',
      enabled: true,
    },
  },
}
