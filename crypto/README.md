# Crypto utilities

[![JSR @frytg/crypto](https://jsr.io/badges/@frytg/crypto)](https://jsr.io/@frytg/crypto)
[![ci](https://github.com/frytg/utility/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/frytg/utility/actions/workflows/test.yml)

This package provides functions to compute SHA-256 and SHA-512 hashes using [native Node crypto](https://nodejs.org/api/crypto.html).

- [full docs on JSR](https://jsr.io/@frytg/crypto/doc)
- [Hash (SHA-256 or SHA-512)](https://jsr.io/@frytg/crypto/doc/hash)
- [HMAC (SHA-256 or SHA-512)](https://jsr.io/@frytg/crypto/doc/hmac)
- [generate default keys](https://jsr.io/@frytg/crypto/doc/generate-default-keys)
- [generate key](https://jsr.io/@frytg/crypto/doc/generate-key)

## Generate default keys

You can generate default keys for common key sizes by running the following command:

```bash
deno run jsr:@frytg/crypto/generate-default-keys
```

The output will be printed to the console.

Those can be used for HMAC or encryption key generation.
Google Cloud Storage for example uses 32 byte keys (in base64) for [customer-supplied](https://cloud.google.com/storage/docs/encryption/customer-supplied-keys) [encryption keys](https://cloud.google.com/storage/docs/encryption/using-customer-supplied-keys#storage-upload-encrypted-object-nodejs).

For SHA-256 the recommended key size is 32 bytes (256 bits) and for SHA-512 it is 64 bytes (512 bits) (see [RFC 2104](https://www.rfc-editor.org/rfc/rfc2104#section-2) - section 2 and 3).

## Author

Created by [@frytg](https://github.com/frytg) / [frytg.digital](https://www.frytg.digital)

## License

[Unlicense](https://github.com/frytg/utility/blob/main/LICENSE) - also see [unlicense.org](https://unlicense.org)
