import {Collector} from "./collector.js";
import {Iterator} from "../iterator.js";
import {CompareFn, Mapping} from "../types.js";
import {Option} from "nochoices";

function simpleCompare<T> (t1: T, t2: T): number {
  if (t1 === t2) {
    return 0
  } else if (t1 > t2) {
    return 1
  } else {
    return -1
  }
}

export class MaxBy<A, B> implements Collector<A, Option<A>> {
  private mapping: Mapping<A, B>;
  private compare: CompareFn<B>
  constructor (mapping: Mapping<A, B>, compare: CompareFn<B> = simpleCompare) {
    this.mapping = mapping
    this.compare = compare
  }

  collect (it: Iterator<A>): Option<A> {
    return it.reduce((partial, current) => {
      return this.take(partial, current)
    });
  }

  private take(a1: A, a2: A): A {
    if (this.compare(this.mapping(a1), this.mapping(a2)) >= 0) {
      return a1
    } else {
      return a2
    }
  }
}
