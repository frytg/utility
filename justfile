# run `just` in the CLI to see the list of shortcuts
_default:
	just --list

test:
	deno test --allow-sys --allow-env --clean --coverage

bench-logger:
	deno run bench-logger

lint:
	deno run -A oxlint

format:
	bunx oxlint --fix
	bunx oxfmt

# install toolchain (mise)
[group('DEV-SETUP')]
install *args:
	mise install {{ args }}

# update package dependencies
[group('DEV-SETUP')]
update *args:
	deno run update
	mise upgrade --bump -y --local {{ args }}
	mise outdated --quiet {{ args }}
	mise lock {{ args }}
