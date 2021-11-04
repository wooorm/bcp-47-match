/**
 * See <https://tools.ietf.org/html/rfc4647#section-3.1>
 * for more information on the algorithms.
 */

/**
 * @typedef {string} Tag
 * @typedef {Array<Tag>} Tags
 * @typedef {string} Range
 * @typedef {Array<Range>} Ranges
 */

/**
 * @callback Check
 * @param {Tag} tag
 * @param {Range} range
 * @returns {boolean}
 */

/**
 * @callback Filter
 * @param {Tag|Tags} tag
 * @param {Range|Ranges} [ranges]
 * @returns {Tag}
 */

/**
 * @callback Lookup
 * @param {Tag|Tags} tag
 * @param {Range|Ranges} [ranges]
 * @returns {Tag}
 */

/**
 * Factory to perform a filter or a lookup.
 * This factory creates a function that accepts a list of tags and a list of
 * ranges, and contains logic to exit early for lookups.
 * `check` just has to deal with one tag and one range.
 * This match function iterates over ranges, and for each range,
 * iterates over tags.  That way, earlier ranges matching any tag have
 * precedence over later ranges.
 *
 * @type {{
 *   (check: Check, filter: true): Filter
 *   (check: Check, filter?: false): Lookup
 * }}
 */
// prettier-ignore
const factory = (
  /**
   * @param {Check} check
   * @param {boolean} [filter=false]
   */
  function (check, filter) {
    return match

    /**
     * @param {Tag|Tags} tags
     * @param {Range|Ranges} [ranges='*']
     * @returns {Tag|Tags|undefined}
     */
    function match(tags, ranges) {
      let left = cast(tags, 'tag')
      const right = cast(
        ranges === null || ranges === undefined ? '*' : ranges,
        'range'
      )
      /** @type {Tags} */
      const matches = []
      let rightIndex = -1

      while (++rightIndex < right.length) {
        const range = right[rightIndex].toLowerCase()

        // Ignore wildcards in lookup mode.
        if (!filter && range === '*') continue

        let leftIndex = -1
        /** @type {Tags} */
        const next = []

        while (++leftIndex < left.length) {
          if (check(left[leftIndex].toLowerCase(), range)) {
            // Exit if this is a lookup and we have a match.
            if (!filter) return left[leftIndex]
            matches.push(left[leftIndex])
          } else {
            next.push(left[leftIndex])
          }
        }

        left = next
      }

      // If this is a filter, return the list.  If it’s a lookup, we didn’t find
      // a match, so return `undefined`.
      return filter ? matches : undefined
    }
  }
)

/**
 * Basic Filtering (Section 3.3.1) matches a language priority list consisting
 * of basic language ranges (Section 2.1) to sets of language tags.
 * @param {Tag|Tags} tags
 * @param {Range|Ranges} [ranges]
 * @returns {Tags}
 */
export const basicFilter = factory(
  /** @type {Check} */
  function (tag, range) {
    return range === '*' || tag === range || tag.includes(range + '-')
  },
  true
)

/**
 * Extended Filtering (Section 3.3.2) matches a language priority list
 * consisting of extended language ranges (Section 2.2) to sets of language
 * tags.
 * @param {Tag|Tags} tags
 * @param {Range|Ranges} [ranges]
 * @returns {Tags}
 */
export const extendedFilter = factory(
  /** @type {Check} */
  function (tag, range) {
    // 3.3.2.1
    const left = tag.split('-')
    const right = range.split('-')
    let leftIndex = 0
    let rightIndex = 0

    // 3.3.2.2
    if (right[rightIndex] !== '*' && left[leftIndex] !== right[rightIndex]) {
      return false
    }

    leftIndex++
    rightIndex++

    // 3.3.2.3
    while (rightIndex < right.length) {
      // 3.3.2.3.A
      if (right[rightIndex] === '*') {
        rightIndex++
        continue
      }

      // 3.3.2.3.B
      if (!left[leftIndex]) return false

      // 3.3.2.3.C
      if (left[leftIndex] === right[rightIndex]) {
        leftIndex++
        rightIndex++
        continue
      }

      // 3.3.2.3.D
      if (left[leftIndex].length === 1) return false

      // 3.3.2.3.E
      leftIndex++
    }

    // 3.3.2.4
    return true
  },
  true
)

/**
 * Lookup (Section 3.4) matches a language priority list consisting of basic
 * language ranges to sets of language tags to find the one exact language tag
 * that best matches the range.
 * @param {Tag|Tags} tags
 * @param {Range|Ranges} [ranges]
 * @returns {Tag}
 */
export const lookup = factory(
  /** @type {Check} */
  function (tag, range) {
    let right = range

    /* eslint-disable-next-line no-constant-condition */
    while (true) {
      if (right === '*' || tag === right) return true

      let index = right.lastIndexOf('-')

      if (index < 0) return false

      if (right.charAt(index - 2) === '-') index -= 2

      right = right.slice(0, index)
    }
  }
)

/**
 * Validate tags or ranges, and cast them to arrays.
 *
 * @param {string|Array<string>} values
 * @param {string} name
 * @returns {Array<string>}
 */
function cast(values, name) {
  const value = values && typeof values === 'string' ? [values] : values

  if (!value || typeof value !== 'object' || !('length' in value)) {
    throw new Error(
      'Invalid ' + name + ' `' + value + '`, expected non-empty string'
    )
  }

  return value
}
