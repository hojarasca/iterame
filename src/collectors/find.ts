import {Collector} from "./collector.js";
import {Predicate} from "../types.js";
import {Iterator} from "../index.js";
import {last} from "../helpers.js";
import {Option} from "nochoices";

export class Find<T> implements Collector<T, Option<T>> {
  private predicate: Predicate<T>;
  constructor (predicate: Predicate<T>) {
    this.predicate = predicate
  }
  collect (it: Iterator<T>): Option<T> {
    return  it.filter(this.predicate).next()
  }
}
