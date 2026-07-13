# Utility packages

[![JSR @frytg](https://jsr.io/badges/@frytg)](https://jsr.io/@frytg)
[![ci](https://github.com/frytg/utility/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/frytg/utility/actions/workflows/test.yml)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

A collection of utilities for TypeScript and JavaScript.

The primary repository lives on [tangled.org](https://tangled.org/frytg.digital/utility), which gets synced to [github.com](https://github.com/frytg/utility).

It is tested against Bun, Deno, and Node.js runtimes. Published on [jsr.io (`@frytg`)](https://jsr.io/@frytg).

## Tools

- [`@frytg/check-required-env`](./check-required-env/README.md) - Check a required environment variable
- [`@frytg/crypto`](./crypto/README.md) - Crypto utilities (hash, hmac, etc.)
- [`@frytg/dates`](./dates/README.md) - Date utilities around Luxon
- [`@frytg/logger`](./logger/README.md) - Pre-configuredWinston logging wrapper

## Lint

Uses Biome to check the code.

```bash
just lint
```

See [_Writing documentation_](https://jsr.io/docs/writing-docs) for details about writing JSDoc.

## Testing

This uses [`@cross/test`](https://jsr.io/@cross/test) and [`sinon`](https://sinonjs.org) to run the tests.

```bash
just test
```

For Node.js and Bun, install dependencies with [Nub](https://nubjs.com/docs) and run tests:

```bash
nub install
nub run test
```

## Publish

Locally check if everything is ok:

```bash
deno publish --dry-run
```

Then once everything is pushed or merged on `main`, run the GitHub actions workflow to publish the packages to JSR
(see [_publishing packages_](https://jsr.io/docs/publishing-packages) for more details).

## Author

Created by [@frytg](https://github.com/frytg) / [frytg.digital](https://www.frytg.digital)

## License

[MIT](./LICENSE)
