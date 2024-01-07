import {Iterator} from "../index.js";
import {Option} from "nochoices";

export class Concat<T> extends Iterator<T> {
  private base: Iterator<T>;
  private extension: Iterator<T>;
  constructor (base: Iterator<T>, extension: Iterator<T>) {
    super();
    this.base = base
    this.extension = extension
  }

  next (): Option<T> {
    return this.base.next().orElse(() => this.extension.next());
  }
}
