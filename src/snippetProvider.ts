import * as vscode from 'vscode';
import customVariables from '../custom-variables.json';
import { snippets, NAMESPACE_MARKER, SnippetDefinition } from './snippets';
import { resolveNamespace } from './namespaceResolver';

const SUBSTITUTABLE_VARIABLES = ['PHP_VARIABLE_TYPE', 'PHP_FUNCTION_RETURN_TYPE', 'PHP_POSSIBLE_EXCEPTIONS'] as const;

// Escapes the characters that are meaningful inside a VS Code SnippetString
// body (`\`, `$`, `}`) so a resolved namespace is always inserted as literal
// text, never accidentally parsed as a tabstop/variable/placeholder-close.
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

/**
 * Length of the trailing substring of `textBeforeCursor` that matches the
 * start of `prefix` (e.g. textBeforeCursor "..$" against prefix "$t" -> 1).
 * Used for prefixes starting with a symbol (`*`, `#`, `$t`, ...), since those
 * characters are word separators and never covered by getWordRangeAtPosition.
 */
function matchingSymbolPrefixLength(textBeforeCursor: string, prefix: string): number {
  const maxLength = Math.min(prefix.length, textBeforeCursor.length);
  for (let length = maxLength; length > 0; length--) {
    const candidate = textBeforeCursor.slice(textBeforeCursor.length - length);
    if (prefix.startsWith(candidate)) {
      return length;
    }
  }
  return 0;
}

/**
 * Prefixes made only of word characters (e.g. "get", "controller") can safely
 * reuse the editor's own wordRange. Prefixes mixing a symbol with word
 * characters (e.g. "$t", "$t=") cannot: getWordRangeAtPosition only ever
 * covers the trailing word part ("t"), which would leave the leading symbol
 * ("$") already typed in the document and duplicate it on insert.
 */
function isWordOnlyPrefix(prefix: string): boolean {
  return /^\w+$/.test(prefix);
}

export class PhpSnippetProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token?: vscode.CancellationToken,
    context: vscode.CompletionContext = { triggerKind: vscode.CompletionTriggerKind.Invoke, triggerCharacter: undefined }
  ): vscode.CompletionItem[] {
    const namespace = resolveNamespace(document.uri);
    const symfonySnippetsEnabled = vscode.workspace
      .getConfiguration('php-better-snippets')
      .get<boolean>('enable-symfony-snippets', true);
    // Without an explicit range, VS Code falls back to its own guess of what
    // to replace, which can end up covering more than the typed prefix and
    // leaves the inserted snippet fully selected instead of focused on the
    // first tabstop. Pin it to the word being typed so only the prefix is
    // replaced.
    const wordRange = document.getWordRangeAtPosition(position);
    // Symbols like `*`, `#`, `?`, `$` are word separators, so prefixes made of
    // (or starting with) them never get a wordRange. Match them manually
    // against the text right before the cursor, otherwise every symbol-based
    // snippet would show up unfiltered and its already-typed prefix would be
    // duplicated instead of replaced.
    const textBeforeCursor = document.lineAt(position.line).text.slice(0, position.character);
    const items: vscode.CompletionItem[] = [];

    for (const definition of snippets) {
      if (definition.area === 'symfony' && !symfonySnippetsEnabled) {
        continue;
      }

      const prefixes = Array.isArray(definition.prefix) ? definition.prefix : [definition.prefix];
      for (const prefix of prefixes) {
        let range: vscode.Range;

        if (wordRange && isWordOnlyPrefix(prefix)) {
          // Clipped at the cursor: getWordRangeAtPosition covers the whole word
          // it finds, so completing in the middle of an existing identifier
          // (e.g. `get` inside `getName`) would replace its tail as well.
          range = new vscode.Range(wordRange.start, position);
        } else {
          const matchLength = matchingSymbolPrefixLength(textBeforeCursor, prefix);
          if (matchLength > 0) {
            range = new vscode.Range(new vscode.Position(position.line, position.character - matchLength), position);
          } else if (!wordRange && context.triggerKind === vscode.CompletionTriggerKind.Invoke) {
            // Invocation with no word under the cursor (e.g. Ctrl+Space on an
            // empty line): keep browsing all snippets. The `!wordRange` guard
            // matters because Invoke is also the kind reported while typing
            // word characters, and an item with an empty range is never
            // filtered out by VS Code (the filter word is empty, so it always
            // scores) — every symbol-prefixed snippet would show up while
            // typing an unrelated identifier.
            range = new vscode.Range(position, position);
          } else {
            // Something else is being typed (a word, or a different symbol)
            // that doesn't match this snippet's prefix at all — skip it so
            // unrelated symbol-prefixed snippets don't clutter the list.
            continue;
          }
        }

        items.push(buildCompletionItem(definition, prefix, namespace, range));
      }
    }

    return items;
  }
}
