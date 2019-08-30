import { createSimpleAsyncActions } from "../src";
import { GlobalTypes, GlobalState } from "./types";
import { loadUserInfo } from "./api";

// 接口返回直接替代掉user
export const getUserInfo = createSimpleAsyncActions(
  GlobalTypes.GET_USER_INFO,
  loadUserInfo
)<GlobalState>("user");

getUserInfo("Alex", 1);

export const getUserInfo2 = createSimpleAsyncActions(
  GlobalTypes.GET_USER_INFO,
  loadUserInfo
)<GlobalState>((payload, state) => ({
  ...state,
  user: payload,
  isAdmin: payload.is_admin
}));

getUserInfo2("Join", 2);
