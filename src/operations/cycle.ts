import {ArrayIterator, END, Iterator, OrEnd} from "../index.js";
import {Option} from "nochoices";
import {InfiniteStream} from "../iterators/index.js";

export class Cycle<T> extends InfiniteStream<T> {
  private base: Iterator<T>;
  private elems: T[]
  private elemsIter: ArrayIterator<T>

  constructor (base: Iterator<T>) {
    super();
    this.base = base
    this.elems = []
    this.elemsIter = new ArrayIterator<T>(this.elems)
  }

  next (): Option<T> {
    return this.base.next()
      .ifSome((elem) => {
        this.elems.push(elem)
      })
      .orElse(() => this.elemsIter.next().ifNone(() => this.elemsIter.reset()))
      .orElse(() => this.elemsIter.next())
  }

  internalNext (): OrEnd<T> {
    const next = this.next() as Option<OrEnd<T>>
    return next.unwrapOr(END);
  }
}
