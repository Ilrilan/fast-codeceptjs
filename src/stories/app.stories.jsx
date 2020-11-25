import { storiesOf } from '@storybook/react'

import { FioForm } from '../App'

const logArgs = (state) => {
  console.log(state) //eslint-skip-line no-console
}

storiesOf('simpleApp', module)
  .add('allDataRequired', () => <FioForm onSubmit={logArgs} />)
  .add('neverCanSubmit', () => <FioForm onSubmit={logArgs} />)
  .add('minFirstNameLength3', () => (
    <FioForm
      onSubmit={logArgs}
      isDataCorrect={(state) => {
        return typeof state.firstName === 'string' && state.firstName.length > 3
      }}
    />
  ))
  .add('minAllLength3', () => (
    <FioForm
      onSubmit={logArgs}
      isDataCorrect={(state) => {
        const isCorrectValue = (str) => typeof str === 'string' && str.length > 3
        const { firstName, secondName, lastName, passportSerie, passportGivenBy } = state
        return (
          isCorrectValue(firstName) &&
          isCorrectValue(secondName) &&
          isCorrectValue(lastName) &&
          isCorrectValue(passportSerie) &&
          isCorrectValue(passportGivenBy)
        )
      }}
    />
  ))
