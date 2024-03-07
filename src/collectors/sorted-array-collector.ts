import {Collector} from "./collector.js";
import {Iterator} from "../iterator.js";
import {CompareFn} from "../types.js";

export class SortedArrayCollector<T> implements Collector<T, T[]> {
  private criteria: CompareFn<T>;
  constructor (criteria: CompareFn<T>) {
    this.criteria = criteria
  }

  collect (it: Iterator<T>): T[] {
    const array = []
    for (const elem of it) {
      array.push(elem)
    }
    array.sort(this.criteria)
    return array
  }
}
