/**
 * Benchmark @frytg/logger against a plain Winston JSON logger.
 *
 * Usage: deno run -A logger/benchmark.ts [iterations]
 */

import process from 'node:process'
import { config, createLogger, format, transports } from 'winston'

const DEFAULT_ITERATIONS = 50_000
const WARMUP_ITERATIONS = 1_000

process.env.STAGE = 'prod'
process.env.IS_LOCAL = 'false'
process.env.SERVICE_NAME = 'benchmark-service'
process.env.SERVICE_VERSION = '0.0.0'

const { detectProcessVersion, logger: frytgLogger } = await import('./logger.ts')

type BenchCase = {
	name: string
	run: () => void
}

/**
 * Silence stdout writes so benchmark timing is not dominated by terminal I/O.
 *
 * @returns restore function
 */
const silenceStdout = (): (() => void) => {
	const originalWrite = process.stdout.write.bind(process.stdout)
	process.stdout.write = (() => true) as typeof process.stdout.write
	return () => {
		process.stdout.write = originalWrite
	}
}

/**
 * Run a benchmark case with warmup and return ops/sec.
 *
 * @param benchCase - case name and run function
 * @param iterations - measured iterations
 * @returns operations per second
 */
const runBenchCase = (benchCase: BenchCase, iterations: number): number => {
	const restoreStdout = silenceStdout()
	try {
		for (let i = 0; i < WARMUP_ITERATIONS; i++) benchCase.run()

		const start = performance.now()
		for (let i = 0; i < iterations; i++) benchCase.run()
		const durationMs = performance.now() - start

		return (iterations / durationMs) * 1000
	} finally {
		restoreStdout()
	}
}

/**
 * Print a formatted line to stdout.
 *
 * @param line - text to print
 */
const printLine = (line: string): void => {
	process.stdout.write(`${line}\n`)
}

const plainLogger = createLogger({
	level: 'info',
	levels: config.syslog.levels,
	exitOnError: false,
	format: format.combine(format.timestamp(), format.json()),
	transports: [new transports.Console()],
})

const logPayload = {
	message: 'benchmark message',
	source: 'logger/benchmark.ts',
	data: { requestId: 'abc-123', userId: 42, nested: { ok: true } },
}

const iterations = Number.parseInt(Deno.args[0] ?? `${DEFAULT_ITERATIONS}`, 10)

const cases: BenchCase[] = [
	{
		name: 'winston (json)',
		run: () => plainLogger.info(logPayload),
	},
	{
		name: '@frytg/logger (json)',
		run: () => frytgLogger.info(logPayload.message, logPayload),
	},
]

printLine(`Logger benchmark (${iterations.toLocaleString()} iterations, runtime: ${detectProcessVersion()})`)
printLine('')

const results = cases.map((benchCase) => ({
	name: benchCase.name,
	ops: runBenchCase(benchCase, iterations),
}))

const baselineOps = results[0].ops

for (const result of results) {
	const relative = result.ops / baselineOps
	const relativeLabel = result === results[0] ? 'baseline' : `${(relative * 100).toFixed(1)}%`
	printLine(`${result.name.padEnd(24)} ${result.ops.toFixed(0).padStart(10)} ops/s  (${relativeLabel})`)
}
