import {Iterable, ArrayIterator, Iterator} from "../index.js";
import {Option} from "nochoices";
import {Mapping} from "../types.js";

export class FlatMap<A, B> extends Iterator<B> {
  private base: Iterable<A>;
  private transformation: Mapping<A, Iterable<B> | B[]>;
  private current: Iterable<B>

  constructor (base: Iterable<A>, transformation: Mapping<A, Iterable<B> | B[]>) {
    super();
    this.base = base
    this.transformation = transformation
    this.current = new ArrayIterator([])
  }

  next (): Option<B> {
    return this.current.next().orElse(() => this.findNext())
  }

  private findNext (): Option<B> {
    let next: Option<A>
    let current: Iterable<B>
    let maybeElem: Option<B>

    do {
      next = this.base.next()
      current = next
        .map(this.transformation)
        .map((a) => this.arrayOrIterIntoIter(a))
        .unwrapOr(new ArrayIterator([]))
      maybeElem = current.next()
    } while (next.isSome() && maybeElem.isNone())

    this.current = current
    return maybeElem
  }

  private arrayOrIterIntoIter (arrayOrIter: Iterable<B> | B[]): Iterable<B> {
    if (Array.isArray(arrayOrIter)) {
      return new ArrayIterator(arrayOrIter)
    } else {
      return arrayOrIter
    }
  }
}
