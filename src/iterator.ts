import {Option} from "nochoices";
import {Mapping, Predicate} from "./types.js";
import {IterFilter, IterMap} from "./index.js";

export interface Iterable<T> {
  next(): Option<T>
}

export abstract class Iterator<T> implements Iterable<T> {
  abstract next (): Option<T>
  map<U>(mapping: Mapping<T, U>): IterMap<T, U> {
    return new IterMap(this, mapping)
  }

  filter(predicate: Predicate<T>): IterFilter<T> {
    return new IterFilter(this, predicate)
  }

  toArray (): T[] {
    return [...this]
  }

  * [Symbol.iterator] (): Generator<T> {
    let next = this.next()
    while (next.isSome()) {
      yield next.unwrap()
      next = this.next()
    }
  }
}