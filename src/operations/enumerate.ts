import {Iterator} from "../index.js";
import {Option} from "nochoices";

export class Enumerate<T> extends Iterator<[number, T]> {
  private base: Iterator<T>;
  private index: number;

  constructor (base: Iterator<T>) {
    super();
    this.base = base
    this.index = 0
  }

  next (): Option<[number, T]> {
    return this.base.next()
      .map<[number, T]>(t => [this.index, t])
      .ifSome((_) => this.index += 1);
  }

}
