const Puppeteer = require('codeceptjs/lib/helper/Puppeteer')
const Locator = require('codeceptjs/lib/locator')

class PuppeteerWrapper extends Puppeteer {
  constructor(config) {
    const defaults = {
      useInputReactUtils: false,
    }
    super({
      ...defaults,
      ...config,
    })
    this.prevUseInputReactUtilsStates = []
    global.browser = this
  }

  setInputTestUtilsState(value) {
    this.prevUseInputReactUtilsStates.push(this.useInputReactUtils)
    this.useInputReactUtils = value
  }

  restoreInputTestUtilsState() {
    if (this.prevUseInputReactUtilsStates.length) {
      this.useInputReactUtils = this.prevUseInputReactUtilsStates.pop()
    }
  }

  _before() {
    super._before()
    this.useInputReactUtils = this.config.useInputReactUtils
    this.prevUseInputReactUtilsStates = []
  }

  async __executeCodeceptMethod(methodName, ...args) {
    const res = await this.executeAsyncScript(
      (methodName, ...args) => {
        return window.__CODECEPT_METHODS__[methodName](...args)
      },
      methodName,
      ...args
    )
    if (res && res.indexOf('ERROR') !== -1) {
      throw new Error(res)
    }
    return res
  }

  async waitDisabled(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitDisabled', matchedLocator.value)
  }

  async waitEnabled(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitEnabled', matchedLocator.value)
  }

  async waitFocused(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitFocused', matchedLocator.value)
  }

  async waitVisible(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitVisible', matchedLocator.value)
  }

  async waitValue(locator, value) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitValue', matchedLocator.value, value)
  }

  async waitInvisible(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitInvisible', matchedLocator.value)
  }

  async waitUnfocused(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitUnfocused', matchedLocator.value)
  }

  async click(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('click', matchedLocator.value)
  }

  async fill(field, value, blurAfter) {
    if (this.useInputReactUtils) {
      const matchedLocator = new Locator(field)
      return await this.__executeCodeceptMethod('fill', matchedLocator.value, value, blurAfter)
    }
    return super.fillField(field, value)
  }

  async batchExecute(methodsArray) {
    return await this.__executeCodeceptMethod('batchExecute', methodsArray)
  }
}

module.exports = PuppeteerWrapper
