import php from '../snippets/php.snippets.json';
import php84 from '../snippets/php8.4.snippets.json';
import symfony from '../snippets/symfony.snippets.json';
import symfonyAttributes from '../snippets/symfony-attributes.snippets.json';
import symfonyDoctrine from '../snippets/symfony-doctrine.snippets.json';
import symfonyMessenger from '../snippets/symfony-messenger.snippets.json';
import symfonyScheduler from '../snippets/symfony-scheduler.snippets.json';

export type SnippetArea = 'php' | 'symfony';

export interface SnippetDefinition {
  name: string;
  prefix: string | string[];
  body: string[];
  description: string;
  scope?: string;
  area: SnippetArea;
}

type RawSnippetDefinition = Omit<SnippetDefinition, 'area'>;

function withArea(definitions: RawSnippetDefinition[], area: SnippetArea): SnippetDefinition[] {
  return definitions.map((definition) => ({ ...definition, area }));
}

/**
 * Marcador presente no body de snippets que geram `namespace`.
 * O namespace é sempre auto-preenchido pelo provider a partir do
 * composer.json/PSR-4 (ou deixado como string vazia se não resolver), então
 * o cursor nunca deve parar nele. Snippets sem este marcador passam pelo
 * provider sem qualquer alteração de namespace.
 */
export const NAMESPACE_MARKER = '$PHP_RESOLVED_NAMESPACE';

/**
 * Única fonte de verdade de todos os snippets da extensão, um arquivo JSON por área
 * em `snippets/` (mesma divisão dos antigos `snippets/*.code-snippets`). Para
 * adicionar/editar um snippet, edite o `.snippets.json` correspondente — não este arquivo.
 */
export const snippets: SnippetDefinition[] = [
  ...withArea(php as RawSnippetDefinition[], 'php'),
  ...withArea(php84 as RawSnippetDefinition[], 'php'),
  ...withArea(symfony as RawSnippetDefinition[], 'symfony'),
  ...withArea(symfonyAttributes as RawSnippetDefinition[], 'symfony'),
  ...withArea(symfonyDoctrine as RawSnippetDefinition[], 'symfony'),
  ...withArea(symfonyMessenger as RawSnippetDefinition[], 'symfony'),
  ...withArea(symfonyScheduler as RawSnippetDefinition[], 'symfony')
];
