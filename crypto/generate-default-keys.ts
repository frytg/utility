/**
 * @module
 * Run key generation for default key sizes and print the results to the console
 *
 * @example
 * ```bash
 * deno run jsr:@frytg/crypto/generate-default-keys
 * ```
 */

// load module
import { generateKey } from './generate-key.ts'

generateKey(32)
generateKey(64)
generateKey(128)
