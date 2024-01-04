import {describe, it} from "mocha";

describe('simple benchmarks', () => {
  it('10 numbers million map and filter', () => {
    const numbers = new Array(10000000).fill(1).map((_, i) => i)
    console.time('eager')
    const res= numbers.map(n => n * 2).filter(n => n % 3 === 0)
    console.log(res.length)
    console.timeEnd('eager')

    console.time('lazy')
    const res2 = [...numbers.map(n => n * 2).filter(n => n % 3 === 0)]
    console.log(res2.length)
    console.timeEnd('lazy')
  })
})