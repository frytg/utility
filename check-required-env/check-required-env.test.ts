import process from 'node:process'
import { test } from '@cross/test'
import { assertEquals, assertExists } from '@std/assert'

import { checkRequiredEnv } from './check-required-env.ts'

test('checkRequiredEnv - returns when env variable exists', () => {
	// Setup
	const testVarName = 'TEST_ENV_VAR'
	process.env[testVarName] = 'test-value'

	// Test
	checkRequiredEnv(testVarName)

	// Verify
	assertExists(process.env[testVarName])

	// Cleanup
	delete process.env[testVarName]
})

test('checkRequiredEnv - exits when env variable is missing', () => {
	// Setup
	const testVarName = 'MISSING_ENV_VAR'
	const originalExit = process.exit
	let exitCalled = false
	let exitCode: number | undefined

	// Mock process.exit
	process.exit = ((code?: number) => {
		exitCalled = true
		exitCode = code
		// Don't actually exit
	}) as typeof process.exit

	// Test
	checkRequiredEnv(testVarName)

	// Verify
	assertEquals(exitCalled, true)
	assertEquals(exitCode, 1)

	// Cleanup
	process.exit = originalExit
})
