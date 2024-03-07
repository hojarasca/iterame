import {Option} from "nochoices";

export function times (repetitions: number, fn: (n: number) => void) {
  let n = 0;
  while (n < repetitions) {
    fn(n)
    n +=1
  }
}

export function last<T> (list: T[]): Option<T> {
  return Option.fromNullable(list[list.length - 1])
}

export function identity<T> (t: T): T {
  return t
}

export function simpleEquality<T> (t1: T, t2: T): boolean {
  return t1 === t2
}
