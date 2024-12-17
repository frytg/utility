// load packages
import { test } from '@cross/test'
import { assertEquals } from '@std/assert'

// load module
import { hmacSha256, hmacSha512 } from './hmac.ts'

test('hmacSha256 - generates correct HMAC SHA-256 hashes', () => {
	const testCases = [
		{
			input: 'hello',
			key: '0123456789abcdef',
			expected: '58341de110352e89a9dfe341aede35073e34b5640f006ed94208efa321d68994',
		},
		{
			input: '',
			key: '0123456789abcdef',
			expected: 'f2f24bb00417d3d905c2fc9b659fbe5310af55be93eb00524fc2021e3cc29a88',
		},
		{
			input: 'The quick brown fox jumps over the lazy dog',
			key: '0123456789abcdef',
			expected: '5a4921e469387c921b75e6f135db948ab94a0ee5d28c8d8706df5df3c09a8095',
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
			key: '0123456789abcdef',
			expected:
				'e603296d6ec667b62905984498c87cee7c35625fac4517108d74ac169ab0a6727a65d4786cd11c3c0851b8505983714f58ee2156f32093e9360cb275539802e9',
		},
		{
			input: '',
			key: '0123456789abcdef',
			expected:
				'acae8450151bdbb810f41200da1bf26ef2756037bcdc930b014cbbc5fccb3b9ddc0cdcee6b05fa07d88e65af87d202e6dd8d0c5303a8a0866a2a5ce505779808',
		},
		{
			input: 'The quick brown fox jumps over the lazy dog',
			key: '0123456789abcdef',
			expected:
				'10e7297c19413a9129c9ac57779baa43b273198bce8b27b2e3e3e764c2792d430f46742bf57d1c9d8c6593e70c891d384472a508ac44a2ec92effff1ff850ba4',
		},
	]

	for (const { input, key, expected } of testCases) {
		assertEquals(hmacSha512(input, key), expected, `hmacSha512("${input}", "${key}") should return "${expected}"`)
	}
})
