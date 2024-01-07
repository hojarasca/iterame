import {Iterator, Iterable} from "../index.js";
import {Option} from "nochoices";
import {Mapping} from "../types.js";

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
    let next = this.nextWithTransformation()
    while (next.isSomeAnd(([_, transformed]) => this.alreadySeen.has(transformed))) {
      next = this.nextWithTransformation()
    }
    next.ifSome(([_, transformed]) => this.alreadySeen.add(transformed))
    return next.map(([value, _]) => value)
  }

  private nextWithTransformation(): Option<[A, B]> {
    return this.base.next()
        .map<[A, B]>(value => [value, this.transformation(value)])
  }
}
