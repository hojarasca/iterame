import {Option} from "nochoices";
import {Mapping} from "./types.js";
import {IterMap} from "./index.js";

export interface Iterable<T> {
  next(): Option<T>
}

export abstract class Iterator<T> implements Iterable<T> {
  abstract next (): Option<T>
  map<U>(mapping: Mapping<T, U>): IterMap<T, U> {
    return new IterMap(this, mapping)
  }

  * [Symbol.iterator] (): Generator<T> {
    let next = this.next()
    while (next.isSome()) {
      yield next.unwrap()
      next = this.next()
    }
  }
}