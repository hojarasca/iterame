import {END, Iterator, OrEnd} from "../index.js";
import {Option} from "nochoices";
import {Mapping} from "../types.js";
import {IterOperation} from "./iter-operation.js";

export class DedupBy<A, B> extends IterOperation<A, A>{
  protected base: Iterator<A>;
  private alreadySeen: Set<B>;
  private transformation: Mapping<A, B>;

  constructor (base: Iterator<A>, transformation: Mapping<A, B>) {
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

  private nextWithTransformation (): Option<[A, B]> {
    return this.base.next()
        .map<[A, B]>(value => [value, this.transformation(value)])
  }

  internalNext (): OrEnd<A> {
    const next = this.next() as Option<OrEnd<A>>
    return next.unwrapOr(END);
  }
}
