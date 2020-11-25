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

export const FioForm = (props = {}) => {
  const { onSubmit = () => {} } = props
  const [state, setState] = useState(initialState)

  const updateState = (patchState) => {
    const newState = {
      ...state,
      ...patchState,
    }
    const { firstName, secondName, lastName, passportSerie, passportGivenBy, canSubmit } = newState
    const submitEnabled = !!firstName && !!secondName && !!lastName && !!passportSerie && !!passportGivenBy
    if (!canSubmit && canSubmit !== submitEnabled) {
      newState.validating = true
      setTimeout(() => {
        updateState({
          ...patchState,
          canSubmit: true,
          validating: false,
        })
      }, 1000)
    }
    setState(newState)
  }
  const { firstName, secondName, lastName, passportSerie, passportGivenBy, validating, canSubmit } = state
  return (
    <>
      <div>Фамилия</div>{' '}
      <input
        disabled={validating || canSubmit}
        name={'firstName'}
        width={200}
        value={firstName}
        onChange={(e) => {
          updateState({ firstName: e.target.value })
        }}
      />
      <div>Имя</div>{' '}
      <input
        disabled={validating || canSubmit}
        name={'secondName'}
        width={200}
        value={secondName}
        onChange={(e) => {
          updateState({ secondName: e.target.value })
        }}
      />
      <div>Отчество</div>{' '}
      <input
        disabled={validating || canSubmit}
        onChange={(e) => {
          updateState({ lastName: e.target.value })
        }}
        value={lastName}
        name={'lastName'}
        width={200}
      />
      <br />
      <div>Серия и номер паспорта</div>{' '}
      <input
        disabled={validating || canSubmit}
        value={passportSerie}
        onChange={(e) => {
          updateState({ passportSerie: e.target.value })
        }}
        name={'passportSerie'}
        width={200}
      />
      <div>Выдан</div>{' '}
      <input
        disabled={validating || canSubmit}
        value={passportGivenBy}
        onChange={(e) => {
          updateState({ passportGivenBy: e.target.value })
        }}
        name={'passportGivenBy'}
        width={500}
      />
      <br />
      {validating ? <div>Ожидайте проверки введенных данных...</div> : null}
      {canSubmit ? <div>Данные введены корректные!</div> : null}
      <br />
      <input
        type={'button'}
        disabled={!canSubmit || validating}
        onClick={() => onSubmit(state)}
        value={'Отправить заявку'}
      />
      <br />
      <br />
      <input type={'button'} disabled={!canSubmit} onClick={() => setState(initialState)} value={'Очистить заявку'} />
    </>
  )
}
