import { configure } from '@storybook/react'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

configure(() => {
  window.__REACT_TEST_UTILS__ = require('react-dom/test-utils')
  window.__CODECEPT_METHODS__ = require('../src/injects/browser-methods')
}, module)
