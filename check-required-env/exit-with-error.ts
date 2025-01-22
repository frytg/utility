// load packages
import process from 'node:process'
import logger from '@frytg/logger'

/**
 * Check if an variable is set and log an alert and exit if it is not set.
 *
 * @param {string | string[] | object | null | undefined} name - The name of the variable.
 * @returns {void}
 *
 * @example
 * ```ts
 * import { exitWithError } from '@frytg/check-required-env/exit'
 *
 * const someKeyVar = null
 * exitWithError(someKeyVar)
 * ```
 */
export const exitWithError = (input: string | string[] | object | null | undefined): void => {
	// return if the variable is set and not empty
	if (input && input !== '') return

	// log and exit if not set
	logger.log({
		level: 'alert',
		message: `${input} is required`,
		source: 'exitWithError',
		data: { input },
	})
	process.exit(1)
}
