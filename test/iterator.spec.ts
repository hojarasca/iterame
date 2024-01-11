import {describe, it} from "mocha";
import {expect} from "chai";
import '../src/index'
import {ArrayIterator, Iterator} from "../src/index.js";

describe('Iterator', () => {
  const iter = <T> (arr: T[]): Iterator<T> => {
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
      const target = iter([1, 2, 3]).drop(0)
      expect(target.toArray()).to.eql([1, 2, 3])
    })

    it('skip 1 ignores first element', () => {
      const target = iter([1, 2, 3]).drop(1)
      expect(target.toArray()).to.eql([2, 3])
    })

    it('skip 1 ignores for empty iterator returns empty iterator', () => {
      const target = iter([]).drop(1)
      expect(target.toArray()).to.eql([])
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

    it('when size is lower than the iterator length returns the first elements of the iterator', () => {
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

    it('when condition always fulfills take all the iterator', () => {
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

    it('when condition always fulfills take all the iterator', () => {
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

    it('when elements appear in different moments only the first instance is shown', () => {
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

  describe('#dedupBy', () => {
    it('returns none for empty iterator', () => {
      const it = iter<number>([]).dedupBy(() => 10)
      expect(it.toArray()).to.eql([])
    })

    it('groups of 2 that ar mapped to the same value are reduced the first one', () => {
      const it = iter([1, '1', 2, '2', 3, '3']).dedupBy(t => t.toString())
      expect(it.toArray()).to.eql([1, 2, 3])
    })

    it('when elements that map to the same value are dispersed the first occurrence survives', () => {
      const it = iter([1, '2', 3, 1, '1', 2, '2', 1]).dedupBy(t => t.toString())
      expect(it.toArray()).to.eql([1, '2', 3])
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
      expect(it.toArray()).to.eql([1, 2])
    })
  })

  describe('#stepBy', () => {
    it('returns odd position when size is 2', () => {
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

  describe('#intersperse', () => {
    it('returns empty for empty iterator', () => {
      const it = iter<number>([]).interspace(0)
      expect(it.next().isNone()).to.eql(true)
    })

    it('in a 2 elem iterator puts 1 instance of the separator in the middle', () => {
      const it = iter<number>([1, 2]).interspace(100)
      expect(it.toArray()).to.eql([1, 100, 2])
    })

    it('in a 3 elem iterator puts separator in the middle after first and after second elem', () => {
      const it = iter<number>([1, 2, 3]).interspace(100)
      expect(it.toArray()).to.eql([1, 100, 2, 100, 3])
    })

    it('in a 1 elem iterator no separator', () => {
      const it = iter<number>([1]).interspace(100)
      expect(it.toArray()).to.eql([1])
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
      expect(it.toArray()).to.eql([2, 3, 4])
    })

    it('when the function returns an iter it returns those elements in order', () => {
      const it = iter<number>([1]).flatMap((_) => iter([2, 3, 4]))
      expect(it.toArray()).to.eql([2, 3, 4])
    })

    it('when the function returns empty array for some elements they get ignored', () => {
      const it = iter<number>([0, 1, 2, 3, 4, 5, 6])
        .flatMap((n) => n % 3 === 0 ? [n] : [])
      expect(it.toArray()).to.eql([0, 3, 6])
    })

    it('when the function returns list of lists it flattens only once', () => {
      const it = iter<number>([0, 1, 2])
        .flatMap((n) => [[n]])
      expect(it.toArray()).to.eql([[0], [1], [2]])
    })
  })

  describe('#flatten', () => {
    it('returns empty iter for empty iter', () => {
      const it = iter<number[]>([]).flatten()
      expect(it.next().isNone()).to.eql(true)
    })

    it('flattens a list of size 1', () => {
      const it = iter([[1]]).flatten()
      expect(it.toArray()).to.eql([1])
    })

    it('flattens a list of one iterator', () => {
      const it = iter([iter([1])]).flatten()
      expect(it.toArray()).to.eql([1])
    })

    it('does nothing with a list of plain objects', () => {
      const it = iter([1, 2, 3]).flatten()
      expect(it.toArray()).to.eql([1, 2, 3])
    })
  })

  describe('#select', () => {
    it('works as filter', () => {
      const it = iter([0, 1, 2, 3]).select(n => n % 2 === 0)
      expect(it.toArray()).to.eql([0, 2])
    })
  })

  describe('#reject', () => {
    it('returns elements that make the predicate false', () => {
      const it = iter([0, 1, 2, 3]).reject(n => n % 2 === 0)
      expect(it.toArray()).to.eql([1, 3])
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
      let calls: number[][] = []
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
      let empty = iter<number>([]).cycle()
      expect(empty.next().isNone()).to.eql(true)
    })

    it('the same element over and over for a 1 element iter', () => {
      let empty = iter<number>([123]).cycle()
      expect(empty.next().unwrap()).to.eql(123)
      expect(empty.next().unwrap()).to.eql(123)
      expect(empty.next().unwrap()).to.eql(123)
      expect(empty.next().unwrap()).to.eql(123)
      expect(empty.next().unwrap()).to.eql(123)
      expect(empty.next().unwrap()).to.eql(123)
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
      iter([1, 2, 3]).inspect(fn).toArray()
      expect(elems).to.eql([1, 2, 3])
    })

    it('does not affected the items of the iterator', () => {
      const fn = (_n: number) => {}
      const it = iter([1, 2, 3]).inspect(fn)
      expect(it.toArray()).to.eql([1, 2, 3])
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
      expect(it.toArray()).to.eql([
        [0, 'first'],
        [1, 'second'],
        [2, 'third'],
      ])
    })

    it('when enumerated and then filtered, the original indexes get conserved', () => {
      const it = iter(['first', 'second', 'third'])
        .enumerate()
        .filter(([_, s]) => s !== 'second')

      expect(it.toArray()).to.eql([
        [0, 'first'],
        [2, 'third'],
      ])
    })

    it('uses indexes for when enumerated was called', () => {
      const it = iter(['first', 'second', 'third'])
        .filter(s => s !== 'second') // first remove some elems
        .enumerate()

      expect(it.toArray()).to.eql([
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
      expect(zip.toArray()).to.eql([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ])
    })

    it('when first iterator is shorter it limits the size of the zipped', () => {
      const it1 = iter<number>([1, 2])
      const it2 = iter<string>(['one', 'two', 'three'])
      const zip = it1.zip(it2)
      expect(zip.toArray()).to.eql([
        [1, 'one'],
        [2, 'two']
      ])
    })

    it('when second iterator is shorter it limits the size of the zipped', () => {
      const it1 = iter<number>([1, 2, 3])
      const it2 = iter<string>(['one', 'two'])
      const zip = it1.zip(it2)
      expect(zip.toArray()).to.eql([
        [1, 'one'],
        [2, 'two']
      ])
    })
  })

  describe.skip('#equals', () => {
    it('returns true for 2 empty iters', () => {
      const it1 = iter<number>([])
      const it2 = iter<number>([])
      expect(it1.equals(it2)).to.eql(true)
    })

  })
  describe.skip('#equalsBy', () => {

  })
  describe.skip('#equalsWith', () => {

  })
  describe.skip('#filterMap', () => {
  })
  describe.skip('#find', () => {
  })
  describe.skip('#findIndex', () => {
  })
  describe.skip('#intersperseWith', () => {
  })
  describe.skip('#intersperseWith', () => {
  })
  describe.skip('#mapWhile', () => {
  })
  // describe.skip('#max', () => {})
  describe.skip('#maxBy', () => {
  })
  describe.skip('#maxWith', () => {
  })
  // describe.skip('#min', () => {})
  describe.skip('#minWith', () => {
  })
  describe.skip('#partition', () => {
  })
  describe.skip('#findIndex', () => {
  })
  describe.skip('#positionOf', () => {
  })
  describe.skip('#rev', () => {
  })
  describe.skip('#peek', () => {
  })
  describe.skip('#rFindIndex', () => {
  })
  describe.skip('#rPositionOf', () => {
  })
  describe.skip('#rPositionOf', () => {
  })


  describe.skip('collect into map', () => {
  })
  describe.skip('collect into set', () => {
  })
  describe.skip('collect into orderedList', () => {
  })
  describe.skip('collect into orderedListBy', () => {
  })
  describe.skip('collect into orderedListWith', () => {
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
})
