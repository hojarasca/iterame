import {describe, it} from "mocha";
import {expect} from "chai";
import '../src/index.js'

describe('Array monkey patch', () => {
  it('monkeypatches the array class', () => {
    const iter = [1, 2, 3].iter().filter(n => n % 2 === 1).map(n => n * 2)
    expect([...iter]).to.eql([2, 6])
  })
})
