# Date utilities

[![JSR @frytg/dates](https://jsr.io/badges/@frytg/dates)](https://jsr.io/@frytg/dates)
[![ci](https://github.com/frytg/utility/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/frytg/utility/actions/workflows/test.yml)

This is a simple opinionated wrapper around the [Luxon](https://github.com/moment/luxon) library to provide pre-configured helpers.

For example, to get the current date in ISO format:

```ts
import { getISO } from '@frytg/dates';

getISO(); // returns string like 2025-01-01T00:00:00.000Z
```

You can also use the full `DateTime` object from Luxon:

```ts
import { DateTime } from '@frytg/dates';

const date = DateTime.fromMillis(1719859200000);
```

## Author

Created by [@frytg](https://github.com/frytg) / [frytg.digital](https://www.frytg.digital)

## License

[Unlicense](https://github.com/frytg/utility/blob/main/LICENSE) - also see [unlicense.org](https://unlicense.org)
