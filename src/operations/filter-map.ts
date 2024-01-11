import {Iterable, Iterator} from "../index.js";
import {Option} from "nochoices";
import {OptionalMapping} from "../types.js";

export class FilterMap<A, B> extends Iterator<B> {
  private base: Iterable<A>;
  private mapping: OptionalMapping<A, B>;
  private continue: Option<void>;

  constructor (base: Iterable<A>, mapping: OptionalMapping<A, B>) {
    super();
    this.base = base
    this.mapping = mapping
    this.continue = Option.Some(undefined)
  }

  next (): Option<B> {
    return this.continue
      .andThen(() => this.base.next())
      .map(this.mapping)
      .flatten()
      .ifNone(() => this.continue = Option.None());
  }
}
