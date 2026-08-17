import * as vscode from 'vscode';
import customVariables from '../custom-variables.json';
import { snippets, NAMESPACE_MARKER, SnippetDefinition } from './snippets';
import { resolveNamespace } from './namespaceResolver';

const SUBSTITUTABLE_VARIABLES = ['PHP_VARIABLE_TYPE', 'PHP_FUNCTION_RETURN_TYPE', 'PHP_POSSIBLE_EXCEPTIONS'] as const;

function escapeSnippetDefaultText(value: string): string {
  return value.replace(/[\\$}]/g, '\\$&');
}

function buildSnippetText(definition: SnippetDefinition, namespace: string | undefined): string {
  let text = definition.body.join('\n');

  for (const key of SUBSTITUTABLE_VARIABLES) {
    const value = (customVariables as Record<string, string>)[key];
    if (value !== undefined) {
      text = text.split(`$${key}`).join(value);
    }
  }

  if (text.includes(NAMESPACE_MARKER)) {
    const replacement = namespace !== undefined ? escapeSnippetDefaultText(namespace) : '';
    text = text.split(NAMESPACE_MARKER).join(replacement);
  }

  return text;
}

function buildCompletionItem(
  definition: SnippetDefinition,
  prefix: string,
  namespace: string | undefined,
  range: vscode.Range
): vscode.CompletionItem {
  const item = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Snippet);
  item.insertText = new vscode.SnippetString(buildSnippetText(definition, namespace));
  item.detail = definition.description;
  item.filterText = prefix;
  item.sortText = prefix;
  item.range = range;
  return item;
}

export class PhpSnippetProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    const namespace = resolveNamespace(document.uri);
    const symfonySnippetsEnabled = vscode.workspace
      .getConfiguration('php-better-snippets')
      .get<boolean>('enable-symfony-snippets', true);
    // Without an explicit range, VS Code falls back to its own guess of what
    // to replace, which can end up covering more than the typed prefix and
    // leaves the inserted snippet fully selected instead of focused on the
    // first tabstop. Pin it to the word being typed (or a zero-length range
    // at the cursor if there's no word) so only the prefix is replaced.
    const range = document.getWordRangeAtPosition(position) ?? new vscode.Range(position, position);
    const items: vscode.CompletionItem[] = [];

    for (const definition of snippets) {
      if (definition.area === 'symfony' && !symfonySnippetsEnabled) {
        continue;
      }

      const prefixes = Array.isArray(definition.prefix) ? definition.prefix : [definition.prefix];
      for (const prefix of prefixes) {
        items.push(buildCompletionItem(definition, prefix, namespace, range));
      }
    }

    return items;
  }
}
