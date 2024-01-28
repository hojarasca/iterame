import {Iterator} from "../index.js";
import {Option} from "nochoices";

import {Mapping} from "../types.js";
import {IterOperation} from "./iter-operation.js";

export class IterMap<A, B> extends IterOperation<A, B> {
  protected base: Iterator<A>;
  private mapping: Mapping<A, B>;

  constructor (base: Iterator<A>, mapping: Mapping<A, B>) {
    super()
    this.base = base
    this.mapping = mapping
  }

  next (): Option<B> {
    return this.base.next().map(this.mapping);
  }
}
