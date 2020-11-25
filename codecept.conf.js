exports.config = {
  tests: 'src/**/*.test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      require: './utils/puppeteer-driver.js',
      url: 'http://localhost:6006',
      show: true,
      restart: false,
      windowSize: '1200x900',
      useInputReactUtils: false,
      waitForAction: 10,
      waitForTimeout: 5000,
    },
    FastCodeceptjsHelper: {
      require: './utils/codecept-helper.js',
      useAmOnStory: false,
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
