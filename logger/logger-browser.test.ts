import { test } from '@cross/test'
import { assertEquals, assertExists } from '@std/assert'
import sinon from 'sinon'

import { logger } from './logger-browser.ts'

test('logger browser - logs structured event fields', () => {
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
	assertEquals(loggedData.message, 'test message')
	assertEquals(loggedData.level, 'info')
	assertEquals(loggedData.source, 'test-source')
	assertEquals(loggedData.data, { test: 'data' })
	assertEquals(loggedData.host, undefined)

	consoleStub.restore()
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

test('logger browser - sets debug level in development builds', () => {
	assertEquals(logger.level, isDevBuild() ? 'debug' : 'info')
})

test('logger browser - does not log below configured level', () => {
	if (logger.level === 'debug') return

	const consoleStub = sinon.stub(console, 'debug')
	logger.debug('should not log', { source: 'test-source' })

	assertEquals(consoleStub.called, false)
	consoleStub.restore()
})

/**
 * Mirror the browser logger development-mode check for assertions.
 *
 * @returns {boolean} True when the current build is development.
 */
const isDevBuild = (): boolean => {
	const metaEnv = (import.meta as ImportMeta & { env?: Record<string, string | boolean | undefined> }).env
	if (metaEnv?.DEV === true) return true
	if (metaEnv?.MODE === 'development') return true
	return false
}
