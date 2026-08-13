import { vi } from 'vitest';

export class Uri {
  private constructor(
    public readonly scheme: string,
    public readonly fsPath: string
  ) {}

  static file(fsPath: string): Uri {
    return new Uri('file', fsPath);
  }
}

export enum CompletionItemKind {
  Snippet = 27
}

export class CompletionItem {
  detail?: string;
  insertText?: unknown;
  filterText?: string;
  sortText?: string;

  constructor(
    public label: string,
    public kind?: CompletionItemKind
  ) {}
}

export class SnippetString {
  value: string;

  constructor(value = '') {
    this.value = value;
  }
}

export const workspace = {
  getWorkspaceFolder: vi.fn()
};
