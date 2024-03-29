import {Iterator} from "../index.js";
import {Option} from "nochoices";
import {IterOperation} from "./iter-operation.js";

export class Take<T> extends IterOperation<T, T> {
  protected base: Iterator<T>;
  private size: number;
  private current: number;
  constructor (base: Iterator<T>, size: number) {
    super();
    this.base = base
    this.size = size
    this.current = 0
  }

  next (): Option<T> {
    return Option.Some(null)
        .filter(() => this.size > this.current)
        .andThen(() => this.base.next())
        .ifSome(() => this.current += 1)
  }
}
