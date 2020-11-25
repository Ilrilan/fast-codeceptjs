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
    return await this.__executeCodeceptMethod('waitDisabled', matchedLocator.value, matchedLocator.toString())
  }

  async waitEnabled(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitEnabled', matchedLocator.value, matchedLocator.toString())
  }

  async waitFocused(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitFocused', matchedLocator.value, matchedLocator.toString())
  }

  async waitVisible(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitVisible', matchedLocator.value, matchedLocator.toString())
  }

  async waitInvisible(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitInvisible', matchedLocator.value, matchedLocator.toString())
  }

  async waitUnfocused(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('waitUnfocused', matchedLocator.value, matchedLocator.toString())
  }

  async click(locator) {
    const matchedLocator = new Locator(locator)
    return await this.__executeCodeceptMethod('click', matchedLocator.value, matchedLocator.toString())
  }

  async fillField(field, value, blurAfter) {
    if (this.useInputReactUtils) {
      const matchedLocator = new Locator(field)
      return await this.__executeCodeceptMethod('fill', matchedLocator.value, field.toString(), value, blurAfter)
    }
    return super.fillField(field, value)
  }

  async batchExecute(methodsArray) {
    return await this.__executeCodeceptMethod('batchExecute', methodsArray)
  }
}

module.exports = PuppeteerWrapper
