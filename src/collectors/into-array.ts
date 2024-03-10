import {END, Iterator} from "../iterators/iterator.js";

export class IntoArray<T> {
  collect (iter: Iterator<T>): Array<T> {
    const array = new Array(100)
    let i = 0
    while (true) {
      const next = iter.internalNext()
      if (next === END) {
        array.length = i
        return array
      } else {
        array[i] = next
        i++
      }
    }
  }
}
