// load packages
import process from 'node:process'
import { checkRequiredEnv } from '@frytg/check-required-env'
import * as Minio from 'minio'

// check for env
checkRequiredEnv('S3_ENDPOINT')
checkRequiredEnv('MY_SCW_ACCESS_KEY')
checkRequiredEnv('MY_SCW_SECRET_KEY')

export const minioClient = new Minio.Client({
	useSSL: true,
	endPoint: process.env.S3_ENDPOINT,
	accessKey: process.env.MY_SCW_ACCESS_KEY,
	secretKey: process.env.MY_SCW_SECRET_KEY,
})
