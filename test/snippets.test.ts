import { describe, expect, it } from 'vitest';
import { NON_WORD_TRIGGER_CHARACTERS, snippets } from '../src/snippets';

describe('NON_WORD_TRIGGER_CHARACTERS', () => {
  it('includes every non-word character a snippet prefix starts with, e.g. * and #', () => {
    const expected = snippets
      .flatMap((definition) => (Array.isArray(definition.prefix) ? definition.prefix : [definition.prefix]))
      .map((prefix) => prefix.charAt(0))
      .filter((char) => !/\w/.test(char));

    expect(NON_WORD_TRIGGER_CHARACTERS).toEqual(expect.arrayContaining(['*', '#']));
    expect(NON_WORD_TRIGGER_CHARACTERS).toEqual(expect.arrayContaining(expected));
  });

  it('leaves out non-word characters that never start a prefix, e.g. the "=" of "$t="', () => {
    expect(NON_WORD_TRIGGER_CHARACTERS).not.toContain('=');
  });

  it('has no duplicates', () => {
    expect(new Set(NON_WORD_TRIGGER_CHARACTERS).size).toBe(NON_WORD_TRIGGER_CHARACTERS.length);
  });
});
