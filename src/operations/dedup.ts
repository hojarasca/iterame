import {END, Iterator, OrEnd} from "../index.js";
import {Option} from "nochoices";
import {IterOperation} from "./iter-operation.js";

export class Dedup<T> extends IterOperation<T, T>{
  protected base: Iterator<T>;
  private alreadySeen: Set<T>;

  constructor (base: Iterator<T>) {
    super();
    this.base = base
    this.alreadySeen = new Set();
  }
  next (): Option<T> {
    let next = this.base.next()
    while (next.isSomeAnd(t => this.alreadySeen.has(t))) {
      next = this.base.next()
    }
    next.ifSome(t => this.alreadySeen.add(t))
    return next
  }

  internalNext(): OrEnd<T> {
    const next = this.next() as Option<OrEnd<T>>
    return next.unwrapOr(END);
  }
}
