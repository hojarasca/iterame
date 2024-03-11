import {Iterator} from "../iterators/iterator.js";
import {IteratorIterator} from "../iterators/index.js";

declare global {
  interface Set<T> {
    iter(): Iterator<T>;
  }
}

Object.defineProperty(Set.prototype, 'iter', {
  value: function<T> (): Iterator<T> {
    return new IteratorIterator(this.keys())
  },
  writable: false
})
