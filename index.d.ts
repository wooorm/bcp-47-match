
// See https://tools.ietf.org/html/rfc4647#section-3.1
// for more information on the algorithms.

/**
 * Language tags
 */
export type Tags = string | string[]

/**
 * Language ranges
 */
export type Ranges = string | string[]

/**
 * Basic Filtering (Section 3.3.1) matches a language priority list consisting
 * of basic language ranges (Section 2.1) to sets of language tags.
 *
 * @see https://tools.ietf.org/html/rfc4647#section-3.3.1
 *
 * @param tags - Language tags
 * @param ranges - Language range
 *
 * @return Matching language tags
 */
export declare function basicFilter(tags: Tags, ranges: Ranges): string[]

/**
 * Extended Filtering (Section 3.3.2) matches a language priority list
 * consisting of extended language ranges (Section 2.2) to sets of language
 * tags.
 *
 * @see https://tools.ietf.org/html/rfc4647#section-3.3.2
 *
 * @param tags - Language tags
 * @param ranges - Language range
 *
 * @return Matching language tags
 */
export declare function extendedFilter(tags: Tags, ranges: Ranges): string[]

/**
 * Lookup (Section 3.4) matches a language priority list consisting of basic
 * language ranges to sets of language tags to find the one exact language tag
 * that best matches the range.
 *
 * @see https://tools.ietf.org/html/rfc4647#section-3.4
 *
 * @param tags - Language tags
 * @param ranges - Language range
 *
 * @return Best matching language tag or nothing
 */
export declare function lookup(tags: Tags, ranges: Ranges): string | undefined
