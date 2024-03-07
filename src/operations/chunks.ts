import {END, Iterator} from "../iterator.js";
import {Option} from "nochoices";
import {IterOperation} from "./iter-operation.js";

export class Chunks<T> extends IterOperation<T, T[]> {
  protected base: Iterator<T>;
  private chunkSize: number;
  constructor (base: Iterator<T>, chunkSize: number) {
    super();
    if (chunkSize <= 0) {
      throw new Error('size should be a positive non zero integer')
    }
    this.base = base
    this.chunkSize = chunkSize
  }

  next (): Option<T[]> {
    const nextChunk = this.base.take(this.chunkSize)
    return Option.Some(nextChunk.intoArray()).filter(list => list.length > 0)
  }

  internalNext(): typeof END | T[] {
    return (this.next() as Option<typeof END | T[]>).unwrapOr(END);
  }
}
