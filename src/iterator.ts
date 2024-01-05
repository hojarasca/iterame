import {Option} from "nochoices";
import {Mapping, Predicate} from "./types.js";
import {Filter, IterMap, Take, Chunks, Concat, TakeWhile, TakeWhileInclusive, Dedup, DedupWith} from "./index.js";
import {times} from "./helpers.js";
import {} from "./concat.js";


export interface Iterable<T> {
  next(): Option<T>
}

export abstract class Iterator<T> implements Iterable<T> {
  abstract next (): Option<T>
  map<U>(mapping: Mapping<T, U>): IterMap<T, U> {
    return new IterMap(this, mapping)
  }

  filter(predicate: Predicate<T>): Filter<T> {
    return new Filter(this, predicate)
  }

  every (param: Predicate<T>): boolean {
    let next = this.next()
    // Advance until there is next and the condition is meet.
    while (next.isSomeAnd(param)) {
      next = this.next()
    }
    // If last value was none it means end of iterator.
    return next.isNone()
  }

  some (predicate: Predicate<T>) {
    const map = this.map(predicate);
    let next = map.next()

    while (next.isSome() && !next.unwrap()) {
      next = map.next()
    }

    return next.isSome()
  }

  toArray (): T[] {
    return [...this]
  }



  skip (n: number): Iterator<T> {
    times(n, () => this.next())
    return this
  }

  nth (position: number): Option<T> {
    if (position < 0) {
      throw new Error('position should be positive')
    }
    this.skip(position)
    return this.next()
  }

  take (size: number): Take<T> {
    return new Take(this, size)
  }

  chunks (eachSize: number): Chunks<T> {
    return new Chunks<T>(this, eachSize)
  }

  concat (it2: Iterator<T>): Concat<T> {
    return new Concat(this, it2)
  }

  forEach(fn: (t: T) => void): void {
    let next = this.next()
    while (next.isSome()) {
      fn(next.unwrap())
      next = this.next()
    }
  }

  count (): number {
    let count = 0
    this.forEach(() => count += 1)
    return count
  }

  takeWhile (condition: Predicate<T>): TakeWhile<T> {
    return new TakeWhile(this, condition)
  }

  * [Symbol.iterator] (): Generator<T> {
    let next = this.next()
    while (next.isSome()) {
      yield next.unwrap()
      next = this.next()
    }
  }

  takeWhileInclusive (condition: Predicate<T>): TakeWhileInclusive<T> {
    return new TakeWhileInclusive(this, condition)
  }

  dedup (): Dedup<T> {
    return new Dedup<T>(this)
  }

  dedupWith <U>(transformation: Mapping<T, U>): DedupWith<T, U> {
    return new DedupWith(this, transformation)
  }
}