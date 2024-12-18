// load packages
import process from 'node:process'
import logger from '@frytg/logger'

/**
 * Check if an environment variable is required and log an alert and exit if it is not set.
 *
 * @param {string} name - The name of the environment variable.
 * @returns {void}
 *
 * @example
 * ```ts
 * import { checkRequiredEnv } from '@frytg/check-required-env'
 *
 * checkRequiredEnv('MY_IMPORTANT_ENV_VAR')
 * ```
 */
export const checkRequiredEnv = (name: string): void => {
	// return if the env variable is set
	if (process.env[name]) return

	// log and exit if not set
	logger.log({
		level: 'alert',
		message: `env ${name} is required`,
		source: 'checkRequiredEnv',
		data: { name },
	})
	process.exit(1)
}
