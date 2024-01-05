export function times(repetitions: number, fn: (n: number) => void) {
  let n = 0;
  while (n < repetitions) {
    fn(n)
    n +=1
  }
}