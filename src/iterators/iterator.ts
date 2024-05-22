/* eslint @typescript-eslint/no-unsafe-declaration-merging: 0 */

import {Option, Transformation} from "nochoices";
import {
  AreEqual,
  Callback,
  CompareFn,
  GenValue,
  Mapping,
  OptionalMapping,
  Predicate
} from "../types.js";
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
  Interspace,
  FlatMap,
  Flatten,
  Collector,
  Reducer,
  Fold,
  Cycle,
  Inspect,
  Enumerate,
  EqualIter,
  Zip,
  ZipInclusive,
  FilterMap,
  Find,
  FindIndex,
  MapWhile,
  MaxBy,
  MaxWith,
  Partition,
  RFind,
  SetCollector,
  SortedArrayCollector, Last, Reverse
} from "../index.js";
import {identity, simpleEquality, times} from "../helpers.js";
import {IntoArray} from "../collectors/index.js";

const DEFAULT_SORT_CRITERIA = function <T> (a: T, b: T): number {
  return a < b
    ? -1
    : a > b
      ? 1
      : 0
};

export const END = Symbol('iterame::END')
export type OrEnd<T> = T | typeof END

export abstract class Iterator<T> {
  internalNext (): OrEnd<T> {
    const next = this.next() as Option<OrEnd<T>>
    return next.unwrapOr(END);
  }

  next (): Option<T> {
    const next = this.internalNext()
    if (next === END) {
      return Option.None()
    } else {
      return Option.Some(next as T)
    }
  }

  estimateLength(): Option<number> {
    return Option.None()
  }

  nextBack (): Option<T> {
    const next = this.internalNextBack()
    if (next === END) {
      return Option.None()
    } else {
      return Option.Some(next as T)
    }
  }

  internalNextBack(): OrEnd<T> {
    const next: Option<OrEnd<T>> = this.nextBack()
    return next.unwrapOr(END);
  }

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
    return new Interspace(this, () => separator)
  }

  flatMap<U> (fn: Transformation<T, U[] | Iterator<U>>): FlatMap<T, U> {
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

  zip<U> (another: Iterator<U>): Zip<T, U> {
    return new Zip<T, U>(this, another)
  }

  zipInclusive<U> (another: Iterator<U>): ZipInclusive<T, U> {
    return new ZipInclusive(this, another)
  }

  filterMap<U> (mapping: OptionalMapping<T, U>): Iterator<U> {
    return new FilterMap(this, mapping)
  }

  //---------------------
  // Double sided needed
  // --------------------

  rev (): Reverse<T> {
    return new Reverse(this)
  }

  //------------
  // Finalizers
  //------------

  collect<U> (collector: Collector<T, U>): U {
    return collector.collect(this)
  }

  intoArray (): T[] {
    return this.collect(new IntoArray())
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
    let next = this.internalNext()
    while (next !== END) {
      yield next
      next = this.internalNext()
    }
  }

  fold<U> (start: U, reducer: Reducer<T, U>): U {
    return this.collect(new Fold(start, reducer))
  }

  reduce (param: Reducer<T, T>): Option<T> {
    const next = this.internalNext()

    if (next === END) {
      return Option.None()
    } else {
      return Option.Some(new Fold(next, param).collect(this))
    }
  }

  equals (it2: Iterator<T>): boolean {
    return this.collect(new EqualIter(it2, identity, simpleEquality))
  }

  equalsBy<U> (iter2: Iterator<T>, fn: Mapping<T, U>): boolean {
    return this.collect(new EqualIter(iter2, fn, simpleEquality))
  }

  equalsWith (iter2: Iterator<T>, equality: AreEqual<T>): boolean {
    return this.collect(new EqualIter(iter2, identity, equality))
  }

  find (condition: Predicate<T>): Option<T> {
    return this.collect(new Find(condition))
  }

  findIndex (condition: Predicate<T>): Option<number> {
    return this.collect(new FindIndex(condition))
  }

  interspaceWith (genSeparator: GenValue<T>): Iterator<T> {
    return new Interspace(this, genSeparator)
  }

  mapWhile<U> (mapping: OptionalMapping<T, U>): MapWhile<T, U> {
    return new MapWhile(this, mapping)
  }

  maxBy<U> (mapping: Mapping<T, U>): Option<T> {
    return this.collect(new MaxBy(mapping))
  }

  maxWith (compare: CompareFn<T>): Option<T> {
    return this.collect(new MaxWith(compare))
  }

  minBy<U> (mapping: Mapping<T, U>): Option<T> {
    return this.collect(new MaxBy(
      mapping,
      (u1, u2) => u1 <= u2 ? 1 : -1)
    )
  }

  minWith (compare: CompareFn<T>) {
    return this.collect(new MaxWith((a, b) => {
      return compare(a, b) * -1
    }))
  }

  partition (criteria: Predicate<T>): [T[], T[]] {
    return this.collect(new Partition(criteria))
  }

  positionOf (target: T): Option<number> {
    return this.findIndex(t => t === target)
  }

  rFind (condition: Predicate<T>): Option<T> {
    return this.collect(new RFind(condition))
  }

  rFindIndex (condition: Predicate<T>): Option<number> {
    return this
      .enumerate()
      .collect(new RFind(([_index, elem]) => {
        return condition(elem)
      }))
      .map(([index, _elem]) => index)
  }

  intoSet () {
    return this.collect(new SetCollector())
  }

  intoSortedArray (): T[] {
    return this.collect(new SortedArrayCollector(DEFAULT_SORT_CRITERIA))
  }

  intoSortedWithArray (order: CompareFn<T>): T[] {
    return this.collect(new SortedArrayCollector(order))
  }

  intoSortedByArray<U> (transformation: Mapping<T, U>) {
    return this.collect(new SortedArrayCollector((t1, t2) => {
      return DEFAULT_SORT_CRITERIA(transformation(t1), transformation(t2))
    }))
  }

  last () {
    return this.collect(new Last())
  }
}

export interface Iterator<T> {
  filter (predicate: Predicate<T>): Filter<T>

  rPositionOf (predicate: Predicate<T>): Option<number>
}

Iterator.prototype.filter = Iterator.prototype.select
Iterator.prototype.rPositionOf = Iterator.prototype.rFindIndex
