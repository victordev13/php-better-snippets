import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TextDocument } from 'vscode';
import { Uri, workspace } from 'vscode';
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

function fakeDocument(): TextDocument {
  return { uri: Uri.file('/workspace/src/Service/Foo.php') } as unknown as TextDocument;
}

function findDefinition(prefix: string) {
  const definition = snippets.find((d) => (Array.isArray(d.prefix) ? d.prefix.includes(prefix) : d.prefix === prefix));
  if (!definition) {
    throw new Error(`snippet with prefix "${prefix}" not found`);
  }
  return definition;
}

function namespaceTabstopOf(prefix: string): string {
  const body = findDefinition(prefix).body.join('\n');
  const match = body.match(/\$\{(\d+):\$PHP_RESOLVED_NAMESPACE\}/);
  if (!match) {
    throw new Error(`snippet "${prefix}" has no namespace marker`);
  }
  return match[1];
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

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument());

    expect(items.length).toBe(expectedCount);
  });

  it('fills the namespace tabstop with the resolved namespace, escaped, at its own tabstop number', () => {
    mockedResolveNamespace.mockReturnValue('App\\Service');
    const tabstop = namespaceTabstopOf('phpc');

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument());
    const item = items.find((i) => i.filterText === 'phpc')!;
    const text = (item.insertText as { value: string }).value;

    expect(text).toContain(`\${${tabstop}:App\\\\Service}`);
    expect(text).not.toContain('PHP_RESOLVED_NAMESPACE');
  });

  it('leaves an empty tabstop for the namespace when it cannot be resolved', () => {
    mockedResolveNamespace.mockReturnValue(undefined);
    const tabstop = namespaceTabstopOf('phpc');

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument());
    const item = items.find((i) => i.filterText === 'phpc')!;
    const text = (item.insertText as { value: string }).value;

    expect(text).toContain(`namespace $${tabstop};`);
    expect(text).not.toContain('PHP_RESOLVED_NAMESPACE');
  });

  it('places the namespace tabstop after every other tabstop in the same snippet', () => {
    mockedResolveNamespace.mockReturnValue(undefined);
    const tabstop = Number(namespaceTabstopOf('service'));
    const body = findDefinition('service').body.join('\n');
    const otherTabstops = Array.from(body.matchAll(/\$\{?(\d+)/g))
      .map((m) => Number(m[1]))
      .filter((n) => n !== tabstop);

    expect(otherTabstops.every((n) => n < tabstop)).toBe(true);
  });

  it('substitutes custom variables from custom-variables.json', () => {
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument());
    const item = items.find((i) => i.filterText === 'service')!;
    const text = (item.insertText as { value: string }).value;

    expect(text).toContain((customVariables as Record<string, string>).PHP_FUNCTION_RETURN_TYPE);
    expect(text).not.toContain('$PHP_FUNCTION_RETURN_TYPE');
  });

  it('leaves snippets without the namespace marker untouched', () => {
    mockedResolveNamespace.mockReturnValue('App\\Service');

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument());
    const item = items.find((i) => i.filterText === 'php')!;
    const text = (item.insertText as { value: string }).value;

    expect(text).toBe('<?php');
  });

  it('creates a separate completion item per prefix for multi-prefix snippets', () => {
    mockedResolveNamespace.mockReturnValue(undefined);
    const multiPrefixDefinition = snippets.find((d) => Array.isArray(d.prefix) && d.prefix.length > 1);
    expect(multiPrefixDefinition).toBeDefined();

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument());
    for (const prefix of multiPrefixDefinition!.prefix as string[]) {
      expect(items.some((i) => i.filterText === prefix)).toBe(true);
    }
  });

  it('omits Symfony snippets when phpBetterSnippets.enableSymfonySnippets is false', () => {
    stubConfig({ enableSymfonySnippets: false });
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument());

    const expectedCount = snippets
      .filter((d) => d.area === 'php')
      .reduce((sum, d) => sum + (Array.isArray(d.prefix) ? d.prefix.length : 1), 0);
    expect(items.length).toBe(expectedCount);
    expect(items.some((i) => i.filterText === 'controller')).toBe(false);
    expect(items.some((i) => i.filterText === 'phpc')).toBe(true);
  });

  it('keeps Symfony snippets when phpBetterSnippets.enableSymfonySnippets is true (default)', () => {
    stubConfig({ enableSymfonySnippets: true });
    mockedResolveNamespace.mockReturnValue(undefined);

    const items = new PhpSnippetProvider().provideCompletionItems(fakeDocument());

    expect(items.some((i) => i.filterText === 'controller')).toBe(true);
  });
});
