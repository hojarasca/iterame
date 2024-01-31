import {Option} from "nochoices";
import {Stream} from "./stream.js";

export class IteratorIterator<T> extends Stream<T> {
  iter: Iterator<T>

  constructor(iter: Iterator<T>) {
    super();
    this.iter = iter
  }

  next(): Option<T> {
    const next = this.iter.next()
    if (next.done) {
      return Option.None()
    } else {
      return Option.Some(next.value)
    }
  }
}
