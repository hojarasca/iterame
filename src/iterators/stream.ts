import { Iterator, OrEnd } from "./iterator.js";
import { Option } from "nochoices";

export abstract class Stream<T> extends Iterator<T> {
  nextBack(): Option<T> {
    throw new Error('Streams cannot be iterated backwards')
  }

  internalNextBack(): OrEnd<T> {
    throw new Error('Streams cannot be iterated backwards')
  }
}
