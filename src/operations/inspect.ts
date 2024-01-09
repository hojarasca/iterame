import {Iterator, Iterable} from "../index.js";
import {Option} from "nochoices";
import {Callback} from "../types.js";

export class Inspect<T> extends Iterator<T> {
  private base: Iterable<T>;
  private callback: Callback<T>;

  constructor (base: Iterable<T>, cbk: Callback<T>) {
    super();
    this.base = base
    this.callback = cbk
  }

  next (): Option<T> {
    return this.base.next().ifSome(this.callback);
  }

}
