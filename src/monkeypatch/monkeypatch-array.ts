import {ArrayIterator} from "../iterators/index.js";

declare global {
  interface Array<T> {
    iter(): ArrayIterator<T>;
  }
}

Object.defineProperty(Array.prototype, 'iter', {
  value: function<T>(): ArrayIterator<T> {
    return new ArrayIterator(this)
  },
  writable: false
})
