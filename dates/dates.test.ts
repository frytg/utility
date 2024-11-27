import { test } from '@cross/test'
import { assert, assertEquals } from '@std/assert'

import {
	DateTime,
	getDateHourMinutes,
	getFullRelativeTime,
	getISO,
	getIso,
	getMs,
	getMsOffset,
	getNow,
	getRelative,
	getUnix,
	getYearMonthDay,
	msToUnix,
	parseISO,
	parseIso,
	toLocal,
} from './dates.ts'

test('toLocal() converts date to Amsterdam timezone', () => {
	const utcDate = DateTime.fromISO('2024-03-15T12:00:00Z')
	const localDate = toLocal(utcDate)
	assertEquals(localDate.zoneName, 'Europe/Amsterdam')
})

test('msToUnix() converts milliseconds to unix timestamp', () => {
	const ms = 1647345600000
	assertEquals(msToUnix(ms), 1647345600)
})

test('getNow() returns current DateTime', () => {
	const now = getNow()
	assert(now instanceof DateTime)
	assert(Math.abs(now.toMillis() - Date.now()) < 1000) // Within 1 second
})

test('getUnix() returns unix timestamp', () => {
	const now = DateTime.fromMillis(1647345600000) // March 15, 2024 12:00:00 UTC
	assertEquals(getUnix(now), 1647345600)
})

test('getMs() returns millisecond timestamp', () => {
	const now = DateTime.fromMillis(1647345600000) // March 15, 2024 12:00:00 UTC
	assertEquals(getMs(now), 1647345600000)
})

test('getISO() returns ISO string in UTC', () => {
	const date = DateTime.fromISO('2024-03-15T12:00:00+01:00')
	assertEquals(getISO(date), '2024-03-15T11:00:00.000Z')
})

test('getIso() is an alias for getISO()', () => {
	const date = DateTime.fromISO('2024-03-15T12:00:00+01:00')
	assertEquals(getIso(date), getISO(date))
})

test('getMsOffset() calculates offset from previous timestamp', () => {
	const now = getMs()
	const earlier = now - 1000 // 1 second ago
	assert(getMsOffset(earlier) >= 1000)
})

test('getRelative() returns relative time string', () => {
	const now = getNow()
	const yesterday = now.minus({ days: 1 })
	assertEquals(getRelative(yesterday), '1 day ago')
})

test('getYearMonthDay() formats date correctly', () => {
	const date = DateTime.fromISO('2024-03-15T12:00:00Z')
	assertEquals(getYearMonthDay(date), 20240315)
	assertEquals(getYearMonthDay(date, true), '2024-03-15')
})

test('parseISO() parses ISO string correctly', () => {
	const isoString = '2024-03-15T12:00:00.000Z'
	const parsed = parseISO(isoString)
	assert(parsed instanceof DateTime)
	assertEquals(parsed.toUTC().toISO(), isoString)
})

test('parseIso() is an alias for parseISO()', () => {
	const isoString = '2024-03-15T12:00:00.000Z'
	assertEquals(parseIso(isoString).toISO(), parseISO(isoString).toISO())
})

test('getDateHourMinutes() formats date in human readable way', () => {
	const date = DateTime.fromISO('2024-03-15T12:00:00Z')
	const formatted = getDateHourMinutes(date)
	assert(formatted.includes('Mar'))
	assert(formatted.includes('2024'))
})

test('getFullRelativeTime() combines date and relative time', () => {
	const date = DateTime.fromISO('2024-03-15T12:00:00Z')
	const fullRelative = getFullRelativeTime(date)
	assert(fullRelative.includes('Mar'))
	assert(fullRelative.includes('2024'))
	assert(fullRelative.includes('ago'))
})
