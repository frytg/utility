// load packages
import process from 'node:process'
import logger from '@frytg/logger'

/**
 * Access an environment variable and log an alert and exit if it is not set.
 *
 * @param {string} name - The name of the environment variable.
 * @param {boolean} preferThrowError - Whether to throw an error if the environment variable is not set.
 * @returns {string} The value of the environment variable.
 *
 * @example
 * ```ts
 * import { getRequiredEnv } from '@frytg/check-required-env/get'
 *
 * getRequiredEnv('MY_IMPORTANT_ENV_VAR', false)
 * ```
 */
export const getRequiredEnv = (name: string, preferThrowError = true): string => {
	const value = process.env[name]

	// return if the env variable is set
	if (value !== undefined) return value

	// log and exit if not set
	logger.log({
		level: 'alert',
		message: `env ${name} is required`,
		source: 'getRequiredEnv',
		data: { name },
	})
	if (preferThrowError) throw new Error(`env ${name} is required`)
	process.exit(1)
}
