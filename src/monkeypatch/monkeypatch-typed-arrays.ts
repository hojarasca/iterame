import {Iterator} from "../iterator.js";
import {IteratorIterator} from "../iterators/index.js";

declare global {
  interface Uint8Array {
    iter(): Iterator<number>;
  }

  interface Uint16Array {
    iter(): Iterator<number>;
  }

  interface Uint32Array {
    iter(): Iterator<number>;
  }

  interface BigUint64Array {
    iter(): Iterator<bigint>
  }

  interface Int8Array {
    iter(): Iterator<number>;
  }

  interface Int16Array {
    iter(): Iterator<number>;
  }

  interface Int32Array {
    iter(): Iterator<number>;
  }

  interface BigInt64Array {
    iter(): Iterator<bigint>
  }

  interface Float32Array {
    iter(): Iterator<number>
  }
  interface Float64Array {
    iter(): Iterator<number>
  }
}


[
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Float32Array,
  Float64Array
].forEach(klass => {
  Object.defineProperty(klass.prototype, 'iter', {
    value: function(): Iterator<number> {
      return new IteratorIterator(this[Symbol.iterator]())
    },
    writable: false
  })
});

[
  BigUint64Array,
  BigInt64Array
].forEach(klass => {
  Object.defineProperty(klass.prototype, 'iter', {
    value: function(): Iterator<bigint> {
      return new IteratorIterator(this[Symbol.iterator]())
    },
    writable: false
  })
})
