/* benchmark.js */
import * as b from 'benny'
import _ from 'lodash'
import {pipe} from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'
import '../src/index.js'

const numbers = _.range(100)

await b.suite(
    'Map and filter 100 numbers',
    b.add('Native', () => {
        const mapped = numbers
            .map(n => n * 3)
            .filter(n => n % 2 === 0)
    }),

    b.add('lodash', () => {
        _.chain(numbers)
            .map(n => n * 3)
            .filter(n => n % 2 === 0)
            .value()
    }),

    b.add('fp-ts', () => {
        pipe(
            numbers,
            A.map(n => n * 3),
            A.filter(n => n % 2 === 0),
        )
    }),

    b.add('iterame', () => {
        const iter = numbers.iter()
            .map(n => n * 3)
            .filter(n => n % 2 === 0)
            .intoArray()
    }),

    b.cycle(),
    b.complete()
    // b.save({ file: 'reduce', version: '1.0.0' }),
    // b.save({ file: 'reduce', format: 'chart.html' }),
)
