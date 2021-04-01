<!--lint disable no-html-->

# bcp-47-match

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Match [BCP 47][spec] language tags with “language ranges” per [RFC 4647][match],
as done by the `:lang()` pseudo-class in CSS, or the `Accept-Language` HTTP
header.

Related to [`bcp-47`][bcp47].

## Contents

*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`basicFilter(tags[, ranges='*'])`](#basicfiltertags-ranges)
    *   [`extendedFilter(tags[, ranges='*'])`](#extendedfiltertags-ranges)
    *   [`lookup(tags, ranges)`](#lookuptags-ranges)
*   [Related](#related)
*   [License](#license)

## Install

This package is ESM only: Node 12+ is needed to use it and it must be `import`ed
instead of `require`d.

[npm][]:

```sh
npm install bcp-47-match
```

## Use

```js
import {basicFilter, extendedFilter, lookup} from 'bcp-47-match'

var tags = ['en-GB', 'de-CH', 'en', 'de']

console.log(basicFilter(tags, '*')) // => [ 'en-GB', 'de-CH', 'en', 'de' ]
console.log(basicFilter(tags, 'en')) // => [ 'en-GB', 'en' ]
console.log(basicFilter(tags, 'en-GB')) // => [ 'en-GB' ]
console.log(basicFilter(tags, ['en-GB', 'en'])) // => [ 'en-GB', 'en' ]
console.log(basicFilter(tags, 'jp')) // => []

console.log(extendedFilter(tags, '*')) // => [ 'en-GB', 'de-CH', 'en', 'de' ]
console.log(extendedFilter(tags, 'en')) // => [ 'en-GB', 'en' ]
console.log(extendedFilter(tags, 'en-GB')) // => [ 'en-GB' ]
console.log(extendedFilter(tags, '*-GB')) // => [ 'en-GB' ]
console.log(extendedFilter(tags, ['en-GB', 'en'])) // => [ 'en-GB', 'en' ]
console.log(extendedFilter(tags, 'jp')) // => []

console.log(lookup(tags, 'en')) // => 'en'
console.log(lookup(tags, 'en-GB')) // => 'en-GB'
console.log(lookup(tags, ['en-GB', 'en'])) // => 'en-GB'
console.log(lookup(tags, ['en', 'en-GB'])) // => 'en'
console.log(lookup(tags, 'jp')) // => undefined
```

## API

This package exports the following identifiers: `basicFilter`, `extendedFilter`,
`lookup`.
There is no default export.

### `basicFilter(tags[, ranges='*'])`

> [See Basic Filtering spec](https://tools.ietf.org/html/rfc4647#section-3.3.1)

Match language tags to a list of simple ranges.
Searches for matches between the first range and all tags, and continues
with further ranges.
Returns a list of matching tags in the order they matched.

<details><summary>View matching table</summary>

| Basic Filter | * | de | de-CH | de-DE | de-*-DE | *-CH |
| - | - | - | - | - | - | - |
| de | ✔︎ | ✔︎ | | | | |
| de-CH | ✔︎ | ✔︎ | ✔︎ | | | |
| de-CH-1996 | ✔︎ | ✔︎ | ✔︎ | | | |
| de-DE | ✔︎ | ✔︎ | | ✔︎ | | |
| de-DE-1996 | ✔︎ | ✔︎ | | ✔︎ | | |
| de-DE-x-goethe | ✔︎ | ✔︎ | | ✔︎ | | |
| de-Deva | ✔︎ | ✔︎ | | | | |
| de-Deva-DE | ✔︎ | ✔︎ | | | | |
| de-Latf-DE | ✔︎ | ✔︎ | | | | |
| de-Latn-DE | ✔︎ | ✔︎ | | | | |
| de-Latn-DE-1996 | ✔︎ | ✔︎ | | | | |
| de-x-DE | ✔︎ | ✔︎ | | | | |
| en | ✔︎ | | | | | |
| en-GB | ✔︎ | | | | | |
| zh | ✔︎ | | | | | |
| zh-Hans | ✔︎ | | | | | |
| zh-Hant | ✔︎ | | | | | |

</details>

###### Parameters

*   `tags` (`string` or `Array.<string>`) — List of BCP-47 tags
*   `ranges` (`string` or `Array.<string>`) — List of RFC 4647
    [basic ranges][basic-range]
    (aka, matching `/^(\*|[a-z]{1,8}(-[a-z0-9]{1,8})*)$/i`)

###### Returns

`Array.<string>` — Possibly empty list of matching tags in the order they
matched.

### `extendedFilter(tags[, ranges='*'])`

> [See Extended Filtering spec](https://tools.ietf.org/html/rfc4647#section-3.3.2)

Match language tags to a list of extended ranges.
Searches for matches between the first range and all tags, and continues
with further ranges.

<details><summary>View matching table</summary>

| Extended Filter | * | de | de-CH | de-DE | de-*-DE | *-CH |
| - | - | - | - | - | - | - |
| de | ✔︎ | ✔︎ | | | | |
| de-CH | ✔︎ | ✔︎ | ✔︎ | | | ✔︎ |
| de-CH-1996 | ✔︎ | ✔︎ | ✔︎ | | | ✔︎ |
| de-DE | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| de-DE-1996 | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| de-DE-x-goethe | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| de-Deva | ✔︎ | ✔︎ | | | | |
| de-Deva-DE | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| de-Latf-DE | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| de-Latn-DE | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| de-Latn-DE-1996 | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| de-x-DE | ✔︎ | ✔︎ | | | | |
| en | ✔︎ | | | | | |
| en-GB | ✔︎ | | | | | |
| zh | ✔︎ | | | | | |
| zh-Hans | ✔︎ | | | | | |
| zh-Hant | ✔︎ | | | | | |

</details>

###### Parameters

*   `tags` (`string` or `Array.<string>`) — List of BCP-47 tags
*   `ranges` (`string` or `Array.<string>`) — List of RFC 4647
    [extended ranges][extended-range]
    (aka, matching `/^(\*|[a-z]{1,8})(-(\*|[a-z0-9]{1,8}))*$/i`)

###### Returns

`Array.<string>` — Possibly empty list of matching tags in the order they
matched.

### `lookup(tags, ranges)`

> [See Lookup spec](https://tools.ietf.org/html/rfc4647#section-3.4)

Find the best language tag that matches a list of ranges.
Searches for a match between the first range and all tags, and continues
with further ranges.
Returns the first match, if any.

<details><summary>View matching table</summary>

| Lookup | * | de | de-CH | de-DE | de-*-DE | *-CH |
| - | - | - | - | - | - | - |
| de | | ✔︎︎ | ✔︎︎ | ✔︎ | ✔︎ | ✔︎ |
| de-CH | | | ✔︎ | | | ✔︎ |
| de-CH-1996 | | | | | | ✔︎ |
| de-DE | | | | ✔︎ | | ✔︎ |
| de-DE-1996 | | | | | | ✔︎ |
| de-DE-x-goethe | | | | | | ✔︎ |
| de-Deva | | | | | | ✔︎ |
| de-Deva-DE | | | | | | ✔︎ |
| de-Latf-DE | | | | | | ✔︎ |
| de-Latn-DE | | | | | | ✔︎ |
| de-Latn-DE-1996 | | | | | | ✔︎ |
| de-x-DE | | | | | | ✔︎ |
| en | | | | | | ✔︎ |
| en-GB | | | | | | ✔︎ |
| zh | | | | | | ✔︎ |
| zh-Hans | | | | | | ✔︎ |
| zh-Hant | | | | | | ✔︎ |

</details>

###### Parameters

*   `tags` (`string` or `Array.<string>`) — List of BCP-47 tags
*   `ranges` (`string` or `Array.<string>`) — List of RFC 4647 basic ranges
    (but `*` is ignored)

###### Returns

`string?` — The first matching tag in `tags`, or `undefined` otherwise.

## Related

*   [`bcp-47`](https://github.com/wooorm/bcp-47)
    — Parse and serialize BCP 47 language tags
*   [`bcp-47-normalize`](https://github.com/wooorm/bcp-47-normalize)
    — Normalize, canonicalize, and format BCP 47 tags
*   [`iso-3166`](https://github.com/wooorm/iso-3166)
    — ISO 3166 codes
*   [`iso-639-2`](https://github.com/wooorm/iso-639-2)
    — ISO 639-2 codes
*   [`iso-639-3`](https://github.com/wooorm/iso-639-3)
    — ISO 639-3 codes
*   [`iso-15924`](https://github.com/wooorm/iso-15924)
    — ISO 15924 codes
*   [`un-m49`](https://github.com/wooorm/un-m49)
    — UN M49 codes

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/wooorm/bcp-47-match/workflows/main/badge.svg

[build]: https://github.com/wooorm/bcp-47-match/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/bcp-47-match.svg

[coverage]: https://codecov.io/github/wooorm/bcp-47-match

[downloads-badge]: https://img.shields.io/npm/dm/bcp-47-match.svg

[downloads]: https://www.npmjs.com/package/bcp-47-match

[size-badge]: https://img.shields.io/bundlephobia/minzip/bcp-47-match.svg

[size]: https://bundlephobia.com/result?p=bcp-47-match

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[bcp47]: https://github.com/wooorm/bcp-47

[spec]: https://tools.ietf.org/html/bcp47

[match]: https://tools.ietf.org/html/rfc4647

[basic-range]: https://tools.ietf.org/html/rfc4647#section-2.1

[extended-range]: https://tools.ietf.org/html/rfc4647#section-2.2
