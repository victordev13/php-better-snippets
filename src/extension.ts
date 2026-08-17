import * as vscode from 'vscode';
import { PhpSnippetProvider } from './snippetProvider';
import { invalidateComposerCache } from './namespaceResolver';
import { NON_WORD_TRIGGER_CHARACTERS } from './snippets';

export function activate(context: vscode.ExtensionContext): void {
  const provider = new PhpSnippetProvider();
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider({ language: 'php' }, provider, ...NON_WORD_TRIGGER_CHARACTERS)
  );

  const watcher = vscode.workspace.createFileSystemWatcher('**/composer.json');
  watcher.onDidChange((uri) => invalidateComposerCache(uri.fsPath));
  watcher.onDidCreate((uri) => invalidateComposerCache(uri.fsPath));
  watcher.onDidDelete((uri) => invalidateComposerCache(uri.fsPath));
  context.subscriptions.push(watcher);
}

export function deactivate(): void {}
