import {END, Iterator} from "./iterator.js";
import {Option} from "nochoices";


export class ArrayIterator<T> extends Iterator<T> {
  private iterable: T[]
  lowerBound: number
  upperBound: number

  constructor (arr: T[]) {
    super()
    this.iterable = arr
    this.lowerBound = 0
    this.upperBound = this.iterable.length
  }

  estimateLength (): Option<number> {
    return Option.Some(this.upperBound - this.lowerBound)
        .filter(l => l >= 0)
  }

  internalNext (): typeof END | T {
    if (this.lowerBound >= this.upperBound) {
      return END
    } else {
      const next = this.iterable[this.lowerBound]
      this.lowerBound += 1
      return next
    }
  }

  reset () {
    this.lowerBound = 0
    this.upperBound = this.iterable.length
  }
}
