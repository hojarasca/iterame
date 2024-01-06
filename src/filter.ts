import {Iterator, Iterable} from "./index.js";
import {Option} from "nochoices";

import {Predicate} from "./types.js";

export class Filter<A> extends Iterator<A> {
  private base: Iterable<A>;
  private predicate: Predicate<A>;

  constructor (base: Iterable<A>, predicate: Predicate<A>) {
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