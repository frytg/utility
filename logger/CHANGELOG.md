# Logger Changelog

## 2026-07-13 - 0.1.0

- feat: added `@frytg/logger/browser` entry for frontend apps as a structured `console` replacement
- feat: shared `syslog-levels` and `serialize-error` modules used by server and browser loggers
- refactor: browser logger logs caller-provided fields only; dev builds use `import.meta.env.DEV` / `MODE`

## 2026-07-13 - 0.0.4

- feat: added Fly.io and Deno Deploy context to log events
- fix: detect runtime once at module load instead of on every log event

## 2025-01-10 - 0.0.3

- feat: added AWS Lambda context to log events

## 2024-11-22 - 0.0.2

- feat: added basic setup
