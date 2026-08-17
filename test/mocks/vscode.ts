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

export enum CompletionTriggerKind {
  Invoke = 0,
  TriggerCharacter = 1,
  TriggerForIncompleteCompletions = 2
}

export class Position {
  constructor(
    public readonly line: number,
    public readonly character: number
  ) {}
}

export class Range {
  constructor(
    public readonly start: Position,
    public readonly end: Position
  ) {}
}

export class CompletionItem {
  detail?: string;
  insertText?: unknown;
  filterText?: string;
  sortText?: string;
  range?: Range;

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
  getWorkspaceFolder: vi.fn(),
  getConfiguration: vi.fn(),
  createFileSystemWatcher: vi.fn()
};

export const languages = {
  registerCompletionItemProvider: vi.fn()
};
