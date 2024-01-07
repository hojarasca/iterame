import {describe, it} from "mocha";
import {expect} from "chai";
import '../src/index'
import {IterArray, Iterator} from "../src/index.js";

describe('IterArray', () => {
  const iter = <T>(arr: T[]): Iterator<T> => {
    return new IterArray(arr)
  }

  it('generates no values for empty list', () => {
    const iterator = iter([])
    expect(iterator.next().isNone()).to.eql(true)
  })

  it('generates values in list', () => {
    const iterator = iter([1, 2, 3])
    expect(iterator.next().unwrap()).to.eql(1)
    expect(iterator.next().unwrap()).to.eql(2)
    expect(iterator.next().unwrap()).to.eql(3)
    expect(iterator.next().isNone()).to.eql(true)
  })

  describe('Symbol.iterator', () => {
    it('can create an iterator', () => {
      const res = []
      for (const a of iter([1, 2, 3])) {
        res.push(a)
      }
      expect(res).to.eql([1, 2, 3])
    })
  })

  describe('#map', () => {
    it('applies transformation on each element', () => {
      const target = iter([1, 2, 3]).map(n => n * 2)
      expect(target.next().unwrap()).to.eql(2)
      expect(target.next().unwrap()).to.eql(4)
      expect(target.next().unwrap()).to.eql(6)
      expect(target.next().isNone()).to.eql(true)
    })

    it('can be mapped again', () => {
      const target = iter([1, 2, 3]).map(n => n * 2).map(n => n + 1)
      expect(target.next().unwrap()).to.eql(3)
      expect(target.next().unwrap()).to.eql(5)
      expect(target.next().unwrap()).to.eql(7)
      expect(target.next().isNone()).to.eql(true)
    })
  })

  describe('toArray', () => {
    it('returns the original array', () => {
      const target = iter([1, 2, 3]).toArray()
      expect(target).to.eql([1, 2, 3])
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

  describe('#skip', () => {
    it('skip 0 does nothing', () => {
      const target = iter([1, 2, 3]).skip(0)
      expect(target.toArray()).to.eql([1, 2, 3])
    })

    it('skip 1 ignores first element', () => {
      const target = iter([1, 2, 3]).skip(1)
      expect(target.toArray()).to.eql([2, 3])
    })

    it('skip 1 ignores for empty iterator returns empty iterator', () => {
      const target = iter([]).skip(1)
      expect(target.toArray()).to.eql([])
    })

    it('skip more times than iterator length returns empty iterator', () => {
      const target = iter([1, 2, 3]).skip(5)
      expect(target.next().isNone()).to.eql(true)
    })
  })

  describe('#nth', () => {
    it('with 0 returns element at first position', () => {
      const elem = iter([1, 2, 3]).nth(0)
      expect(elem.unwrap()).to.eql(1)
    })

    it('with 1 returns element at second position', () => {
      const elem = iter([1, 2, 3]).nth(1)
      expect(elem.unwrap()).to.eql(2)
    })

    it('with 1 returns element at second position', () => {
      const elem = iter([1, 2, 3]).nth(1)
      expect(elem.unwrap()).to.eql(2)
    })

    it('with a negative number throws an error', () => {
      const iterator = iter([1, 2, 3])
      expect(() => iterator.nth(-1)).to.throw(Error, 'position should be positive')
      expect(iterator.toArray()).to.eql([1, 2, 3])
    })

    it('with a value bigger than the size of the iterator returns none', () => {
      const tenth = iter([1, 2, 3]).nth(10)
      expect(tenth.isNone()).to.eql(true)
    })
  })

  describe('#take', () => {
    it('for an empty list returns empty list', () => {
      const taken = iter([]).take(10)
      expect(taken.toArray()).to.eql([])
    })

    it('when size is lower than the iterator length retuns the first elements of the iterator', () => {
      const taken = iter([1, 2, 3]).take(2)
      expect(taken.toArray()).to.eql([1, 2])
    })

    it('when the size is bigger than the list returns the entire list', () => {
      const taken = iter([1, 2, 3]).take(10)
      expect(taken.toArray()).to.eql([1, 2, 3])
    })
  })

  describe('#takeWhile', () => {
    it('returns empty for empty iterator', () => {
      const it = iter<number>([]).takeWhile(() => true)
      expect(it.toArray()).to.eql([])
    })

    it('returns first chunk of elements that match the condition', () => {
      const it = iter<number>([-3, -1, 0, -1, 1, 2])
        .takeWhile((elem) => elem < 0)
      expect(it.toArray()).to.eql([-3, -1])
    })

    it('when condition always fullfills take all the iterator', () => {
      const it = iter<number>([1, 2, 3])
        .takeWhile((_) => true)
      expect(it.toArray()).to.eql([1, 2, 3])
    })
  })

  describe('#takeWhileInclusive', () => {
    it('returns empty for empty iterator', () => {
      const it = iter<number>([]).takeWhileInclusive(() => true)
      expect(it.toArray()).to.eql([])
    })

    it('returns first chunk of elements that match the condition, including the element that made the condition fail', () => {
      const it = iter<number>([-3, -1, 0, -1, 1, 2])
        .takeWhileInclusive((elem) => elem < 0)
      expect(it.toArray()).to.eql([-3, -1, 0])
    })

    it('when condition always fullfills take all the iterator', () => {
      const it = iter<number>([1, 2, 3])
        .takeWhileInclusive((_) => true)
      expect(it.toArray()).to.eql([1, 2, 3])
    })
  })

  describe('#chunks', () => {
    it('using 2, an iterator with 4 elements gets into an iterator with 2 lists of 2', () => {
      const chunks = iter([1, 2, 3, 4]).chunks(2)
      expect(chunks.toArray()).to.eql([[1, 2], [3, 4]])
    })

    it('using 3, an iterator with 5 elements gets into an iterator with only 2 elems with 3 and 2 elems inside', () => {
      const chunks = iter([1, 2, 3, 4, 5]).chunks(3)
      expect(chunks.toArray()).to.eql([[1, 2, 3], [4, 5]])
    })

    it('using the size of the iterator returns only 1 element with the list inside', () => {
      const chunks = iter([1, 2, 3, 4, 5]).chunks(5)
      expect(chunks.toArray()).to.eql([[1, 2, 3, 4, 5]])
    })

    it('using a number bigger than the list returns 1 element with the list inside', () => {
      const chunks = iter([1, 2, 3, 4, 5]).chunks(10)
      expect(chunks.toArray()).to.eql([[1, 2, 3, 4, 5]])
    })

    it('used with 0 throws an error', () => {
      const iterator = iter([1, 2, 3]);
      expect(() => iterator.chunks(0)).to.throw(Error, 'size should be a positive non zero integer')
      expect(iterator.toArray()).to.eql([1, 2, 3])
    })

    it('used with negative numbers throws an error', () => {
      const iterator = iter([1, 2, 3]);
      expect(() => iterator.chunks(-5)).to.throw(Error, 'size should be a positive non zero integer')
      expect(iterator.toArray()).to.eql([1, 2, 3])
    })
  })

  describe('#concat', () => {
    it('empty array with another iter returns the elements of the parameter', () => {
      const it1 = iter<number>([])
      const it2 = iter([1, 2, 3])
      const target = it1.concat(it2)
      expect(target.toArray()).to.eql([1, 2, 3])
    })

    it('concat 2 iterators with data returns 1 iterator with all the data', () => {
      const it1 = iter([1, 2, 3])
      const it2 = iter([10, 11, 12])
      const target = it1.concat(it2)
      expect(target.toArray()).to.eql([1, 2, 3, 10, 11, 12])
    })

    it('concat with empty returns iterator with the original data', () => {
      const it1 = iter<number>([1, 2, 3])
      const it2 = iter<number>([])
      const target = it1.concat(it2)
      expect(target.toArray()).to.eql([1, 2, 3])
    })
  })

  describe('#count', () => {
    it('returns 0 for empty iterator', () => {
      const it = iter<number>([])
      expect(it.count()).to.eql(0)
    })

    it('returns amount of elements for non empty iterator', () => {
      const it = iter([1, 2, 3])
      expect(it.count()).to.eql(3)
    })

    it('consumes the iterator', () => {
      const it = iter([1, 2, 3])
      it.count()
      expect(it.next().isNone()).to.eql(true)
    })
  })

  describe('#dedup', () => {
    it('returns none for empty iterator', () => {
      const it = iter<number>([]).dedup()
      expect(it.toArray()).to.eql([])
    })

    it('returns same list when all elements are different', () => {
      const it = iter<number>([1, 2, 3]).dedup()
      expect(it.toArray()).to.eql([1, 2, 3])
    })

    it('groups of 2 are reduced to only one', () => {
      const it = iter<number>([1, 1, 2, 2, 3, 3]).dedup()
      expect(it.toArray()).to.eql([1, 2, 3])
    })

    it('when elements appear in different moments only the first insance is shown', () => {
      const it = iter<number>([1, 2, 3, 1, 4, 1, 2, 5]).dedup()
      expect(it.toArray()).to.eql([1, 2, 3, 4, 5])
    })

    it('it compares elements using js ===', () => {
      const obj1 = {}
      const obj2 = {}
      const it = iter([obj1, obj2, obj1]).dedup()
      expect(it.toArray()).to.eql([obj1, obj2])
    })
  })

  describe('#dedupWith', () => {
    it('returns none for empty iterator', () => {
      const it = iter<number>([]).dedupWith(() => 10)
      expect(it.toArray()).to.eql([])
    })

    it('groups of 2 that ar mapped to the same value are reduced the first one', () => {
      const it = iter([1, '1', 2, '2', 3, '3']).dedupWith(t => t.toString())
      expect(it.toArray()).to.eql([1, 2, 3])
    })

    it('when elements that map to the same value are dispersed the first occurence survives', () => {
      const it = iter([1, '2', 3, 1, '1', 2, '2', 1]).dedupWith(t => t.toString())
      expect(it.toArray()).to.eql([1, '2', 3])
    })

    it('compares transformed values using js equality', () => {
      const obj1 = {}
      const obj2 = {}
      const it = iter([1, 2, 3]).dedupWith(t => {
        if (t === 1) {
          return obj1
        }
        if (t === 2) {
          return obj2
        }
        if (t === 3) {
          return obj1
        }
      })
      expect(it.toArray()).to.eql([1, 2])
    })
  })

  describe('#stepBy', () => {
    it('returns odd positiosn when size is 2', () => {
      const it = iter([0, 1, 2, 3, 4, 5]).stepBy(2)
      expect(it.toArray()).to.eql([1, 3, 5])
    })

    it('returns empty iter when step is bigger than iterator size', () => {
      const it = iter([0, 1, 2]).stepBy(4)
      expect(it.toArray()).to.eql([])
    })

    it('returns equivalent iterator when size is 1', () => {
      const it = iter([0, 1, 2]).stepBy(1)
      expect(it.toArray()).to.eql([0, 1, 2])
    })

    it('when there is a rest the rest is ignored', () => {
      const it = iter([0, 1, 2, 3, 4, 5, 6, 7]).stepBy(3)
      expect(it.toArray()).to.eql([2, 5])
    })
  })

  it('can be mapped and then mapped again', () => {
    const res = []
    for (const a of iter([1, 2, 3]).map(n => n * 2).map(n => n + 1)) {
      res.push(a)
    }
    expect(res).to.eql([3, 5, 7])
  })

  it('can be filtered', () => {
    const res = []
    for (const a of iter([1, 2, 3]).filter(n => n % 2 === 1)) {
      res.push(a)
    }
    expect(res).to.eql([1, 3])
  })

  it('can be mapped and filtered filtered', () => {
    const res = []
    const iterator = iter([1, 2, 3])
      .filter(n => n % 2 === 1)
      .map(n => n * 2)
    for (const a of iterator) {
      res.push(a)
    }
    expect(res).to.eql([2, 6])
  })

  it('monkeypatches the array class', () => {
    const iter = [1, 2, 3].iter().filter(n => n % 2 === 1).map(n => n * 2)
    expect([...iter]).to.eql([2, 6])
  })
})
