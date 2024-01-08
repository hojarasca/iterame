import {Iterator} from "../iterator.js";

export class ToArray<T> {
  collect(iter: Iterator<T>): Array<T> {
    return [...iter]
  }
}
