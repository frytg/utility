/**
 * @module
 * Shared error serialization for structured log events.
 */

export type SerializedError = {
	message: string
	stack?: string
	[key: string]: unknown
}

/**
 * Serialize an error for structured logging.
 *
 * @param {unknown} error - The error value to serialize.
 * @returns {SerializedError | undefined} Serialized error fields.
 */
export const serializeError = (error: unknown): SerializedError | undefined => {
	if (!(error instanceof Error)) return undefined

	return {
		...error,
		message: error.message,
		...(error.stack !== undefined ? { stack: error.stack } : {}),
	}
}
