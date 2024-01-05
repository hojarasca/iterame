import {Option} from "nochoices";
import {Iterator} from "./iterator.js";
import {IterMap} from "./iter-map.js";
import {Mapping, Predicate} from "./types.js";
import {times} from "./helpers.js";
import {Take} from "./take.js";

export class IterArray<T> extends Iterator<T> {
  private current: number;
  private iterable: T[];
  constructor (arr: T[]) {
    super()
    this.iterable = arr
    this.current = 0;
  }

  next(): Option<T> {
    return Option.Some(this.iterable[this.current])
        .filter(_ => this.current < this.iterable.length)
        .ifSome(() => this.current += 1)
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
    let map = this.map(predicate);
    let next = map.next()

    while (next.isSome() && !next.unwrap()) {
      next = map.next()
    }

    return next.isSome()
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
}