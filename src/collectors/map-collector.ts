import {Collector} from "./collector.js";
import {Iterator} from "../iterator.js";


type Pair<A, B> = [A, B];
export class MapCollector<Key, Value> implements Collector<[Key, Value], Map<Key, Value>> {
  collect(it: Iterator<Pair<Key, Value>>): Map<Key, Value> {
    const map =  new Map<Key, Value>();
    for (const [k, v] of it) {
      map.set(k, v)
    }
    return map
  }

  // static collect<Key, Value>(it: Iterator<Pair<Key, Value>>): Map<Key, Value> {
  //   const map =  new Map<Key, Value>();
  //   for (const [k, v] of it) {
  //     map.set(k, v)
  //   }
  //   return map
  // }
}
