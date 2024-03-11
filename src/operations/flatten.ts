import {Iterator, ArrayIterator, IterMap, OnePieceIterator} from "../index.js";
import {Option} from "nochoices";

export class Flatten<A> extends Iterator<Flattened<A>> {
  private base: Iterator<Iterator<Flattened<A>>>;
  private head: Option<Iterator<Flattened<A>>>

  constructor (base: Iterator<A>) {
    super();
    this.base = this.prepareIter(base)
    this.head = Option.None()
  }

  private prepareIter (base: Iterator<A>): Iterator<Iterator<Flattened<A>>> {
    return new IterMap(base, (a) => {
      if (a instanceof Array) {
        return new ArrayIterator(a) as Iterator<Flattened<A>>
      } else if (a instanceof Iterator) {
        return a as Iterator<Flattened<A>>
      } else {
        return OnePieceIterator.from(a) as Iterator<Flattened<A>>
      }
    })
  }

  next (): Option<Flattened<A>> {
    return this.head
      .map(iter => iter.next())
      .flatten()
      .ifNone(() => {
        this.head = this.base.next()
      }).orElse(() =>
        this.head.map(iter => iter.next()).flatten()
      )
  }
}

type Flattened<T> = T extends Iterator<infer U>
  ? U
  : (T extends Array<infer V>
    ? V
    : T)
