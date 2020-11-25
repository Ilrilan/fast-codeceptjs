const locators = require('./locators')

Feature('Simple test')

const LongText = 'Клиентиориентированная одиннадцатиклассница сильно ошиблась в выборе своей профессии'

Scenario.only('firstName Length 3', async (I) => {
  await I.amOnPage('http://localhost:6006/iframe.html?id=simpleapp--minfirstnamelength3')
  await I.waitForVisible(locators.firstName)
  await I.fillField(locators.firstName, 'First name')
  await I.waitForText('Ожидайте проверки введенных данных')
})

Scenario('Max Length In All Fields', async (I) => {
  await I.amOnPage('http://localhost:6006/iframe.html?id=simpleapp--nevercansubmit')
  await I.waitForVisible(locators.firstName)
  await I.fillField(locators.firstName, LongText)
  await I.fillField(locators.secondName, LongText)
  await I.fillField(locators.lastName, LongText)
  await I.fillField(locators.passportSerie, LongText)
  await I.fillField(locators.passportGivenBy, LongText)
})
