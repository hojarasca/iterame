import {Iterator} from "../index.js";

export interface Collector<A, B> {
  collect(it: Iterator<A>): B
}
