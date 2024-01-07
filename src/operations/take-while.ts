import {Iterator} from "../index.js";
import {Option} from "nochoices";
import {Predicate} from "../types.js";

export class TakeWhile<T> extends Iterator<T> {
  private base: Iterator<T>;
  private condition: Predicate<T>;
  private finished: boolean;

  constructor (base: Iterator<T>, condition: Predicate<T>) {
    super();
    this.base = base
    this.condition = condition
    this.finished = false
  }
  next (): Option<T> {
    return this
        .start()
        .and(this.base.next())
        .filter(this.condition)
        .ifNone(() => this.finished = true)
  }

  private start(): Option<void> {
    return this.finished
      ? Option.None()
      : Option.Some(undefined)
  }
}
