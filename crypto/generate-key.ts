// deno-lint-ignore-file no-console
/**
 * @module
 *
 * This module provides a function to generate a key of the specified number of bytes and print the key in base64 and hex to the console or return the key as a Buffer.
 *
 * @example
 * ```ts
 * import { generateKey } from '@frytg/crypto/generate-key'
 *
 * generateKey(32, true)
 * ```
 */

// load packages
import type { Buffer } from 'node:buffer'
import crypto from 'node:crypto'

/**
 * Generates a key of the specified number of bytes and prints the key in base64 and hex to the console
 *
 * @param {number} bytes - The number of bytes to generate
 * @param {boolean} skipConsole - Whether to skip printing to the console
 * @returns {Object} The key in buffer, base64 and hex
 *
 * @example
 * ```ts
 * import { generateKey } from '@frytg/crypto/generate-key'
 *
 * generateKey(64, true)
 * ```
 */
export const generateKey = (bytes = 32, skipConsole = false): { buffer: Buffer; base64: string; hex: string } => {
	// generate key
	if (!skipConsole) console.group(`Generating ${bytes} byte key...\n`)

	// generate key
	const buffer = crypto.randomBytes(bytes)

	// encode key in base64
	const encodedKeyBase64 = buffer.toString('base64')
	if (!skipConsole) console.log(`Base 64 encoded key:\n${encodedKeyBase64}\n`)

	// encode key in hex
	const encodedKeyHex = buffer.toString('hex')
	if (!skipConsole) console.log(`Hex encoded key:\n${encodedKeyHex}\n`)

	if (!skipConsole) console.groupEnd()

	return {
		buffer,
		base64: encodedKeyBase64,
		hex: encodedKeyHex,
	}
}
