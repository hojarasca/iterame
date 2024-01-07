import {Iterable, Iterator, Take} from "./index.js";
import {Option} from "nochoices";
import {last} from "./helpers.js";

export class StepBy<T> extends Iterator<T> {
  private base: Iterable<T>;
  private step: number;
  constructor(base: Iterable<T>, step: number) {
    super();
    this.base = base
    this.step = step
  }

  next(): Option<T> {
    const taken = new Take(this.base, this.step).toArray();
    return last(taken).filter(_ => taken.length === this.step)
  }

}
