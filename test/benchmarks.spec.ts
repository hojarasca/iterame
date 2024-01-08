import {describe, it} from "mocha";
import '../src/index.js'
import {expect} from "chai";

describe('simple benchmarks', () => {
  it('100 numbers map and filter', () => {
    const numbers = new Array(100).fill(1).map((_, i) => i)
    console.time('eager')
    const res= numbers.map(n => n * 3).filter(n => n % 2 === 0)
    expect(res.length).to.eql(50)
    console.timeEnd('eager')

    console.time('lazy')
    const res2 = numbers.iter().map(n => n * 3).filter(n => n % 2 === 0).toArray()
    expect(res2.length).to.eql(50)
    console.timeEnd('lazy')
  })

  it('1000 numbers map and filter', () => {
    const numbers = new Array(1000).fill(1).map((_, i) => i)
    console.time('eager')
    const res= numbers.map(n => n * 3).filter(n => n % 2 === 0)
    expect(res.length).to.eql(500)
    console.timeEnd('eager')

    console.time('lazy')
    const res2 = numbers.iter().map(n => n * 3).filter(n => n % 2 === 0).toArray()
    expect(res2.length).to.eql(500)
    console.timeEnd('lazy')
  })

  it('1000 numbers filter and map', () => {
    const numbers = new Array(1000).fill(1).map((_, i) => i)
    console.time('eager')
    const res= numbers.filter(n => n % 2 === 0).map(n => n * 3)
    expect(res.length).to.eql(500)
    console.timeEnd('eager')

    console.time('lazy')
    const res2 = numbers.iter().filter(n => n % 2 === 0).map(n => n * 3).toArray()
    expect(res2.length).to.eql(500)
    console.timeEnd('lazy')
  })

  it('10 numbers million map and filter', () => {
    const numbers = new Array(10000000).fill(1).map((_, i) => i)
    console.time('eager')
    const res= numbers.map(n => n * 3).filter(n => n % 2 === 0)
    expect(res.length).to.eql(10000000 / 2)
    console.timeEnd('eager')

    console.time('lazy')
    const res2 = numbers.iter().map(n => n * 3).filter(n => n % 2 === 0).toArray()
    expect(res2.length).to.eql(10000000 / 2)
    console.timeEnd('lazy')
  })

  it('10 numbers million map and filter extreme example', () => {
    const numbers = new Array(10000000).fill(1).map((_, i) => i)
    console.time('eager')
    const res= numbers.map(n => n * 3).filter(n => n % 2 === 0).slice(0, 10)
    expect(res.length).to.eql(10)
    console.timeEnd('eager')

    console.time('lazy')
    const res2 = numbers.iter().map(n => n * 3).filter(n => n % 2 === 0).take(10).toArray()
    expect(res2.length).to.eql(10)
    console.timeEnd('lazy')
  })
})
