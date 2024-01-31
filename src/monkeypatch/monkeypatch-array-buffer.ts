import {Iterator} from "../iterator.js";
import {IteratorIterator} from "../iterators/index.js";

declare global {
  interface ArrayBuffer {
    iter(): Iterator<number>;
  }

  interface SharedArrayBuffer {
    iter(): Iterator<number>;
  }
}

Object.defineProperty(ArrayBuffer.prototype, 'iter', {
  value: function(): Iterator<number> {
    return new IteratorIterator(new Uint8Array(this)[Symbol.iterator]())
  },
  writable: false
})

Object.defineProperty(SharedArrayBuffer.prototype, 'iter', {
  value: function(): Iterator<number> {
    return new IteratorIterator(new Uint8Array(this)[Symbol.iterator]())
  },
  writable: false
})
