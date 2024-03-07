import {END, Iterator, OrEnd} from "../index.js";
import {Option} from "nochoices";
import {Callback} from "../types.js";
import {IterOperation} from "./iter-operation.js";

export class Inspect<T> extends IterOperation<T, T> {
  protected base: Iterator<T>;
  private callback: Callback<T>;

  constructor (base: Iterator<T>, cbk: Callback<T>) {
    super();
    this.base = base
    this.callback = cbk
  }

  next (): Option<T> {
    return this.base.next().ifSome(this.callback);
  }

  internalNext(): OrEnd<T> {
    const next = this.next() as Option<OrEnd<T>>
    return next.unwrapOr(END);
  }
}
