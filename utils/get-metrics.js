const event = require('codeceptjs/lib/event')
const recorder = require('codeceptjs/lib/recorder')
const path = require('path')
const fs = require('fs')
const { performance } = require('perf_hooks')

const defaultConfig = {
  outputDir: global.output_dir,
}

const RESULT_PASSED = 'pass'
const RESULT_FAILED = 'fail'
const RESULT_SKIP = 'skip'
const RESULT_TODO = 'todo'

const todoMessage = 'Test not implemented!'

const ID = Symbol('unique_id')
const TYPE = Symbol('type')

const IN_TEST = 0
const IN_SUITE = 1

let currentSuite
let currentTest

const deltaTime = new Date().getTime() - Math.floor(performance.now())
const unix_date = Math.round(new Date().getTime() / 1000)

const getHighResTime = () => {
  const floatTime = deltaTime + performance.now()
  return Math.round(floatTime * 1000)
}

const stats = {
  params: {
    startDate: clearString(new Date().toISOString().replace('T', '_').replace('Z', '')),
    startTime: getHighResTime(),
  },
  suites: [],
}

module.exports = (config) => {
  config = Object.assign(defaultConfig, config)

  const getStepObj = (step) => {
    if (step[TYPE] === IN_TEST) {
      return currentTest.steps[step[ID]]
    } else {
      return currentSuite.steps[step[ID]]
    }
  }

  event.dispatcher.on(event.step.before, (step) => {
    recorder.add('[getMetrics]_beforeStepHook', async () => {
      try {
        const curStep = {
          name: step.name,
          beforeTime: getHighResTime(),
        }
        if (currentTest && currentTest.afterTime === undefined) {
          step[ID] = currentTest.steps.length
          step[TYPE] = IN_TEST
          currentTest.steps[step[ID]] = curStep
        } else {
          step[ID] = currentSuite.steps.length
          step[TYPE] = IN_SUITE
          currentSuite.steps[step[ID]] = curStep
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_beforeStepHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.step.after, (step) => {
    recorder.add('[getMetrics]_afterStepHook', async () => {
      try {
        const stepObject = getStepObj(step)
        stepObject.afterTime = getHighResTime()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_afterStepHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.step.started, (step) => {
    recorder.add('[getMetrics]_startedStepHook', async () => {
      try {
        const stepObject = getStepObj(step)
        stepObject.startTime = getHighResTime()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_startedStepHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.step.finished, (step) => {
    recorder.add('[getMetrics]_finishedStepHook', async () => {
      try {
        const stepObject = getStepObj(step)
        stepObject.finishTime = getHighResTime()
        stepObject.passTime = `${(stepObject.finishTime - stepObject.beforeTime) / 1000} ms`
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_finishedStepHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.step.passed, (step) => {
    recorder.add('[getMetrics]_passedStepHook', async () => {
      try {
        const stepObject = getStepObj(step)
        stepObject.result = RESULT_PASSED
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_passedStepHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.step.failed, (step, error) => {
    recorder.add('[getMetrics]_failedStepHook', async () => {
      try {
        const stepObject = getStepObj(step)
        stepObject.result = RESULT_FAILED
        stepObject.errorText = error.message.slice(0, 200)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_failedStepHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.test.before, (test) => {
    recorder.add('[getMetrics]_beforeTestHook', async () => {
      try {
        test[ID] = currentSuite.tests.length
        currentTest = {
          name: test.title,
          beforeTime: getHighResTime(),
          steps: [],
        }
        currentSuite.tests[test[ID]] = currentTest
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_beforeTestHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.test.after, (test) => {
    recorder.add('[getMetrics]_afterTestHook', async () => {
      try {
        currentTest.afterTime = getHighResTime()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_afterTestHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.test.started, (test) => {
    recorder.add('[getMetrics]_startedTestHook', async () => {
      try {
        currentTest.startTime = getHighResTime()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_startedTestHook: ${e.message}`)
      }
    })
  })
  event.dispatcher.on(event.test.finished, (test) => {
    recorder.add('[getMetrics]_finishedTestHook', async () => {
      try {
        currentTest.finishTime = getHighResTime()
        currentTest.passTime = `${(currentTest.finishTime - currentTest.beforeTime) / 1000} ms`
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_finishedTestHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.test.passed, (test) => {
    recorder.add('[getMetrics]_passedTestHook', async () => {
      try {
        currentTest.result = RESULT_PASSED
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_passedTestHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.test.failed, (test, error) => {
    recorder.add('[getMetrics]_failedTestHook', async () => {
      try {
        const lastStep = test.steps[0]
        const failedStep = currentTest.steps[lastStep[ID]]
        if (!failedStep.result) {
          failedStep.result = RESULT_FAILED
        }
        currentTest.result = RESULT_FAILED
        currentTest.errorText = error.message.slice(0, 200)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_failedTestHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.suite.before, (suite) => {
    recorder.add('[getMetrics]_beforeSuiteHook', async () => {
      try {
        suite[ID] = stats.suites.length
        currentSuite = {
          name: suite.title,
          beforeTime: getHighResTime(),
          tests: [],
          steps: [],
        }
        stats.suites[suite[ID]] = currentSuite
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_beforeSuiteHook: ${e.message}`)
      }
    })
  })
  event.dispatcher.on(event.suite.after, (suite) => {
    recorder.add('[getMetrics]_afterSuiteHook', async () => {
      try {
        const tests = suite.tests
        tests.forEach((test) => {
          if (test.pending) {
            currentSuite.tests.push({
              name: test.title,
              result: test.opts.skipInfo && test.opts.skipInfo.message === todoMessage ? RESULT_TODO : RESULT_SKIP,
            })
          }
        })
        currentSuite.afterTime = getHighResTime()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Error in [getMetrics]_afterSuiteHook: ${e.message}`)
      }
    })
  })

  event.dispatcher.on(event.all.result, () => {
    try {
      stats.params.finishTime = getHighResTime()
      stats.params.unix_date = unix_date
      const fileName = `test_metrics_${stats.params.startDate}_${Math.floor(Math.random() * 10000)}.json`
      const filePath = path.join(global.output_dir, fileName)
      fs.writeFileSync(filePath, JSON.stringify(stats, null, 1), { encoding: 'utf8' })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Error in [getMetrics]_afterAll: ${e.message}`)
    }
  })

  return this
}

function clearString(str) {
  /* Replace forbidden symbols in string */
  return str
    .replace(/ /g, '_')
    .replace(/\./g, '_')
    .replace(/"/g, "'")
    .replace(/\//g, '_')
    .replace(/</g, '(')
    .replace(/>/g, ')')
    .replace(/:/g, '_')
    .replace(/\\/g, '_')
    .replace(/\|/g, '_')
    .replace(/\?/g, '.')
    .replace(/\*/g, '^')
    .replace(/'/g, '')
}
