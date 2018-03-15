import * as Redux from 'redux'

export interface AnyAction extends Redux.Action {
  type: string
  data?: any // obsolete - just to be backward compatible with tarte-tatin actions shape
}

export interface Action<P, M = undefined> extends AnyAction {
  payload: P
  meta: M
}

export interface ActionCreator<P, M> {
  __actionType: string
  isMatch: (action: Redux.Action) => action is Action<P, M>
}
export interface PayloadActionCreator<P, M = undefined> extends ActionCreator<P, M> {
  (payload: P, meta?: M): Action<P, M>
}

export interface EmptyActionCreator extends PayloadActionCreator<undefined, undefined> {
  (payload?: undefined, meta?: undefined): Action<undefined, undefined>
}

export interface ActionCreatorFactory {
  makeAction: {
    (type: string): EmptyActionCreator
    <P>(type: string): PayloadActionCreator<P>
    <P, M>(type: string): PayloadActionCreator<P, M>
    // <P, R extends Redux.Action>(type: string, func: (type, payload: P) => R)
  }
  makeActionWithFunction: {
    <Z extends Object /*, F extends (args: any) => Z*/>(
      type: string,
      func: (...args: any[]) => Z
    ): MakeActionWithFunctionCreatorResult<Z>
  }
}

export const makeAction = (prefix = '') => <P, M = undefined>(type: string) => {
  const prefixedType = prefix === '' ? type : `${prefix}/${type}`
  const actionCreator: PayloadActionCreator<P, M> = ((p: P, m: M) => ({
    payload: p,
    meta: m,
    type: prefixedType
  })) as any
  actionCreator.__actionType = prefixedType
  actionCreator.isMatch = (action: Redux.Action): action is Action<P, M> => {
    return action.type === prefixedType
  }
  return actionCreator
}

export interface MakeActionWithFunctionCreatorResult<Z> {
  (...args: any[]): Z & AnyAction
  __actionType: string
  isMatch: (action: Redux.Action) => action is Z & AnyAction
}

// export interface MakeActionWithFunctionCreator<Z> {

// }

export const makeActionWithFunction = (prefix = '') => <
  Z extends Object /*, F extends (...args: any[]) => Z*/
>(
  type: string,
  f: (...args: any[]) => Z
) /*: (...args: any[]) => Z & AnyAction */ => {
  const prefixedType = prefix === '' ? type : `${prefix}/${type}`

  const actionCreator: MakeActionWithFunctionCreatorResult<Z> = ((...args: any[]) => ({
    ...(f(...args) as any),
    type: prefixedType
  })) as any

  actionCreator.__actionType = prefixedType
  actionCreator.isMatch = (action: Redux.Action): action is Z & AnyAction => {
    return action.type === prefixedType
  }
  return actionCreator
}

export const isAction = <T>(
  action: Redux.Action,
  actionCreator: (...args: any[]) => T
): action is T & Redux.Action => {
  return action.type === (actionCreator as any).__actionType
}

export function actionCreatorFactory(prefix = ''): ActionCreatorFactory {
  return {
    makeAction: makeAction(prefix),
    makeActionWithFunction: makeActionWithFunction(prefix)
  }
}
