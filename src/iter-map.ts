import {Iterable, Iterator} from "./index.js";
import {Option} from "nochoices";

import {Mapping} from "./types.js";

export class IterMap<A, B> extends Iterator<B> {
  private base: Iterable<A>;
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