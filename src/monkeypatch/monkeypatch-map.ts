import {IteratorIterator} from "../iterators/index.js";
import {Iterator} from "../iterator.js";

declare global {
  interface Map<K, V> {
    iterKeys(): Iterator<K>;

    iterValues(): Iterator<V>;
  }
}

Object.defineProperty(Map.prototype, 'iterKeys', {
  value: function <T>(): Iterator<T> {
    return new IteratorIterator(this.keys())
  },
  writable: false
})
