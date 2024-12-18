// load packages
import process from 'node:process'
import { test } from '@cross/test'
import { assertInstanceOf } from '@std/assert'
// @deno-types="minio/dist/esm/minio.d.mts"
import { Client } from 'minio'
import sinon from 'sinon'

test('s3 - exports a Minio.Client instance', async () => {
	// Setup
	const envStub = sinon.stub(process, 'env').value({
		STORE_S3_ENDPOINT: 'test-endpoint',
		STORE_S3_ACCESS_KEY: 'test-access-key',
		STORE_S3_SECRET_KEY: 'test-secret-key',
	})

	// load module with stubbed env
	const { minioClient } = await import('./s3.ts')

	// Verify
	assertInstanceOf(minioClient, Client, 'Should export a Minio.Client instance')

	// Cleanup
	envStub.restore()
})
