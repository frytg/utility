import { spawnSync } from 'node:child_process'
import { globSync } from 'node:fs'

const files = globSync('**/*.test.ts', { exclude: ['**/node_modules/**'] })

if (files.length === 0) {
	throw new Error('no test files found')
}

const result = spawnSync('tsx', ['--test', ...files], { stdio: 'inherit' })
process.exit(result.status ?? 1)
