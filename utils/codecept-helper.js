const urlIsStory = (url) => {
  return url.indexOf('/iframe.html?id=') !== -1
}

const getStoryId = (url) => {
  const search = url.split('?')[1]
  return new URLSearchParams(search).get('id')
}

/* eslint-disable no-undef */
const switchToStory = (storyId, url, done) => {
  const trySwitch = () => {
    return new Promise((resolve, reject) => {
      __STORYBOOK_CLIENT_API__._storyStore.setSelection({ storyId: 'none' })
      if (window.__ActiveRequests) {
        window.__ActiveRequests.clear()
      }
      setTimeout(() => {
        __STORYBOOK_CLIENT_API__._storyStore.setSelection({
          storyId: __STORYBOOK_CLIENT_API__._storyStore._data[storyId].id,
        })
        // update window.location url without reload page
        window.history.pushState({ storyId }, '', url)

        function checkRequests() {
          if (!window.__ActiveRequests || !window.__ActiveRequests.hasActive()) {
            resolve()
          } else {
            setTimeout(checkRequests, 0)
          }
        }

        setTimeout(checkRequests, 1)
      }, 10)
    })
  }
  let currentEl = document.getElementById('root').firstChild
  let tryCounts = 0
  const retrySwitch = () => {
    trySwitch().then(() => {
      if (document.getElementById('root').firstChild !== currentEl) {
        done('SUCCESS')
      } else {
        tryCounts++
        if (tryCounts < 5) {
          setTimeout(retrySwitch, 0)
        } else {
          done('Cannot switch to story, unknown error')
        }
      }
    })
  }
  retrySwitch()
}

const Helper = codecept_helper // eslint-disable-line no-undef
const supportedHelpers = ['Puppeteer']

class FastCodeceptHelper extends Helper {
  get helper() {
    if (this._helper) {
      return this._helper
    }

    for (const helperName of supportedHelpers) {
      if (Object.keys(this.helpers).indexOf(helperName) !== -1) {
        this._helper = this.helpers[helperName]
        this.browserName = helperName
      }
    }

    if (!this._helper) {
      throw new Error(`You use unsupported driver. Please, use one of ${JSON.stringify(supportedHelpers)}`)
    }

    return this._helper
  }

  async amOnStory(url) {
    if (!this.config.useAmOnStory) {
      await this.helper.amOnPage(url)
      return
    }
    this.lastUrl = url
    try {
      const currentUrl = await this.helper.grabCurrentUrl()
      if (!urlIsStory(url) || !urlIsStory(currentUrl)) {
        await this.helper.amOnPage(url)
      } else {
        const id = getStoryId(url)
        await this._clearDom()
        const result = await this.helper.executeAsyncScript(switchToStory, id, url)
        if (result !== 'SUCCESS') {
          throw new Error(result)
        }
      }
    } catch (e) {
      await this.helper.amOnPage(url)
    }
  }

  async _clearDom() {
    await this.helper.executeScript(() => {
      if (document.body && document.body.childNodes) {
        const elements = Array.from(document.body.childNodes)
        elements.forEach((el) => {
          if (el.id === 'root') {
            return
          }

          // Это может быть реактовский портал, при анмаунте реакт сам за собой его почистит
          const reactKey = Object.keys(el).find((key) => key.startsWith('__reactInternalInstance'))

          if (reactKey) {
            return
          }

          document.body.removeChild(el)
        })
      }
      // Скроллим в левый верхный угол если тесты меняли положение скроллеров
      // eslint-disable-next-line no-undef
      window.scrollTo(0, 0)
    })
  }

  async _before() {
    // чистим мусор в document.body который мог быть добавлен при прогоне теста - всякие всплывающие экраны и прочая фигня
    await this._clearDom()
  }

  async refreshStorybookPage() {
    const currentUrl = await this.helper.grabCurrentUrl()

    if (!this.lastUrl || this.lastUrl === currentUrl) {
      await this.helper.refreshPage()
    } else {
      await this.helper.amOnPage(this.lastUrl)
    }
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
}

module.exports = FastCodeceptHelper
