import {Option} from "nochoices";
import {Iterator} from "../iterator.js";
import {Collector} from "../collectors/index.js";

export abstract class InfiniteStream<T> extends Iterator<T> {
  abstract next(): Option<T>

  collect<U> (_collector: Collector<T, U>): U {
    throw new Error(`Infinite streams cannot be collected`)
  }
}
