// deno-lint-ignore-file no-console
/**
 * @module
 * A browser-safe structured console logger for frontend apps.
 */

const SYSLOG_LEVELS = {
	emerg: 0,
	alert: 1,
	crit: 2,
	error: 3,
	warning: 4,
	notice: 5,
	info: 6,
	debug: 7,
} as const

type SyslogLevel = keyof typeof SYSLOG_LEVELS

type LogMetadata = {
	source?: string
	data?: Record<string, unknown>
	error?: unknown
	[key: string]: unknown
}

type LogEvent = LogMetadata & {
	level: SyslogLevel
	message: string
	error?: {
		message: string
		stack?: string
		[key: string]: unknown
	}
}

type ImportMetaEnv = Record<string, string | boolean | undefined>

type BrowserLogger = {
	level: SyslogLevel
	levels: typeof SYSLOG_LEVELS
	log: (event: LogMetadata & { level: SyslogLevel; message: string }) => void
} & Record<SyslogLevel, (message: string, meta?: LogMetadata) => void>

/**
 * Determine whether the app is running in development mode.
 *
 * @returns {boolean} True when running in a development build.
 */
const isDev = (): boolean => {
	const metaEnv = (import.meta as ImportMeta & { env?: ImportMetaEnv }).env
	if (metaEnv?.DEV === true) return true
	if (metaEnv?.MODE === 'development') return true
	return false
}

/**
 * Resolve the minimum log level for the current build.
 *
 * @returns {SyslogLevel} The configured minimum log level.
 */
const resolveMinLevel = (): SyslogLevel => isDev() ? 'debug' : 'info'

/**
 * Serialize an error for structured logging.
 *
 * @param {unknown} error - The error value to serialize.
 * @returns {LogEvent['error'] | undefined} Serialized error fields.
 */
const serializeError = (error: unknown): LogEvent['error'] | undefined => {
	if (!(error instanceof Error)) return undefined

	return {
		...error,
		message: error.message,
		...(error.stack !== undefined ? { stack: error.stack } : {}),
	}
}

/**
 * Determine whether a log event should be emitted for the configured level.
 *
 * @param {SyslogLevel} eventLevel - The event severity.
 * @param {SyslogLevel} configuredLevel - The configured minimum level.
 * @returns {boolean} True when the event should be logged.
 */
const shouldLog = (eventLevel: SyslogLevel, configuredLevel: SyslogLevel): boolean =>
	SYSLOG_LEVELS[eventLevel] <= SYSLOG_LEVELS[configuredLevel]

/**
 * Select the console method that best matches a syslog level.
 *
 * @param {SyslogLevel} level - The syslog level.
 * @returns {'debug' | 'error' | 'log' | 'warn'} The console method to use.
 */
const consoleMethodForLevel = (level: SyslogLevel): 'debug' | 'error' | 'log' | 'warn' => {
	if (level === 'error' || level === 'crit' || level === 'emerg' || level === 'alert') return 'error'
	if (level === 'warning') return 'warn'
	if (level === 'debug') return 'debug'
	return 'log'
}

/**
 * Format a log event for console output.
 *
 * @param {LogEvent} event - The structured log event.
 * @returns {string} Serialized log output.
 */
const formatLogEvent = (event: LogEvent): string => isDev() ? JSON.stringify(event, null, 4) : JSON.stringify(event)

/**
 * Create a browser-safe logger with syslog levels and structured JSON output.
 *
 * @returns {BrowserLogger} Configured browser logger.
 */
const createBrowserLogger = (): BrowserLogger => {
	const logger: BrowserLogger = {
		level: resolveMinLevel(),
		levels: SYSLOG_LEVELS,
		log: (event) => {
			if (!shouldLog(event.level, logger.level)) return

			const serializedError = serializeError(event.error)
			const logEvent: LogEvent = {
				level: event.level,
				message: event.message,
				...(event.source !== undefined ? { source: event.source } : {}),
				...(event.data !== undefined ? { data: event.data } : {}),
				...(serializedError !== undefined ? { error: serializedError } : {}),
			}

			console[consoleMethodForLevel(event.level)](formatLogEvent(logEvent))
		},
	} as BrowserLogger

	for (const level of Object.keys(SYSLOG_LEVELS) as SyslogLevel[]) {
		logger[level] = (message: string, meta: LogMetadata = {}) => {
			logger.log({ level, message, ...meta })
		}
	}

	return logger
}

/**
 * Use the exported logger to log messages in browser environments.
 *
 * @example basic log
 * ```ts
 * import logger from '@frytg/logger/browser'
 *
 * logger.info('my log message', {
 *   source: 'components/MyComponent',
 *   data: { userId: '123' },
 * })
 * ```
 */
export const logger: BrowserLogger = createBrowserLogger()

export default logger
