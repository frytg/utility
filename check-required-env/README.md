# Check a required environment variable

[![JSR @frytg/check-required-env](https://jsr.io/badges/@frytg/check-required-env)](https://jsr.io/@frytg/check-required-env)
[![ci](https://github.com/frytg/utility/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/frytg/utility/actions/workflows/test.yml)

Simply check if a certain required environment variable is set. If not, throw an error and exit the process.

```ts
import { checkRequiredEnv } from '@frytg/check-required-env';

checkRequiredEnv('MY_IMPORTANT_ENV_VAR');
```

It uses the logger from [`@frytg/logger`](https://jsr.io/@frytg/logger) to log the error and exit the process (with code 1).

## Author

Created by [@frytg](https://github.com/frytg) / [frytg.digital](https://www.frytg.digital)

## License

[Unlicense](https://github.com/frytg/utility/blob/main/LICENSE) - also see [unlicense.org](https://unlicense.org)
