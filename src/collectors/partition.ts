import {Collector} from "./collector.js";
import {Predicate} from "../types.js";
import {Iterator} from "../index.js";

export class Partition<T> implements Collector<T, [T[], T[]]> {
  private criteria: Predicate<T>;
  constructor (criteria: Predicate<T>) {
    this.criteria = criteria
  }

  collect (it: Iterator<T>): [T[], T[]] {
    const trues = []
    const falses = []
    for (const val of it) {
      if (this.criteria(val)) {
        trues.push(val)
      } else {
        falses.push(val)
      }
    }
    return [trues, falses]
  }
}
