import {Collector} from "./collector.js";
import {Iterator} from "../iterator.js";

export type Reducer<Curr, Res> = (partial: Res, current: Curr) => Res
export class Reduce<A, B> implements Collector<A, B> {
  private start: B;
  private fn: Reducer<A, B>;

  constructor (start: B, fn: Reducer<A, B>) {
    this.start = start
    this.fn = fn
  }
  collect (it: Iterator<A>): B {
    let next = it.next()
    let partial = this.start
    while (next.isSome()) {
      partial = this.fn(partial, next.unwrap())
      next = it.next()
    }
    return partial
  }

}
