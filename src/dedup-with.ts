import {Iterator, Iterable} from "./index.js";
import {Option} from "nochoices";
import {Mapping} from "./types.js";

export class DedupWith<A, B> extends Iterator<A>{
  private base: Iterable<A>;
  private alreadySeen: Set<B>;
  private transformation: Mapping<A, B>;

  constructor (base: Iterable<A>, transformation: Mapping<A, B>) {
    super();
    this.base = base
    this.alreadySeen = new Set();
    this.transformation = transformation
  }
  next (): Option<A> {
    let next = this.base.next()
    while (next.isSomeAnd(t => this.has(t))) {
      next = this.base.next()
    }
    next.ifSome(t => this.add(t))
    return next
  }

  private has(value: A): boolean {
    return this.alreadySeen.has(this.transformation(value))
  }

  private add(value: A): void {
    this.alreadySeen.add(this.transformation(value))
  }
}