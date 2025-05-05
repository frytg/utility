// load package
import { format as stdFormat } from '@std/fmt/duration'
// @deno-types="npm:@types/luxon@^3.4.2"
import { DateTime } from 'luxon'

// docs for luxon shortcuts: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
const DEFAULT_LOCALE = 'en'
const LOCAL_TIMEZONE = 'Europe/Amsterdam'
const DATE_HOUR_MINUTES_FORMAT = 'ccc, d. LLLL yyyy - h:mma'
const DATE_HOUR_MINUTES_FORMAT_24H = 'ccc, d. LLLL yyyy - HH:mm'

/**
 * Export DateTime from Luxon
 * @returns {DateTime} DateTime
 *
 * @example
 * ```ts
 * import { DateTime } from '@frytg/dates'
 *
 * DateTime.fromMillis(1719859200000)
 * ```
 */
export { DateTime }

/**
 * Convert date to local time
 * @param {DateTime} date - date object to convert
 * @param {string} [timezone] - timezone (default: Europe/Amsterdam)
 * @returns {DateTime} date in local time
 *
 * @example
 * ```ts
 * import { toLocal } from '@frytg/dates'
 *
 * toLocal(getNow())
 * ```
 */
export const toLocal = (date: DateTime, timezone = LOCAL_TIMEZONE): DateTime => date.setZone(timezone)

/**
 * Converts ms timestamp to s
 * @param {number} ms - ms timestamp
 * @returns {number} unix timestamp
 *
 * @example
 * ```ts
 * import { msToUnix } from '@frytg/dates'
 *
 * msToUnix(getMs())
 * ```
 */
export const msToUnix = (ms: number): number => Number.parseInt(`${ms / 1000}`)

/**
 * Provide util to get current date object
 * @returns {DateTime} current date object
 *
 * @example
 * ```ts
 * import { getNow } from '@frytg/dates'
 *
 * getNow()
 * ```
 */
export const getNow = (): DateTime => DateTime.now()

/**
 * Get unix timestamp
 * @param {DateTime} [date] - date object
 * @returns {number} unix timestamp
 *
 * @example
 * ```ts
 * import { getUnix } from '@frytg/dates'
 *
 * getUnix()
 * getUnix(getNow())
 * ```
 */
export const getUnix = (date?: DateTime): number => msToUnix(getDateTime(date).valueOf())

/**
 * Get ms (milliseconds) timestamp
 * @param {DateTime} [date] - date object
 * @returns {number} ms timestamp
 *
 * @example
 * ```ts
 * import { getMs } from '@frytg/dates'
 *
 * getMs()
 * getMs(getNow())
 * ```
 */
export const getMs = (date?: DateTime): number => getDateTime(date).valueOf()

/**
 * Internal util to get DateTime object
 * @param {DateTime} [date] - date object
 * @returns {DateTime} DateTime object
 */
const getDateTime = (date?: DateTime): DateTime => (date instanceof DateTime ? date : getNow())

/**
 * Get ISO string in UTC timezone
 * @param {DateTime} [date] - date object
 * @returns {string} ISO string
 *
 * @example
 * ```ts
 * import { getISO } from '@frytg/dates'
 *
 * getISO()
 * getISO(getNow())
 * ```
 */
export const getISO = (date?: DateTime): string | null => getDateTime(date).toUTC().toISO()

/**
 * Get ISO string (alias for {@link getISO})
 * @param {DateTime} [date] - date object
 * @returns {string} ISO string
 */
export const getIso = getISO

/**
 * Calculate offset from previous ms timestamp
 * @param {number} ms - ms timestamp
 * @returns {number} offset
 *
 * @example
 * ```ts
 * import { getMsOffset } from '@frytg/dates'
 *
 * getMsOffset(getMs())
 * ```
 */
export const getMsOffset = (ms: number): number => getMs() - ms

/**
 * Get relative time
 * @param {DateTime} date - date object
 * @param {string} [locale] - locale (default: en)
 * @param {string} [timezone] - timezone (default: Europe/Amsterdam)
 * @returns {string} relative time
 *
 * @example
 * ```ts
 * import { getRelative } from '@frytg/dates'
 *
 * getRelative(getNow())
 * getRelative(getNow(), 'nl-NL')
 * getRelative(getNow(), 'nl-NL', 'Europe/Amsterdam')
 * ```
 */
