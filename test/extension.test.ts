import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ExtensionContext } from 'vscode';
import { languages, workspace } from 'vscode';

vi.mock('../src/namespaceResolver', () => ({
  invalidateComposerCache: vi.fn()
}));

import { invalidateComposerCache } from '../src/namespaceResolver';
import { activate } from '../src/extension';
import { NON_WORD_TRIGGER_CHARACTERS } from '../src/snippets';
import { PhpSnippetProvider } from '../src/snippetProvider';

const mockedRegisterProvider = vi.mocked(languages.registerCompletionItemProvider);
const mockedCreateWatcher = vi.mocked(workspace.createFileSystemWatcher);
const mockedInvalidateComposerCache = vi.mocked(invalidateComposerCache);

function fakeContext(): ExtensionContext {
  return { subscriptions: [] } as unknown as ExtensionContext;
}

/**
 * Stubs the watcher `activate` creates, capturing the handlers it registers so
 * a test can fire them.
 */
function stubWatcher(): Record<string, (uri: { fsPath: string }) => void> {
  const handlers: Record<string, (uri: { fsPath: string }) => void> = {};
  mockedCreateWatcher.mockReturnValue({
    onDidChange: (fn: typeof handlers.change) => {
      handlers.change = fn;
    },
    onDidCreate: (fn: typeof handlers.create) => {
      handlers.create = fn;
    },
    onDidDelete: (fn: typeof handlers.delete) => {
      handlers.delete = fn;
    },
    dispose: vi.fn()
  } as never);
  return handlers;
}

describe('activate', () => {
  beforeEach(() => {
    mockedRegisterProvider.mockReset().mockReturnValue({ dispose: vi.fn() });
    mockedCreateWatcher.mockReset();
    mockedInvalidateComposerCache.mockReset();
  });

  it('registers the provider for PHP with every non-word prefix character as a trigger character', () => {
    stubWatcher();

    activate(fakeContext());

    expect(mockedRegisterProvider).toHaveBeenCalledTimes(1);
    const [selector, provider, ...triggerCharacters] = mockedRegisterProvider.mock.calls[0];
    expect(selector).toEqual({ language: 'php' });
    expect(provider).toBeInstanceOf(PhpSnippetProvider);
    // Spread, not passed as an array: registerCompletionItemProvider takes the
    // trigger characters as variadic arguments.
    expect(triggerCharacters).toEqual(NON_WORD_TRIGGER_CHARACTERS);
    expect(triggerCharacters).toEqual(expect.arrayContaining(['*', '#', '?', '$']));
  });

  it('invalidates the composer.json cache when the watched file changes, is created, or is deleted', () => {
    const handlers = stubWatcher();

    activate(fakeContext());

    expect(mockedCreateWatcher).toHaveBeenCalledWith('**/composer.json');

    handlers.change({ fsPath: '/workspace/composer.json' });
    handlers.create({ fsPath: '/workspace/composer.json' });
    handlers.delete({ fsPath: '/workspace/composer.json' });

    expect(mockedInvalidateComposerCache).toHaveBeenCalledTimes(3);
    expect(mockedInvalidateComposerCache).toHaveBeenCalledWith('/workspace/composer.json');
  });
});
