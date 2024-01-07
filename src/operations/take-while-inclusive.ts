import {Iterable, Iterator} from "../index.js";
import {Option} from "nochoices";
import {Predicate} from "../types.js";

export class TakeWhileInclusive<T> extends Iterator<T> {
  private base: Iterable<T>;
  private condition: Predicate<T>;
  private finished: boolean;

  constructor (base: Iterable<T>, condition: Predicate<T>) {
    super();
    this.base = base;
    this.condition = condition;
    this.finished = false
  }

  next (): Option<T> {
    const next = this.start().and(this.base.next());
    if(next.isSomeBut(this.condition)) {
      this.finished = true
    }
    return next
  }

  private start(): Option<void> {
    return this.finished
      ? Option.None<void>()
      : Option.Some(undefined)
  }
}
