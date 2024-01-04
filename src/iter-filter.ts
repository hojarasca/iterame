import {Iterable, Iterator} from "./index.js";
import {Option} from "nochoices";

import {Predicate} from "./types.js";

export class IterFilter<A> extends Iterator<A> {
  private base: Iterable<A>;
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