export const getRelative = (date: DateTime, locale = DEFAULT_LOCALE, timezone = LOCAL_TIMEZONE): string | null =>
	date.setZone(timezone).toRelative({ locale })

/**
 * Get year-month-day (YYYYMMDD or YYYY-MM-DD)
 * @param {DateTime} [date] - date object
 * @param {boolean} [withDashes] - with dashes (default: false)
 * @returns {string | number} year-month-day
 *
 * @example
 * ```ts
 * import { getYearMonthDay } from '@frytg/dates'
 *
 * getYearMonthDay(getNow()) // YYYYMMDD
 * getYearMonthDay(getNow(), true) // YYYY-MM-DD
 * ```
 */
export const getYearMonthDay = (date?: DateTime, withDashes = false): string | number =>
	withDashes ? getDateTime(date).toFormat('yyyy-LL-dd') : Number.parseInt(getDateTime(date).toFormat('yyyyLLdd'))

/**
 * Parse ISO string
 * @param {string} iso - ISO string
 * @returns {DateTime} date object
 *
 * @example
 * ```ts
 * import { parseISO } from '@frytg/dates'
 *
 * parseISO(getISO())
 * parseISO('2024-11-23T10:00:00.000Z')
 * ```
 */
export const parseISO = (iso: string): DateTime => DateTime.fromISO(iso)

/**
 * Parse ISO string (alias for {@link parseISO})
 * @param {string} iso - ISO string
 * @returns {DateTime} date object
 */
export const parseIso = parseISO

/**
 * Format the date in a human readable way (like 'Mon, 23. Nov 2024 - 10:00AM')
 * @param {DateTime} date - date object
 * @param {string} [locale] - locale (default: en)
 * @param {string} [timezone] - timezone (default: Europe/Amsterdam)
 * @param {boolean} [prefer24h] - prefer 24h format (default: false)
 * @returns {string} readable date
 *
 * @example
 * ```ts
 * import { getDateHourMinutes } from '@frytg/dates'
 *
 * getDateHourMinutes(getNow())
 * getDateHourMinutes(getNow(), 'nl')
 * getDateHourMinutes(getNow(), 'nl', 'Europe/Amsterdam')
 * getDateHourMinutes(getNow(), 'nl', 'Europe/Amsterdam', true)
 * ```
 */
export const getDateHourMinutes = (
	date: DateTime,
	locale = DEFAULT_LOCALE,
	timezone = LOCAL_TIMEZONE,
	prefer24h = false,
): string =>
	date
		.setZone(timezone)
		.setLocale(locale)
		.toFormat(prefer24h ? DATE_HOUR_MINUTES_FORMAT_24H : DATE_HOUR_MINUTES_FORMAT)

/**
 * Get full relative time (combines {@link getDateHourMinutes} and {@link getRelative})
 * @param {DateTime} date - date object
 * @param {string} [locale] - locale (default: en)
 * @param {string} [timezone] - timezone (default: Europe/Amsterdam)
 * @param {boolean} [prefer24h] - prefer 24h format (default: false)
 * @returns {string} full relative time
 *
 * @example
 * ```ts
 * import { getFullRelativeTime } from '@frytg/dates'
 *
 * getFullRelativeTime(getNow())
 * getFullRelativeTime(getNow(), 'nl')
 * getFullRelativeTime(getNow(), 'nl', 'Europe/Amsterdam')
 * getFullRelativeTime(getNow(), 'nl', 'Europe/Amsterdam', true)
 * ```
 */
export const getFullRelativeTime = (
	date: DateTime,
	locale = DEFAULT_LOCALE,
	timezone = LOCAL_TIMEZONE,
	prefer24h = false,
): string => `${getDateHourMinutes(date, locale, timezone, prefer24h)} (${getRelative(date, locale, timezone)})`

/**
 * Format a duration in milliseconds to a human readable string.
 *
 * @param {number} duration - the duration in milliseconds
 * @returns {string} the formatted duration (e.g. `1m 39s`)
 *
 * @example
 * ```ts
 * import { formatDuration } from '@frytg/dates'
 *
 * formatDuration(1000) // 1s
 *
 * const startTs = getMs()
 * // do something...
 * formatDuration(getMsOffset(startTs)) // time taken
 * ```
 */
export const formatDuration = (duration: number): string => stdFormat(duration, { ignoreZero: true })
