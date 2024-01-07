import {Iterable, Iterator} from "../iterator.js";

export class ToArray<T> {
  private iter: Iterator<T>;
  constructor (iter: Iterator<T>) {
    this.iter = iter
  }

  collect(): Array<T> {
    return [...this.iter]
  }
}
