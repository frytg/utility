// load packages
import { getRequiredEnv } from '@frytg/check-required-env/get'
// @deno-types="minio/dist/esm/minio.d.mts"
import { Client } from 'minio'

// create a minio client
export const minioClient = new Client({
	useSSL: true,
	endPoint: getRequiredEnv('S3_ENDPOINT', false),
	accessKey: getRequiredEnv('MY_SCW_ACCESS_KEY', false),
	secretKey: getRequiredEnv('MY_SCW_SECRET_KEY', false),
})
