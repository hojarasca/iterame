import {Collector} from "./collector.js";
import {Iterator} from "../index.js";
import {Option} from "nochoices";

export class Last<T> implements Collector<T, Option<T>> {
  collect (it: Iterator<T>): Option<T> {
    const last = Option.None<T>()
    for (const next of it) {
      last.replace(next)
    }
    return last
  }
}
