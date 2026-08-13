import * as vscode from 'vscode';
import customVariables from '../custom-variables.json';
import { snippets, NAMESPACE_MARKER_PATTERN, SnippetDefinition } from './snippets';
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

  text = text.replace(NAMESPACE_MARKER_PATTERN, (_match, tabstopNum: string) =>
    namespace !== undefined ? `\${${tabstopNum}:${escapeSnippetDefaultText(namespace)}}` : `$${tabstopNum}`
  );

  return text;
}

function buildCompletionItem(
  definition: SnippetDefinition,
  prefix: string,
  namespace: string | undefined
): vscode.CompletionItem {
  const item = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Snippet);
  item.insertText = new vscode.SnippetString(buildSnippetText(definition, namespace));
  item.detail = definition.description;
  item.filterText = prefix;
  item.sortText = prefix;
  return item;
}

export class PhpSnippetProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(document: vscode.TextDocument): vscode.CompletionItem[] {
    const namespace = resolveNamespace(document.uri);
    const items: vscode.CompletionItem[] = [];

    for (const definition of snippets) {
      const prefixes = Array.isArray(definition.prefix) ? definition.prefix : [definition.prefix];
      for (const prefix of prefixes) {
        items.push(buildCompletionItem(definition, prefix, namespace));
      }
    }

    return items;
  }
}
