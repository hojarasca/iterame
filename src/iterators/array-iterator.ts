import {Option} from "nochoices";
import {Iterator} from "../iterator.js";


interface Advancer {
  currentIndex(iter: ArrayIterator<any>): number
  advance(iter: ArrayIterator<any>): void
  revert(): Advancer
}

class Forward implements Advancer {
  advance(iter: ArrayIterator<any>): void {
    iter.lowerBound += 1
  }

  revert(): Advancer {
    return new Backward()
  }

  currentIndex(iter: ArrayIterator<any>): number {
    return iter.lowerBound;
  }
}

class Backward implements Advancer {
  advance(iter: ArrayIterator<any>): void {
    iter.upperBound -= 1
  }

  revert(): Advancer {
    return new Forward()
  }

  currentIndex(iter: ArrayIterator<any>): number {
    return iter.upperBound;
  }
}

export class ArrayIterator<T> extends Iterator<T> {
  private iterable: T[]
  lowerBound: number
  upperBound: number
  private advancer: Advancer
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
