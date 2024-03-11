import {IteratorIterator} from "../iterators/index.js";
import {Iterator} from "../iterators/iterator.js";

declare global {
  interface Map<K, V> {
    iterKeys(): Iterator<K>;

    iterValues(): Iterator<V>;

    iterEntries(): Iterator<[K, V]>
  }
}

Object.defineProperty(Map.prototype, 'iterKeys', {
  value: function <T> (): Iterator<T> {
    return new IteratorIterator(this.keys())
  },
  writable: false
})

Object.defineProperty(Map.prototype, 'iterValues', {
  value: function <T> (): Iterator<T> {
    return new IteratorIterator(this.values())
  },
  writable: false
})

Object.defineProperty(Map.prototype, 'iterEntries', {
  value: function <T> (): Iterator<T> {
    return new IteratorIterator(this.entries())
  },
  writable: false
})
