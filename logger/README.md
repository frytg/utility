# Winston logging wrapper

[![JSR @frytg/logger](https://jsr.io/badges/@frytg/logger)](https://jsr.io/@frytg/logger)
[![ci](https://github.com/frytg/utility/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/frytg/utility/actions/workflows/test.yml)

This is a simple opinionated wrapper around the logging library [Winston](https://github.com/winstonjs/winston)
to provide a logger that is easy to use and configure.

It accesses and inject several env variables (like runtime or package version) to each log event.

If `IS_LOCAL` is set to `true`, it will use a more human readable, colorized output format,
otherwise it will use JSON on one line.

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

## Configuration

The logger accesses and injects several env variables to each log event (envs listed in order of priority):

- `host` - the host name (e.g. `my-function`)
  - from env `K_REVISION` - set by Knative such as Google Cloud Run
  - from env`AWS_LAMBDA_FUNCTION_NAME` - set by AWS Lambda
  - from `os.hostname()` - fallback
- `serviceName` - the service name (e.g. `my-service`)
  - from env `SERVICE_NAME` - set by your deployment
  - from env `K_SERVICE` - set by Knative such as Google Cloud Run
- `stage` - the stage (e.g. `dev`)
  - from env `STAGE` - set by your deployment
  - from env `NODE_ENV` - set by your deployment
- `version` - the version (e.g. `1.0.0`)
  - from env `SERVICE_VERSION` - set by your deployment
  - from env `npm_package_version` - set by your deployment in `package.json`
- `region` - the region (e.g. `eu-west-1`)
  - from env `REGION` - set by your deployment
  - from env `AWS_REGION` - set by AWS Lambda
- `runtime` - the runtime (e.g. `nodejs-20.11.0`)
  - from `process.versions.bun` - set by Bun
  - from `process.versions.deno` - set by Deno
  - from env `AWS_EXECUTION_ENV` - set by AWS Lambda
  - from `process.version` - fallback (usually Node.js)

Additionally these environment variables are triggering different logging formats:

- `IS_LOCAL` - set to `true` to use a more human readable, colorized output format that uses multiple lines
- `STAGE` - set to `dev` to enable debug logs

## Log Levels

It is currently pre-configured with the
[syslog log levels](https://github.com/winstonjs/winston?tab=readme-ov-file#logging-levels) from most to least severe:

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
