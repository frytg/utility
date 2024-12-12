import { test } from '@cross/test'
import { assertEquals } from '@std/assert'

import { formatDuration } from './dates.ts'

test('formatDuration - formats milliseconds correctly', () => {
	const testCases = [
		{ input: 1000, expected: '1s' },
		{ input: 60000, expected: '1m' },
		{ input: 3600000, expected: '1h' },
		{ input: 86400000, expected: '1d' },
		{ input: 99123, expected: '1m 39s 123ms' },
		{ input: 3723000, expected: '1h 2m 3s' },
		{ input: 0, expected: '' },
		{ input: 500, expected: '500ms' },
	]

	for (const { input, expected } of testCases) {
		assertEquals(formatDuration(input), expected, `formatDuration(${input}) should return "${expected}"`)
	}
})
