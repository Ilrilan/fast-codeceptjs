import { storiesOf } from '@storybook/react'

import { FioForm } from '../App'

const logArgs = (...args) => {
  console.log(args)
}

storiesOf('simpleApp', module).add('firstStory', () => <FioForm onSubmit={logArgs} />)
