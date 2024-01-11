import {Iterable, Iterator} from "../index.js";
import {Option} from "nochoices";

export class Zip<A, B> extends Iterator<[A, B]> {
  private first: Iterable<A>;
  private second: Iterable<B>;

  constructor (first: Iterable<A>, second: Iterable<B>) {
    super();
    this.first = first
    this.second = second
  }

  next (): Option<[A, B]> {
    const first = this.first.next();
    const second = this.second.next()
    return first.zip(second);
  }

}
