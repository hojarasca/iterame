import {ArrayIterator, Iterable, Iterator} from "../index.js";
import {Option} from "nochoices";

export class Cycle<T> extends Iterator<T> {
  private base: Iterable<T>;
  private elems: T[]
  private elemsIter: ArrayIterator<T>

  constructor (base: Iterable<T>) {
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

}
