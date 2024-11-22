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
			code: event.error.code,
			message: event.error.message,
			stack: event.error.stack,
		}
	}
	return event
})

// Detect the process version
const detectProcessVersion = () => {
	if (process.versions?.bun) return `bun-${process.versions.bun}`
	if (process.versions?.deno) return `deno-${process.versions.deno}`
	return process.version
}

// Add global context to log events
const convertGlobals = format((event) => {
	event.host = process.env.K_REVISION || hostName
	event.serviceName = process.env.SERVICE_NAME
	event.stage = process.env.STAGE
	event.version = process.env.npm_package_version
	event.runtime = detectProcessVersion()
	return event
})

// Set up format based on environment
let formatConfig: Logform.Format = format.combine(convertError(), convertGlobals(), format.json())
if (process.env.IS_LOCAL === 'true') {
	formatConfig = format.combine(
		convertError(),
		convertGlobals(),
		format.timestamp(),
		format.json({ space: 4 }),
		format.colorize({ all: true }),
	)
}

// Initialize logger
const logger: Logger = createLogger({
	level: process.env.STAGE === 'dev' ? 'debug' : 'info',
	levels: config.syslog.levels,
	exitOnError: false,
	format: formatConfig,
	transports: [new transports.Console()],
})

export default logger
