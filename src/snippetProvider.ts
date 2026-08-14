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
    const symfonySnippetsEnabled = vscode.workspace
      .getConfiguration('phpBetterSnippets')
      .get<boolean>('enableSymfonySnippets', true);
    const items: vscode.CompletionItem[] = [];

    for (const definition of snippets) {
      if (definition.area === 'symfony' && !symfonySnippetsEnabled) {
        continue;
      }

      const prefixes = Array.isArray(definition.prefix) ? definition.prefix : [definition.prefix];
      for (const prefix of prefixes) {
        items.push(buildCompletionItem(definition, prefix, namespace));
      }
    }

    return items;
  }
}
