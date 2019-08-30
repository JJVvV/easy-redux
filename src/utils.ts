import { PlainObject } from "./types";

function isType<T>(type: string) {
  return function inner(obj): obj is T {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
}

export const isObject = isType<PlainObject>("Object");
export const isFunction = isType<Function>("Function");

export const isString = isType<string>("String");
export const isArray = isType<Array<any>>("Array");
export const isNumber = isType<Number>("Number");
export const isPromise = p => p && typeof p.then === "function";
