import process from 'node:process'
import { test } from '@cross/test'
import { assertExists } from '@std/assert'
import sinon from 'sinon'

import { checkRequiredEnv } from './check-required-env.ts'

test('checkRequiredEnv - returns when env variable exists', () => {
	// Setup
	const envStub = sinon.stub(process, 'env').value({
		TEST_ENV_VAR: 'test-value',
	})

	// Test
	checkRequiredEnv('TEST_ENV_VAR')

	// Verify
	assertExists(process.env.TEST_ENV_VAR)

	// Cleanup
	envStub.restore()
})

test('checkRequiredEnv - exits when env variable is missing', () => {
	// Setup
	const envStub = sinon.stub(process, 'env').value({})
	const exitStub = sinon.stub(process, 'exit')

	// Test
	checkRequiredEnv('MISSING_ENV_VAR')

	// Verify
	sinon.assert.calledOnce(exitStub)
	sinon.assert.calledWith(exitStub, 1)

	// Cleanup
	exitStub.restore()
	envStub.restore()
})
