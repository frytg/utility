/**
 * @module
 * Shared syslog level definitions used by server and browser loggers.
 */

export const SYSLOG_LEVELS = {
	emerg: 0,
	alert: 1,
	crit: 2,
	error: 3,
	warning: 4,
	notice: 5,
	info: 6,
	debug: 7,
} as const

export type SyslogLevel = keyof typeof SYSLOG_LEVELS

/**
 * Determine whether a log event should be emitted for the configured level.
 *
 * @param {SyslogLevel} eventLevel - The event severity.
 * @param {SyslogLevel} configuredLevel - The configured minimum level.
 * @returns {boolean} True when the event should be logged.
 */
export const shouldLog = (eventLevel: SyslogLevel, configuredLevel: SyslogLevel): boolean =>
	SYSLOG_LEVELS[eventLevel] <= SYSLOG_LEVELS[configuredLevel]
