import {describe, it} from "mocha";
import {expect} from "chai";
import '../src/index'
import {IterArray} from "../src/index.js";

describe('somthing', () => {
  const iter = <T> (arr: T[]): IterArray<T> => {
    return new IterArray(arr)
  }

  it('can create an iterator', () => {
    const res = []
    for (const a of iter([1,2,3])) {
      res.push(a)
    }
    expect(res).to.eql([1,2,3])
  })

  it('can map over that iterator', () => {
    const res = []
    for (const a of iter([1,2,3]).map(n => n * 2)) {
      res.push(a)
    }
    expect(res).to.eql([2,4,6])
  })

  it('can be mapped and then mapped again', () => {
    const res = []
    for (const a of iter([1,2,3]).map(n => n * 2).map(n => n + 1)) {
      res.push(a)
    }
    expect(res).to.eql([3,5,7])
  })
})