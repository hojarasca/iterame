import {Iterator} from "../iterators/iterator.js";
import {Option} from "nochoices";
import {number} from "fp-ts";

export abstract class IterOperation<A, B> extends Iterator<B> {
  protected abstract base: Iterator<A>

  estimateLength (): Option<number> {
    return this.base.estimateLength();
  }

}
