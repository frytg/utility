# Utility packages

[![JSR @frytg](https://jsr.io/badges/@frytg)](https://jsr.io/@frytg)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

A collection of utilities for TypeScript and JavaScript.

This repository is work in progress.

## Tools

- [`@frytg/check-required-env`](./check-required-env/README.md) - Check a required environment variable
- [`@frytg/logger`](./logger/README.md) - Winston logging wrapper

## Lint

Use `deno fmt`, `deno lint` and `biome lint` to check the code.

```bash
deno task check
```

See [_Writing documentation_](https://jsr.io/docs/writing-docs) for details about writing JSDoc.

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
