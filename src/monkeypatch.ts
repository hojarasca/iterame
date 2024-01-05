import {IterArray} from "./iter-array.js";


declare global {
  interface Array<T> {
    iter(): IterArray<T>;
  }
}

Object.defineProperty(Array.prototype, 'iter', {
  value: function<T>(): IterArray<T> {
    return new IterArray(this)
  },
  writable: false
})