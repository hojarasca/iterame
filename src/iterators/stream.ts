import {Iterator} from "../iterator.js";

export abstract class Stream<T> extends Iterator<T> {
  rev(): Iterator<T> {
    throw new Error('Streamos cannot be reverted')
  }
}
