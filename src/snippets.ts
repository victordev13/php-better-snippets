import php from '../snippets/php.snippets.json';
import php84 from '../snippets/php8.4.snippets.json';
import symfony from '../snippets/symfony.snippets.json';
import symfonyAttributes from '../snippets/symfony-attributes.snippets.json';
import symfonyDoctrine from '../snippets/symfony-doctrine.snippets.json';
import symfonyMessenger from '../snippets/symfony-messenger.snippets.json';
import symfonyScheduler from '../snippets/symfony-scheduler.snippets.json';

export type SnippetArea = 'php' | 'symfony';

export interface SnippetDefinition {
  name: string;
  prefix: string | string[];
  body: string[];
  description: string;
  scope?: string;
  area: SnippetArea;
}

type RawSnippetDefinition = Omit<SnippetDefinition, 'area'>;

function withArea(definitions: RawSnippetDefinition[], area: SnippetArea): SnippetDefinition[] {
  return definitions.map((definition) => ({ ...definition, area }));
}

/**
 * Marker present in the body of snippets that generate `namespace`.
 * The namespace is always auto-filled by the provider from
 * composer.json/PSR-4 (or left as an empty string if it can't be resolved),
 * so the cursor should never stop on it. Snippets without this marker go
 * through the provider without any namespace substitution.
 */
export const NAMESPACE_MARKER = '$PHP_RESOLVED_NAMESPACE';

/**
 * Single source of truth for all of the extension's snippets, one JSON file per
 * area in `snippets/` (same split as the former `snippets/*.code-snippets`). To
 * add/edit a snippet, edit the matching `.snippets.json` — not this file.
 */
export const snippets: SnippetDefinition[] = [
  ...withArea(php as RawSnippetDefinition[], 'php'),
  ...withArea(php84 as RawSnippetDefinition[], 'php'),
  ...withArea(symfony as RawSnippetDefinition[], 'symfony'),
  ...withArea(symfonyAttributes as RawSnippetDefinition[], 'symfony'),
  ...withArea(symfonyDoctrine as RawSnippetDefinition[], 'symfony'),
  ...withArea(symfonyMessenger as RawSnippetDefinition[], 'symfony'),
  ...withArea(symfonyScheduler as RawSnippetDefinition[], 'symfony')
];

/**
 * Non-word characters (anything outside [A-Za-z0-9_]) that *start* a snippet
 * prefix. VS Code only invokes a CompletionItemProvider automatically while
 * typing word characters, so prefixes like `*` or `#` need to be registered as
 * trigger characters or they never surface a suggestion.
 *
 * Only the first character counts: a symbol further into the prefix (the `=` of
 * `$t=`) is typed with the suggestion session already open, and registering it
 * would pop the widget open after every unrelated `=` in the file.
 */
export const NON_WORD_TRIGGER_CHARACTERS: string[] = [
  ...new Set(
    snippets
      .flatMap((definition) => (Array.isArray(definition.prefix) ? definition.prefix : [definition.prefix]))
      .map((prefix) => prefix.charAt(0))
      .filter((char) => !/[A-Za-z0-9_]/.test(char))
      .sort()
  )
];
