/**
 * @typedef {import('tape').Test} Test
 * @typedef {import('./index.js').Filter} Filter
 * @typedef {import('./index.js').Lookup} Lookup
 */

import test from 'tape'
import chalk from 'chalk'
import {basicFilter, extendedFilter, lookup} from './index.js'

test('basicFilter(tags[, ranges="*"])', function (t) {
  /** @type {Array<[string|string[], string|string[]|undefined, unknown]>} */
  const basics = [
    ['de-de', undefined, ['de-de']],
    ['de-de', '*', ['de-de']],
    ['de-DE', '*', ['de-DE']],
    ['de-DE-1996', '*', ['de-DE-1996']],
    ['de-Deva', '*', ['de-Deva']],
    ['de-Latn-DE', '*', ['de-Latn-DE']],
    ['de', 'de', ['de']],
    ['DE', 'de', ['DE']],
    ['de', 'de', ['de']],
    ['de-DE', 'de', ['de-DE']],
    ['DE-DE', 'de', ['DE-DE']],
    ['de-de', 'de-de', ['de-de']],
    ['de-DE', 'de-de', ['de-DE']],
    ['de-de', 'de-DE', ['de-de']],
    ['de-DE-1996', 'de-de', ['de-DE-1996']],
    ['de-Deva', 'de-de', []],
    ['de-Latn-DE', 'de-de', []],
    ['en', 'de-de', []],
    ['en', 'de', []],
    ['de-CH-1996', 'de-CH', ['de-CH-1996']],
    ['nb', 'no', []],
    ['zh-Hans', 'zh-CN', []],
    [['de-de', 'de', 'en-GB', 'en'], 'de', ['de-de', 'de']],
    [['de-de', 'de', 'en-GB', 'en'], 'en', ['en-GB', 'en']],
    [
      ['de-de', 'de', 'en-GB', 'en'],
      ['de', 'en'],
      ['de-de', 'de', 'en-GB', 'en']
    ],
    [
      ['de-de', 'de', 'en-GB', 'en'],
      ['en', 'de'],
      ['en-GB', 'en', 'de-de', 'de']
    ],
    [
      ['de-de', 'de', 'en-GB', 'en'],
      ['en-gb', 'de-de'],
      ['en-GB', 'de-de']
    ],
    [
      ['de-de', 'de', 'en-GB', 'en'],
      ['de-de', 'de'],
      ['de-de', 'de']
    ]
  ]
  let index = -1

  while (++index < basics.length) {
    check(t, basicFilter, basics[index])
  }

  t.throws(
    function () {
      // @ts-expect-error runtime
      basicFilter()
    },
    /^Error: Invalid tag `undefined`, expected non-empty string$/,
    'should throw without tag'
  )

  t.throws(
    function () {
      basicFilter('')
    },
    /^Error: Invalid tag ``, expected non-empty string$/,
    'should throw with empty string tag'
  )

  t.throws(
    function () {
      // @ts-expect-error runtime
      basicFilter(1)
    },
    /^Error: Invalid tag `1`, expected non-empty string$/,
    'should throw with invalid tag'
  )

  t.end()
})

