/**
 * @module
 * {@linkcode hmacSha256 | HMAC SHA-256} and {@linkcode hmacSha512 | HMAC SHA-512} hash functions
 *
 * @example
 * ```ts
 * import { hmacSha512 } from '@frytg/crypto/hmac'
 *
 * hmacSha512('hello world', '0123456789abcdef')
 * ```
 */

// load packages
import { Buffer } from 'node:buffer'
import { createHmac } from 'node:crypto'

const BASE64_ENCODING = 'base64'
const BASE64_REGEX = /^[0-9a-zA-Z+/=]*$/
const HEX_ENCODING = 'hex'
const HEX_REGEX = /^[0-9a-fA-F]*$/

/**
 * Returns a HMAC SHA-256 hash of the input string (as hexadecimal string)
 * @param {string | Buffer} str - The string to hash
 * @param {string | Buffer} key - The key to use for the HMAC, when a string is provided, it will be converted to a Buffer
 * @returns {string} HMAC SHA-256 hash of the input string (hexadecimal)
 *
 * @example
 * ```ts
 * import { hmacSha256 } from '@frytg/crypto/hmac'
 *
 * hmacSha256('hello world', '0123456789abcdef')
 * ```
 */
export const hmacSha256 = (str: string | Buffer, key: string | Buffer): string => {
	const keyBuffer = typeof key === 'string' ? bufferFromHex(key) : key
	return createHmac('sha256', keyBuffer).update(str).digest(HEX_ENCODING)
}

/**
 * Returns a HMAC SHA-512 hash of the input string (as hexadecimal string)
 * @param {string | Buffer} str - The string to hash
 * @param {string | Buffer} key - The key to use for the HMAC, when a string is provided, it will be converted to a Buffer
 * @returns {string} HMAC SHA-512 hash of the input string (hexadecimal)
 *
 * @example
 * ```ts
 * import { hmacSha512 } from '@frytg/crypto/hmac'
 *
 * hmacSha512('hello world', '0123456789abcdef')
 * ```
 */
export const hmacSha512 = (str: string | Buffer, key: string | Buffer): string => {
	const keyBuffer = typeof key === 'string' ? bufferFromHex(key) : key
	return createHmac('sha512', keyBuffer).update(str).digest(HEX_ENCODING)
}

/**
 * Converts a base64 string to a Buffer for use with HMAC
 * @param {string} base64 - The base64 string to convert
 * @returns {Buffer}
 *
 * @example
 * ```ts
 * import { hmacSha512, bufferFromBase64 } from '@frytg/crypto/hmac'
 *
 * hmacSha512('hello world', bufferFromBase64('MDEyMzQ1Njc4OWFiY2RlZg=='))
 * ```
 */
export const bufferFromBase64 = (base64: string): Buffer => {
	// check if base64 string is valid
	if (!BASE64_REGEX.test(base64)) throw new Error('Invalid base64 string')

	return Buffer.from(base64, BASE64_ENCODING)
}

/**
 * Converts a hexadecimal string to a Buffer for use with HMAC
 * @param {string} hex - The hexadecimal string to convert
 * @returns {Buffer}
 *
 * @example
 * ```ts
 * import { hmacSha512, bufferFromHex } from '@frytg/crypto/hmac'
 *
 * hmacSha512('hello world', bufferFromHex('0123456789abcdef'))
 * ```
 */
export const bufferFromHex = (hex: string): Buffer => {
	// check if hex string is valid
	if (!HEX_REGEX.test(hex)) throw new Error('Invalid hex string')

	// check if hex string is even length
	if (hex.length % 2 !== 0) throw new Error('Invalid hex string length')

	return Buffer.from(hex, HEX_ENCODING)
}
