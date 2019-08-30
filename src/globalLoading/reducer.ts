import { Reducer } from "redux";
import { REG_LOADING } from "../constants";

export function createLoadingReducer<T>() {
  const initialState = {} as T;
  const reducer: Reducer<T> = (state = initialState, action) => {
    const { type } = action;
    const matches = REG_LOADING.exec(type);

    // not *_REQUEST / *_SUCCESS /  *_FAILURE actions, 忽略
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
      ...state,
      [requestName]: requestState === "REQUEST"
    };
  };
  return reducer;
}
