// load packages
import process from 'node:process'
// @deno-types="minio/dist/esm/minio.d.mts"
import { Client } from 'minio'

// check environment variables
if (!process.env.STORE_S3_ENDPOINT) throw new Error('Environment variable STORE_S3_ENDPOINT is not defined')
if (!process.env.STORE_S3_ACCESS_KEY) throw new Error('Environment variable STORE_S3_ACCESS_KEY is not defined')
if (!process.env.STORE_S3_SECRET_KEY) throw new Error('Environment variable STORE_S3_SECRET_KEY is not defined')

// create a minio client
export const minioClient = new Client({
	useSSL: true,
	endPoint: process.env.STORE_S3_ENDPOINT,
	accessKey: process.env.STORE_S3_ACCESS_KEY,
	secretKey: process.env.STORE_S3_SECRET_KEY,
})
