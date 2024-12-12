import process from 'node:process'
import { test } from '@cross/test'
import { assertEquals, assertExists } from '@std/assert'
import sinon from 'sinon'

import logger from './logger.ts'

test('logger - formats errors correctly', () => {
	// Setup
	const testError = new Error('test error')
	const writeStub = sinon.stub(process.stdout, 'write')
	let loggedOutput = ''
	writeStub.callsFake((str: string) => {
		loggedOutput = str
		return true
	})

	// Test
	logger.error('error occurred', {
		source: 'test-source',
		error: testError,
	})

	// Verify
	const loggedData = JSON.parse(loggedOutput)
	assertExists(loggedData.error.message)
	assertExists(loggedData.error.stack)
	assertEquals(loggedData.error.message, 'test error')
	assertExists(loggedData.runtime)

	// Cleanup
	writeStub.restore()
})
