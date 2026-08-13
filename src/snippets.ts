import php from '../snippets/php.snippets.json';
import php84 from '../snippets/php8.4.snippets.json';
import symfony from '../snippets/symfony.snippets.json';
import symfonyAttributes from '../snippets/symfony-attributes.snippets.json';
import symfonyDoctrine from '../snippets/symfony-doctrine.snippets.json';
import symfonyMessenger from '../snippets/symfony-messenger.snippets.json';
import symfonyScheduler from '../snippets/symfony-scheduler.snippets.json';

export interface SnippetDefinition {
  name: string;
  prefix: string | string[];
  body: string[];
  description: string;
  scope?: string;
}

/**
 * Marcador presente no body de snippets que geram `namespace`, sempre como o
 * tabstop de maior número do snippet (o namespace é auto-preenchido, então não deve
 * ser o primeiro foco ao expandir — os demais parâmetros vêm antes). O número varia
 * por snippet, por isso o marcador é uma regex que captura esse número; o provider
 * resolve o namespace real via composer.json/PSR-4 e substitui o marcador por um
 * placeholder no mesmo tabstop (ou o deixa vazio se não resolver). Snippets sem este
 * marcador passam pelo provider sem qualquer alteração de namespace.
 */
export const NAMESPACE_MARKER_PATTERN = /\$\{(\d+):\$PHP_RESOLVED_NAMESPACE\}/g;

/**
 * Única fonte de verdade de todos os snippets da extensão, um arquivo JSON por área
 * em `snippets/` (mesma divisão dos antigos `snippets/*.code-snippets`). Para
 * adicionar/editar um snippet, edite o `.snippets.json` correspondente — não este arquivo.
 */
export const snippets: SnippetDefinition[] = [
  ...(php as SnippetDefinition[]),
  ...(php84 as SnippetDefinition[]),
  ...(symfony as SnippetDefinition[]),
  ...(symfonyAttributes as SnippetDefinition[]),
  ...(symfonyDoctrine as SnippetDefinition[]),
  ...(symfonyMessenger as SnippetDefinition[]),
  ...(symfonyScheduler as SnippetDefinition[])
];
