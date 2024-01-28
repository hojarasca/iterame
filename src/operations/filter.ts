import {Iterator} from "../index.js";
import {Option} from "nochoices";

import {Predicate} from "../types.js";
import {IterOperation} from "./iter-operation.js";

export class Filter<A> extends IterOperation<A, A> {
  protected base: Iterator<A>;
  private predicate: Predicate<A>;

  constructor (base: Iterator<A>, predicate: Predicate<A>) {
    super()
    this.base = base
    this.predicate = predicate
  }

  next (): Option<A> {
    let next = this.base.next()
    while (next.isSome() && next.filter(this.predicate).isNone()) {
      next = this.base.next()
    }
    return next
  }
}
