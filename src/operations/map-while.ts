import {END, Iterator, OrEnd} from "../index.js";
import {Option} from "nochoices";
import {OptionalMapping} from "../types.js";
import {IterOperation} from "./iter-operation.js";

export class MapWhile<A, B> extends IterOperation<A, B> {
  protected base: Iterator<A>;
  private mapping: OptionalMapping<A, B>;
  private continue: Option<void>

  constructor (base: Iterator<A>, mapping: OptionalMapping<A, B>) {
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
      .ifNone(() => this.continue.take())
  }

  internalNext (): OrEnd<B> {
    const next = this.next() as Option<OrEnd<B>>
    return next.unwrapOr(END);
  }

}
