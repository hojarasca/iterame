import {Iterator} from "./iterator.js";
import {Option} from "nochoices";

export class Chunks<T> extends Iterator<T[]> {
  private base: Iterator<T>;
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
    return Option.Some(nextChunk.toArray()).filter(list => list.length > 0)
  }

}