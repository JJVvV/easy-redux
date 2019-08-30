import {
  createStandardAction,
  createAsyncAction,
  AsyncActionCreator
} from "typesafe-actions";

import { isObject, isFunction } from "./utils";
import {
  StateKey,
  F,
  B,
  TRFetch,
  PayloadWithStateKey,
  TAsyncTypes,
  PromiseFunc
} from "./types";

export { createRequestMiddleware } from "./requestMiddleware";
export * from "./types";
export * from "typesafe-actions";
export { createLoadingReducer } from "./globalLoading/reducer";

export function composeTypes<T, P>(config: {
  BasicTypes: T;
  FetchTypes?: P;
  prefix: string;
}): B<T> & F<P>;
export function composeTypes<T, P>(config: {
  BasicTypes?: T;
  FetchTypes: P;
  prefix: string;
}): B<T> & F<P>;
export function composeTypes<T, P>(config: {
  BasicTypes: T;
  FetchTypes: P;
  prefix: string;
}): B<T> & F<P> {
  const { BasicTypes = {}, FetchTypes = {}, prefix } = config;
  let ret = <B<T> & F<P>>{};
  if (BasicTypes !== undefined) {
    ret = Object.keys(BasicTypes).reduce((pre, next) => {
      pre[next] = next;
      return pre;
    }, ret);
  }
  if (FetchTypes !== undefined) {
    ret = Object.keys(FetchTypes).reduce((pre, next: string) => {
      const rr = {} as TRFetch;
      rr.request = `${prefix}/${next}_REQUEST`;
      rr.success = `${prefix}/${next}_SUCCESS`;
      rr.error = `${prefix}/${next}_ERROR`;
      pre[next] = rr;
      return pre;
    }, ret);
  }
  return ret;
}

function handleInit<T extends {}, K extends StateKey<T>>(
  state: T,
  stateKey: K,
  action
): T {
  if (isObject(stateKey)) {
    return Object.keys(stateKey as any).reduce((pre, next) => {
      pre[next] = stateKey[next](action.payload, state);
      return pre;
    }, state);
  }
  if (isFunction(stateKey)) {
    return { ...state, ...(stateKey as Function)(action.payload, state) };
  }
  return { ...state, [stateKey as string]: action.payload };
}
export function handleAll<T>(state: T, action, handle = handleInit): T {
  if (action.stateKey) {
    return handle(state, action.stateKey, action);
  }
  return state;
}

/**
 * @desc 生成带有 stateKey 的 action
 * @param type - action.type
 */
export function createStandardAction2<T extends string>(type: T) {
  return function inner<P, SAll>(stateKey: StateKey<SAll, P>) {
    return createStandardAction(type).map(
      (payload: P): PayloadWithStateKey<P, StateKey<SAll, P>> => ({
        payload,
        stateKey
      })
    );
  };
}

export function createAsyncActions<T extends string>(types: TAsyncTypes<T>) {
  const { request, success, error } = types;
  /**
   *
   * @param stateKey - state 中的某个属性
   */
  function inner<T1, T2, T3 = Error, SAll = {}>(
    stateKey: StateKey<SAll>
  ): AsyncActionCreator<
    [typeof request, T1],
    [typeof success, T2],
    [typeof error, T3]
  >;

  function inner<T1, T2, T3 = Error, SAll = {}>(): AsyncActionCreator<
    [typeof request, T1],
    [typeof success, T2],
    [typeof error, T3]
  >;

  function inner<T1, T2, T3 = Error, SAll = {}>(stateKey?: any) {
    if (typeof stateKey !== undefined) {
      const requestRet = createStandardAction(request)<T1>();
      const successRet = createStandardAction2(success)<T2, SAll>(
        stateKey as StateKey<SAll>
      );
      const failureRet = createStandardAction(error)<T3>();
      return {
        request: requestRet,
        success: successRet,
        failure: failureRet
      };
    }

    return createAsyncAction(request, success, error)<T1, T2, T3>();
  }
  return inner;
}

export function createSimpleAsyncActions<
  T extends string,
  P extends PromiseFunc
>(types: TAsyncTypes<T>, func: P) {
  type PromiseRetType = P extends (...args: any[]) => Promise<infer R>
    ? R
    : never;
  type FuncArgsType = Parameters<typeof func>;
  return function inner<SAll>(stateKey?: StateKey<SAll, PromiseRetType>) {
    const actions = createAsyncActions(types)<
      undefined,
      PromiseRetType,
      undefined,
      SAll
    >(stateKey);

    return function innerParams(...args: FuncArgsType) {
      return {
        types,
        actions,
        func,
        params: args
      };
    };
  };
}
