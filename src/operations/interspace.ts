import {Iterator} from "../index.js";
import {Option} from "nochoices";
import {GenValue} from "../types.js";
import {IterOperation} from "./iter-operation.js";

export class Interspace<T> extends IterOperation<T, T> {
  protected base: Iterator<T>;
  private separator: GenValue<T>;
  private nextSepator: Option<GenValue<T>>;
  private nextValue: Option<T>;
  constructor (base: Iterator<T>, separator: GenValue<T>) {
    super();
    this.base = base
    this.separator = separator
    this.nextSepator = Option.None()
    this.nextValue = Option.None()
  }
  next (): Option<T> {
    const both = this.nextSepator.and(this.nextValue)
    if (both.isSome()) {
      return this.nextSepator.take().map(gen => gen())
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
