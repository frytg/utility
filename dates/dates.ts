// load package
import { DateTime } from 'luxon'

const LOCAL_TIMEZONE = 'Europe/Amsterdam'
const DATE_HOUR_MINUTES_FORMAT = 'ccc, d. LLLL yyyy - h:mma'

/**
 * Luxon DateTime
 */
export { DateTime }

/**
 * Convert date to local time
 * @param {DateTime} date - date object to convert
 * @returns {DateTime} date in local time
 *
 * @example
 * ```ts
 * import { toLocal } from 'jsr:@frytg/dates'
 *
 * toLocal(getNow())
 * ```
 */
export const toLocal = (date: DateTime): DateTime => date.setZone(LOCAL_TIMEZONE)

/**
 * Converts ms timestamp to s
 * @param {number} ms - ms timestamp
 * @returns {number} unix timestamp
 *
 * @example
 * ```ts
 * import { msToUnix } from 'jsr:@frytg/dates'
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
 * import { getNow } from 'jsr:@frytg/dates'
 *
 * getNow()
 * ```
 */
export const getNow = (): DateTime => DateTime.now()

/**
 * Provides util to get .unix() style value
 * @param {DateTime} [date] - date object
 * @returns {number} unix timestamp
 *
 * @example
 * ```ts
 * import { getUnix } from 'jsr:@frytg/dates'
 *
 * getUnix()
 * getUnix(getNow())
 * ```
 */
export const getUnix = (date?: DateTime): number => msToUnix((date || getNow()).valueOf())

/**
 * Provides util to get ms timestamp
 * @param {DateTime} [date] - date object
 * @returns {number} ms timestamp
 *
 * @example
 * ```ts
 * import { getMs } from 'jsr:@frytg/dates'
 *
 * getMs()
 * getMs(getNow())
 * ```
 */
export const getMs = (date?: DateTime): number => (date || getNow()).valueOf()

/**
 * Provides util to get ISO string in UTC timezone
 * @param {DateTime} [date] - date object
 * @returns {string} ISO string
 *
 * @example
 * ```ts
 * import { getISO } from 'jsr:@frytg/dates'
 *
 * getISO()
 * getISO(getNow())
 * ```
 */
export const getISO = (date?: DateTime): string => (date || getNow()).toUTC().toISO()

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
 * import { getMsOffset } from 'jsr:@frytg/dates'
 *
 * getMsOffset(getMs())
 * ```
 */
export const getMsOffset = (ms: number): number => getMs() - ms

/**
 * Get relative time
 * @param {DateTime} date - date object
 * @param {string} [locale] - locale (default: 'en-US')
 * @returns {string} relative time
 *
 * @example
 * ```ts
 * import { getRelative } from 'jsr:@frytg/dates'
 *
 * getRelative(getNow())
 * getRelative(getNow(), 'nl-NL')
 * ```
 */
export const getRelative = (date: DateTime, locale = 'en-US'): string => date.toRelative({ locale })

/**
 * Get year-month-day (YYYYMMDD or YYYY-MM-DD)
 * @param {DateTime} [date] - date object
 * @param {boolean} [withDashes] - with dashes (default: false)
 * @returns {string | number} year-month-day
 *
 * @example
 * ```ts
 * import { getYearMonthDay } from 'jsr:@frytg/dates'
 *
 * getYearMonthDay(getNow()) // YYYYMMDD
 * getYearMonthDay(getNow(), true) // YYYY-MM-DD
 * ```
 */
export const getYearMonthDay = (date?: DateTime, withDashes = false): string | number =>
	withDashes ? (date || getNow()).toFormat('yyyy-LL-dd') : Number.parseInt((date || getNow()).toFormat('yyyyLLdd'))

/**
 * Parse ISO string
 * @param {string} iso - ISO string
 * @returns {DateTime} date object
 *
 * @example
 * ```ts
 * import { parseISO } from 'jsr:@frytg/dates'
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
 * @returns {string} readable date
 *
 * @example
 * ```ts
 * import { getDateHourMinutes } from 'jsr:@frytg/dates'
 *
 * getDateHourMinutes(getNow())
 * ```
 */
export const getDateHourMinutes = (date: DateTime): string =>
	`${date.setLocale('en').toFormat(DATE_HOUR_MINUTES_FORMAT)}`

/**
 * Get full relative time (combines {@link getDateHourMinutes} and {@link getRelative})
 * @param {DateTime} date - date object
 * @returns {string} full relative time
 *
 * @example
 * ```ts
 * import { getFullRelativeTime } from 'jsr:@frytg/dates'
 *
 * getFullRelativeTime(getNow())
 * ```
 */
export const getFullRelativeTime = (date: DateTime): string => `${getDateHourMinutes(date)} (${getRelative(date)})`
