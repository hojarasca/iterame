import {Collector} from "./collector.js";
import {END, Iterator} from "../iterators/iterator.js";

export type Reducer<Curr, Res> = (partial: Res, current: Curr) => Res
export class Fold<A, B> implements Collector<A, B> {
  private start: B;
  private fn: Reducer<A, B>;

  constructor (start: B, fn: Reducer<A, B>) {
    this.start = start
    this.fn = fn
  }
  collect (it: Iterator<A>): B {
    let next = it.internalNext()
    let partial = this.start
    while (next !== END) {
      partial = this.fn(partial, next)
      next = it.internalNext()
    }
    return partial
  }

}
