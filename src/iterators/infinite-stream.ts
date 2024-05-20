import {Option} from "nochoices";
import {Collector} from "../collectors/index.js";
import { Stream } from "./stream.js";

export abstract class InfiniteStream<T> extends Stream<T> {
  abstract next(): Option<T>

  collect<U> (_collector: Collector<T, U>): U {
    throw new Error(`Infinite streams cannot be collected`)
  }
}
