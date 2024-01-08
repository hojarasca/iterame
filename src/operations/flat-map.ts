import {Iterable, IterArray, Iterator} from "../index.js";
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
    this.current = new IterArray([])
  }

  next (): Option<B> {
    return this.current.next().orElse(() => {
      let next = this.base.next()
      let current = this.current.next()
      while (next.isSomeAnd(() => current.isNone())) {
        this.current = this.arrayOrIterIntoIter(this.transformation(next.unwrap()))
        current = this.current.next().ifNone(() => next = this.base.next())
      }
      return current
    })
  }

  // private iterNext(): Option<B> {
  //   return this.current.next().orElse(() => {
  //     return this.base.next().andThen(a => {
  //       this.current = this.arrayOrIterIntoIter(this.transformation(a))
  //       return this.current.next()
  //     })
  //   })
  // }

  private arrayOrIterIntoIter(arrayOrIter: Iterable<B> | B[]): Iterable<B> {
    if (Array.isArray(arrayOrIter)) {
      return new IterArray(arrayOrIter)
    } else {
      return arrayOrIter
    }
  }
}
