# Utility packages

[![JSR @frytg](https://jsr.io/badges/@frytg)](https://jsr.io/@frytg)
[![ci](https://github.com/frytg/utility/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/frytg/utility/actions/workflows/test.yml)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

A collection of utilities for TypeScript and JavaScript.

This repository is work in progress.

## Tools

- [`@frytg/check-required-env`](./check-required-env/README.md) - Check a required environment variable
- [`@frytg/dates`](./dates/README.md) - Date utilities around Luxon
- [`@frytg/logger`](./logger/README.md) - Pre-configuredWinston logging wrapper

## More Tooling

Planned for this utility package:

- `hashes` - sha256, sha512, etc.

Other tools that I regularly use and don't feel the need to optimize or re-create in this utility package:

- [`axios`](https://github.com/axios/axios) - _Promise based HTTP client for the browser and node.js_
- [`hono`](https://jsr.io/@hono/hono) - _small, simple, and ultrafast web framework built on Web Standards_
- [`undici`](https://github.com/nodejs/undici) - performant HTTP/1.1 client for Node.js

## Lint

Use `deno fmt`, `deno lint` and `biome lint` to check the code.

```bash
deno task check
```

See [_Writing documentation_](https://jsr.io/docs/writing-docs) for details about writing JSDoc.

## Testing

This uses [`@cross/test`](https://jsr.io/@cross/test) and [`sinon`](https://sinonjs.org) to run the tests.

```bash
deno task test
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

[Unlicense](./LICENSE) - also see [unlicense.org](https://unlicense.org)
