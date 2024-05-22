import { IterOperation } from "./iter-operation.js";
import { Iterator } from "../iterators/iterator.js"
import { OrEnd } from "../iterators/iterator.js";

export class Reverse<T> extends IterOperation<T, T> {
  protected base: Iterator<T>;

  constructor(base: Iterator<T>) {
    super()
    this.base = base;
  }

  internalNext(): OrEnd<T> {
    return this.base.internalNextBack();
  }

  internalNextBack(): OrEnd<T> {
    return this.base.internalNext();
  }
}
