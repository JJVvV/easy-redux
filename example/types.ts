import { composeTypes } from "../src";

enum BasicTypes {
  SET_VERSION
}

enum FetchTypes {
  GET_USER_INFO
}

export const GlobalTypes = composeTypes({
  BasicTypes,
  FetchTypes,
  prefix: "global"
});

export type TFetchTypes = typeof FetchTypes;

export type TUser = {
  email: string;
  info: string;
  is_admin: boolean;
  uid: string;
};

type TNull<T> = T | null | undefined;

export type GlobalState = {
  version: string;
  user: TNull<TUser>;
  isAdmin: boolean;
};
