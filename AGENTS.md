# @frytg/utility monorepo

A Deno workspace of `@frytg/*` utility packages published to [JSR](https://jsr.io/@frytg). The primary remote is [Tangled](https://tangled.org/frytg.digital/utility); GitHub is a mirror driven by a Spindle workflow. Code is tested on Bun, Deno, and Node 24 / 26 across Linux, macOS, and Windows. License is MIT (Daniel Freytag).

## AI agents: never auto-commit

AI agents MUST NEVER automatically commit to git. Do not run `git commit`, `git push`, `git tag`, `gh pr create`, or any other command that mutates repo history or opens a PR without explicit confirmation in the current conversation. Stage nothing, push nothing, open nothing — the agent's job ends at the diff. Wait for the user to say so.

This rule applies even when the change looks safe, the tests pass, and the commit message is already drafted. It's about who triggers the action, not whether the action is correct.

## Layout

- Root `deno.jsonc` declares four workspaces: `./check-required-env`, `./crypto`, `./dates`, `./logger`.
- Each workspace ships its own `deno.jsonc` with `name`, `version`, `exports`, `imports`, and `publish.exclude`. Tests (`*.test.ts`) are always excluded from publish; `logger` also excludes `benchmark.ts`.
- Lockfiles (`deno.lock`, `bun.lock`) are committed and reviewed. No floating `latest` in CI.

## Tooling

- **Toolchain:** mise (`mise.toml`) pins node `26`, deno `canary`, bun `latest`, just `latest`. All four runtimes are installed locally by `mise install` and on CI by `jdx/mise-action@v2`.
- **Linter / formatter:** oxlint + oxfmt. Driven by `just lint` and `just format`; config in `.oxlintrc.json` + `.oxfmtrc.json`. Tabs, single quotes, 120 cols, trailing commas, semicolons as needed.
- **Task runner:** `just` (`justfile`). Recipes: `test`, `lint`, `format`, `update`, `bench-logger`.
- **Node packages:** `bun install` reads `package.json` + `bun.lock` and writes `node_modules`. `.npmrc` routes the `@jsr:` scope through `https://npm.jsr.io` so JSR packages resolve.
- **Deno:** vendored install (`deno install --vendor`), `deno test`, and `deno publish`.
- **Test framework:** `@cross/test` + `@std/assert` + `sinon`. Tests are runtime-agnostic — no `bun:test`, `node:test`, or Jest globals. Stub `process` / `os` with `sinon` instead of importing `bun:test` mocks.

## Daily commands

- `just lint` — oxlint across the whole tree.
- `just test` — `deno test --allow-sys --allow-env --clean --coverage`.
- `just format` — `bunx oxlint --fix && bunx oxfmt`.
- `just update` — `deno outdated --update --latest --recursive` to refresh JSR/NPM dep versions.
- `just bench-logger` — run the logger micro-bench.
- `bun install --frozen-lockfile && bun test` — Bun smoke (CI only; no `node_modules` is shipped).
- `bun install --frozen-lockfile && bunx tsx --test '**/*.test.ts'` — Node smoke (CI).
- `deno publish --dry-run` — preview a JSR release locally before cutting.

## Code style

- TypeScript strict: `strict`, `exactOptionalPropertyTypes`, `useUnknownInCatchVariables`, `noImplicitOverride`, `noUncheckedIndexedAccess` (root `deno.jsonc`).
- Arrow functions over `function` declarations (`export const foo = () => {}`); `function` only when hoisting is required.
- Use the `node:` import scheme (`import os from 'node:os'`, `import { createHash } from 'node:crypto'`).
- JSDoc with `@module`, `@example`, `@param`, `@returns` on every exported function. Tests and modules go through JSR's doc renderer — write docs that survive triple-backtick rendering.
- File naming: `kebab-case.ts`; tests sit next to source as `*.test.ts`.
- Keep modules portable across Bun / Deno / Node. Avoid runtime-specific globals in library code; `Bun` and `Deno` are listed as oxlint globals but only at the edges (env detection, optional integrations).
- No drive-by refactors, magic numbers, or commented-out code in a diff. Bug fixes ship with a regression test.

## Publishing

- Tangled is the source of truth. Push a branch there; the `.tangled/workflows/github-mirror.yml` Spindle mirrors `main` to `git@github.com:frytg/utility.git` using the `GITHUB_DEPLOY_KEY` secret on Tangled.
- GitHub Actions on the mirror: `test.yml` runs on every push (Deno, Bun, Node matrices + lint + publish dry-run); `publish.yml` runs on `release.published` to push to JSR with OIDC.
- Release flow: bump the package version in the workspace's `deno.jsonc#version`, refresh its `CHANGELOG.md`, merge to `main`, then publish a GitHub release on the mirror repo. `publish.yml` handles the JSR push.
- Never run `deno publish` from a local machine — let CI do it. Use `deno publish --dry-run` locally to verify.

## CI branches

- GitHub Actions (`test.yml`) trigger on `push` to `main`, `dev/*`, `chore/*`, `feature/*` and on `pull_request` to `main`.
- Tangled Spindles run on `push` to any branch (`.tangled/workflows/lint.yml` alpine microvm installs mise via the musl tarball, then `mise install` + `just lint`) and on `main` (`.tangled/workflows/github-mirror.yml` nixos microvm mirrors to GitHub).
- Match the branch prefix to the kind of work. PRs target `main`.

## Conventions

- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `build:`, `ci:`. One logical change per commit and per PR. PR description covers what changed, why, how to test, follow-ups.
- No amending or force-pushing shared history without coordination.
- Dependabot runs weekly on Friday for `github-actions` only (`.github/dependabot.yml`); JSR / NPM dep bumps are done via `just update`, not Dependabot.
- Never commit plaintext secrets. The repo has no integration secrets of its own — env files at the consumer end are encrypted with sops per the dotfiles global.

## Composition with global AGENTS.md

The dotfiles-level `AGENTS.md` is the baseline. This file overrides only where this repo genuinely differs: Tangled → GitHub → JSR publishing flow; cross-runtime test discipline; the Deno workspace layout. Everything else — secret handling, commit style, package-manager preference, JSDoc habits, language defaults — inherits unchanged.
