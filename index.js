'use strict'

// See https://tools.ietf.org/html/rfc4647#section-3.1
// for more information on the algorithms.

var dash = '-'
var asterisk = '*'

exports.basicFilter = factory(basic, true)
exports.extendedFilter = factory(extended, true)
exports.lookup = factory(lookup)

// Basic Filtering (Section 3.3.1) matches a language priority list consisting
// of basic language ranges (Section 2.1) to sets of language tags.
function basic(tag, range) {
  tag = lower(tag)
  range = lower(range)
  return range === asterisk || tag === range || tag.indexOf(range + dash) !== -1
}

// Extended Filtering (Section 3.3.2) matches a language priority list
// consisting of extended language ranges (Section 2.2) to sets of language
// tags.
function extended(tag, range) {
  // 3.3.2.1
  var tags = lower(tag).split(dash)
  var ranges = lower(range).split(dash)
  var length = ranges.length
  var rangeIndex = -1
  var tagIndex = -1

  tag = tags[++tagIndex]
  range = ranges[++rangeIndex]

  // 3.3.2.2
  if (range !== asterisk && range !== tag) {
    return false
  }

  tag = tags[++tagIndex]
  range = ranges[++rangeIndex]

  // 3.3.2.3
  while (rangeIndex < length) {
    // 3.3.2.3.A
    if (range === asterisk) {
      range = ranges[++rangeIndex]
      continue
    }

    // 3.3.2.3.B
    if (!tag) {
      return false
    }

    // 3.3.2.3.C
    if (tag === range) {
      tag = tags[++tagIndex]
      range = ranges[++rangeIndex]
      continue
    }

    // 3.3.2.3.D
    if (tag.length === 1) {
      return false
    }

    // 3.3.2.3.E
    tag = tags[++tagIndex]
  }

  // 3.3.2.4
  return true
}

// Lookup (Section 3.4) matches a language priority list consisting of basic
// language ranges to sets of language tags to find the one exact language tag
// that best matches the range.
function lookup(tag, range) {
  var pos

  tag = lower(tag)
  range = lower(range)

  /* eslint-disable no-constant-condition */
  while (true) {
    /* eslint-enable no-constant-condition */
    if (range === asterisk || tag === range) {
      return true
    }

    pos = range.lastIndexOf(dash)

    if (pos === -1) {
      return false
    }

    if (pos > 3 && range.charAt(pos - 2) === dash) {
      pos -= 2
    }

    range = range.slice(0, pos)
  }
}

// Factory to perform a filter or a lookup.
// This factory creates a function that accepts a list of tags and a list of
// ranges, and contains logic to exit early for lookups.
// `check` just has to deal with one tag and one range.
// This match function iterates over ranges, and for each range,
// iterates over tags.  That way, earlier ranges matching any tag have
// precedence over later ranges.
function factory(check, filter) {
  return match

  function match(tags, ranges) {
    var values = normalize(tags, ranges)
    var result = []
    var next
    var tagIndex
    var tagLength
    var tag
    var rangeIndex
    var rangeLength
    var range
    var matches

    tags = values.tags
    ranges = values.ranges
    rangeLength = ranges.length
    rangeIndex = -1

    while (++rangeIndex < rangeLength) {
      range = ranges[rangeIndex]

      // Ignore wildcards in lookup mode.
      if (!filter && range === asterisk) {
        continue
      }

      tagLength = tags.length
      tagIndex = -1
      next = []

      while (++tagIndex < tagLength) {
        tag = tags[tagIndex]
        matches = check(tag, range)
        ;(matches ? result : next).push(tag)

        // Exit if this is a lookup and we have a match.
        if (!filter && matches) {
          return tag
        }
      }

      tags = next
    }

    // If this is a filter, return the list.  If it’s a lookup, we didn’t find
    // a match, so return `undefined`.
    return filter ? result : undefined
  }
}

// Normalize options.
function normalize(tags, ranges) {
  ranges = ranges === undefined || ranges === null ? asterisk : ranges

  return {tags: cast(tags, 'tag'), ranges: cast(ranges, 'range')}
}

// Validate tags or ranges, and cast them to arrays.
function cast(values, name) {
  var value = values && typeof values === 'string' ? [values] : values

  if (!value || typeof value !== 'object' || !('length' in value)) {
    throw new Error(
      'Invalid ' + name + ' `' + value + '`, expected non-empty string'
    )
  }

  return value
}

function lower(value) {
  return value.toLowerCase()
}
