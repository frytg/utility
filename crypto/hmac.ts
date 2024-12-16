// load package
import { Buffer } from 'node:buffer'
import { createHmac } from 'node:crypto'

const HEX_ENCODING = 'hex'

/**
 * Returns a HMAC SHA-256 hash of the input string (as hexadecimal string)
 * @param str - The string to hash
 * @param key - The key to use for the HMAC
 * @returns HMAC SHA-256 hash of the input string (hexadecimal)
 *
 * @example
 * ```ts
 * import { hmacSha256 } from '@frytg/crypto/hmac'
 *
 * hmacSha256('hello', 'my-secret-key')
 * ```
 */
export const hmacSha256 = (str: string | Buffer, key: string | Buffer): string =>
	createHmac('sha256', key).update(str).digest(HEX_ENCODING)

/**
 * Returns a HMAC SHA-512 hash of the input string (as hexadecimal string)
 * @param str - The string to hash
 * @param key - The key to use for the HMAC
 * @returns HMAC SHA-512 hash of the input string (hexadecimal)
 *
 * @example
 * ```ts
 * import { hmacSha512 } from '@frytg/crypto/hmac'
 *
 * hmacSha512('hello', 'my-secret-key')
 * ```
 */
export const hmacSha512 = (str: string | Buffer, key: string | Buffer): string =>
	createHmac('sha512', key).update(str).digest(HEX_ENCODING)

/**
 * Converts a hexadecimal string to a Buffer for use with HMAC
 * @param hex - The hexadecimal string to convert
 * @returns Buffer
 *
 * @example
 * ```ts
 * import { hmacSha512, bufferFromHex } from '@frytg/crypto/hmac'
 *
 * hmacSha512('hello', bufferFromHex('0123456789abcdef'))
 * ```
 */
export const bufferFromHex = (hex: string): Buffer => Buffer.from(hex, HEX_ENCODING)
