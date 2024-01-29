import {Collector} from "./collector.js";
import {Iterator} from "../iterator.js";

export class SortedArrayCollector<T> implements Collector<T, T[]> {
  collect(it: Iterator<T>): T[] {
    const array = []
    for (const elem of it) {
      array.push(elem)
    }
    array.sort()
    return array
  }
}
