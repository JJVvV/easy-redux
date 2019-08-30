export type TRFetch = { request: string; success: string; error: string };

export type TAsyncTypes<K extends string> = {
  request: "loading";
  success: K;
  error: "error";
};

export type B<T> = { [key in keyof T]: key };
export type F<T> = {
  [key in keyof T]: key extends string ? TAsyncTypes<key> : never;
};

export type StateKey<S, P = any> = S extends object
  ? (
      | keyof S
      | { [KK in keyof S]?: (p1: P, p2: S) => S[KK] }
      | ((p1: P, p2: S) => S))
  : any;

export type PayloadWithStateKey<P, SK> = {
  payload: P;
  stateKey: SK;
};

export type PromiseFunc = (...args: any[]) => Promise<any>;

export type PlainObject = {
  [key: string]: any;
};

// type AllFetchTypes = GlobalTFetchTypes & MachineListTFetchTypes
export type GetAllFetchTypes<T> = Partial<{ [key in keyof T]: boolean }>;

export type ApplicationState<T extends PlainObject> = Readonly<T>;
