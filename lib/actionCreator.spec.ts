/// <reference path="../node_modules/@types/jest/index.d.ts" />

import * as ac from './actionCreator'
import { Action } from 'redux'

describe('actions', () => {
  const { makeAction, makeActionWithFunction } = ac.actionCreatorFactory('tasks')
  it('should create an empty action', () => {
    const expected = { type: 'tasks/EMPTY_ACTION' }
    const actual = makeAction('EMPTY_ACTION')()
    expect(actual).toEqual(expected)
  })
  it('should create an action with payload', () => {
    const expected = { type: 'tasks/ACTION', payload: 1 }
    const actual = makeAction<number>('ACTION')(1)
    expect(actual).toEqual(expected)
  })

  it('should create an action with payload and meta', () => {
    const expected = { type: 'tasks/ACTION', payload: 1, meta: { foo: 'bar' } }
    const actual = makeAction<number, { foo: string }>('ACTION')(1, { foo: 'bar' })
    expect(actual).toEqual(expected)
  })

  it('should make action with function', () => {
    const expected = { type: 'tasks/ACTION', payload: { result: 'aaa' } }
    const creator = makeActionWithFunction('ACTION', (foo: string) => {
      return {
        payload: { result: foo }
      }
    })

    const actual = creator('aaa')
    console.log(actual)
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
  const { makeAction, makeActionWithFunction } = ac.actionCreatorFactory()
  it('should apply data guard for simple payload', () => {
    const incomingAction: Action = { type: 'ACTION', payload: 1 } as any
    const creator = makeAction<number>('ACTION')
    if (creator.isMatch(incomingAction)) {
      // $ExpectType number
      incomingAction.payload

      // $ExpectType undefined
      incomingAction.meta
    }
  })

  it('should apply data guard for a structure', () => {
    const incomingAction: Action = { type: 'ACTION', payload: 1 } as any
    const creator = makeAction<{ foo: string; bar: number[] }>('ACTION')
    if (creator.isMatch(incomingAction)) {
      // $ExpectType { foo: string; bar: number[]; }
      incomingAction.payload
      // $ExpectType undefined
      incomingAction.meta
    }
  })

  it('should apply data guard for a structure payload and meta', () => {
    const incomingAction: Action = { type: 'ACTION', payload: 1, meta: { foo: 'bar' } } as any
    const creator = makeAction<{ foo: string; bar: number[] }, { foo: string }>('ACTION')
    if (creator.isMatch(incomingAction)) {
      // $ExpectType { foo: string; bar: number[]; }
      incomingAction.payload
      // $ExpectType { foo: string; }
      incomingAction.meta
    }
  })

  it('should apply data guard for a creator without payload', () => {
    const incomingAction: Action = { type: 'ACTION' } as any
    const creator = makeAction('ACTION')
    if (creator.isMatch(incomingAction)) {
      // $ExpectType undefined
      incomingAction.payload
    }
  })

  it('should make action with function', () => {
    const incomingAction = { type: 'tasks/ACTION', payload: { result: 'aaa' } } as any
    const creator = makeActionWithFunction('ACTION', (foo: string) => {
      return {
        payload: { result: foo }
      }
    })

    if (creator.isMatch(incomingAction)) {
      // $ExpectType { payload: { result: string; }; } & AnyAction
      incomingAction
    }
  })
})
/* tslint:enable */
