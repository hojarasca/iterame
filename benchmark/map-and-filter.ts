/* benchmark.js */
import * as b from 'benny'
import _ from 'lodash'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'
import '../src/index.js'

const numbers = _.range(0, 100)

await b.suite(
  'Map and filter 100 numbers',



  b.add('Native', () => {
    numbers.map(n => n * 3).filter(n => n % 2 === 0).reduce((a, b) => a + b)
  }),

  b.add('lodash', () => {
    const mapped = _.map(numbers, n => n * 3)
    const filtered = _.filter(mapped, n => n % 2 === 0)
    _.reduce(filtered, (a, b) => a + b)
  }),

  b.add('fp-ts', () => {
    pipe(
      numbers,
      A.map(n => n * 3),
      A.filter(n => n % 2 === 0),
      A.reduce(0,(a, b) => a + b)
    )
  }),

  b.add('iterame', () => {
    numbers.iter()
      .map(n => n * 3)
      .filter(n => n % 2 === 0)
      .reduce((a, b) => a + b)
      .toArray()
  }),

  b.cycle(),
  b.complete()
  // b.save({ file: 'reduce', version: '1.0.0' }),
  // b.save({ file: 'reduce', format: 'chart.html' }),
)
