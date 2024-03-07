import {END, Iterator, OrEnd} from "../index.js";
import {Option} from "nochoices";
import {Predicate} from "../types.js";
import {IterOperation} from "./iter-operation.js";

export class TakeWhile<T> extends IterOperation<T, T> {
  protected base: Iterator<T>;
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

  internalNext(): OrEnd<T> {
    const next = this.next() as Option<OrEnd<T>>
    return next.unwrapOr(END);
  }

  private start(): Option<void> {
    return this.finished
      ? Option.None()
      : Option.Some(undefined)
  }
}
