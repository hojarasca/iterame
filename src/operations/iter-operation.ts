import {Iterator} from "../iterator.js";

export abstract class IterOperation<A, B> extends Iterator<B> {
  protected abstract base: Iterator<A>

  protected changeBase(newBase: Iterator<A>): void {
    this.base = newBase
  }
}
