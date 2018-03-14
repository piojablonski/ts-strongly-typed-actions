import * as Redux from 'redux'

export interface AnyAction extends Redux.Action {
  type: string
  data?: any // obsolete - just to be backward compatible with tarte-tatin actions shape
}

export interface Action<P> extends AnyAction {
  payload: P
}

export interface ActionCreatorMeta<P> {
  __actionType: string
  isMatch: (action: Redux.Action) => action is Action<P>
}

// interface ActionCreatorFunc<P> {
//   (type: string): (...args: any[]): Action<P>
// }

// export interface FunctionActionCreator<P> extends ActionCreatorMeta, ActionCreatorFunc<P> {}
export interface PayloadActionCreator<P> extends ActionCreatorMeta<P> {
  (payload: P): Action<P>
}

export interface EmptyActionCreator extends PayloadActionCreator<undefined> {
  (payload?: undefined): Action<undefined>
}

export interface ActionCreatorFactory {
  (type: string): EmptyActionCreator
  <P>(type: string): PayloadActionCreator<P>
  // <P, R extends Redux.Action>(type: string, func: (type, payload: P) => R)
}

export const makeAction = (prefix = '') => <P>(type: string) => {
  const prefixedType = prefix === '' ? type : `${prefix}/${type}`
  const actionCreator: PayloadActionCreator<P> = ((p: P) => ({
    payload: p,
    type: prefixedType
  })) as any
  actionCreator.__actionType = prefixedType
  actionCreator.isMatch = (action: Redux.Action): action is Action<P> => {
    return action.type === prefixedType
  }
  return actionCreator
}

// export function makeActionFunc<P>(type: string, func: ActionCreatorFunc<P>) {
//   const actionCreator: FunctionActionCreator<P> =

//   actionCreator.__actionType = type
//   actionCreator.isMatch = (action: Redux.Action): action is Action<P> => {
//     return action.type === type
//   }
//   return actionCreator
// }

// export function makeActionFn<AP extends { payload: any }>(type: string) {
// const f1 = (fn: (...args: any[]) => AP) => {
//   const actionCreator: (...args: any[]) => AP & Redux.Action = (...args: any[]) => ({
//     ...(fn as any)(...args),
//     type
//   })
//   actionCreator['__actionType'] = type
//   return actionCreator
// }
// return f1
// }

export const isAction = <T>(
  action: Redux.Action,
  actionCreator: (...args: any[]) => T
): action is T & Redux.Action => {
  return action.type === (actionCreator as any).__actionType
}

export function actionCreatorFactory(prefix = ''): ActionCreatorFactory {
  return makeAction(prefix)
}

// export const isActionC = curry2(isAction)
