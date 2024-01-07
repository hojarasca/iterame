import {Option} from "nochoices";

export function times(repetitions: number, fn: (n: number) => void) {
  let n = 0;
  while (n < repetitions) {
    fn(n)
    n +=1
  }
}

export function last<T>(list: T[]): Option<T> {
  return Option.fromNullable(list[list.length - 1])
}
