# Contribution guide:

All snippets are served at runtime by a `CompletionItemProvider` (`src/snippetProvider.ts`), registered for PHP files in `src/extension.ts`. There is no build-time generation step anymore (no `build.sh`, no `.dist`/`.code-snippets` files) — everything is bundled directly by `esbuild` (`npm run compile`) into `dist/extension.js`.

## Development commands

```bash
npm install                    # install devDependencies (esbuild, typescript, vitest, ...)
npm run compile                # bundle src/extension.ts (+ snippet JSON) into dist/extension.js via esbuild
npm run watch                  # compile in watch mode
npx tsc --noEmit               # type-check without emitting files
npm test                       # run the unit test suite (vitest)
npm run test:watch             # vitest in watch mode
npm run vscode:prepublish      # runs compile (fires automatically before packaging/publishing)
npm run pack                   # build the .vsix package (vsce package)
npm run publish                # package and publish to the Marketplace
npm run publish:pre-release    # publish as a pre-release
```

Press `F5` in VS Code to open an Extension Development Host and try out the snippets live (`.vscode/launch.json` already runs `vscode:prepublish` as a `preLaunchTask`).

A `Makefile` wraps the same commands under shorter, memorable targets (`make build`, `make test`, `make watch`, ...) — use whichever you prefer.

## Releasing

`scripts/release.js` (invoked via `npm run release -- <bump>` or `make release-patch` / `make release-minor` / `make release-major` / `make release VERSION=x.y.z`) automates a release:

1. Bumps `package.json`'s `version` (accepts `patch`, `minor`, `major`, or an explicit `x.y.z`).
2. Moves the `## [Unreleased]` section of `CHANGELOG.md` under a new `## [x.y.z] - YYYY-MM-DD` heading, resetting `Unreleased` to empty. The `Unreleased` section must already contain your entries — the script aborts if it's empty or missing.
3. Runs `tsc --noEmit`, the test suite, and `npm run compile` to make sure the release actually builds.
4. Commits `package.json`, `package-lock.json`, and `CHANGELOG.md`, and creates a `vX.Y.Z` git tag.

It refuses to run on a dirty working tree (unless you pass `--no-git`, which skips the commit/tag and only touches the files). It never pushes or publishes — after it finishes, push manually (`git push && git push origin vX.Y.Z`) and run `npm run pack`/`npm run publish` when you're ready.

So before releasing: add your changes under `## [Unreleased]` in `CHANGELOG.md` as you go, then run `npm run release -- patch` (or `minor`/`major`) when you're ready to cut a version.

## Adding or editing a snippet

Snippets live in `snippets/*.snippets.json`, one file per area:
  - `php.snippets.json`
  - `php8.4.snippets.json`
  - `symfony.snippets.json`
  - `symfony-attributes.snippets.json`
  - `symfony-doctrine.snippets.json`
  - `symfony-messenger.snippets.json`
  - `symfony-scheduler.snippets.json`

Each file is a JSON array of `{ name, prefix, body, description, scope?, requiredUse? }` objects (`prefix` and `body` may also be arrays, for multiple prefixes/multi-line bodies). `src/snippets.ts` only imports and concatenates all of these into a single array — edit the JSON file for the relevant area to add/change a snippet, never `snippets.ts`.

## Custom variables

To simplify the creation of new snippets and the maintenance of existing ones, certain repeated code segments have been extracted to reusable variables, defined in [`./custom-variables.json`](./custom-variables.json) and substituted by `src/snippetProvider.ts` at completion time (textual replace, e.g. `$PHP_VARIABLE_TYPE` → the value in `custom-variables.json`).

The currently available variables are:
  - `$PHP_VARIABLE_TYPE`
  - `$PHP_FUNCTION_RETURN_TYPE`
  - `$PHP_POSSIBLE_EXCEPTIONS`

## Dynamic namespace

Any snippet body containing the literal text `$PHP_RESOLVED_NAMESPACE` (the `NAMESPACE_MARKER` constant in `src/snippets.ts`) has every occurrence replaced by the real namespace of the target file, resolved from the project's `composer.json` PSR-4/`autoload-dev` PSR-4 mappings (`src/namespaceResolver.ts`). If no `composer.json` is found or no PSR-4 entry covers the file, the marker is replaced with an empty string for manual editing — there is no fallback to a folder-based heuristic. Snippets without this marker are unaffected by namespace resolution.

The marker is **not** a tabstop, so the cursor never lands on the namespace — write it as plain text (`$PHP_RESOLVED_NAMESPACE`, no `${N:...}` wrapper). Number the snippet's other tabstops (`$1`, `$2`, ...) in the order they should be filled, without reserving a number for the namespace at all.

## Required use statements

A snippet may declare a required `use` statement via the optional `requiredUse` field:
  - `requiredUse: "Doctrine\\ORM\\Mapping as ORM"` — a single class alias.
  - `requiredUse: ["Symfony\\Component\\Console\\Attribute\\AsCommand", "Symfony\\Component\\Console\\Command\\Command"]` — multiple use statements, as an array.

When the completion item is accepted, if a required `use` statement is not already present in the file, `src/snippetProvider.ts` automatically adds it via `additionalTextEdits`, inserted at the most appropriate location:
  1. After an existing block of `use` statements (if any).
  2. After the `namespace` declaration (if any).
  3. After the `<?php` tag and optional `declare(strict_types=1);` (if any).

The value must match the complete text between `use` and `;` exactly (e.g. `Doctrine\ORM\Mapping as ORM` for `use Doctrine\ORM\Mapping as ORM;`), and duplicates are not inserted — the file is checked first.

This whole behavior can be turned off by the user via the `php-better-snippets.enable-auto-imports` setting (default `true`); when disabled, `additionalTextEdits` is never generated, regardless of `requiredUse`.

## Tests

Unit tests live in `test/` and run with `npm test` (vitest). `test/namespaceResolver.test.ts` covers PSR-4/`autoload-dev` resolution, monorepo nesting, most-specific-match, and mtime-based caching/invalidation, using real temp directories and composer.json fixtures. `test/snippetProvider.test.ts` covers custom-variable substitution and namespace marker substitution/omission. Since the real `vscode` module doesn't exist in a plain Node test run, `vitest.config.ts` aliases `vscode` to the mock at `test/mocks/vscode.ts` — extend that mock if a test needs another `vscode` API.
