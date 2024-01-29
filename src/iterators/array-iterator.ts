import {Option} from "nochoices";
import {Iterator} from "../iterator.js";


interface Advancer<T> {
  currentIndex(iter: ArrayIterator<T>): number
  advance(iter: ArrayIterator<T>): void
  revert(): Advancer<T>
}

class Forward<T> implements Advancer<T> {
  advance(iter: ArrayIterator<T>): void {
    iter.lowerBound += 1
  }

  revert(): Advancer<T> {
    return new Backward<T>()
  }

  currentIndex(iter: ArrayIterator<T>): number {
    return iter.lowerBound;
  }
}

class Backward<T> implements Advancer<T> {
  advance(iter: ArrayIterator<T>): void {
    iter.upperBound -= 1
  }

  revert(): Advancer<T> {
    return new Forward()
  }

  currentIndex(iter: ArrayIterator<T>): number {
    return iter.upperBound;
  }
}

export class ArrayIterator<T> extends Iterator<T> {
  private iterable: T[]
  lowerBound: number
  upperBound: number
  private advancer: Advancer<T>
  constructor (arr: T[]) {
    super()
    this.iterable = arr
    this.lowerBound = 0
    this.upperBound = this.iterable.length - 1
    this.advancer = new Forward()
  }

  next(): Option<T> {
    return Option.Some(this.iterable[this.advancer.currentIndex(this)])
        .filter(_ => this.lowerBound <= this.upperBound)
        .ifSome(() => {
          this.advancer.advance(this)
        })
  }

  rev(): Iterator<T> {
    this.advancer = this.advancer.revert()
    return this
  }

  reset () {
    this.lowerBound = 0
    this.upperBound = this.iterable.length - 1
  }
}
