import {END, Iterator, OrEnd, Take} from "../index.js";
import {Option} from "nochoices";
import {last} from "../helpers.js";
import {IterOperation} from "./iter-operation.js";

export class StepBy<T> extends IterOperation<T, T> {
  protected base: Iterator<T>;
  private step: number;
  constructor(base: Iterator<T>, step: number) {
    super();
    this.base = base
    this.step = step
  }

  next(): Option<T> {
    const taken = new Take(this.base, this.step).intoArray();
    return last(taken).filter(_ => taken.length === this.step)
  }

  internalNext(): OrEnd<T> {
    const next = this.next() as Option<OrEnd<T>>
    return next.unwrapOr(END);
  }

}
