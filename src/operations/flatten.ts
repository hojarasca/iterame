import {Iterable, IterArray, Iterator, IterMap} from "../index.js";
import {Option} from "nochoices";
import {OnePieceIterator} from "../one-piece-iterator.js";

export class Flatten<A> extends Iterator<Flattened<A>> {
  private base: Iterable<Iterable<Flattened<A>>>;
  private head: Option<Iterable<Flattened<A>>>

  constructor (base: Iterable<A>) {
    super();
    this.base = this.prepareIter(base)
    this.head = Option.None()
  }

  private prepareIter (base: Iterable<A>): Iterator<Iterator<Flattened<A>>> {
    return new IterMap(base, (a) => {
      if (a instanceof Array) {
        return new IterArray(a) as Iterator<Flattened<A>>
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

type Flattened<T> = T extends Iterable<infer U>
  ? U
  : (T extends Array<infer V>
    ? V
    : T)
