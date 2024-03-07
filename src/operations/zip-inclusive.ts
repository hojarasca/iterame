import {Iterator} from "../index.js";
import {Option} from "nochoices";

export class ZipInclusive<A, B> extends Iterator<[Option<A>, Option<B>]> {
  private first: Iterator<A>;
  private second: Iterator<B>;
  private finished: Option<void>;

  constructor (first: Iterator<A>, second: Iterator<B>) {
    super();
    this.first = first
    this.second = second
    this.finished = Option.Some(undefined)
  }

  next (): Option<[Option<A>, Option<B>]> {
    return this.finished.map<[Option<A>, Option<B>]>(
      () => [
        this.first.next().ifNone(() => this.finished = Option.None()),
        this.second.next().ifNone(() => this.finished = Option.None())
      ]
    )
  }
}
