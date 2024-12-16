import { Buffer } from 'node:buffer'
import { test } from '@cross/test'
import { assertEquals } from '@std/assert'

import { bufferFromHex, hmacSha256, hmacSha512 } from './hmac.ts'

test('hmacSha256 - generates correct HMAC SHA-256 hashes', () => {
	const testCases = [
		{
			input: 'hello',
			key: 'secret',
			expected: '88aab3ede8d3adf94d26ab90d3bafd4a2083070c3bcce9c014ee04a443847c0b',
		},
		{
			input: '',
			key: 'secret',
			expected: 'f9e66e179b6747ae54108f82f8ade8b3c25d76fd30afde6c395822c530196169',
		},
		{
			input: 'The quick brown fox jumps over the lazy dog',
			key: 'secret',
			expected: '54cd5b827c0ec938fa072a29b177469c843317b095591dc846767aa338bac600',
		},
	]

	for (const { input, key, expected } of testCases) {
		assertEquals(hmacSha256(input, key), expected, `hmacSha256("${input}", "${key}") should return "${expected}"`)
	}
})

test('hmacSha512 - generates correct HMAC SHA-512 hashes', () => {
	const testCases = [
		{
			input: 'hello',
			key: 'secret',
			expected:
				'db1595ae88a62fd151ec1cba81b98c39df82daae7b4cb9820f446d5bf02f1dcfca6683d88cab3e273f5963ab8ec469a746b5b19086371239f67d1e5f99a79440',
		},
		{
			input: '',
			key: 'secret',
			expected:
				'b0e9650c5faf9cd8ae02276671545424104589b3656731ec193b25d01b07561c27637c2d4d68389d6cf5007a8632c26ec89ba80a01c77a6cdd389ec28db43901',
		},
		{
			input: 'The quick brown fox jumps over the lazy dog',
			key: 'secret',
			expected:
				'76af3588620ef6e2c244d5a360e080c0d649b6dd6b82ccd115eeefee8ff403bcee9aeb08618db9a2a94a9e80c7996bb2cb0c00f6e69de38ed8af2758ef39df0a',
		},
	]

	for (const { input, key, expected } of testCases) {
		assertEquals(hmacSha512(input, key), expected, `hmacSha512("${input}", "${key}") should return "${expected}"`)
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
