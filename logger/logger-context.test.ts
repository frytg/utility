import process from 'node:process'
import { test } from '@cross/test'
import { assertEquals, assertExists } from '@std/assert'
import sinon from 'sinon'

import logger from './logger.ts'

test('logger - includes global context in log events', () => {
	// Setup
	const envStub = sinon.stub(process, 'env').value({
		K_REVISION: 'test-revision',
		SERVICE_NAME: 'test-service',
		STAGE: 'test',
		npm_package_version: '1.0.0',
	})

	const writeStub = sinon.stub(process.stdout, 'write')
	let loggedOutput = ''
	writeStub.callsFake((str: string) => {
		loggedOutput = str
		return true
	})

	// Test
	logger.info('test message', {
		source: 'test-source',
		data: { test: 'data' },
	})

	// Verify
	const loggedData = JSON.parse(loggedOutput)
	assertEquals(loggedData.host, 'test-revision')
	assertEquals(loggedData.serviceName, 'test-service')
	assertEquals(loggedData.stage, 'test')
	assertEquals(loggedData.version, '1.0.0')
	assertExists(loggedData.runtime)

	// Cleanup
	writeStub.restore()
	envStub.restore()
})

test('logger - sets debug level correctly', () => {
	// Test & Verify
	assertEquals(logger.level, process.env.STAGE === 'dev' ? 'debug' : 'info')
})

test('logger - has correct syslog levels', () => {
	const expectedLevels = {
		emerg: 0,
		alert: 1,
		crit: 2,
		error: 3,
		warning: 4,
		notice: 5,
		info: 6,
		debug: 7,
	}

	assertEquals(logger.levels, expectedLevels)
})
