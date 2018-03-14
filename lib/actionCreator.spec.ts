import * as ac from './actionCreator'
import { Action } from 'redux'

describe('actions', () => {
  const actionCreator = ac.actionCreatorFactory('tasks')
  it('should create an empty action', () => {
    const expected = { type: 'tasks/EMPTY_ACTION' }
    const actual = actionCreator('EMPTY_ACTION')()
    console.log(actual)
    expect(actual).toEqual(expected)
  })
  it('should create an action with payload', () => {
    const expected = { type: 'tasks/ACTION', payload: 1 }
    const actual = actionCreator<number>('ACTION')(1)
    expect(actual).toEqual(expected)
  })

  // it('should create an action with payload', () => {
  //   const expected = { type: 'tasks/ACTION', payload: 1 }
  //   const actual = actionCreator('ACTION', (d: number) => ({ payload: d}))(1)
  //   expect(actual).toEqual(expected)
  // })
})

/* tslint:disable */
describe('usage', () => {
  const actionCreator = ac.actionCreatorFactory()
  it('should apply data guard for simple payload', () => {
    const incomingAction: Action = { type: 'ACTION', payload: 1 } as any
    const creator = actionCreator<number>('ACTION')
    if (creator.isMatch(incomingAction)) {
      // $ExpectType number
      incomingAction.payload
    }
  })

  it('should apply data guard for a structure', () => {
    const incomingAction: Action = { type: 'ACTION', payload: 1 } as any
    const creator = actionCreator<{ foo: string; bar: number[] }>('ACTION')
    if (creator.isMatch(incomingAction)) {
      // $ExpectType { foo: string; bar: number[]; }
      incomingAction.payload
    }
  })

  it('should apply data guard for a creator without payload', () => {
    const incomingAction: Action = { type: 'ACTION' } as any
    const creator = actionCreator('ACTION')
    if (creator.isMatch(incomingAction)) {
      // $ExpectType undefined
      incomingAction.payload
    }
  })
})
/* tslint:enable */
