# Storage (S3) wrapper

[![JSR @frytg/storage-s3](https://jsr.io/badges/@frytg/storage-s3)](https://jsr.io/@frytg/storage-s3)
[![ci](https://github.com/frytg/utility/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/frytg/utility/actions/workflows/test.yml)

This is a simple opinionated wrapper around the S3 library [MinIO](https://min.io/) to access and manipulate S3 objects.

## Usage

```ts
import { getObject } from '@frytg/storage-s3';

const object = await getObject('path/to/object.json', { parseJson: true });
```

## Methods

- [getObject](https://jsr.io/@frytg/storage-s3/doc/~/getObject)
- [uploadObject](https://jsr.io/@frytg/storage-s3/doc/~/uploadObject)
- [objectExists](https://jsr.io/@frytg/storage-s3/doc/~/objectExists)
- [listObjects](https://jsr.io/@frytg/storage-s3/doc/~/listObjects)

## Author

Created by [@frytg](https://github.com/frytg) / [frytg.digital](https://www.frytg.digital)

## License

[Unlicense](https://github.com/frytg/utility/blob/main/LICENSE) - also see [unlicense.org](https://unlicense.org)
