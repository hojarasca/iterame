import {Iterator, Iterable} from "../index.js";
import {Option} from "nochoices";

export class Interspace<T> extends Iterator<T> {
  private base: Iterable<T>;
  private separator: T;
  private nextSepator: Option<T>;
  private nextValue: Option<T>;
  constructor (base: Iterable<T>, separator: T) {
    super();
    this.base = base
    this.separator = separator
    this.nextSepator = Option.None()
    this.nextValue = Option.None()
  }
  next (): Option<T> {
    const both = this.nextSepator.and(this.nextValue)
    if (both.isSome()) {
      return this.nextSepator.take()
    }

    if (this.nextSepator.isNone() && this.nextValue.isSome()) {
      const res  =  this.nextValue
      this.nextSepator.replace(this.separator)
      this.nextValue = this.base.next()
      return res
    }

    const res = this.base.next()
    this.nextValue = this.base.next()
    this.nextSepator.replace(this.separator)
    return res
  }
}
