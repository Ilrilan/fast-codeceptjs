const ReactTestUtils = __REACT_TEST_UTILS__

function assertElementExists(els, locatorStr) {
  if (!els || els.length === 0) {
    throw new Error(`Element ${locatorStr} was not found`)
  }
}

function $x(xpath) {
  const iterator = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE)
  const array = []
  let item
  while ((item = iterator.iterateNext())) {
    array.push(item)
  }

  return array
}

function _focus(el) {
  el.focus()
  ReactTestUtils.Simulate.focus(el)
}

function _click(el) {
  ReactTestUtils.Simulate.mouseDown(el)
  ReactTestUtils.Simulate.click(el)
  el.click()
  ReactTestUtils.Simulate.mouseUp(el)
}

function isVisible(elem) {
  if (!(elem instanceof Element)) {
    throw Error('DomUtil: elem is not an element.')
  }
  const style = getComputedStyle(elem)
  if (style.display === 'none') {
    return false
  }
  if (style.visibility !== 'visible') {
    return false
  }
  /*if (style.opacity < 0.1) {
      return false
    }*/
  const rect = elem.getBoundingClientRect()
  if (elem.offsetWidth + elem.offsetHeight + rect.height + rect.width === 0) {
    return false
  }
  const elemCenter = {
    x: rect.left + elem.offsetWidth / 2,
    y: rect.top + elem.offsetHeight / 2,
  }
  if (elemCenter.x < 0) {
    return false
  }
  if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) {
    return false
  }
  if (elemCenter.y < 0) {
    return false
  }
  if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) {
    return false
  }
  let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y)
  do {
    if (pointContainer === elem) {
      return true
    }
  } while ((pointContainer = pointContainer.parentNode))
  return false
}

async function waitForScript(func, timeout = 5000, args = []) {
  return new Promise((resolve, reject) => {
    let finished = false // Флаг нужен, чтоб после резолва случайно ещё раз не вызвался func
    const superResolve = () => {
      finished = true
      resolve()
    }
    const timeoutReject = () => {
      finished = true
      reject(new Error('waitForScript: timeout end'))
    }
    const t1 = setTimeout(timeoutReject, timeout)

    const checkFn = () => {
      if (finished) {
        return
      }
      if (func(...args)) {
        clearTimeout(t1)
        superResolve()
      } else {
        setTimeout(checkFn, 0)
      }
    }
    checkFn()
  })
}

async function waitForFunction(fn, argsOrSec, sec) {
  let timeout
  let args
  if (typeof argsOrSec === 'number') {
    timeout = argsOrSec * 1000
    args = []
  } else {
    args = argsOrSec || []
    timeout = (sec || 5) * 1000
  }
  await waitForScript(fn, timeout, args)
}

// eslint-disable-next-line max-params
async function fill(xpath, locatorStr, value, doBlur = false, done) {
  async function macroTask() {
    await new Promise((resolve) => {
      setTimeout(resolve, 0)
      if (window.clock) {
        const time = Date.now()
        window.clock.tick(1)
        // запоминаем время и восстанавливаем его, чтобы не сдвигать значения таймеров Синона
        window.clock.setSystemTime(time)
      }
    })
  }

  if (typeof doBlur === 'function') {
    done = doBlur
    doBlur = false
  }

  try {
    const els = await $x(xpath)
    assertElementExists(els, locatorStr)
    const el = els[0]

    el.focus()
    ReactTestUtils.Simulate.focus(el)

    await macroTask()

    el.value = value
    ReactTestUtils.Simulate.change(el)

    await macroTask()

    if (doBlur) {
      el.blur()
      ReactTestUtils.Simulate.blur(el)

      await macroTask()
    } else {
      try {
        const pos = el.value.length
        el.setSelectionRange(pos, pos)

        await macroTask()
      } catch (e) {}
    }

    await macroTask()

    done()
  } catch (e) {
    done('ERROR: ' + e.toString())
  }
}

async function waitFocused(xpath, locatorStr, done) {
  return waitForFunction(() => {
    const el = $x(xpath)[0]
    return el && el === document.activeElement
  })
    .then(() => done('OK'))
    .catch(() => {
      done(`ERROR: Element ${locatorStr} was not focused`)
    })
}

async function waitUnfocused(xpath, locatorStr, done) {
  return waitForFunction(() => {
    const el = $x(xpath)[0]
    return el && el !== document.activeElement
  })
    .then(() => done('OK'))
    .catch(() => {
      done(`ERROR: Element ${locatorStr} still in focus`)
    })
}

async function waitVisible(xpath, locatorStr, done) {
  return waitForFunction(() => {
    const el = $x(xpath)[0]
    return el && isVisible(el)
  })
    .then(() => done('OK'))
    .catch(() => {
      done(`ERROR: Element ${locatorStr} was invisible`)
    })
}

async function waitDisabled(xpath, locatorStr, done) {
  return waitForFunction(() => {
    const el = $x(xpath)[0]
    return el && el.disabled
  })
    .then(() => done('OK'))
    .catch(() => {
      done(`ERROR: Element ${locatorStr} was enabled`)
    })
}

async function waitEnabled(xpath, locatorStr, done) {
  return waitForFunction(() => {
    const el = $x(xpath)[0]
    return el && !el.disabled
  })
    .then(() => done('OK'))
    .catch(() => {
      done(`ERROR: Element ${locatorStr} was disabled`)
    })
}

async function waitInvisible(xpath, locatorStr, done) {
  return waitForFunction(() => {
    const el = $x(xpath)[0]
    return !el || !isVisible(el)
  })
    .then(() => done('OK'))
    .catch(() => {
      done(`ERROR: Element ${locatorStr} was visible`)
    })
}

async function click(xpath, locatorStr, done) {
  try {
    const els = await $x(xpath)
    assertElementExists(els, locatorStr)
    const el = els[0]

    _focus(el)
    _click(el)
    done('OK')
  } catch (e) {
    done('ERROR: ' + e.toString())
  }
}

async function batchExecute(browserMethods, done) {
  try {
    const startAllBatch = performance.now()
    for (let i = 0; i < browserMethods.length; i++) {
      const [methodName, ...restArgs] = browserMethods[i]
      const methodFn = publicMethods[methodName]
      if (!methodFn) {
        throw new Error(
          `Method ${methodName} was not correct! Correct variants are: ${Object.keys(publicMethods).join(', ')}`
        )
      }
      const methodPromise = new Promise((resolve) => {
        const startTime = performance.now()
        methodFn(...restArgs, (res) => {
          const endTime = performance.now()
          console.log(`method ${methodName} result: ${res} executionTime: ${endTime - startTime}`)
          resolve(res)
        })
      })
      const res = await methodPromise
      if (res && res.indexOf('ERROR') !== -1) {
        done(res)
      }
    }
    console.log(`end batch execute, full time: ${performance.now() - startAllBatch}`)
    done('OK')
  } catch (e) {
    done('ERROR: ' + e.toString())
  }
}

const publicMethods = {
  fill,
  waitFocused,
  waitUnfocused,
  waitVisible,
  waitInvisible,
  waitDisabled,
  waitEnabled,
  click,
  batchExecute,
}

module.exports = publicMethods
