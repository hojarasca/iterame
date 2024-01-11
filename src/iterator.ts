/* eslint @typescript-eslint/no-unsafe-declaration-merging: 0 */

import {Option, Transformation} from "nochoices";
import {Callback, Mapping, Predicate} from "./types.js";
import {
  Filter,
  IterMap,
  Take,
  Chunks,
  Concat,
  TakeWhile,
  TakeWhileInclusive,
  Dedup,
  DedupBy,
  StepBy,
  Interspace, FlatMap, Flatten, Collector, Reducer, Fold, Cycle, Inspect, Enumerate, EqualIter, Zip
} from "./index.js";
import {times} from "./helpers.js";
import {ToArray} from "./collectors/to-array.js";


export interface Iterable<T> {
  next (): Option<T>
}

export abstract class Iterator<T> implements Iterable<T> {
  abstract next (): Option<T>

  //---------
  // Filters
  //---------

  map<U> (mapping: Mapping<T, U>): IterMap<T, U> {
    return new IterMap(this, mapping)
  }

  select (predicate: Predicate<T>): Filter<T> {
    return new Filter(this, predicate)
  }

  reject (condition: Predicate<T>): Filter<T> {
    return new Filter(this, (t) => !condition(t))
  }

  drop (n: number): Iterator<T> {
    times(n, () => this.next())
    return this
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

  takeWhile (condition: Predicate<T>): TakeWhile<T> {
    return new TakeWhile(this, condition)
  }

  takeWhileInclusive (condition: Predicate<T>): TakeWhileInclusive<T> {
    return new TakeWhileInclusive(this, condition)
  }

  dedup (): Dedup<T> {
    return new Dedup<T>(this)
  }

  dedupBy<U> (transformation: Mapping<T, U>): DedupBy<T, U> {
    return new DedupBy(this, transformation)
  }

  stepBy (stepSize: number): StepBy<T> {
    return new StepBy(this, stepSize)
  }

  interspace (separator: T): Interspace<T> {
    return new Interspace(this, separator)
  }

  flatMap<U> (fn: Transformation<T, U[] | Iterable<U>>): FlatMap<T, U> {
    return new FlatMap(this, fn)
  }

  flatten (): Flatten<T> {
    return new Flatten(this)
  }

  inspect (callback: Callback<T>): Inspect<T> {
    return new Inspect(this, callback)
  }

  enumerate (): Enumerate<T> {
    return new Enumerate(this)
  }

  cycle (): Cycle<T> {
    return new Cycle(this)
  }

  //------------
  // Finalizers
  //------------

  collect<U> (collector: Collector<T, U>): U {
    return collector.collect(this)
  }

  toArray (): T[] {
    return this.collect(new ToArray())
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

  nth (position: number): Option<T> {
    if (position < 0) {
      throw new Error('position should be positive')
    }
    this.drop(position)
    return this.next()
  }

  forEach (fn: (t: T) => void): void {
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

  * [Symbol.iterator] (): Generator<T> {
    let next = this.next()
    while (next.isSome()) {
      yield next.unwrap()
      next = this.next()
    }
  }

  fold<U> (start: U, reducer: Reducer<T, U>): U {
    return this.collect(new Fold(start, reducer))
  }

  reduce (param: Reducer<T, T>): Option<T> {
    return this.next()
      .map(t => new Fold(t, param).collect(this))
  }

  equals (it2: Iterator<T>): boolean {
    return this.collect(new EqualIter(it2))
  }

  zip <U>(another: Iterator<U>): Zip<T, U> {
    return new Zip<T, U>(this, another)
  }
}

export interface Iterator<T> {
  filter (predicate: Predicate<T>): Filter<T>
}

Iterator.prototype.filter = Iterator.prototype.select
