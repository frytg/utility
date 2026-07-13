/**
 * @module
 * A pre-configured logger that is ready to use with syslog levels.
 */

// load packages
import os from 'node:os'
import process from 'node:process'
import type { Logform, Logger } from 'winston'
import { createLogger, format, transports } from 'winston'

import { serializeError } from './serialize-error.ts'
import { SYSLOG_LEVELS } from './syslog-levels.ts'

// set config once
const hostName = os.hostname()

// Format error objects
const convertError = format((event) => {
	const serializedError = serializeError(event?.error)
	if (serializedError !== undefined) {
		event.error = serializedError
	}
	return event
})

let cachedProcessRuntime: string | undefined

/**
 * Detect and return the process version
 *
 * @returns {string} the process version (e.g. `bun-1.1.23`, `deno-deploy-1.3.2`, `node-20.11.0`)
 */
export const detectProcessVersion = (): string => {
	if (cachedProcessRuntime !== undefined) return cachedProcessRuntime

	if (process.versions?.bun) {
		cachedProcessRuntime = `bun-${process.versions.bun}`
	} else if (process.versions?.deno) {
		cachedProcessRuntime = process.env.DENO_DEPLOYMENT_ID
			? `deno-deploy-${process.versions.deno}`
			: `deno-${process.versions.deno}`
	} else if (process.env.AWS_EXECUTION_ENV) {
		cachedProcessRuntime = process.env.AWS_EXECUTION_ENV.replace(/_/g, '-')
	} else {
		cachedProcessRuntime = `nodejs-${process.version}`
	}

	return cachedProcessRuntime
}

const processRuntime = detectProcessVersion()

// Add global context to log events
const convertGlobals = format((event) => {
	event.host =
		process.env.K_REVISION ||
		process.env.AWS_LAMBDA_FUNCTION_NAME ||
		process.env.FLY_MACHINE_ID ||
		process.env.DENO_DEPLOYMENT_ID ||
		hostName
	event.serviceName = process.env.SERVICE_NAME || process.env.K_SERVICE || process.env.FLY_APP_NAME || null
	event.stage = process.env.STAGE || process.env.NODE_ENV || null
	event.version = process.env.SERVICE_VERSION || process.env.npm_package_version
	event.region =
		process.env.REGION || process.env.AWS_REGION || process.env.FLY_REGION || process.env.DENO_REGION || null
	event.runtime = processRuntime
	return event
})

// Set up format based on environment
const formatConfig: Logform.Format = format.combine(convertError(), convertGlobals(), format.json())
const formatConfigLocal: Logform.Format = format.combine(
	convertError(),
	convertGlobals(),
	format.timestamp(),
	format.json({ space: 4 }),
	format.colorize({ all: true }),
)

/**
 * Use the exported logger to log messages.
 *
 * @param {Object} event
 * @param {string} event.level - one of the syslog levels
 * @param {string} event.message - the log message
 * @param {string} event.source - the source of the log message (e.g. function or file name)
 * @param {Error} event.error - an error object to log
 * @param {Object} event.data - additional data to log (object)
 *
 * @example basic log
 * ```ts
 * import { logger } from '@frytg/logger'
 *
 * logger.log({
 *   level: 'debug',
 *   message: 'my log message',
 *   source: 'folder-a/file-b/function-c',
 *   data: { name: 'my-data' },
 * })
 * ```
 *
 * @example log with error
 * ```ts
 * // ...
 * } catch (error) {
 *   logger.log({
 *     level: 'error',
 *     message: 'some bad xyz thing happened',
 *     source: 'folder-a/file-b/function-c',
 *     data: { name: 'my-data' },
 *     error,
 *   })
 * }
 * ```
 */
export const logger: Logger = createLogger({
	level: process.env.STAGE === 'dev' ? 'debug' : 'info',
	levels: SYSLOG_LEVELS,
	exitOnError: false,
	format: process.env.IS_LOCAL === 'true' ? formatConfigLocal : formatConfig,
	transports: [new transports.Console()],
})

export default logger
