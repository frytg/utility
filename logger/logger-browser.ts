// deno-lint-ignore-file no-console
/**
 * @module
 * A browser-safe logger with the same log event shape as `@frytg/logger`.
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

type GlobalContext = {
	host: string | null
	serviceName: string | null
	stage: string | null
	version: string | null
	region: string | null
	runtime: string
}

type LogEvent = LogMetadata & GlobalContext & {
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

let cachedBrowserRuntime: string | undefined

/**
 * Read a configuration value from browser-safe environment sources.
 *
 * @param {string} key - Environment variable name.
 * @returns {string | undefined} The value when present.
 */
const readEnv = (key: string): string | undefined => {
	const metaEnv = (import.meta as ImportMeta & { env?: ImportMetaEnv }).env
	const metaValue = metaEnv?.[key]
	if (typeof metaValue === 'string' && metaValue !== '') return metaValue

	const globalEnv = (globalThis as { __ENV__?: Record<string, string> }).__ENV__
	const globalValue = globalEnv?.[key]
	if (globalValue !== undefined && globalValue !== '') return globalValue

	return undefined
}

/**
 * Detect and return the browser runtime label.
 *
 * @returns {string} A browser runtime identifier.
 */
export const detectBrowserRuntime = (): string => {
	if (cachedBrowserRuntime !== undefined) return cachedBrowserRuntime

	if (typeof navigator !== 'undefined' && navigator.userAgent) {
		cachedBrowserRuntime = `browser-${navigator.userAgent}`
	} else {
		cachedBrowserRuntime = 'browser-unknown'
	}

	return cachedBrowserRuntime
}

/**
 * Resolve the minimum log level from environment configuration.
 *
 * @returns {SyslogLevel} The configured minimum log level.
 */
const resolveMinLevel = (): SyslogLevel => {
	const stage = readEnv('STAGE') ?? readEnv('NODE_ENV') ?? readEnv('MODE') ?? readEnv('VITE_STAGE')
	return stage === 'dev' ? 'debug' : 'info'
}

/**
 * Determine whether local, colorized output should be used.
 *
 * @returns {boolean} True when local output is enabled.
 */
const isLocalOutput = (): boolean => readEnv('IS_LOCAL') === 'true' || readEnv('DEV') === 'true'

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
 * Build global context fields injected into each log event.
 *
 * @returns {GlobalContext} Global log context.
 */
const buildGlobalContext = (): GlobalContext => ({
	host: readEnv('K_REVISION') ??
		readEnv('HOST') ??
		(typeof globalThis.location !== 'undefined' ? globalThis.location.hostname : null),
	serviceName: readEnv('SERVICE_NAME') ?? readEnv('K_SERVICE') ?? readEnv('VITE_SERVICE_NAME') ?? null,
	stage: readEnv('STAGE') ?? readEnv('NODE_ENV') ?? readEnv('MODE') ?? readEnv('VITE_STAGE') ?? null,
	version: readEnv('SERVICE_VERSION') ?? readEnv('npm_package_version') ?? readEnv('VITE_SERVICE_VERSION') ??
		null,
	region: readEnv('REGION') ?? readEnv('AWS_REGION') ?? readEnv('FLY_REGION') ?? readEnv('DENO_REGION') ??
		null,
	runtime: detectBrowserRuntime(),
})

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
 * Format a log event for output.
 *
 * @param {LogEvent} event - The structured log event.
 * @returns {string} Serialized log output.
 */
const formatLogEvent = (event: LogEvent): string =>
	isLocalOutput() ? JSON.stringify(event, null, 4) : JSON.stringify(event)

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
				...buildGlobalContext(),
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
 * logger.log({
 *   level: 'debug',
 *   message: 'my log message',
 *   source: 'folder-a/file-b/function-c',
 *   data: { name: 'my-data' },
 * })
 * ```
 */
export const logger: BrowserLogger = createBrowserLogger()

export default logger
