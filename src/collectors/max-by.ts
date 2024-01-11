import {Collector} from "./collector.js";
import {Iterator} from "../iterator.js";
import {Mapping} from "../types.js";
import {Option} from "nochoices";

export class MaxBy<A, B> implements Collector<A, Option<A>> {
  private mapping: Mapping<A, B>;
  constructor (mapping: Mapping<A, B>) {
    this.mapping = mapping
  }

  collect (it: Iterator<A>): Option<A> {
    return it.reduce((partial, current) => {
      return this.mapping(current) <= this.mapping(partial) ? partial : current
    });
  }
}
