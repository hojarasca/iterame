import {END, Iterator} from "../iterator.js";
import {Sized} from "../sized.js";

export class IntoSizedArray<T> {
  collect(iter: Iterator<T> & Sized): Array<T> {
    const array = new Array(iter.size())
    let i = 0
    while (true) {
      const next = iter.internalNext()
      if (next === END) {
        return array
      } else {
        array[i] = next
        i++
      }
    }
  }
}
