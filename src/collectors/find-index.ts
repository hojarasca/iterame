import {Collector} from "./collector.js";
import {Predicate} from "../types.js";
import {Iterator} from "../index.js";
import {last} from "../helpers.js";
import {Option} from "nochoices";

export class FindIndex<T> implements Collector<T, Option<number>> {
  private predicate: Predicate<T>;
  constructor (predicate: Predicate<T>) {
    this.predicate = predicate
  }
  collect (it: Iterator<T>): Option<number> {
    const taken = it.map(this.predicate).takeWhileInclusive(a => !a).toArray()
    return last(taken).filter(elem => elem).map(_ => taken.length - 1)
  }
}
