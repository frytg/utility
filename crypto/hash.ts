/**
 * @module
 * {@linkcode hashSha256 | SHA-256} and {@linkcode hashSha512 | SHA-512} hash functions
 *
 * @example
 * ```ts
 * import { hashSha512 } from '@frytg/crypto/hash'
 *
 * hashSha512('hello world')
 * ```
 */

// load packages
import { createHash } from 'node:crypto'

const HEX_ENCODING = 'hex'

/**
 * Returns a SHA-256 hash of the input string (as hexadecimal string)
 * @param str - The string to hash
 * @returns SHA-256 hash of the input string (hexadecimal)
 *
 * @example SHA-256
 * ```ts
 * import { hashSha256 } from '@frytg/crypto/hash'
 *
 * hashSha256('hello world')
 * ```
 */
export const hashSha256 = (str: string): string => createHash('sha256').update(str).digest(HEX_ENCODING)

/**
 * Returns a SHA-512 hash of the input string (as hexadecimal string)
 * @param str - The string to hash
 * @returns SHA-512 hash of the input string (hexadecimal)
 *
 * @example SHA-512
 * ```ts
 * import { hashSha512 } from '@frytg/crypto/hash'
 *
 * hashSha512('hello world')
 * ```
 */
export const hashSha512 = (str: string): string => createHash('sha512').update(str).digest(HEX_ENCODING)
