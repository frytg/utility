# run `just` in the CLI to see the list of shortcuts
_default:
	just --list

update:
	deno run update

test:
	deno test --allow-sys --allow-env --clean --coverage

bench-logger:
	deno run bench-logger

lint:
	deno run -A @biomejs/biome lint

format:
	nubx biome lint --write
	nubx biome format --write
