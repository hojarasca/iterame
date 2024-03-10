import {END, Iterator} from "./iterator.js";
import {Sized} from "../sized.js";


export class ArrayIterator<T> extends Iterator<T> implements Sized{
  private iterable: T[]
  lowerBound: number
  upperBound: number

  constructor (arr: T[]) {
    super()
    this.iterable = arr
    this.lowerBound = 0
    this.upperBound = this.iterable.length - 1
  }

  size (): number {
    return this.upperBound - this.lowerBound
  }

  internalNext (): typeof END | T {
    if (this.lowerBound > this.upperBound) {
      return END
    } else {
      const next = this.iterable[this.lowerBound]
      this.lowerBound += 1
      return next
    }
  }

  reset () {
    this.lowerBound = 0
    this.upperBound = this.iterable.length - 1
  }
}
