// import packages
import { Buffer } from 'node:buffer'
import process from 'node:process'

// load utils
import { minioClient } from './s3.ts'

// get object from s3
export const getObject = (path: string, parseJson = false, throwError = true) =>
	new Promise((resolve, reject) => {
		const chunks = []
		minioClient
			.getObject(process.env.S3_BUCKET_NAME, path)
			.then((stream) => {
				stream.on('data', (chunk) => chunks.push(chunk))
				stream.on('end', () => {
					const buffer = Buffer.concat(chunks)
					if (parseJson) {
						resolve(JSON.parse(buffer.toString('utf-8')))
					} else {
						resolve(buffer)
					}
				})
				stream.on('error', reject)
			})
			.catch((error) => {
				if (throwError) reject(error)
				else resolve(null)
			})
	})

// upload object to s3
export const uploadObject = async (path: string, data) => {
	// convert data to string if it's an object or array
	let dataString = data
	if (typeof data === 'object' || Array.isArray(data)) {
		dataString = JSON.stringify(data, null, 2)
	}

	// upload object
	await minioClient.putObject(process.env.S3_BUCKET_NAME, path, dataString)
}

// check if object exists in s3
export const objectExists = async (path: string) => {
	try {
		const result = await minioClient.statObject(process.env.S3_BUCKET_NAME, path)
		return result
	} catch (_error) {
		return false
	}
}

// convert a readable stream to a string
const readableStreamToString = (stream: ReadableStream) => {
	return new Promise((resolve, reject) => {
		const chunks = []
		stream.on('data', (chunk) => chunks.push(chunk))
		stream.on('end', () => resolve(chunks))
		stream.on('error', reject)
	})
}

// list objects in s3 with v2
export const listObjects = async (prefix: string, recursive = false) => {
	const result = await minioClient.listObjectsV2(process.env.S3_BUCKET_NAME, prefix, recursive)
	const data = await readableStreamToString(result)
	return data
}
