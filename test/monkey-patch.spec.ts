import {describe, it} from "mocha";
import {expect} from "chai";
import '../src/index.js'

describe('Array monkey patch', () => {
  it('monkeypatches the array class', () => {
    const iter = [1, 2, 3].iter().filter(n => n % 2 === 1).map(n => n * 2)
    expect([...iter]).to.eql([2, 6])
  })
})

describe('Map monkey patch', () => {
  it('adds iterKeys method', () => {
    const map = new Map([['foo', 1], ['bar', 2]])
    const iter = map.iterKeys()
    expect(iter.intoArray()).to.have.members(['foo', 'bar'])
  })

  it('adds iterValues method', () => {
    const map = new Map([['foo', 1], ['bar', 2]])
    const iter = map.iterValues()
    expect(iter.intoArray()).to.have.members([1, 2])
  })

  it('adds iterEntries method', () => {
    const map = new Map([['foo', 1], ['bar', 2]])
    const iter = map.iterEntries()

    let count = 0
    for (const [key, value] of iter) {
      count += 1
      if (key === 'foo') {
        expect(value).to.eql(1)
      } else if (key === 'bar') {
        expect(value).to.eql(2)
      } else {
        expect.fail('unknown key')
      }
    }

    expect(count).to.eql(2)
  })
});
