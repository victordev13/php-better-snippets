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

## Adding or editing a snippet

Snippets live in `snippets/*.snippets.json`, one file per area:
  - `php.snippets.json`
  - `php8.4.snippets.json`
  - `symfony.snippets.json`
  - `symfony-attributes.snippets.json`
  - `symfony-doctrine.snippets.json`
  - `symfony-messenger.snippets.json`
  - `symfony-scheduler.snippets.json`

Each file is a JSON array of `{ name, prefix, body, description, scope? }` objects (`prefix` and `body` may also be arrays, for multiple prefixes/multi-line bodies). `src/snippets.ts` only imports and concatenates all of these into a single array — edit the JSON file for the relevant area to add/change a snippet, never `snippets.ts`.

## Custom variables

To simplify the creation of new snippets and the maintenance of existing ones, certain repeated code segments have been extracted to reusable variables, defined in [`./custom-variables.json`](./custom-variables.json) and substituted by `src/snippetProvider.ts` at completion time (textual replace, e.g. `$PHP_VARIABLE_TYPE` → the value in `custom-variables.json`).

The currently available variables are:
  - `$PHP_VARIABLE_TYPE`
  - `$PHP_FUNCTION_RETURN_TYPE`
  - `$PHP_POSSIBLE_EXCEPTIONS`

## Dynamic namespace

Any snippet body containing a marker of the form `${N:$PHP_RESOLVED_NAMESPACE}` (matched at completion time via `NAMESPACE_MARKER_PATTERN` in `src/snippets.ts`) has that marker replaced by the real namespace of the target file, resolved from the project's `composer.json` PSR-4/`autoload-dev` PSR-4 mappings (`src/namespaceResolver.ts`). If no `composer.json` is found or no PSR-4 entry covers the file, the tab-stop is left empty for manual editing — there is no fallback to a folder-based heuristic. Snippets without this marker are unaffected by namespace resolution.

Since the namespace is auto-filled, it should never be the first thing the cursor lands on. The marker's tabstop number (`N`) must always be the **highest** number used in that snippet's body — number every other tabstop `$1`, `$2`, ... in the order they should be filled, and put the namespace marker last. For example, a snippet with a class name and a body placeholder uses `${1:$TM_FILENAME_BASE}` / `$2` for those, and `${3:$PHP_RESOLVED_NAMESPACE}` for the namespace, even though the `namespace` line appears earlier in the generated code — tabstop order follows the numbers, not the text position.

## Tests

Unit tests live in `test/` and run with `npm test` (vitest). `test/namespaceResolver.test.ts` covers PSR-4/`autoload-dev` resolution, monorepo nesting, most-specific-match, and mtime-based caching/invalidation, using real temp directories and composer.json fixtures. `test/snippetProvider.test.ts` covers custom-variable substitution and namespace marker substitution/omission. Since the real `vscode` module doesn't exist in a plain Node test run, `vitest.config.ts` aliases `vscode` to the mock at `test/mocks/vscode.ts` — extend that mock if a test needs another `vscode` API.
