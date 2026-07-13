import { test } from '@cross/test'
import { assertEquals, assertExists } from '@std/assert'
import sinon from 'sinon'

import { detectBrowserRuntime, logger } from './logger-browser.ts'

test('detectBrowserRuntime - returns the same value on repeated calls', () => {
	const first = detectBrowserRuntime()
	const second = detectBrowserRuntime()

	assertEquals(second, first)
})

test('logger browser - includes global context in log events', () => {
	const globalScope = globalThis as { __ENV__?: Record<string, string> }
	const previousEnv = globalScope.__ENV__
	globalScope.__ENV__ = {
		K_REVISION: 'test-revision',
		SERVICE_NAME: 'test-service',
		STAGE: 'test',
		npm_package_version: '1.0.0',
	}

	const consoleStub = sinon.stub(console, 'log')
	let loggedOutput = ''
	consoleStub.callsFake((output: string) => {
		loggedOutput = output
	})

	logger.info('test message', {
		source: 'test-source',
		data: { test: 'data' },
	})

	const loggedData = JSON.parse(loggedOutput)
	assertEquals(loggedData.host, 'test-revision')
	assertEquals(loggedData.serviceName, 'test-service')
	assertEquals(loggedData.stage, 'test')
	assertEquals(loggedData.version, '1.0.0')
	assertExists(loggedData.runtime)

	consoleStub.restore()
	if (previousEnv === undefined) {
		delete globalScope.__ENV__
	} else {
		globalScope.__ENV__ = previousEnv
	}
})

test('logger browser - formats errors correctly', () => {
	const testError = new Error('test error')
	const consoleStub = sinon.stub(console, 'error')
	let loggedOutput = ''
	consoleStub.callsFake((output: string) => {
		loggedOutput = output
	})

	logger.error('error occurred', {
		source: 'test-source',
		error: testError,
	})

	const loggedData = JSON.parse(loggedOutput)
	assertExists(loggedData.error.message)
	assertExists(loggedData.error.stack)
	assertEquals(loggedData.error.message, 'test error')
	assertExists(loggedData.runtime)

	consoleStub.restore()
})

test('logger browser - has correct syslog levels', () => {
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

test('logger browser - sets debug level from environment', () => {
	const stage = (globalThis as { __ENV__?: Record<string, string> }).__ENV__?.STAGE
	assertEquals(logger.level, stage === 'dev' ? 'debug' : 'info')
})

test('logger browser - does not log below configured level', () => {
	if (logger.level === 'debug') return

	const consoleStub = sinon.stub(console, 'debug')
	logger.debug('should not log', { source: 'test-source' })

	assertEquals(consoleStub.called, false)
	consoleStub.restore()
})
