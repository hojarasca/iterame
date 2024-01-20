import {Collector} from "./collector.js";
import {Iterator} from "../iterator.js";
import {CompareFn, Mapping} from "../types.js";
import {Option} from "nochoices";


export class MaxWith<A> implements Collector<A, Option<A>> {
  private compare: CompareFn<A>;
  constructor (compare: CompareFn<A>) {
    this.compare = compare
  }

  collect (it: Iterator<A>): Option<A> {
    return it.reduce((partial, current) => {
      return this.takeMax(partial, current)
    });
  }

  private takeMax(a1: A, a2: A): A {
    if (this.compare(a1, a2) >= 0) {
      return a1
    } else {
      return a2
    }
  }
}
