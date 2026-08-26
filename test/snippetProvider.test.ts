import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TextDocument } from 'vscode';
import { CompletionTriggerKind, Position, Range, Uri, workspace } from 'vscode';
import customVariables from '../custom-variables.json';
import { snippets } from '../src/snippets';

vi.mock('../src/namespaceResolver', () => ({
  resolveNamespace: vi.fn()
}));

import { resolveNamespace } from '../src/namespaceResolver';
import { PhpSnippetProvider } from '../src/snippetProvider';

const mockedResolveNamespace = vi.mocked(resolveNamespace);
const mockedGetConfiguration = vi.mocked(workspace.getConfiguration);

function stubConfig(overrides: Record<string, unknown> = {}): void {
  mockedGetConfiguration.mockReturnValue({
    get: (key: string, defaultValue?: unknown) => (key in overrides ? overrides[key] : defaultValue)
  } as never);
}

const fakePosition = new Position(3, 2);
const fakeWordRange = new Range(new Position(3, 0), new Position(3, 2));

function fakeDocument(content = ''): TextDocument {
  return {
    uri: Uri.file('/workspace/src/Service/Foo.php'),
    getWordRangeAtPosition: () => fakeWordRange,
    lineAt: () => ({ text: '' }),
    getText: () => content
  } as unknown as TextDocument;
}

/**
 * Simulates typing a symbol-based prefix (e.g. "*", "#"): no word under the
 * cursor, so getWordRangeAtPosition returns undefined and the provider has to
 * fall back to matching the line's text against each snippet's own prefix.
 */
function fakeSymbolDocument(lineText: string, content = ''): TextDocument {
  return {
    uri: Uri.file('/workspace/src/Service/Foo.php'),
    getWordRangeAtPosition: () => undefined,
    lineAt: () => ({ text: lineText }),
    getText: () => content
  } as unknown as TextDocument;
}

/**
 * Simulates typing a prefix that mixes a symbol with word characters (e.g.
 * "$t"): getWordRangeAtPosition only ever covers the trailing word part
 * ("t"), never the leading symbol ("$").
 */
function fakeMixedPrefixDocument(lineText: string, wordRange: Range, content = ''): TextDocument {
  return {
    uri: Uri.file('/workspace/src/Service/Foo.php'),
    getWordRangeAtPosition: () => wordRange,
    lineAt: () => ({ text: lineText }),
    getText: () => content
  } as unknown as TextDocument;
}

/**
 * Simulates an invocation with nothing typed (Ctrl+Space on an empty line):
 * no word under the cursor and no text before it, so every snippet is offered.
 */
function fakeEmptyLineDocument(content = ''): TextDocument {
  return fakeSymbolDocument('', content);
}

function findDefinition(prefix: string) {
  const definition = snippets.find((d) => (Array.isArray(d.prefix) ? d.prefix.includes(prefix) : d.prefix === prefix));
  if (!definition) {
    throw new Error(`snippet with prefix "${prefix}" not found`);
  }
  return definition;
}

function hasNamespaceMarker(prefix: string): boolean {
  return findDefinition(prefix).body.join('\n').includes('$PHP_RESOLVED_NAMESPACE');
}

