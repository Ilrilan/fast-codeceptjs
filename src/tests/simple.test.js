const locators = require('./locators')

Feature('Simple test')

const LongText = 'Клиенториентированная одиннадцатиклассница сильно ошиблась в выборе своей профессии'
const FirstFieldsMaxLengthText = 'Клиенториентированная одиннадц'

Scenario('firstName Length 3', async (I) => {
  await I.amOnStory('http://localhost:6006/iframe.html?id=simpleapp--minfirstnamelength3')
  await I.waitForVisible(locators.firstName)
  await I.fill(locators.firstName, 'First name')
  await I.waitForText('Ожидайте проверки введенных данных')
  await I.waitEnabled(locators.submit)
})

Scenario('Clear button worked', async (I) => {
  await I.amOnStory('http://localhost:6006/iframe.html?id=simpleapp--minfirstnamelength3')
  await I.waitForVisible(locators.firstName)
  await I.fill(locators.firstName, 'First name')
  await I.waitForText('Ожидайте проверки введенных данных')
  await I.waitEnabled(locators.submit)
  await I.click(locators.clear)
  await I.waitDisabled(locators.submit)
  await I.waitValue(locators.firstName, '')
})

Scenario('Button on form are disabled', async (I) => {
  await I.amOnStory('http://localhost:6006/iframe.html?id=simpleapp--minfirstnamelength3')
  await I.waitVisible(locators.firstName)
  await I.waitDisabled(locators.submit)
  await I.waitDisabled(locators.clear)
})

Scenario('Max Length In All Fields', async (I) => {
  await I.amOnStory('http://localhost:6006/iframe.html?id=simpleapp--alldatarequired')
  await I.waitVisible(locators.firstName)
  await I.fill(locators.firstName, LongText)
  await I.waitValue(locators.firstName, FirstFieldsMaxLengthText)
  await I.fill(locators.secondName, LongText)
  await I.waitValue(locators.secondName, FirstFieldsMaxLengthText)
  await I.fill(locators.lastName, LongText)
  await I.waitValue(locators.lastName, FirstFieldsMaxLengthText)
  await I.fill(locators.passportSerie, LongText)
  await I.waitValue(locators.passportSerie, 'Клиенториен')
  await I.fill(locators.passportGivenBy, LongText)
  await I.waitValue(locators.passportGivenBy, LongText)
})
Scenario('Max Length In All Fields batching', async (I) => {
  await I.amOnStory('http://localhost:6006/iframe.html?id=simpleapp--alldatarequired')
  await I.batchExecute([
    ['waitVisible', locators.firstName],
    ['fill', locators.firstName, LongText],
    ['waitValue', locators.firstName, FirstFieldsMaxLengthText],
    ['fill', locators.secondName, LongText],
    ['waitValue', locators.secondName, FirstFieldsMaxLengthText],
    ['fill', locators.secondName, LongText],
    ['waitValue', locators.secondName, FirstFieldsMaxLengthText],
    ['fill', locators.passportSerie, LongText],
    ['waitValue', locators.passportSerie, 'Клиенториен'],
    ['fill', locators.passportGivenBy, LongText],
    ['waitValue', locators.passportGivenBy, LongText],
  ])
})
