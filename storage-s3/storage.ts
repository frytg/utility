/**
 * Storage module for S3 with common operations using MinIO.
 * @module
 * @see https://min.io/docs/minio/linux/developers/javascript/API.html
 *
 * @example
 * ```ts
 * import { getObject } from '@frytg/storage-s3'
 *
 * const object = await getObject(process.env.S3_BUCKET_NAME, 'path/to/object.json', { parseJson: true })
 * console.log(object)
 * ```
 */

// import packages
import { Buffer } from 'node:buffer'
import type { BucketItem, BucketItemStat, BucketStream, Client as ClientType } from 'minio/dist/esm/minio.d.mts'

// load utils
import { minioClient } from './s3.ts'

/**
 * The MinIO client.
 * @type {Client}
 *
 * @see https://min.io/docs/minio/linux/developers/javascript/API.html
 *
 * @example Remove an object
 * ```ts
 * import { Client as minioClient } from '@frytg/storage-s3'
 *
 * await minioClient.removeObject('mybucket', 'photo.jpg')
 * ```
 */
export const Client: ClientType = minioClient

/**
 * Retrieves an object from S3.
 * @param {string} bucketName - The name of the bucket to retrieve the object from.
 * @param {string} path - The path to the object in S3.
 * @param {object} options - The options for the operation.
 * @param {boolean} options.parseJson - Whether to parse the object as JSON. Defaults to `false`.
 * @param {boolean} options.throwError - Whether to throw an error if the object does not exist. Defaults to `true`.
 * @returns {Promise<Buffer | string | null>}
 *
 * @see https://min.io/docs/minio/linux/developers/javascript/API.html#getObject
 *
 * @example
 * ```ts
 * import { getRequiredEnv } from '@frytg/check-required-env/get'
 * import { getObject } from '@frytg/storage-s3'
 *
 * const object = await getObject(getRequiredEnv('S3_BUCKET_NAME'), 'path/to/object.json', { parseJson: true })
 * console.log(object)
 * ```
 */
export const getObject = (
	bucketName: string,
	path: string,
	{
		parseJson = false,
		throwError = true,
	}: {
		parseJson?: boolean
		throwError?: boolean
	},
): Promise<Buffer | string | object | null> =>
	new Promise((resolve, reject) => {
		const chunks: Buffer[] = []
		minioClient
			.getObject(bucketName, path)
			.then((stream) => {
				stream.on('data', (chunk) => chunks.push(chunk))
				stream.on('end', () => {
					const buffer = Buffer.concat(chunks)
					if (parseJson) resolve(JSON.parse(buffer.toString('utf-8')))
					else resolve(buffer)
				})
				stream.on('error', reject)
			})
			.catch((error) => {
				if (throwError) reject(error)
				else resolve(null)
			})
	})

/**
 * Uploads an object to S3.
 * @param {string} path - The path to the object in S3.
 * @param {Buffer | string} data - The data to upload. Can be a Buffer or a string. If JSON is passed, it will be stringified.
 * @param {object} options - The options for the operation.
 * @param {string} options.bucketName - The name of the bucket to upload the object to. Defaults to env `S3_BUCKET_NAME`.
 * @returns {Promise<void>}
 *
 * @see https://min.io/docs/minio/linux/developers/javascript/API.html#putObject
 *
 * @example JSON
 * ```ts
 * import { getRequiredEnv } from '@frytg/check-required-env/get'
 * import { uploadObject } from '@frytg/storage-s3'
 *
 * await uploadObject(getRequiredEnv('S3_BUCKET_NAME'), 'path/to/object.json', { foo: 'bar' })
 * ```
 *
 * @example Buffer
 * ```ts
 * import { getRequiredEnv } from '@frytg/check-required-env/get'
 * import { uploadObject } from '@frytg/storage-s3'
 *
 * await uploadObject(getRequiredEnv('S3_BUCKET_NAME'), 'path/to/object.blob', Buffer.from('foo'))
 * ```
 */
export const uploadObject = async (bucketName: string, path: string, data: Buffer | string): Promise<void> => {
	// convert data to string if it's an object or array
	let dataString = data
	if (typeof data === 'object' || Array.isArray(data)) {
		dataString = JSON.stringify(data, null, 2)
	}

	// upload object
	await minioClient.putObject(bucketName, path, dataString)
}

/**
 * Checks if an object exists in S3.
 * @param {string} path - The path to the object in S3.
 * @param {object} options - The options for the operation.
 * @param {string} options.bucketName - The name of the bucket to check for the object. Defaults to env `S3_BUCKET_NAME`.
 * @returns {Promise<BucketItemStat | false>}
 *
 * @see https://min.io/docs/minio/linux/developers/javascript/API.html#statObject
 *
 * @example
 * ```ts
 * import { getRequiredEnv } from '@frytg/check-required-env/get'
 * import { objectExists } from '@frytg/storage-s3'
 *
 * const exists = await objectExists(getRequiredEnv('S3_BUCKET_NAME'), 'path/to/object.json')
 * console.log(exists) // null if it doesn't exist, otherwise the object stat
 * ```
 */
export const objectExists = async (bucketName: string, path: string): Promise<BucketItemStat | Promise<null>> => {
	try {
		// explicitly awaiting the result to avoid unhandled promise rejection
		const result: BucketItemStat = await minioClient.statObject(bucketName, path)
		return result
	} catch (_error) {
		return null
	}
}

// convert a readable stream to a string (for listObjects)
const readableStreamForListObjects = (stream: BucketStream<BucketItem>): Promise<BucketItem[]> =>
	new Promise((resolve, reject) => {
		const chunks: BucketItem[] = []
		stream.on('data', (chunk) => chunks.push(chunk))
		stream.on('end', () => resolve(chunks))
		stream.on('error', reject)
	})

/**
 * Lists objects in S3.
 * @param {string} prefix - The prefix to filter the objects by.
 * @param {object} options - The options for the operation.
 * @param {boolean} options.recursive - Whether to list recursively. Defaults to `false`.
 * @param {string} options.bucketName - The name of the bucket to list the objects from. Defaults to env `S3_BUCKET_NAME`.
 * @returns {Promise<BucketItem[]>}
 *
 * @see https://min.io/docs/minio/linux/developers/javascript/API.html#listObjectsV2
 *
 * @example
 * ```ts
 * import { getRequiredEnv } from '@frytg/check-required-env/get'
 * import { listObjects } from '@frytg/storage-s3'
 *
 * const objects = await listObjects(getRequiredEnv('S3_BUCKET_NAME'), 'path/to/prefix')
 * console.log(objects)
 * ```
 *
 * @example Recursive
 * ```ts
 * import { getRequiredEnv } from '@frytg/check-required-env/get'
 * import { listObjects } from '@frytg/storage-s3'
 *
 * const objects = await listObjects(getRequiredEnv('S3_BUCKET_NAME'), 'path/to/prefix', { recursive: true })
 * console.log(objects)
 * ```
 */
export const listObjects = async (
	bucketName: string,
	prefix: string,
	{
		recursive = false,
	}: {
		recursive?: boolean
	},
): Promise<BucketItem[]> => {
	const result: BucketStream<BucketItem> = await minioClient.listObjectsV2(bucketName, prefix, recursive)
	return readableStreamForListObjects(result)
}
