import {Iterator, ArrayIterator, OrEnd, END} from "../index.js";
import {Option} from "nochoices";
import {Mapping} from "../types.js";
import {IterOperation} from "./iter-operation.js";

export class FlatMap<A, B> extends IterOperation<A, B> {
  protected base: Iterator<A>;
  private transformation: Mapping<A, Iterator<B> | B[]>;
  private current: Iterator<B>

  constructor (base: Iterator<A>, transformation: Mapping<A, Iterator<B> | B[]>) {
    super();
    this.base = base
    this.transformation = transformation
    this.current = new ArrayIterator<B>([])
  }

  next (): Option<B> {
    return this.current.next().orElse(() => this.findNext())
  }

  internalNext(): OrEnd<B> {
    const next = this.next() as Option<OrEnd<B>>
    return next.unwrapOr(END);
  }

  private findNext (): Option<B> {
    let next: Option<A>
    let current: Iterator<B>
    let maybeElem: Option<B>

    do {
      next = this.base.next()
      current = next
        .map(this.transformation)
        .map((a) => this.arrayOrIterIntoIter(a))
        .unwrapOr(new ArrayIterator<B>([]))
      maybeElem = current.next()
    } while (next.isSome() && maybeElem.isNone())

    this.current = current
    return maybeElem
  }

  private arrayOrIterIntoIter (arrayOrIter: Iterator<B> | B[]): Iterator<B> {
    if (Array.isArray(arrayOrIter)) {
      return new ArrayIterator(arrayOrIter)
    } else {
      return arrayOrIter
    }
  }
}
