import {END, Iterator, OrEnd} from "../index.js";
import {Option} from "nochoices";

export class Zip<A, B> extends Iterator<[A, B]> {
  private first: Iterator<A>;
  private second: Iterator<B>;
  private start: Option<void>;

  constructor (first: Iterator<A>, second: Iterator<B>) {
    super();
    this.first = first
    this.second = second
    this.start = Option.Some(undefined)
  }

  next (): Option<[A, B]> {
    return this.start
      .andThen(() => this.first.next())
      .zip(this.second.next())
      .ifNone(() => this.start = Option.None());
  }

  internalNext (): OrEnd<[A, B]> {
    const next = this.next() as Option<OrEnd<[A, B]>>
    return next.unwrapOr(END);
  }
}
