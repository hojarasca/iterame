import {Option} from "nochoices";
import {Iterator} from "../iterator.js";

export class ArrayIterator<T> extends Iterator<T> {
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

  reset () {
    this.current = 0
  }
}
