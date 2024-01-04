import {describe, it} from "mocha";
import {expect} from "chai";
import '../src/index'
import {IterArray} from "../src/index.js";

describe('IterArray', () => {
  const iter = <T> (arr: T[]): IterArray<T> => {
    return new IterArray(arr)
  }

  it('generates no values for empty list', () => {
    const iterator = iter([])
    expect(iterator.next().isNone()).to.eql(true)
  })

  it('generates values in list', () => {
    const iterator = iter([1,2,3])
    expect(iterator.next().unwrap()).to.eql(1)
    expect(iterator.next().unwrap()).to.eql(2)
    expect(iterator.next().unwrap()).to.eql(3)
    expect(iterator.next().isNone()).to.eql(true)
  })

  describe('Symbol.iterator', () => {
    it('can create an iterator', () => {
      const res = []
      for (const a of iter([1,2,3])) {
        res.push(a)
      }
      expect(res).to.eql([1,2,3])
    })
  })

  describe('#map', () => {
    it('applies transformation on each element', () => {
      const target = iter([1,2,3]).map(n => n * 2)
      expect(target.next().unwrap()).to.eql(2)
      expect(target.next().unwrap()).to.eql(4)
      expect(target.next().unwrap()).to.eql(6)
      expect(target.next().isNone()).to.eql(true)
    })

    it('can be mapped again', () => {
      const target = iter([1,2,3]).map(n => n * 2).map(n => n + 1)
      expect(target.next().unwrap()).to.eql(3)
      expect(target.next().unwrap()).to.eql(5)
      expect(target.next().unwrap()).to.eql(7)
      expect(target.next().isNone()).to.eql(true)
    })
  })

  describe('toArray', () => {
    it('returns the original array', () => {
      const target = iter([1,2,3]).toArray()
      expect(target).to.eql([1,2,3])
    })
  })

  describe('#every', () => {
    it('returns true when predicate is true for every element', () => {
      const target = iter([2, 4]).every(n => n % 2 === 0)
      expect(target).to.eql(true)
    })

    it('returns false when predicate is not true for one element', () => {
      const target = iter([2, 4, 11]).every(n => n % 2 === 0)
      expect(target).to.eql(false)
    })

    it('returns true for empty array', () => {
      const target = iter([]).every(n => n % 2 === 0)
      expect(target).to.eql(true)
    })
  })

  describe('some', () => {
    it('returns true when predicate is true for every element', () => {
      const target = iter([2, 4]).some(n => n % 2 === 0)
      expect(target).to.eql(true)
    })

    it('returns true when predicate is not true for last element', () => {
      const target = iter([2, 4, 11]).some(n => n % 2 === 0)
      expect(target).to.eql(true)
    })

    it('returns true when predicate is not true for middle element', () => {
      const target = iter([2, 11, 4]).some(n => n % 2 === 0)
      expect(target).to.eql(true)
    })

    it('returns true when predicate is true only for middle element', () => {
      const target = iter([1, 4, 11]).some(n => n % 2 === 0)
      expect(target).to.eql(true)
    })

    it('returns false when predicate is false every element', () => {
      const target = iter([1, 7, 11]).some(n => n % 2 === 0)
      expect(target).to.eql(false)
    })

    it('returns false for empty array', () => {
      const target = iter([]).some(n => n % 2 === 0)
      expect(target).to.eql(false)
    })
  })


  it('can be mapped and then mapped again', () => {
    const res = []
    for (const a of iter([1,2,3]).map(n => n * 2).map(n => n + 1)) {
      res.push(a)
    }
    expect(res).to.eql([3,5,7])
  })

  it('can be filtered', () => {
    const res = []
    for (const a of iter([1,2,3]).filter(n => n % 2 === 1)) {
      res.push(a)
    }
    expect(res).to.eql([1, 3])
  })

  it('can be mapped and filtered filtered', () => {
    const res = []
    const iterator = iter([1,2,3])
        .filter(n => n % 2 === 1)
        .map(n => n * 2)
    for (const a of iterator) {
      res.push(a)
    }
    expect(res).to.eql([2, 6])
  })

  it('monkeypatches the array class', () => {
    const iter = [1,2,3].iter().filter(n => n % 2 === 1).map(n => n * 2)
    expect([...iter]).to.eql([2, 6])
  })
})