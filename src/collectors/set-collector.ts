import {Collector} from "./collector.js";
import {Iterator} from "../iterators/iterator.js";

export class SetCollector<T> implements Collector<T, Set<T>> {
  collect (it: Iterator<T>): Set<T> {
    const set =  new Set<T>();
    for (const elem of it) {
      set.add(elem)
    }
    return set
  }
}
