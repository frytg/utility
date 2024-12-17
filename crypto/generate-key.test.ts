// load packages
import { Buffer } from 'node:buffer'
import { test } from '@cross/test'
import { assertEquals, assertExists } from '@std/assert'

// load module
import { generateKey } from './generate-key.ts'

test('generateKey - generates keys of correct length', () => {
	const testCases = [{ bytes: 16 }, { bytes: 32 }, { bytes: 64 }, { bytes: 128 }]

	for (const { bytes } of testCases) {
		const key = generateKey(bytes, true)

		// Check buffer length
		assertEquals(key.buffer.length, bytes, `Buffer should be ${bytes} bytes long`)

		// Check hex length (2 characters per byte)
		assertEquals(key.hex.length, bytes * 2, `Hex string should be ${bytes * 2} characters long`)
	}
})

test('generateKey - generates different keys each time', () => {
	const keys = new Set()
	const numKeys = 100
	const bytes = 32

	// Generate multiple keys
	for (let i = 0; i < numKeys; i++) {
		const key = generateKey(bytes, true)
		keys.add(key.hex)
	}

	// All keys should be unique
	assertEquals(keys.size, numKeys, `All ${numKeys} generated keys should be unique`)
})

test('generateKey - returns consistent encodings', () => {
	const key = generateKey(32, true)

	// Buffer to base64
	assertEquals(key.base64, key.buffer.toString('base64'), 'base64 encoding should match Buffer.toString("base64")')

	// Buffer to hex
	assertEquals(key.hex, key.buffer.toString('hex'), 'hex encoding should match Buffer.toString("hex")')

	// base64 back to buffer
	assertEquals(Buffer.from(key.base64, 'base64'), key.buffer, 'base64 string should convert back to original buffer')

	// hex back to buffer
	assertEquals(Buffer.from(key.hex, 'hex'), key.buffer, 'hex string should convert back to original buffer')
})

test('generateKey - uses default length of 32 bytes', () => {
	const key = generateKey(undefined, true)
	assertEquals(key.buffer.length, 32, 'Default key length should be 32 bytes')
})

test('generateKey - returns object with required properties', () => {
	const key = generateKey(32, true)

	// Check that all properties exist
	assertExists(key.buffer, 'Should have buffer property')
	assertExists(key.base64, 'Should have base64 property')
	assertExists(key.hex, 'Should have hex property')

	// Check property types
	assertEquals(key.buffer instanceof Buffer, true, 'buffer should be Buffer instance')
	assertEquals(typeof key.base64, 'string', 'base64 should be string')
	assertEquals(typeof key.hex, 'string', 'hex should be string')
})
