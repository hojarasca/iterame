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

describe('monkeypatch set', () => {
  it('adds iter method', () => {
    const iter = new Set([1, 2, 3]).iter()
    expect(iter.intoArray()).to.have.members([1, 2, 3])
  })
});

describe('monkeypatch types arrays', () => {
  it('adds iter to Uint8Array', () => {
    const iter = new Uint8Array([1, 2, 3]).iter()
    expect(iter.intoArray()).to.eql([1, 2, 3])
  })

  it('adds iter to Uint16Array', () => {
    const iter = new Uint16Array([1, 2, 3]).iter()
    expect(iter.intoArray()).to.eql([1, 2, 3])
  })

  it('adds iter to Uint32Array', () => {
    const iter = new Uint32Array([1, 2, 3]).iter()
    expect(iter.intoArray()).to.eql([1, 2, 3])
  })

  it('adds iter to BigUint64Array', () => {
    const iter = new BigUint64Array([1n, 2n, 3n]).iter()
    expect(iter.intoArray()).to.eql([1n, 2n, 3n])
  })

  it('adds iter to Int8Array', () => {
    const iter = new Int8Array([1, 2, 3]).iter()
    expect(iter.intoArray()).to.eql([1, 2, 3])
  })


  it('adds iter to Int16Array', () => {
    const iter = new Int16Array([1, 2, 3]).iter()
    expect(iter.intoArray()).to.eql([1, 2, 3])
  })


  it('adds iter to Int32Array', () => {
    const iter = new Int32Array([1, 2, 3]).iter()
    expect(iter.intoArray()).to.eql([1, 2, 3])
  })

  it('adds iter to BigInt64Array', () => {
    const iter = new BigInt64Array([1n, 2n, 3n]).iter()
    expect(iter.intoArray()).to.eql([1n, 2n, 3n])
  })

  it('adds iter to Float32Array', () => {
    const iter = new Float32Array([1.1, 2.2, 3.3])
      .iter()
      .map(f => f.toFixed(2))
    const expected = [1.1, 2.2, 3.3].map(f => f.toFixed(2));
    expect(iter.intoArray()).to.eql(expected)
  })

  it('adds iter to Float64Array', () => {
    const iter = new Float64Array([1.1, 2.2, 3.3])
      .iter()
      .map(f => f.toFixed(2))
    const expected = [1.1, 2.2, 3.3].map(f => f.toFixed(2));
    expect(iter.intoArray()).to.eql(expected)
  })

  it('adds iter to Buffer', () => {
    // Buffer is not exactly a typed array, but I'm adding it here because it extends Uint8Array
    const iter = Buffer.from([1, 2, 3]).iter()
    const expected = [1, 2, 3]
    expect(iter.intoArray()).to.eql(expected)
  })
});

describe('ArrayBuffer monkeypatch', () => {
  it('adds iter method', () => {
    const buf = new Uint8Array([1, 2, 3]).buffer
    const iter = buf.iter()
    expect(iter.intoArray()).to.eql([1, 2, 3])
  })
})
