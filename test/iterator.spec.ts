import { describe, it } from "mocha";
import { expect } from "chai";
import '../src/index'
import { ArrayIterator, END, Iterator, MapCollector } from "../src/index.js";
import { Option } from "nochoices";

describe('Iterator', () => {
  const iter = <T>(arr: T[]): Iterator<T> => {
    return new ArrayIterator(arr)
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
      const target = iter([1, 2, 3]).intoArray()
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
      const target = iter([1, 2, 3]).drop(0)
      expect(target.intoArray()).to.eql([1, 2, 3])
    })

    it('skip 1 ignores first element', () => {
      const target = iter([1, 2, 3]).drop(1)
      expect(target.intoArray()).to.eql([2, 3])
    })

    it('skip 1 ignores for empty iterator returns empty iterator', () => {
      const target = iter([]).drop(1)
      expect(target.intoArray()).to.eql([])
    })

    it('skip more times than iterator length returns empty iterator', () => {
      const target = iter([1, 2, 3]).drop(5)
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
      expect(iterator.intoArray()).to.eql([1, 2, 3])
    })

    it('with a value bigger than the size of the iterator returns none', () => {
      const tenth = iter([1, 2, 3]).nth(10)
      expect(tenth.isNone()).to.eql(true)
    })
  })

  describe('#take', () => {
    it('for an empty list returns empty list', () => {
      const taken = iter([]).take(10)
      expect(taken.intoArray()).to.eql([])
    })

    it('when size is lower than the iterator length returns the first elements of the iterator', () => {
      const taken = iter([1, 2, 3]).take(2)
      expect(taken.intoArray()).to.eql([1, 2])
    })

    it('when the size is bigger than the list returns the entire list', () => {
      const taken = iter([1, 2, 3]).take(10)
      expect(taken.intoArray()).to.eql([1, 2, 3])
    })
  })

  describe('#takeWhile', () => {
    it('returns empty for empty iterator', () => {
      const it = iter<number>([]).takeWhile(() => true)
      expect(it.intoArray()).to.eql([])
    })

    it('returns first chunk of elements that match the condition', () => {
      const it = iter<number>([-3, -1, 0, -1, 1, 2])
        .takeWhile((elem) => elem < 0)
      expect(it.intoArray()).to.eql([-3, -1])
    })

    it('when condition always fulfills take all the iterator', () => {
      const it = iter<number>([1, 2, 3])
        .takeWhile((_) => true)
      expect(it.intoArray()).to.eql([1, 2, 3])
    })
  })

  describe('#takeWhileInclusive', () => {
    it('returns empty for empty iterator', () => {
      const it = iter<number>([]).takeWhileInclusive(() => true)
      expect(it.intoArray()).to.eql([])
    })

    it('returns first chunk of elements that match the condition, including the element that made the condition fail', () => {
      const it = iter<number>([-3, -1, 0, -1, 1, 2])
        .takeWhileInclusive((elem) => elem < 0)
      expect(it.intoArray()).to.eql([-3, -1, 0])
    })

    it('when condition always fulfills take all the iterator', () => {
      const it = iter<number>([1, 2, 3])
        .takeWhileInclusive((_) => true)
      expect(it.intoArray()).to.eql([1, 2, 3])
    })
  })

  describe('#chunks', () => {
    it('using 2, an iterator with 4 elements gets into an iterator with 2 lists of 2', () => {
      const chunks = iter([1, 2, 3, 4]).chunks(2)
      expect(chunks.intoArray()).to.eql([[1, 2], [3, 4]])
    })

    it('using 3, an iterator with 5 elements gets into an iterator with only 2 elems with 3 and 2 elems inside', () => {
      const chunks = iter([1, 2, 3, 4, 5]).chunks(3)
      expect(chunks.intoArray()).to.eql([[1, 2, 3], [4, 5]])
    })

    it('using the size of the iterator returns only 1 element with the list inside', () => {
      const chunks = iter([1, 2, 3, 4, 5]).chunks(5)
      expect(chunks.intoArray()).to.eql([[1, 2, 3, 4, 5]])
    })

    it('using a number bigger than the list returns 1 element with the list inside', () => {
      const chunks = iter([1, 2, 3, 4, 5]).chunks(10)
      expect(chunks.intoArray()).to.eql([[1, 2, 3, 4, 5]])
    })

    it('used with 0 throws an error', () => {
      const iterator = iter([1, 2, 3]);
      expect(() => iterator.chunks(0)).to.throw(Error, 'size should be a positive non zero integer')
      expect(iterator.intoArray()).to.eql([1, 2, 3])
    })

    it('used with negative numbers throws an error', () => {
      const iterator = iter([1, 2, 3]);
      expect(() => iterator.chunks(-5)).to.throw(Error, 'size should be a positive non zero integer')
      expect(iterator.intoArray()).to.eql([1, 2, 3])
    })
  })

  describe('#concat', () => {
    it('empty array with another iter returns the elements of the parameter', () => {
      const it1 = iter<number>([])
      const it2 = iter([1, 2, 3])
      const target = it1.concat(it2)
      expect(target.intoArray()).to.eql([1, 2, 3])
    })

    it('concat 2 iterators with data returns 1 iterator with all the data', () => {
      const it1 = iter([1, 2, 3])
      const it2 = iter([10, 11, 12])
      const target = it1.concat(it2)
      expect(target.intoArray()).to.eql([1, 2, 3, 10, 11, 12])
    })

    it('concat with empty returns iterator with the original data', () => {
      const it1 = iter<number>([1, 2, 3])
      const it2 = iter<number>([])
      const target = it1.concat(it2)
      expect(target.intoArray()).to.eql([1, 2, 3])
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
      expect(it.intoArray()).to.eql([])
    })

    it('returns same list when all elements are different', () => {
      const it = iter<number>([1, 2, 3]).dedup()
      expect(it.intoArray()).to.eql([1, 2, 3])
    })

    it('groups of 2 are reduced to only one', () => {
      const it = iter<number>([1, 1, 2, 2, 3, 3]).dedup()
      expect(it.intoArray()).to.eql([1, 2, 3])
    })

    it('when elements appear in different moments only the first instance is shown', () => {
      const it = iter<number>([1, 2, 3, 1, 4, 1, 2, 5]).dedup()
      expect(it.intoArray()).to.eql([1, 2, 3, 4, 5])
    })

    it('it compares elements using js ===', () => {
      const obj1 = {}
      const obj2 = {}
      const it = iter([obj1, obj2, obj1]).dedup()
      expect(it.intoArray()).to.eql([obj1, obj2])
    })
  })

  describe('#dedupBy', () => {
    it('returns none for empty iterator', () => {
      const it = iter<number>([]).dedupBy(() => 10)
      expect(it.intoArray()).to.eql([])
    })

    it('groups of 2 that ar mapped to the same value are reduced the first one', () => {
      const it = iter([1, '1', 2, '2', 3, '3']).dedupBy(t => t.toString())
      expect(it.intoArray()).to.eql([1, 2, 3])
    })

    it('when elements that map to the same value are dispersed the first occurrence survives', () => {
      const it = iter([1, '2', 3, 1, '1', 2, '2', 1]).dedupBy(t => t.toString())
      expect(it.intoArray()).to.eql([1, '2', 3])
    })

    it('compares transformed values using js equality', () => {
      const obj1 = {}
      const obj2 = {}
      const it = iter([1, 2, 3]).dedupBy(t => {
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
      expect(it.intoArray()).to.eql([1, 2])
    })
  })

  describe('#stepBy', () => {
    it('returns odd position when size is 2', () => {
      const it = iter([0, 1, 2, 3, 4, 5]).stepBy(2)
      expect(it.intoArray()).to.eql([1, 3, 5])
    })

    it('returns empty iter when step is bigger than iterator size', () => {
      const it = iter([0, 1, 2]).stepBy(4)
      expect(it.intoArray()).to.eql([])
    })

    it('returns equivalent iterator when size is 1', () => {
      const it = iter([0, 1, 2]).stepBy(1)
      expect(it.intoArray()).to.eql([0, 1, 2])
    })

    it('when there is a rest the rest is ignored', () => {
      const it = iter([0, 1, 2, 3, 4, 5, 6, 7]).stepBy(3)
      expect(it.intoArray()).to.eql([2, 5])
    })
  })

  describe('#intersperse', () => {
    it('returns empty for empty iterator', () => {
      const it = iter<number>([]).interspace(0)
      expect(it.next().isNone()).to.eql(true)
    })

    it('in a 2 elem iterator puts 1 instance of the separator in the middle', () => {
      const it = iter<number>([1, 2]).interspace(100)
      expect(it.intoArray()).to.eql([1, 100, 2])
    })

    it('in a 3 elem iterator puts separator in the middle after first and after second elem', () => {
      const it = iter<number>([1, 2, 3]).interspace(100)
      expect(it.intoArray()).to.eql([1, 100, 2, 100, 3])
    })

    it('in a 1 elem iterator no separator', () => {
      const it = iter<number>([1]).interspace(100)
      expect(it.intoArray()).to.eql([1])
    })
  })

  describe('#flatMap', () => {
    it('returns empty for empty iter', () => {
      const it = iter<number>([]).flatMap((_) => [])
      expect(it.next().isNone()).to.eql(true)
    })

    it('returns empty iter for fn that returns empty array', () => {
      const it = iter<number>([1, 2, 3]).flatMap((_) => [])
      expect(it.next().isNone()).to.eql(true)
    })

    it('when the function returns a list it returns those elements in order', () => {
      const it = iter<number>([1]).flatMap((_) => [2, 3, 4])
      expect(it.intoArray()).to.eql([2, 3, 4])
    })

    it('when the function returns an iter it returns those elements in order', () => {
      const it = iter<number>([1]).flatMap((_) => iter([2, 3, 4]))
      expect(it.intoArray()).to.eql([2, 3, 4])
    })

    it('when the function returns empty array for some elements they get ignored', () => {
      const it = iter<number>([0, 1, 2, 3, 4, 5, 6])
        .flatMap((n) => n % 3 === 0 ? [n] : [])
      expect(it.intoArray()).to.eql([0, 3, 6])
    })

    it('when the function returns list of lists it flattens only once', () => {
      const it = iter<number>([0, 1, 2])
        .flatMap((n) => [[n]])
      expect(it.intoArray()).to.eql([[0], [1], [2]])
    })
  })

  describe('#flatten', () => {
    it('returns empty iter for empty iter', () => {
      const it = iter<number[]>([]).flatten()
      expect(it.next().isNone()).to.eql(true)
    })

    it('flattens a list of size 1', () => {
      const it = iter([[1]]).flatten()
      expect(it.intoArray()).to.eql([1])
    })

    it('flattens a list of one iterator', () => {
      const it = iter([iter([1])]).flatten()
      expect(it.intoArray()).to.eql([1])
    })

    it('does nothing with a list of plain objects', () => {
      const it = iter([1, 2, 3]).flatten()
      expect(it.intoArray()).to.eql([1, 2, 3])
    })
  })

  describe('#select', () => {
    it('works as filter', () => {
      const it = iter([0, 1, 2, 3]).select(n => n % 2 === 0)
      expect(it.intoArray()).to.eql([0, 2])
    })
  })

  describe('#reject', () => {
    it('returns elements that make the predicate false', () => {
      const it = iter([0, 1, 2, 3]).reject(n => n % 2 === 0)
      expect(it.intoArray()).to.eql([1, 3])
    })
  })

  describe('#fold', () => {
    it('returns default element for empty iterator', () => {
      const reduced = iter<number>([]).fold(123, (_a, _b) => 0)
      expect(reduced).to.eql(123)
    })

    it('applies the function to the starting value and the only element of a 1 sized iterator', () => {
      const reduced = iter<number>([100]).fold(50, (a, b) => a + b)
      expect(reduced).to.eql(150)
    })

    it('when sum of 100 and 200 with 50 as starter returns 350', () => {
      const reduced = iter<number>([100, 200]).fold(50, (a, b) => a + b)
      expect(reduced).to.eql(350)
    })

    it('sends right arguments for first call of the callback', () => {
      const obj1 = {}
      const obj2 = {}
      const reduced = iter([obj1]).fold(obj2, (partial, current): number => {
        expect(partial).to.equals(obj2)
        expect(current).to.equals(obj1)
        return 0
      })
      expect(reduced).to.eql(0)
    })

    it('sends right arguments for second call of the callback', () => {
      const obj1 = {}
      const obj2 = {}
      const obj3 = {}
      const obj4 = {}

      const calls: object[][] = []
      iter([obj1, obj2]).fold(obj3, (partial, current): object => {
        calls.push([partial, current])
        return obj4
      })

      expect(calls).to.have.length(2)
      expect(calls[0][0]).to.equals(obj3)
      expect(calls[0][1]).to.equals(obj1)
      expect(calls[1][0]).to.equals(obj4)
      expect(calls[1][1]).to.equals(obj2)
    })
  })

  describe('#reduce', () => {
    it('returns none for empty iter', () => {
      const res = iter<number>([]).reduce((_current, _partial) => 0)
      expect(res.isNone()).to.eql(true)
    })

    it('first element when there is only 1 element', () => {
      const res = iter<number>([100]).reduce((_current, _partial) => 0)
      expect(res.unwrap()).to.eql(100)
    })

    it('when calculating sum it sums all the elements', () => {
      const res = iter<number>([1, 10, 100]).reduce((current, partial) => current + partial)
      expect(res.unwrap()).to.eql(111)
    })

    it('sends right args on each call', () => {
      const calls: number[][] = []
      iter<number>([1, 10, 100]).reduce((current, partial) => {
        calls.push([current, partial])
        return current + partial
      })
      expect(calls).to.have.length(2)
      expect(calls[0]).to.eql([1, 10])
      expect(calls[1]).to.eql([11, 100])
    })
  })

  describe('#cycle', () => {
    it('returns empty for empty', () => {
      const empty = iter<number>([]).cycle()
      expect(empty.next().isNone()).to.eql(true)
    })

    it('the same element over and over for a 1 element iter', () => {
      const oneElement = iter<number>([123]).cycle()
      expect(oneElement.next().unwrap()).to.eql(123)
      expect(oneElement.next().unwrap()).to.eql(123)
      expect(oneElement.next().unwrap()).to.eql(123)
      expect(oneElement.next().unwrap()).to.eql(123)
      expect(oneElement.next().unwrap()).to.eql(123)
      expect(oneElement.next().unwrap()).to.eql(123)
    })

    it('loops the same elements', () => {
      const obj1 = {}
      const obj2 = {}
      const obj3 = {}
      const empty = iter([obj1, obj2, obj3]).cycle()
      expect(empty.next().unwrap()).to.equals(obj1)
      expect(empty.next().unwrap()).to.equals(obj2)
      expect(empty.next().unwrap()).to.equals(obj3)
      expect(empty.next().unwrap()).to.equals(obj1)
      expect(empty.next().unwrap()).to.equals(obj2)
      expect(empty.next().unwrap()).to.equals(obj3)
    })
  })

  describe('#inspect', () => {
    it('does not call the callback when the iterator was not consumed', () => {
      const elems: number[] = []
      const fn = (n: number) => elems.push(n)
      iter([1, 2, 3]).inspect(fn)
      expect(elems).to.eql([])
    })

    it('calls the callback for each element when the iterator was not consumed', () => {
      const elems: number[] = []
      const fn = (n: number) => elems.push(n)
      iter([1, 2, 3]).inspect(fn).intoArray()
      expect(elems).to.eql([1, 2, 3])
    })

    it('does not affected the items of the iterator', () => {
      const fn = (_n: number) => {
      }
      const it = iter([1, 2, 3]).inspect(fn)
      expect(it.intoArray()).to.eql([1, 2, 3])
    })
  })

  describe('#forEach', () => {
    it('does not call the callback for empty iterator', () => {
      const it = iter<number>([])
      let called = false
      it.forEach(() => called = true)
      expect(called).to.eql(false)
    })

    it('calls for each element of the iterator sending that as argument', () => {
      const obj1 = {}
      const obj2 = {}
      const it = iter<object>([obj1, obj2, obj1])
      const calls: object[] = []
      it.forEach((arg) => calls.push(arg))
      expect(calls[0]).to.equals(obj1)
      expect(calls[1]).to.equals(obj2)
      expect(calls[2]).to.equals(obj1)
    })
  })

  describe('#enumerate', () => {
    it('returns empty for empty iter', () => {
      const it = iter<number>([]).enumerate()
      expect(it.next().isNone()).to.eql(true)
    })

    it('tuple with zero and the element for one element iterator', () => {
      const it = iter(['first']).enumerate()
      expect(it.next().unwrap()).to.eql([0, 'first'])
      expect(it.next().isNone()).to.eql(true)
    })

    it('enumerates a list', () => {
      const it = iter(['first', 'second', 'third']).enumerate()
      expect(it.intoArray()).to.eql([
        [0, 'first'],
        [1, 'second'],
        [2, 'third'],
      ])
    })

    it('when enumerated and then filtered, the original indexes get conserved', () => {
      const it = iter(['first', 'second', 'third'])
        .enumerate()
        .filter(([_, s]) => s !== 'second')

      expect(it.intoArray()).to.eql([
        [0, 'first'],
        [2, 'third'],
      ])
    })

    it('uses indexes for when enumerated was called', () => {
      const it = iter(['first', 'second', 'third'])
        .filter(s => s !== 'second') // first remove some elems
        .enumerate()

      expect(it.intoArray()).to.eql([
        [0, 'first'],
        [1, 'third'],
      ])
    })
  })

  describe('#zip', () => {
    it('returns empty for empty pair', () => {
      const it1 = iter<number>([])
      const it2 = iter<string>([])
      const zip = it1.zip(it2)
      expect(zip.next().isNone()).to.eql(true)
    })

    it('returns a pair when both have 1', () => {
      const it1 = iter<number>([1])
      const it2 = iter<string>(['one'])
      const zip = it1.zip(it2)
      expect(zip.next().unwrap()).to.eql([1, 'one'])
      expect(zip.next().isNone()).to.eql(true)
    })

    it('the value of self always goes first', () => {
      const it1 = iter<string>(['one'])
      const it2 = iter<number>([1])
      const zip = it1.zip(it2)
      expect(zip.next().unwrap()).to.eql(['one', 1])
      expect(zip.next().isNone()).to.eql(true)
    })

    it('lists pairs', () => {
      const it1 = iter<number>([1, 2, 3])
      const it2 = iter<string>(['one', 'two', 'three'])
      const zip = it1.zip(it2)
      expect(zip.intoArray()).to.eql([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ])
    })

    it('when first iterator is shorter it limits the size of the zipped', () => {
      const it1 = iter<number>([1, 2])
      const it2 = iter<string>(['one', 'two', 'three'])
      const zip = it1.zip(it2)
      expect(zip.intoArray()).to.eql([
        [1, 'one'],
        [2, 'two']
      ])
    })

    it('when first finishes the second gets consumed 1 extra time', () => {
      const it1 = iter<number>([1, 2])
      const it2 = iter<string>(['one', 'two', 'three', 'four'])
      it1.zip(it2).intoArray()
      expect(it2.next().unwrap()).to.eql('four')
      expect(it2.next().isNone()).to.eql(true)
    })

    it('when second finishes the first does gets consumed one extra time', () => {
      const it1 = iter<number>([1, 2, 3, 4])
      const it2 = iter<string>(['one', 'two'])
      it1.zip(it2).intoArray()
      expect(it1.next().isSome()).to.eql(true)
    })

    it('when second iterator is shorter it limits the size of the zipped', () => {
      const it1 = iter<number>([1, 2, 3])
      const it2 = iter<string>(['one', 'two'])
      const zip = it1.zip(it2)
      expect(zip.intoArray()).to.eql([
        [1, 'one'],
        [2, 'two']
      ])
    })
  })

  describe('#zipInclusive', () => {
    it('for double empty returns 1 element with empty options', () => {
      const it1 = iter<number>([])
      const it2 = iter<string>([])
      const zip = it1.zipInclusive(it2)
      expect(zip.next().unwrap()).to.eql([Option.None(), Option.None()])
      expect(zip.next().isNone()).to.eql(true)
    })

    it('when both are present returns list of pairs of options, ended with double none', () => {
      const it1 = iter<number>([1, 2, 3])
      const it2 = iter<string>(['one', 'two', 'tree'])
      const zip = it1.zipInclusive(it2)
      expect(zip.intoArray()).to.eql([
        [Option.Some(1), Option.Some('one')],
        [Option.Some(2), Option.Some('two')],
        [Option.Some(3), Option.Some('tree')],
        [Option.None(), Option.None()]
      ])
    })

    it('when the first iterator is shorter, returns an extra element of the second one', () => {
      const it1 = iter<number>([1, 2])
      const it2 = iter<string>(['one', 'two', 'tree', 'four'])
      const zip = it1.zipInclusive(it2)
      expect(zip.intoArray()).to.eql([
        [Option.Some(1), Option.Some('one')],
        [Option.Some(2), Option.Some('two')],
        [Option.None(), Option.Some('tree')],
      ])
    })

    it('when the second iterator is shorter, returns an extra element of the first one', () => {
      const it1 = iter<number>([1, 2, 3, 4])
      const it2 = iter<string>(['one', 'two'])
      const zip = it1.zipInclusive(it2)
      expect(zip.intoArray()).to.eql([
        [Option.Some(1), Option.Some('one')],
        [Option.Some(2), Option.Some('two')],
        [Option.Some(3), Option.None()],
      ])
    })
  })

  describe('#equals', () => {
    it('returns true for 2 empty iterators', () => {
      const it1 = iter<number>([])
      const it2 = iter<number>([])
      expect(it1.equals(it2)).to.eql(true)
    })

    it('returns false for 1 empty iter and 1 non empty', () => {
      const it1 = iter<number>([])
      const it2 = iter<number>([1])
      expect(it1.equals(it2)).to.eql(false)
    })

    it('returns false for 1 non empty iter and 1 empty', () => {
      const it1 = iter<number>([1])
      const it2 = iter<number>([])
      expect(it1.equals(it2)).to.eql(false)
    })

    it('returns false when 2 1 sized iterators with different values', () => {
      const it1 = iter<number>([1])
      const it2 = iter<number>([2])
      expect(it1.equals(it2)).to.eql(false)
    })

    it('returns true for 2 equal iterators', () => {
      const it1 = iter<number>([1, 2, 3])
      const it2 = iter<number>([1, 2, 3])
      expect(it1.equals(it2)).to.eql(true)
    })
  })

  describe('#equalsBy', () => {
    it('returns true for 2 empty iterators', () => {
      const it1 = iter<number>([])
      const it2 = iter<number>([])
      expect(it1.equalsBy(it2, () => true)).to.eql(true)
    })

    it('returns false for 1 empty iter and 1 non empty', () => {
      const it1 = iter<number>([])
      const it2 = iter<number>([1])
      const comparison = it1.equalsBy(it2, (a) => a);
      expect(comparison).to.eql(false)
    })

    it('returns false for 1 non empty iter and 1 empty', () => {
      const it1 = iter<number>([1])
      const it2 = iter<number>([])
      const comparison = it1.equalsBy(it2, (a) => a);
      expect(comparison).to.eql(false)
    })

    it('returns false when 2 1 sized iterators with different results', () => {
      const it1 = iter<number>([1])
      const it2 = iter<number>([2])
      const comparison = it1.equalsBy(it2, (a) => a.toString());
      expect(comparison).to.eql(false)
    })

    it('returns true when 2 1 sized iterators with same results', () => {
      const it1 = iter<number>([0])
      const it2 = iter<number>([2])
      const comparison = it1.equalsBy(it2, (a) => a % 2);
      expect(comparison).to.eql(true)
    })

    it('returns true for 2 iterators with same mappings', () => {
      const it1 = iter<number>([1, 2, 3])
      const it2 = iter<number>([1, 2, 3])
      const comparison = it1.equalsBy(it2, (a) => a % 3);
      expect(comparison).to.eql(true)
    })

    it('returns false for 2 iterators with same values but different mappings', () => {
      const it1 = iter<number>([1, 2, 3])
      const it2 = iter<number>([1, 2, 3])
      const comparison = it1.equalsBy(it2, (_a) => Math.random());
      expect(comparison).to.eql(false)
    })
  })

  describe('#equalsWith', () => {
    it('returns true for 2 empty iterators', () => {
      const it1 = iter<number>([])
      const it2 = iter<number>([])
      const comparison = it1.equalsWith(it2, (_a, _b) => false);
      expect(comparison).to.eql(true)
    })

    it('returns false for 1 empty iter and 1 non empty', () => {
      const it1 = iter<number>([])
      const it2 = iter<number>([1])
      const comparison = it1.equalsWith(it2, (_a, _b) => true);
      expect(comparison).to.eql(false)
    })

    it('returns false for 1 non empty iter and 1 empty', () => {
      const it1 = iter<number>([1])
      const it2 = iter<number>([])
      const comparison = it1.equalsWith(it2, (_a, _b) => true)
      expect(comparison).to.eql(false)
    })

    it('returns true when 2 1 sized iterators are different but the comparing function works', () => {
      const it1 = iter<number>([1])
      const it2 = iter<number>([2])
      const comparison = it1.equalsWith(it2, (_a, _b) => true)
      expect(comparison).to.eql(true)
    })

    it('returns false when 2 1 sized iterators are the same but the comparing function returns false', () => {
      const it1 = iter<number>([1])
      const it2 = iter<number>([1])
      const comparison = it1.equalsWith(it2, (_a, _b) => false)
      expect(comparison).to.eql(false)
    })

    it('returns true for 2 equal iterators that match the equality condition', () => {
      const it1 = iter<number>([1, 2, 32])
      const it2 = iter<number>([1, 2, 32])
      const comparison = it1.equalsWith(it2, (a, b) => {
        return a % 10 === b % 10
      })
      expect(comparison).to.eql(true)
    })
  })

  describe('#filterMap', () => {
    it('returns empty iter for empty iter', () => {
      const empty = iter<number>([]).filterMap(() => Option.Some(10))
      expect(empty.next().isNone()).to.eql(true)
    })

    it('returns same list when transformation returns some of the value', () => {
      const it = iter([1, 2, 3])
        .filterMap((v) => Option.Some(v))
      expect(it.intoArray()).to.eql([1, 2, 3])
    })

    it('stops when function returns None', () => {
      const it = iter([1, 2, 3, 4, 5])
        .filterMap(v => Option.Some(v).filter(v => v < 4))
      expect(it.intoArray()).to.eql([1, 2, 3])
    })

    it('iterates over transformed values', () => {
      const it = iter([1, 2, 3, 4, 5])
        .filterMap(v => Option.Some(v).filter(v => v < 4).map(n => n.toString()))
      expect(it.intoArray()).to.eql(['1', '2', '3'])
    })
  })

  describe('#find', () => {
    it('returns none for empty iter', () => {
      const found = iter([]).find((_) => true)
      expect(found.isNone()).to.eql(true)
    })

    it('if an element matches the condition returns some with that element', () => {
      const found = iter([1, 2, 3, 4, 5, 6, 7]).find((n) => n % 5 === 0)
      expect(found.unwrap()).to.eql(5)
    })

    it('from the iterator up to the element that matches the condition', () => {
      const it = iter([1, 2, 3, 4, 5, 6, 7])
      it.find((n) => n % 5 === 0)
      expect(it.count()).to.eql(2)
    })

    it('returns none when no element matches the condition', () => {
      const found = iter([1, 2, 3, 4, 5, 6, 7]).find((n) => n % 10 === 0)
      expect(found.isNone()).to.eql(true)
    })

    it('from the iterator up to the element that matches the condition', () => {
      const it = iter([1, 2, 3, 4, 5, 6, 7])
      it.find((n) => n % 10 === 0)
      expect(it.next().isNone()).to.eql(true)
    })
  })

  describe('#findIndex', () => {
    it('returns none for empty iter', () => {
      const found = iter([]).findIndex((_) => true)
      expect(found.isNone()).to.eql(true)
    })

    it('returns Some(0) when first item matches', () => {
      const found = iter([1, 2, 3]).findIndex((n) => n === 1)
      expect(found.unwrap()).to.eql(0)
    })

    it('returns Some(1) when second item matches', () => {
      const found = iter([1, 2, 3]).findIndex((n) => n === 2)
      expect(found.unwrap()).to.eql(1)
    })

    it('returns None when no item matches', () => {
      const found = iter([1, 2, 3]).findIndex((n) => n === 5)
      expect(found.isNone()).to.eql(true)
    })
  })

  describe('#intersperseWith', () => {
    it('returns empty for empty iterator', () => {
      const it = iter<number>([]).interspaceWith(() => expect.fail('should not call this'))
      expect(it.next().isNone()).to.eql(true)
    })

    it('in a 2 elem iterator puts 1 instance of the separator in the middle', () => {
      const it = iter<number>([1, 2]).interspaceWith(() => 100)
      expect(it.intoArray()).to.eql([1, 100, 2])
    })

    it('in a 3 elem iterator puts separator in the middle after first and after second elem', () => {
      const it = iter<number>([1, 2, 3]).interspaceWith(() => 100)
      expect(it.intoArray()).to.eql([1, 100, 2, 100, 3])
    })

    it('in a 1 elem iterator no separator', () => {
      const it = iter<number>([1]).interspaceWith(() => expect.fail('should not be called'))
      expect(it.intoArray()).to.eql([1])
    })
  })

  describe('#mapWhile', () => {
    it('returns empty iter for empty iter', () => {
      const it = iter([]).mapWhile((_) => expect.fail('should not be called'))
      expect(it.intoArray()).to.eql([])
    })

    it('returns same values when fn returns always the value', () => {
      const it = iter([1, 2, 3])
        .mapWhile((n) => Option.Some(n))
      expect(it.intoArray()).to.eql([1, 2, 3])
    })

    it('returns mapped values when fn returns some', () => {
      const it = iter([1, 2, 3])
        .mapWhile((n) => Option.Some(n.toString()))
      expect(it.intoArray()).to.eql(['1', '2', '3'])
    })

    it('stops iterating when function returns none', () => {
      const it = iter([1, 2, 3, 4, 5])
        .mapWhile((n) => Option.Some(n).filter(n => n <= 3))
      expect(it.intoArray()).to.eql([1, 2, 3])
    })

    it('stops consuming iterator when function returns none', () => {
      const it = iter([1, 2, 3, 4, 5]);
      it.mapWhile((n) => Option.Some(n).filter(n => n <= 3)).intoArray()
      expect(it.count()).to.eql(1)
    })
  })

  // describe.skip('#max', () => {})
  describe('#maxBy', () => {
    it('returns none for empty iter', () => {
      const empty = iter<number>([]).maxBy(() => expect.fail('should not be called'))
      expect(empty.isNone()).to.eql(true)
    })

    it('returns some with the element when only one element', () => {
      const one = iter<number>([123]).maxBy((n) => n)
      expect(one.unwrap()).to.eql(123)
    })

    it('returns some with the bigger when 2 elements and bigger is first', () => {
      const max = iter<number>([100, 1]).maxBy((n) => n)
      expect(max.unwrap()).to.eql(100)
    })

    it('returns some with the bigger when 2 elements and bigger is second', () => {
      const max = iter<number>([1, 100]).maxBy((n) => n)
      expect(max.unwrap()).to.eql(100)
    })

    it('returns some with the bigger in a collection', () => {
      const max = iter<number>([1, 2, 3, 4, 100, 5, 6, 99]).maxBy((n) => n)
      expect(max.unwrap()).to.eql(100)
    })

    it('returns the bigger according to the mapping', () => {
      const max = iter<number>([1, 2, 3, 4, 100, 5, 6, 99]).maxBy(
        (n) => 100 - n
      )
      expect(max.unwrap()).to.eql(1)
    })

    it('when more than one element have the same mapping returns the first', () => {
      const max = iter<number>([1, 2, 99, 3, 199, 599, 6, 5]).maxBy(
        (n) => n % 100
      )
      expect(max.unwrap()).to.eql(99)
    })
  })

  describe('#maxWith', () => {
    it('returns none for empty iter', () => {
      const empty = iter<number>([]).maxWith(() => expect.fail('should not be called'))
      expect(empty.isNone()).to.eql(true)
    })

    it('returns only element when 1 sized iter', () => {
      const elem = iter([123]).maxWith(() => expect.fail('should not be called'))
      expect(elem.unwrap()).to.eql(123)
    })

    it('when the compare fn returns always 0 it returns first element', () => {
      const elem = iter([123, 2, 3, 4, 5, 6, 600, -100]).maxWith(() => 0)
      expect(elem.unwrap()).to.eql(123)
    })

    it('when the compare fn returns always positive it returns first element', () => {
      const elem = iter([123, 2, 3, 4, 5, 6, 600, -100]).maxWith(() => 100)
      expect(elem.unwrap()).to.eql(123)
    })

    it('when the compare fn returns always negative it returns last element', () => {
      const elem = iter([123, 2, 3, 4, 5, 6, 600, -1]).maxWith(() => -1)
      expect(elem.unwrap()).to.eql(-1)
    })

    it('when multiple elems return the element that is bigger or equal in compare fn', () => {
      const elem = iter([10, 1, -99, 100, 7, 44, 1.2])
        .maxWith((a, b) => a.toString().length - b.toString().length)
      expect(elem.unwrap()).to.eql(-99)
    })
  })

  // describe.skip('#min', () => {})
  describe('#minBy', () => {
    it('returns none for empty iter', () => {
      const none = iter<number>([]).minBy(() => expect.fail('should not be called'))
      expect(none.isNone()).to.eql(true)
    })

    it('returns only element for 1 size iter', () => {
      const none = iter([123]).minBy(() => expect.fail('should not be called'))
      expect(none.unwrap()).to.eql(123)
    })

    it('returns element with lower mapping for a collection', () => {
      const min = iter(['123', '245', '1', '356']).minBy(s => Number(s))
      expect(min.unwrap()).to.eql('1')
    })

    it('returns element with lower mapping for a collection', () => {
      const min = iter(['123', '245', '1', '356']).minBy(s => Number(s))
      expect(min.unwrap()).to.eql('1')
    })
  })
  describe('#minWith', () => {
    it('returns none for empty iter', () => {
      const none = iter<number>([]).minWith(() => expect.fail('should not be called'))
      expect(none.isNone()).to.eql(true)
    })

    it('returns minimum for a collection', () => {
      const none = iter([111, 123, 1, -1.123, 444])
        .minWith((a, b) => a.toString().length - b.toString().length)
      expect(none.unwrap()).to.eql(1)
    })
  })

  describe('#partition', () => {
    it('returns empty lists for empty iter', () => {
      const [withTrue, withFalse] = iter<number>([]).partition(() => false)
      expect(withTrue).to.eql([])
      expect(withFalse).to.eql([])
    })

    it('the list returned has all the values that returned true, and the seconds the ones that returned false', () => {
      const [withTrue, withFalse] = iter<number>([1, 2, 3, 4, 5, 6, 7, 8])
        .partition((n) => n % 2 === 0)
      expect(withTrue).to.eql([2, 4, 6, 8])
      expect(withFalse).to.eql([1, 3, 5, 7])
    })
  })

  describe('#positionOf', () => {
    it('returns None for empty iter', () => {
      const none = iter<number>([]).positionOf(123)
      expect(none.isNone()).to.eql(true)
    })

    it('returns index of element matching', () => {
      const none = iter<number>([11, -23, 50, 44, -10]).positionOf(50)
      expect(none.unwrap()).to.eql(2)
    })

    it('returns none if element does not exists', () => {
      const none = iter<number>([11, -23, 50, 44, -10]).positionOf(123)
      expect(none.isNone()).to.eql(true)
    })

    it('when element is more than once returns first appearance', () => {
      const none = iter<number>([11, -23, 50, 44, -23, -10]).positionOf(-23)
      expect(none.unwrap()).to.eql(1)
    })
  })

  // Implementing rev is hard, because require making assumptions over the base iteratos
  describe.skip('#rev', () => {
  })

  // Implementing peek is hard, because require making assumptions over the base iteratos
  // Note: I'm not going to implement peek at this time. I believe it adds confusion to when
  // the iteration happens. If requestes I might add it. Adding it also involves changing
  // several other implementations that should use it if exists
  describe.skip('#peek', () => {
  })

  describe('#rFindIndex', () => {
    it('finds the first occurrence from the right', () => {
      const it = iter<number>([1, 2, 4, 1, 5, 6, 1, 7])
      const res = it.rFindIndex(n => n == 1)
      expect(res.unwrap()).to.eql(6)
    })

    it('returns none when no element matches the condition', () => {
      const it = iter<number>([1, 2, 4, 1, 5, 6, 1, 7])
      const res = it.rFindIndex(n => n == 11)
      expect(res).to.eql(Option.None())
    })

    it('consumes the entire iterator', () => {
      const it = iter<number>([1, 2, 3])
      it.rFindIndex(n => n == 2)
      expect(it.next()).to.eql(Option.None())
    })
  })

  describe('#rPositionOf', () => {
    it('finds the first occurrence from the right', () => {
      const it = iter<number>([1, 2, 4, 1, 5, 6, 1, 7])
      const res = it.rPositionOf(n => n == 1)
      expect(res.unwrap()).to.eql(6)
    })

    it('returns none when no element matches the condition', () => {
      const it = iter<number>([1, 2, 4, 1, 5, 6, 1, 7])
      const res = it.rPositionOf(n => n == 11)
      expect(res).to.eql(Option.None())
    })

    it('consumes the entire iterator', () => {
      const it = iter<number>([1, 2, 3])
      it.rPositionOf(n => n == 2)
      expect(it.next()).to.eql(Option.None())
    })
  })

  describe('#rFind', () => {
    it('returns none when element is not present', () => {
      const found = iter([1, 2, 3]).rFind(n => n === 10)
      expect(found.isNone()).to.eql(true)
    })

    it('returns some with the element when the element is present', () => {
      const obj1 = { foo: 1 }
      const obj2 = { foo: 2 }
      const obj3 = { foo: 3 }
      const found = iter([obj1, obj2, obj3]).rFind(o => o.foo === 2)
      expect(found.unwrap()).to.equal(obj2)
    })
  })

  describe('#last', () => {
    it('returns none for empty', () => {
      const last = iter([]).last()
      expect(last.isNone()).to.eql(true)
    })

    it('returns last element for iterator with elements', () => {
      const last = iter([1, 2, 3]).last()
      expect(last.unwrap()).to.eql(3)
    })

    it('consumes the iterator', () => {
      const it = iter([1, 2, 3])
      it.last()
      expect(it.next().isNone()).to.eql(true)
    })
  })

  describe('collect into map', () => {
    it('collects a map from a list of tuples', () => {
      const it = iter<[string, number]>([["foo", 10], ["bar", 12]])
      const map = it.collect(new MapCollector())
      expect(map.size).to.eql(2)
      expect(map.get('foo')).to.eql(10)
      expect(map.get('bar')).to.eql(12)
    })
  })
  describe('collect into set', () => {
    it('collects into a set removing duplicated items', () => {
      const it = iter([1, 2, 3, 1, 2])
      const set = it.intoSet()
      expect(set.size).to.eql(3)
      expect(set.has(1)).to.eql(true)
      expect(set.has(2)).to.eql(true)
      expect(set.has(3)).to.eql(true)
    })
  })

  describe('collect into orderedList', () => {
    it('returns a list ordered by default js criteria', () => {
      const it = iter([5, 1, 2, 4, 3])
      const sorted = it.intoSortedArray()
      expect(sorted).to.eql([1, 2, 3, 4, 5])
    })
  })

  describe('collect into orderedListBy', () => {
    it('returns a list ordered by default js criteria', () => {
      const elem1 = { foo: 1 }
      const elem2 = { foo: -1 }
      const elem3 = { foo: 5 }
      const it = iter([elem1, elem2, elem3])
      const sorted = it.intoSortedByArray(elem => elem.foo)
      expect(sorted).to.eql([elem2, elem1, elem3])
    })
  })

  describe('collect into orderedListWith', () => {
    it('returns a list using custom criteria', () => {
      const it = iter(['foo', 'f', 'fo', 'foob', 'foobar', 'fooba'])
      const sorted = it.intoSortedWithArray((s1, s2) => s2.length - s1.length)
      expect(sorted).to.eql(['f', 'fo', 'foo', 'foob', 'fooba', 'foobar'].reverse())
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

  describe('#estimateLength', () => {
    it('returns 0 for empty array', () => {
      const it = iter([])
      expect(it.estimateLength().unwrap()).to.eql(0)
    })

    it('returns 1 for array with 1 element', () => {
      const it = iter([132])
      expect(it.estimateLength().unwrap()).to.eql(1)
    })

    it('returns 0 for consumed iterator', () => {
      const it = iter([132])
      it.next()
      expect(it.estimateLength().unwrap()).to.eql(0)
    })

    it('returns array length for mapped iterator', () => {
      const it = iter([1, 2, 3]).map(n => n * 2)
      expect(it.estimateLength().unwrap()).to.eql(3)
    })

    it('returns array length for filtered iterator', () => {
      const it = iter([1, 2, 3]).filter(n => n % 2 === 0)
      expect(it.estimateLength().unwrap()).to.eql(3)
    })
  })

  describe('#nextBack', () => {
    it('returns last element', () => {
      const it = iter([1, 2, 3])
      expect(it.nextBack().unwrap()).to.eql(3)
    })

    it('returns all elements from last to first', () => {
      const it = iter([1, 2, 3])
      expect(it.nextBack().unwrap()).to.eql(3)
      expect(it.nextBack().unwrap()).to.eql(2)
      expect(it.nextBack().unwrap()).to.eql(1)
    })

    it('returns None for empty iterator', () => {
      const it = iter([])
      expect(it.nextBack().isNone()).to.eql(true)
    })

    it('does not overlap with items that were already consumed by next', () => {
      const it = iter([1, 2, 3])
      it.next()
      expect(it.nextBack().unwrap()).to.eql(3)
      expect(it.nextBack().unwrap()).to.eql(2)
      expect(it.nextBack().isNone()).to.eql(true)
    })
  })

  describe('#netBackInternal', () => {
    it('returns last element', () => {
      const it = iter([1, 2, 3])
      expect(it.internalNextBack()).to.eql(3)
    })

    it('returns all elements from last to first', () => {
      const it = iter([1, 2, 3])
      expect(it.internalNextBack()).to.eql(3)
      expect(it.internalNextBack()).to.eql(2)
      expect(it.internalNextBack()).to.eql(1)
    })

    it('returns None for empty iterator', () => {
      const it = iter([])
      expect(it.internalNextBack()).to.eql(END)
    })

    it('does not overlap with items that were already consumed by next', () => {
      const it = iter([1, 2, 3])
      it.next()
      expect(it.internalNextBack()).to.eql(3)
      expect(it.internalNextBack()).to.eql(2)
      expect(it.internalNextBack()).to.eql(END)
    })
  })

  describe('#rev', () => {
    it('rev of empty returns empty', () => {
      const it = iter([])
      const rev = it.rev()
      expect(rev.next().isNone()).to.eql(true)
    })

    it('rev of list iters list backwards', () => {
      const it = iter([1, 2, 3])
      const rev = it.rev()
      expect(rev.intoArray()).to.eql([3, 2, 1])
    })
  })
})
