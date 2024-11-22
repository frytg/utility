# `@frytg/logger` - Winston wrapper

This is a simple wrapper around Winston to provide a logger that is easy to use and configure.

It accesses and inject several env variables (like runtime or package version) to each log event.

If `IS_LOCAL` is set to `true`, it will use a more human readable, colorized output format, otherwise it will use JSON
on one line.
