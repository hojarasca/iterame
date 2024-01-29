import {Collector} from "./collector.js";
import {Predicate} from "../types.js";
import {Option} from "nochoices";
import {Iterator} from "../index.js";

export class RFind<T> implements Collector<T, Option<T>> {
  private condition: Predicate<T>;
  constructor(condition: Predicate<T>) {
    this.condition = condition
  }
  collect(it: Iterator<T>): Option<T> {
    const current = Option.None<T>()
    for (const elem of it) {
      if (this.condition(elem)) {
        current.replace(elem)
      }
    }
    return current
  }
}
