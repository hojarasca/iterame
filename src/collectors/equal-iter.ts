import {Collector} from "./collector.js";
import {Iterator} from "../iterator.js";

export class EqualIter<T> implements Collector<T, boolean> {
  private another: Iterator<T>;
  constructor (another: Iterator<T>) {
    this.another = another
  }

  collect (it: Iterator<T>): boolean {
    throw new Error('not implemented yet')
  }

}
