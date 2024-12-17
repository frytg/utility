// load packages
import { test } from '@cross/test'
import { assertEquals } from '@std/assert'

// load module
import { hashSha256, hashSha512 } from './hash.ts'

test('hashSha256 - generates correct SHA-256 hashes', () => {
	const testCases = [
		{
			input: 'hello',
			expected: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
		},
		{
			input: '',
			expected: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
		},
		{
			input: 'The quick brown fox jumps over the lazy dog',
			expected: 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
		},
	]

	for (const { input, expected } of testCases) {
		assertEquals(hashSha256(input), expected, `hashSha256("${input}") should return "${expected}"`)
	}
})

test('hashSha512 - generates correct SHA-512 hashes', () => {
	const testCases = [
		{
			input: 'hello',
			expected:
				'9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
		},
		{
			input: '',
			expected:
				'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
		},
		{
			input: 'The quick brown fox jumps over the lazy dog',
			expected:
				'07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6',
		},
	]

	for (const { input, expected } of testCases) {
		assertEquals(hashSha512(input), expected, `hashSha512("${input}") should return "${expected}"`)
	}
})
