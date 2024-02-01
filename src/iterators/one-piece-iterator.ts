import {Iterator} from "../index.js";
import {Option} from "nochoices";

export class OnePieceIterator<T> extends Iterator<T>{
  private piece: Option<T>
  constructor (piece: Option<T>) {
    super();
    this.piece = piece
  }

  next (): Option<T> {
    return this.piece.take();
  }

  rev(): Iterator<T> {
    return this;
  }

  static from<T>(t: T) {
    return new this(Option.Some(t))
  }
}
