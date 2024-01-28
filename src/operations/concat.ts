import {Iterator} from "../index.js";
import {Option} from "nochoices";
import {IterOperation} from "./iter-operation.js";

export class Concat<T> extends IterOperation<T, T> {
  protected base: Iterator<T>;
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
