const locators = require('./locators')

Feature('Simple test')

const LongText = 'Клиенториентированная одиннадцатиклассница сильно ошиблась в выборе своей профессии'
const FirstFieldsMaxLengthText = 'Клиенториентированная одиннадц'

Scenario('firstName Length 3', async (I) => {
  await I.amOnStory('http://localhost:6006/iframe.html?id=simpleapp--minfirstnamelength3')
  await I.waitForVisible(locators.firstName)
  await I.fillField(locators.firstName, 'First name')
  await I.waitForText('Ожидайте проверки введенных данных')
})

Scenario.only('Button on form are disabled', async (I) => {
  await I.amOnStory('http://localhost:6006/iframe.html?id=simpleapp--minfirstnamelength3')
  await I.waitForVisible(locators.firstName)
  await I.waitDisabled(locators.submit)
})

Scenario('Max Length In All Fields', async (I) => {
  await I.amOnPage('http://localhost:6006/iframe.html?id=simpleapp--alldatarequired')
  await I.waitForVisible(locators.firstName)
  await I.fillField(locators.firstName, LongText)
  await I.waitForValue(locators.firstName, FirstFieldsMaxLengthText)
  await I.fillField(locators.secondName, LongText)
  await I.waitForValue(locators.secondName, FirstFieldsMaxLengthText)
  await I.fillField(locators.lastName, LongText)
  await I.waitForValue(locators.lastName, FirstFieldsMaxLengthText)
  await I.fillField(locators.passportSerie, LongText)
  await I.waitForValue(locators.passportSerie, 'Клиенториен')
  await I.fillField(locators.passportGivenBy, LongText)
  await I.waitForValue(locators.passportGivenBy, LongText)
})