test('extendedFilter(tags[, ranges="*""])', function (t) {
  /** @type {Array<[string|string[], string|string[]|undefined, unknown]>} */
  const extendeds = [
    ['de-de', undefined, ['de-de']],
    ['de-de', '*', ['de-de']],
    ['de-DE', '*', ['de-DE']],
    ['de-Latn-DE', '*', ['de-Latn-DE']],
    ['de-Latf-DE', '*', ['de-Latf-DE']],
    ['de-DE-x-goethe', '*', ['de-DE-x-goethe']],
    ['de-Latn-DE-1996', '*', ['de-Latn-DE-1996']],
    ['de-Deva-DE', '*', ['de-Deva-DE']],
    ['de', '*', ['de']],
    ['de-x-DE', '*', ['de-x-DE']],
    ['de-Deva', '*', ['de-Deva']],
    ['de-DE', 'de-DE', ['de-DE']],
    ['de-de', 'de-DE', ['de-de']],
    ['de-Latn-DE', 'de-DE', ['de-Latn-DE']],
    ['de-Latf-DE', 'de-DE', ['de-Latf-DE']],
    ['de-DE-x-goethe', 'de-DE', ['de-DE-x-goethe']],
    ['de-Latn-DE-1996', 'de-DE', ['de-Latn-DE-1996']],
    ['de-Deva-DE', 'de-DE', ['de-Deva-DE']],
    ['de', 'de-DE', []],
    ['de-x-DE', 'de-DE', []],
    ['de-Deva', 'de-DE', []],
    ['en', 'de-de', []],
    ['en', 'de', []],
    ['de-CH-1996', 'de-CH', ['de-CH-1996']],
    ['nb', 'no', []],
    ['zh-Hans', 'zh-CN', []],
    ['de-DE', 'de-*-DE', ['de-DE']],
    ['de-de', 'de-*-DE', ['de-de']],
    ['de-Latn-DE', 'de-*-DE', ['de-Latn-DE']],
    ['de-Latf-DE', 'de-*-DE', ['de-Latf-DE']],
    ['de-DE-x-goethe', 'de-*-DE', ['de-DE-x-goethe']],
    ['de-Latn-DE-1996', 'de-*-DE', ['de-Latn-DE-1996']],
    ['de-Deva-DE', 'de-*-DE', ['de-Deva-DE']],
    ['de', 'de-*-DE', []],
    ['de-x-DE', 'de-*-DE', []],
    ['de-Deva', 'de-*-DE', []],

    [['de-de', 'de', 'en-GB', 'en'], 'de', ['de-de', 'de']],
    [['de-de', 'de', 'en-GB', 'en'], 'en', ['en-GB', 'en']],
    [
      ['de-de', 'de', 'en-GB', 'en'],
      ['de', 'en'],
      ['de-de', 'de', 'en-GB', 'en']
    ],
    [
      ['de-de', 'de', 'en-GB', 'en'],
      ['en', 'de'],
      ['en-GB', 'en', 'de-de', 'de']
    ],
    [
      ['de-de', 'de', 'en-GB', 'en'],
      ['en-gb', 'de-de'],
      ['en-GB', 'de-de']
    ],
    [
      ['de-de', 'de', 'en-GB', 'en'],
      ['de-de', 'de'],
      ['de-de', 'de']
    ],
    [
      ['de', 'de-de', 'de-DE-x-goethe', 'de-Deva', 'de-Deva-DE', 'de-x-DE'],
      'de-*-DE',
      ['de-de', 'de-DE-x-goethe', 'de-Deva-DE']
    ]
  ]
  let index = -1

  while (++index < extendeds.length) {
    check(t, extendedFilter, extendeds[index])
  }

  t.throws(
    function () {
      // @ts-expect-error runtime
      extendedFilter()
    },
    /^Error: Invalid tag `undefined`, expected non-empty string$/,
    'should throw without tag'
  )

  t.throws(
    function () {
      extendedFilter('')
    },
    /^Error: Invalid tag ``, expected non-empty string$/,
    'should throw with empty string tag'
  )

  t.throws(
    function () {
      // @ts-expect-error runtime
      extendedFilter(1)
    },
    /^Error: Invalid tag `1`, expected non-empty string$/,
    'should throw with invalid tag'
  )

  t.end()
})

test('lookup(tags[, ranges="*"])', function (t) {
  /** @type {Array<[string|string[], string|string[]|undefined, unknown]>} */
  const lookups = [
    // Wildcards have no effect in `lookup`
    ['de-de', undefined, undefined],
    ['de-de', '*', undefined],
    ['de-DE', '*', undefined],
    ['en-GB', 'de-ch', undefined],
    [['en-GB', 'de-CH-1996'], 'de-ch', undefined],
    [['en-GB', 'de-CH'], 'de-ch', 'de-CH'],
    [['en-GB', 'de'], 'de-ch', 'de'],
    [['de-CH', 'fr-CH', 'it-CH'], '*-CH', 'de-CH'],
    [['en-GB', 'en', 'ja-JP', 'ja'], ['fr-FR', 'zh-Hant'], undefined],
    [
      ['en-GB', 'en', 'zh-Hans', 'zh-Hant', 'zh'],
      ['fr-FR', 'zh-Hant'],
      'zh-Hant'
    ],
    [
      ['en-GB', 'en', 'zh-Hans', 'zh-Hant', 'zh', 'fr'],
      ['fr-FR', 'zh-Hant'],
      'fr'
    ],
    [
      ['en-GB', 'en', 'zh-Hans', 'zh-Hant', 'zh', 'fr'],
      ['zh-Hant', 'fr-FR'],
      'zh-Hant'
    ],
    [
      ['en-GB', 'en', 'zh-Hans', 'zh-Hant', 'zh'],
      'zh-Hant-CN-x-private1-private2',
      'zh-Hant'
    ]
  ]
  let index = -1

  while (++index < lookups.length) {
    check(t, lookup, lookups[index])
  }

  t.end()
})

/**
 * @param {Test} t
 * @param {Filter|Lookup} fn
 * @param {[string|string[], string|string[]|undefined, unknown]} options
 */
function check(t, fn, options) {
  t.deepEqual(
    fn(options[0], options[1]),
    options[2],
    'f(' +
      options[0] +
      '; ' +
      chalk.bold.green(options[1]) +
      ') -> ' +
      chalk.bold(String(options[2]) || '[]')
  )
}
