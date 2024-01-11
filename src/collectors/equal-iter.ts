import {Collector} from "./collector.js";
import {Iterator} from "../iterator.js";
import {AreEqual, Mapping} from "../types.js";

export class EqualIter<T, U> implements Collector<T, boolean> {
  private another: Iterator<T>;
  private mapping: Mapping<T, U>
  private equality: AreEqual<U>;
  constructor (another: Iterator<T>, mapping: Mapping<T, U>, equality: AreEqual<U>) {
    this.another = another
    this.mapping = mapping
    this.equality = equality
  }

  collect (it: Iterator<T>): boolean {
    const zip = it.zipInclusive(this.another)
    const allEquals = zip.every(([first, second]) =>
      (first.isNone() && second.isNone()) ||
      first.zip(second)
        .isSomeAnd(([a, b]) => this.equality(this.mapping(a), this.mapping(b)))
    )
    return allEquals
  }

}
