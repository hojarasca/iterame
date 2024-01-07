import {Iterator, Iterable} from "../index.js";
import {Option} from "nochoices";

export class Dedup<T> extends Iterator<T>{
  private base: Iterable<T>;
  private alreadySeen: Set<T>;

  constructor (base: Iterable<T>) {
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

}
