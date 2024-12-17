// load packages
import { Buffer } from 'node:buffer'
import { test } from '@cross/test'
import { assertEquals, assertThrows } from '@std/assert'

// load module
import { bufferFromBase64, bufferFromHex } from './hmac.ts'

test('bufferFromBase64 - converts base64 strings to Buffer correctly', () => {
	const testCases = [
		{
			input: 'aGVsbG8=', // "hello"
			expected: Buffer.from('hello'),
		},
		{
			input: '', // empty string
			expected: Buffer.from(''),
		},
		{
			input: 'YWJjZGVmMTIzNDU2', // "abcdef123456"
			expected: Buffer.from('abcdef123456'),
		},
		{
			input: 'Zm9vIGJhcg==', // "foo bar"
			expected: Buffer.from('foo bar'),
		},
	]

	for (const { input, expected } of testCases) {
		assertEquals(bufferFromBase64(input), expected, `bufferFromBase64("${input}") should return correct Buffer`)
	}
})

test('bufferFromBase64 - validates valid base64 strings correctly', () => {
	// Valid base64 strings should work
	const validBase64 = [
		'aGVsbG8=', // normal case
		'', // empty string
		'YQ==', // single char padding
		'YWI=', // double char padding
		'YWJj', // no padding needed
		'YWJjZA==', // standard padding
	]

	for (const base64 of validBase64) {
		assertEquals(
			typeof bufferFromBase64(base64),
			'object',
			`bufferFromBase64 should accept valid base64 string "${base64}".`,
		)
	}
})

test('bufferFromBase64 - validates invalid base64 strings correctly', () => {
	// Invalid base64 strings should throw
	const invalidBase64 = [
		'!@#$', // invalid characters
		'hello', // not base64
		'YW JjZA==', // spaces
	]

	for (const base64 of invalidBase64) {
		assertThrows(
			() => bufferFromBase64(base64),
			Error,
			'base64', // error message should include
			`bufferFromBase64 should reject invalid base64 string "${base64}".`,
		)
	}
})

test('bufferFromHex - converts hex strings to Buffer correctly', () => {
	const testCases = [
		{
			input: '0123456789abcdef',
			expected: Buffer.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]),
		},
		{
			input: 'ff00ff00',
			expected: Buffer.from([0xff, 0x00, 0xff, 0x00]),
		},
		{
			input: '',
			expected: Buffer.from([]),
		},
	]

	for (const { input, expected } of testCases) {
		assertEquals(bufferFromHex(input), expected, `bufferFromHex("${input}") should return correct Buffer`)
	}
})

test('bufferFromHex - validates hex strings correctly', () => {
	// Valid hex strings should work
	const validHexes = ['0123456789abcdef', 'ABCDEF', '', '00', 'ff', 'deadbeef']

	for (const hex of validHexes) {
		assertEquals(typeof bufferFromHex(hex), 'object', `bufferFromHex should accept valid hex string "${hex}"`)
	}

	// Invalid hex strings should throw
	const invalidHexes = [
		'0123456789abcdefg', // invalid hex char
		'0123456789abcdef0', // odd length
		'xyz', // non-hex chars
		'gh', // non-hex chars
		'   ', // whitespace
		'12 34', // spaces
		'12-34', // dashes
	]

	for (const hex of invalidHexes) {
		assertThrows(
			() => bufferFromHex(hex),
			Error,
			'Invalid hex string', // error message should include
			`bufferFromHex should reject invalid hex string "${hex}"`,
		)
	}
})
