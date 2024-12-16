# Winston logging wrapper

[![JSR @frytg/logger](https://jsr.io/badges/@frytg/logger)](https://jsr.io/@frytg/logger)
[![ci](https://github.com/frytg/utility/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/frytg/utility/actions/workflows/test.yml)

This is a simple opinionated wrapper around the logging library [Winston](https://github.com/winstonjs/winston) to provide a logger
that is easy to use and configure.

It accesses and inject several env variables (like runtime or package version) to each log event.

If `IS_LOCAL` is set to `true`, it will use a more human readable, colorized output format, otherwise it will use JSON
on one line.

Debug logs will only be logged if the env `STAGE` is set to `dev`.

## Usage

```ts
import logger from '@frytg/logger';
```

```ts
logger.log({
  level: 'alert',
  message: 'my log message',
  source: 'folder-a/file-b/function-c',
  data: { name: 'my-data' },
});
```

## Log Levels

It is currently pre-configured with the
[syslog log levels](https://github.com/winstonjs/winston?tab=readme-ov-file#logging-levels):

```ts
{
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7
}
```

## Author

Created by [@frytg](https://github.com/frytg) / [frytg.digital](https://www.frytg.digital)

## License

[Unlicense](https://github.com/frytg/utility/blob/main/LICENSE) - also see [unlicense.org](https://unlicense.org)
