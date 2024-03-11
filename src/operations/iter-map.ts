import {END, Iterator} from "../index.js";

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

  internalNext (): typeof END | B {
    const next = this.base.internalNext()
    if (next === END) {
      return END
    }

    return this.mapping(next);
  }
}
