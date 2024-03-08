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
            .map(n => n * 3)
            .map(n => n * 3)
            .map(n => n * 3)
            .map(n => n * 3)
        const filtered = mapped.filter(n => n % 2 === 0)
        filtered.reduce((a, b) => a + b)
    }),

    b.add('lodash', () => {
        const list = _.chain(numbers)
            .map(n => n * 3)
            .map(n => n * 3)
            .map(n => n * 3)
            .map(n => n * 3)
            .map(n => n * 3)
            .filter(n => n % 2 === 0)
        list.reduce((a, b) => a + b).value()
    }),

    b.add('fp-ts', () => {
        pipe(
            numbers,
            A.map(n => n * 3),
            A.map(n => n * 3),
            A.map(n => n * 3),
            A.map(n => n * 3),
            A.map(n => n * 3),
            A.filter(n => n % 2 === 0),
            A.reduce(0, (a, b) => a + b)
        )
    }),

    b.add('iterame', () => {
        const iter = numbers.iter()
            .map(n => n * 3)
            .map(n => n * 3)
            .map(n => n * 3)
            .map(n => n * 3)
            .map(n => n * 3)
            .filter(n => n % 2 === 0)
            .reduce((a, b) => a + b)
        iter.unwrap()
    }),

    b.cycle(),
    b.complete()
    // b.save({ file: 'reduce', version: '1.0.0' }),
    // b.save({ file: 'reduce', format: 'chart.html' }),
)
