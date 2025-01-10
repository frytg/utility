/**
 * @module
 * A pre-configured logger that is ready to use with syslog levels.
 */

// load packages
import os from 'node:os'
import process from 'node:process'
import type { Logform, Logger } from 'winston'
import { config, createLogger, format, transports } from 'winston'

// set config once
const hostName = os.hostname()

// Format error objects
const convertError = format((event) => {
	if (event?.error instanceof Error) {
		event.error = {
			...event.error,
			message: event.error.message,
			stack: event.error.stack,
		}
	}
	return event
})

/**
 * Detect and return the process version
 *
 * @returns {string} the process version (e.g. `bun-1.1.23`, `deno-1.3.2`, `node-20.11.0`)
 */
export const detectProcessVersion = (): string => {
	if (process.versions?.bun) return `bun-${process.versions.bun}`
	if (process.versions?.deno) return `deno-${process.versions.deno}`
	if (process.env.AWS_EXECUTION_ENV) return process.env.AWS_EXECUTION_ENV.replace(/_/g, '-')
	return `nodejs-${process.version}`
}

// Add global context to log events
const convertGlobals = format((event) => {
	event.host = process.env.K_REVISION || process.env.AWS_LAMBDA_FUNCTION_NAME || hostName
	event.serviceName = process.env.SERVICE_NAME || null
	event.stage = process.env.STAGE || null
	event.version = process.env.npm_package_version
	event.region = process.env.REGION || process.env.AWS_REGION || null
	event.runtime = detectProcessVersion()
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
	levels: config.syslog.levels,
	exitOnError: false,
	format: process.env.IS_LOCAL === 'true' ? formatConfigLocal : formatConfig,
	transports: [new transports.Console()],
})

export default logger
