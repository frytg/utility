# Storage (S3) wrapper

[![JSR @frytg/storage-s3](https://jsr.io/badges/@frytg/storage-s3)](https://jsr.io/@frytg/storage-s3)
[![ci](https://github.com/frytg/utility/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/frytg/utility/actions/workflows/test.yml)

This is a simple opinionated wrapper around the S3 library [MinIO](https://min.io/) to access and manipulate S3 objects.

## Usage

```ts
import { getRequiredEnv } from '@frytg/check-required-env/get';
import { getObject } from '@frytg/storage-s3';

const object = await getObject(getRequiredEnv('STORE_S3_BUCKET_NAME'), 'path/to/object.json', { parseJson: true });
```

The MinIO client will be initialized with these required environment variables:

- `STORE_S3_ENDPOINT`
- `STORE_S3_ACCESS_KEY`
- `STORE_S3_SECRET_KEY`

## Methods

- [getObject](https://jsr.io/@frytg/storage-s3/doc/~/getObject)
- [uploadObject](https://jsr.io/@frytg/storage-s3/doc/~/uploadObject)
- [objectExists](https://jsr.io/@frytg/storage-s3/doc/~/objectExists)
- [listObjects](https://jsr.io/@frytg/storage-s3/doc/~/listObjects)

Also see all options in the [MinIO API documentation](https://min.io/docs/minio/linux/developers/javascript/API.html).
They can be used by importing the `Client` object.

## Author

Created by [@frytg](https://github.com/frytg) / [frytg.digital](https://www.frytg.digital)

## License

[Unlicense](https://github.com/frytg/utility/blob/main/LICENSE) - also see [unlicense.org](https://unlicense.org)
