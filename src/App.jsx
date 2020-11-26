import React, { useState } from 'react'

const initialState = {
  firstName: '',
  secondName: '',
  lastName: '',
  passportSerie: '',
  passportGivenBy: '',
  canSubmit: false,
  validating: false,
}

const defaultIsDataCorrect = (state) => {
  const { firstName, secondName, lastName, passportSerie, passportGivenBy } = state
  return !!firstName && !!secondName && !!lastName && !!passportSerie && !!passportGivenBy
}

let lastPromise = null

export const FioForm = (props = {}) => {
  const { onSubmit = () => {}, isDataCorrect = defaultIsDataCorrect } = props
  const [state, setState] = useState(initialState)

  const updateState = (patchState) => {
    const newState = {
      ...state,
      ...patchState,
    }
    const { canSubmit } = newState
    const submitEnabled = isDataCorrect(newState)
    if (!submitEnabled) {
      lastPromise = null
      newState.validating = false
    }
    if (!canSubmit && canSubmit !== submitEnabled) {
      newState.validating = true
      const p = new Promise((resolve) => setTimeout(resolve, 100))
      lastPromise = p
      p.then(() => {
        if (p === lastPromise) {
          updateState({
            ...patchState,
            canSubmit: true,
            validating: false,
          })
        }
      })
    }

    setState(newState)
  }
  const { firstName, secondName, lastName, passportSerie, passportGivenBy, validating, canSubmit } = state
  return (
    <>
      <div>Фамилия</div>{' '}
      <input
        disabled={canSubmit}
        name={'firstName'}
        style={{ width: '200px' }}
        maxLength={30}
        value={firstName}
        onChange={(e) => {
          updateState({ firstName: e.target.value })
        }}
      />
      <div>Имя</div>{' '}
      <input
        disabled={canSubmit}
        name={'secondName'}
        style={{ width: '200px' }}
        maxLength={30}
        value={secondName}
        onChange={(e) => {
          updateState({ secondName: e.target.value })
        }}
      />
      <div>Отчество</div>{' '}
      <input
        disabled={canSubmit}
        onChange={(e) => {
          updateState({ lastName: e.target.value })
        }}
        value={lastName}
        name={'lastName'}
        style={{ width: '200px' }}
        maxLength={30}
      />
      <br />
      <div>Серия и номер паспорта</div>{' '}
      <input
        disabled={canSubmit}
        value={passportSerie}
        onChange={(e) => {
          updateState({ passportSerie: e.target.value })
        }}
        name={'passportSerie'}
        style={{ width: '100px' }}
        maxLength={11}
      />
      <div>Выдан</div>{' '}
      <input
        disabled={canSubmit}
        value={passportGivenBy}
        onChange={(e) => {
          updateState({ passportGivenBy: e.target.value })
        }}
        name={'passportGivenBy'}
        style={{ width: '800px' }}
        maxLength={200}
      />
      <br />
      {validating ? <div>Ожидайте проверки введенных данных...</div> : null}
      {canSubmit ? <div>Данные введены корректные!</div> : null}
      <br />
      <input
        name={'submit'}
        type={'button'}
        disabled={!canSubmit || validating}
        onClick={() => onSubmit(state)}
        value={'Отправить заявку'}
      />
      <br />
      <br />
      <input
        type={'button'}
        name={'clearForm'}
        disabled={!canSubmit}
        onClick={() => setState(initialState)}
        value={'Очистить заявку'}
      />
    </>
  )
}
