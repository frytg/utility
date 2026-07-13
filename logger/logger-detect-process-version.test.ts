import { test } from '@cross/test'
import { assertEquals } from '@std/assert'

import { detectProcessVersion } from './logger.ts'

test('detectProcessVersion - returns the same value on repeated calls', () => {
	const first = detectProcessVersion()
	const second = detectProcessVersion()

	assertEquals(second, first)
})
