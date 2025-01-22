// load packages
import process from 'node:process'
import { test } from '@cross/test'
import logger from '@frytg/logger'
import sinon from 'sinon'

import { exitWithError } from './exit-with-error.ts'

test('exitWithError - returns when variable exists', () => {
	// Test
	exitWithError('existing-var')
})

test('exitWithError - exits when input is null', () => {
	// Setup
	const exitStub = sinon.stub(process, 'exit')
	const loggerStub = sinon.stub(logger, 'log')

	// Test
	exitWithError(null)

	// Verify
	sinon.assert.calledOnce(exitStub)
	sinon.assert.calledWith(exitStub, 1)

	// Cleanup
	exitStub.restore()
	loggerStub.restore()
})

test('exitWithError - exits when input is undefined', () => {
	// Setup
	const exitStub = sinon.stub(process, 'exit')
	const loggerStub = sinon.stub(logger, 'log')

	// Test
	exitWithError(undefined)

	// Verify
	sinon.assert.calledOnce(exitStub)
	sinon.assert.calledWith(exitStub, 1)

	// Cleanup
	exitStub.restore()
	loggerStub.restore()
})

test('exitWithError - exits when input is empty string', () => {
	// Setup
	const exitStub = sinon.stub(process, 'exit')
	const loggerStub = sinon.stub(logger, 'log')

	// Test
	exitWithError('')

	// Verify
	sinon.assert.calledOnce(exitStub)
	sinon.assert.calledWith(exitStub, 1)

	// Cleanup
	exitStub.restore()
	loggerStub.restore()
})
