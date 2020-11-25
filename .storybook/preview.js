import { configure } from '@storybook/react'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

configure(() => {
  const startTime = new Date().getTime()
  while (new Date().getTime() - startTime < 1500) {}
  console.log('Now other 1000 stories will be loaded')
  window.__REACT_TEST_UTILS__ = require('react-dom/test-utils')
  window.__CODECEPT_METHODS__ = require('../src/injects/browser-methods')
}, module)
