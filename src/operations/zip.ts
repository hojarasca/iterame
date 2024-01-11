import {Iterable, Iterator} from "../index.js";
import {Option} from "nochoices";

export class Zip<A, B> extends Iterator<[A, B]> {
  private first: Iterable<A>;
  private second: Iterable<B>;
  private start: Option<void>;

  constructor (first: Iterable<A>, second: Iterable<B>) {
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
}