describe('PhpSnippetProvider', () => {
  beforeEach(() => {
    stubConfig();
  });

  afterEach(() => {
    mockedResolveNamespace.mockReset();
    mockedGetConfiguration.mockReset();
  });

  it('produces one completion item per prefix across all snippet definitions', () => {
    const expectedCount = snippets.reduce(
      (sum, d) => sum + (Array.isArray(d.prefix) ? d.prefix.length : 1),
      0
    );
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeEmptyLineDocument(), new Position(0, 0));

    expect(items.length).toBe(expectedCount);
  });

  it('fills the namespace with the resolved namespace, escaped, as plain text (no tabstop)', () => {
    mockedResolveNamespace.mockReturnValue('App\\Service');

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(), fakePosition);
    const item = items.find((i) => i.filterText === 'phpc')!;
    const text = (item.insertText as { value: string }).value;

    expect(text).toContain('namespace App\\\\Service;');
    expect(text).not.toContain('PHP_RESOLVED_NAMESPACE');
  });

  it('leaves the namespace empty, with no tabstop, when it cannot be resolved', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(), fakePosition);
    const item = items.find((i) => i.filterText === 'phpc')!;
    const text = (item.insertText as { value: string }).value;

    expect(text).toContain('namespace ;');
    expect(text).not.toContain('PHP_RESOLVED_NAMESPACE');
  });

  it('never places the cursor on the namespace, resolved or not', () => {
    expect(hasNamespaceMarker('service')).toBe(true);
    mockedResolveNamespace.mockReturnValue('App\\Service');

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(), fakePosition);
    const item = items.find((i) => i.filterText === 'service')!;
    const text = (item.insertText as { value: string }).value;

    expect(text).toContain('namespace App\\\\Service;');
    expect(text).not.toMatch(/\$\{\d+:App\\\\Service\}/);
  });

  it('substitutes custom variables from custom-variables.json', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(), fakePosition);
    const item = items.find((i) => i.filterText === 'service')!;
    const text = (item.insertText as { value: string }).value;

    expect(text).toContain((customVariables as Record<string, string>).PHP_FUNCTION_RETURN_TYPE);
    expect(text).not.toContain('$PHP_FUNCTION_RETURN_TYPE');
  });

  it('sets each item range to the word being typed, so only the prefix gets replaced', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(), fakePosition);
    const item = items.find((i) => i.filterText === 'get')!;

    expect(item.range).toEqual(fakeWordRange);
  });

  it('clips the range at the cursor, so completing mid-word does not eat the rest of the identifier', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    // Cursor right after "get" inside "getName": the word range spans the whole
    // identifier, but only the part before the cursor may be replaced.
    const wholeWord = new Range(new Position(0, 0), new Position(0, 7));
    const document = fakeMixedPrefixDocument('getName', wholeWord);
    const position = new Position(0, 3);

    const items = new PhpSnippetProvider().provideCompletionItems(document, position);
    const item = items.find((i) => i.filterText === 'get')!;

    expect(item.range).toEqual(new Range(new Position(0, 0), position));
  });

  it('does not offer symbol-prefixed snippets while a word is being typed', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    // Typing word characters also reports triggerKind Invoke, and an item with
    // an empty range is never filtered out by VS Code — so symbol prefixes must
    // be dropped here instead of relying on the editor's filtering.
    const wordRangeForGet = new Range(new Position(0, 0), new Position(0, 3));
    const document = fakeMixedPrefixDocument('get', wordRangeForGet);
    const position = new Position(0, 3);

    const items = new PhpSnippetProvider().provideCompletionItems(document, position, undefined, {
      triggerKind: CompletionTriggerKind.Invoke
    } as never);

    expect(items.some((i) => i.filterText === 'get')).toBe(true);
    for (const symbolPrefix of ['*', '#', '?', '$t', '$t=']) {
      expect(items.some((i) => i.filterText === symbolPrefix)).toBe(false);
    }
  });

  it('only suggests symbol-prefixed snippets matching what was actually typed, e.g. "*" not "#"', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    const document = fakeSymbolDocument('*');
    const position = new Position(0, 1);
    const items = new PhpSnippetProvider().provideCompletionItems(
      document,
      position,
      undefined,
      { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '*' } as never
    );

    expect(items.some((i) => i.filterText === '*')).toBe(true);
    expect(items.some((i) => i.filterText === '#')).toBe(false);
    expect(items.some((i) => i.filterText === '?')).toBe(false);
  });

  it('sets the range of a symbol-prefixed item to the already-typed symbol, so it gets replaced instead of duplicated', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    const document = fakeSymbolDocument('#');
    const position = new Position(0, 1);
    const items = new PhpSnippetProvider().provideCompletionItems(
      document,
      position,
      undefined,
      { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '#' } as never
    );
    const item = items.find((i) => i.filterText === '#')!;

    expect(item.range).toEqual(new Range(new Position(0, 0), new Position(0, 1)));
  });

  it('does not show a symbol snippet when what was typed does not match its prefix', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    const document = fakeSymbolDocument('#');
    const position = new Position(0, 1);
    // The trigger character claims "*", but the line actually has "#" typed;
    // matching is based on the line's text, not the reported trigger character.
    const items = new PhpSnippetProvider().provideCompletionItems(document, position, undefined, {
      triggerKind: CompletionTriggerKind.TriggerCharacter,
      triggerCharacter: '*'
    } as never);

    expect(items.some((i) => i.filterText === '*')).toBe(false);
    expect(items.some((i) => i.filterText === '#')).toBe(true);
  });

  it('does not duplicate the leading symbol when completing a mixed prefix like "$t"', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    // getWordRangeAtPosition only covers the word part ("t"), not the "$".
    const wordRangeForT = new Range(new Position(0, 1), new Position(0, 2));
    const document = fakeMixedPrefixDocument('$t', wordRangeForT);
    const position = new Position(0, 2);

    const items = new PhpSnippetProvider().provideCompletionItems(document, position, undefined, {
      triggerKind: CompletionTriggerKind.TriggerCharacter,
      triggerCharacter: 't'
    } as never);
    const item = items.find((i) => i.filterText === '$t')!;

    expect(item.range).toEqual(new Range(new Position(0, 0), new Position(0, 2)));
  });

  it('shows every snippet, including symbol-prefixed ones, on a manual invoke with nothing typed', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeEmptyLineDocument(), new Position(0, 0), undefined, {
      triggerKind: CompletionTriggerKind.Invoke
    } as never);

    expect(items.some((i) => i.filterText === '*')).toBe(true);
    expect(items.some((i) => i.filterText === '#')).toBe(true);
    expect(items.some((i) => i.filterText === 'get')).toBe(true);
  });

  it('leaves snippets without the namespace marker untouched', () => {
    mockedResolveNamespace.mockReturnValue('App\\Service');

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(), fakePosition);
    const item = items.find((i) => i.filterText === 'php')!;
    const text = (item.insertText as { value: string }).value;

    expect(text).toBe('<?php');
  });

  it('creates a separate completion item per prefix for multi-prefix snippets, each inserting the shared body', () => {
    mockedResolveNamespace.mockReturnValue(undefined);
    const multiPrefixDefinition = snippets.find((d) => Array.isArray(d.prefix) && d.prefix.length > 1);
    expect(multiPrefixDefinition).toBeDefined();

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(), fakePosition);
    const texts = (multiPrefixDefinition!.prefix as string[]).map((prefix) => {
      const item = items.find((i) => i.filterText === prefix);
      expect(item).toBeDefined();
      expect(item!.detail).toBe(multiPrefixDefinition!.description);
      return (item!.insertText as { value: string }).value;
    });

    // Every alias of the same definition must produce the exact same body.
    expect(new Set(texts).size).toBe(1);
  });

  it('omits Symfony snippets when php-better-snippets.enable-symfony-snippets is false', () => {
    stubConfig({ 'enable-symfony-snippets': false });
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeEmptyLineDocument(), new Position(0, 0));

    const expectedCount = snippets
      .filter((d) => d.area === 'php')
      .reduce((sum, d) => sum + (Array.isArray(d.prefix) ? d.prefix.length : 1), 0);
    expect(items.length).toBe(expectedCount);
    expect(items.some((i) => i.filterText === 'controller')).toBe(false);
    expect(items.some((i) => i.filterText === 'phpc')).toBe(true);
  });

  it('keeps Symfony snippets when php-better-snippets.enable-symfony-snippets is true (default)', () => {
    stubConfig({ 'enable-symfony-snippets': true });
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(), fakePosition);

    expect(items.some((i) => i.filterText === 'controller')).toBe(true);
  });

  it('adds additionalTextEdits for a snippet with requiredUse when the use is missing', () => {
    mockedResolveNamespace.mockReturnValue(undefined);
    // Document without the required use statement
    const documentContent = '<?php\n\nnamespace App\\Entity;\n\nclass Foo {}';

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(documentContent), fakePosition);
    // Find a snippet with requiredUse (e.g., embeddable)
    const item = items.find((i) => i.filterText === 'embeddable');

    expect(item).toBeDefined();
    if (item) {
      expect(item.additionalTextEdits).toBeDefined();
      expect(item.additionalTextEdits!.length).toBeGreaterThan(0);
      // Check that the edit contains the use statement
      const editText = item.additionalTextEdits![0].newText;
      expect(editText).toContain('use Doctrine\\ORM\\Mapping as ORM;');
    }
  });

  it('does not add additionalTextEdits for a snippet with requiredUse when the use already exists', () => {
    mockedResolveNamespace.mockReturnValue(undefined);
    // Document with the required use statement already present
    const documentContent = `<?php

namespace App\\Entity;

use Doctrine\\ORM\\Mapping as ORM;

class Foo {}`;

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(documentContent), fakePosition);
    const item = items.find((i) => i.filterText === 'embeddable');

    expect(item).toBeDefined();
    if (item) {
      // Should not have additionalTextEdits when the use already exists
      expect(item.additionalTextEdits).toBeUndefined();
    }
  });

  it('does not add additionalTextEdits when php-better-snippets.enable-auto-imports is false', () => {
    stubConfig({ 'enable-auto-imports': false });
    mockedResolveNamespace.mockReturnValue(undefined);
    const documentContent = '<?php\n\nnamespace App\\Entity;\n\nclass Foo {}';

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(documentContent), fakePosition);
    const item = items.find((i) => i.filterText === 'embeddable');

    expect(item).toBeDefined();
    if (item) {
      expect(item.additionalTextEdits).toBeUndefined();
    }
  });

  it('does not add additionalTextEdits for a snippet without requiredUse', () => {
    mockedResolveNamespace.mockReturnValue(undefined);
    const documentContent = '<?php\n\nclass Foo {}';

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument(documentContent), fakePosition);
    const item = items.find((i) => i.filterText === 'php');

    expect(item).toBeDefined();
    if (item) {
      expect(item.additionalTextEdits).toBeUndefined();
    }
  });
});
