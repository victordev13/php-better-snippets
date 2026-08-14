# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Esta é a extensão VS Code **PHP Better Snippets**, que fornece snippets de código para PHP e para o framework Symfony (incluindo Doctrine, Messenger e Scheduler). Todos os snippets são servidos em runtime por um único `CompletionItemProvider` em TypeScript (`src/`) — não há mais nenhum mecanismo declarativo (`contributes.snippets`, `.code-snippets`, `.dist`, `build.sh`); tudo é bundlado via `esbuild` em `dist/extension.js`.

## Arquitetura

- `snippets/*.snippets.json`: fonte de verdade de todos os snippets, um arquivo por área (mesma divisão que existia antes em `snippets/*.code-snippets`):
  - `php.snippets.json`, `php8.4.snippets.json`, `symfony.snippets.json`, `symfony-attributes.snippets.json`, `symfony-doctrine.snippets.json`, `symfony-messenger.snippets.json`, `symfony-scheduler.snippets.json`.
  - Cada arquivo é um array de `{ name, prefix, body, description, scope? }` (`prefix`/`body` podem ser array). Para adicionar/editar um snippet, edite o JSON da área correta.
- `src/snippets.ts`: **não contém snippets** — só importa e concatena todos os `snippets/*.snippets.json` num único array (`snippets`), etiquetando cada definição com `area: 'php' | 'symfony'` (via `withArea()`, conforme o arquivo de origem — `php.snippets.json`/`php8.4.snippets.json` viram `'php'`, os cinco `symfony*.snippets.json` viram `'symfony'`), e exporta `NAMESPACE_MARKER`, a string literal `$PHP_RESOLVED_NAMESPACE` usada como marcador de substituição textual (não é tabstop).
- `src/namespaceResolver.ts`: dado o `Uri` do arquivo PHP ativo, sobe a árvore de diretórios (sem passar do workspace folder) procurando o `composer.json` mais próximo; faz parse de `autoload.psr-4` e `autoload-dev.psr-4`; escolhe a entrada cujo diretório-base seja o ancestral mais específico do arquivo; monta `PrefixoPSR4 + caminhoRelativo`. Retorna `undefined` se não resolver — não há fallback para heurística de pastas, o tab-stop fica vazio para edição manual. Cacheia regras por `composer.json` (invalidado por `mtime` e por um `FileSystemWatcher`).
- `src/snippetProvider.ts` (`PhpSnippetProvider`): `CompletionItemProvider` registrado para `language: 'php'` (em `src/extension.ts`). Lê a configuração `php-better-snippets.enable-symfony-snippets` (default `true`, contribuída em `package.json`) e pula as definições com `area: 'symfony'` quando estiver `false`. Para cada definição restante, monta o corpo final substituindo `$PHP_VARIABLE_TYPE`/`$PHP_FUNCTION_RETURN_TYPE`/`$PHP_POSSIBLE_EXCEPTIONS` (valores de `custom-variables.json`, importado direto como JSON) e, se o body contiver `NAMESPACE_MARKER`, substitui todas as ocorrências pelo namespace resolvido como **texto plano, escapado** (ou string vazia se não resolvido) — nunca por um tabstop, então o cursor nunca para no namespace. Snippets sem o marcador passam intactos. Cada `CompletionItem` define `item.range` explicitamente como `document.getWordRangeAtPosition(position)` (com fallback para um range vazio na posição do cursor) — sem isso, o VS Code calcula a área de substituição por conta própria e pode acabar selecionando o snippet inteiro após a expansão, em vez de focar o primeiro tabstop.
- `src/extension.ts`: registra o provider e um `FileSystemWatcher('**/composer.json')` para invalidar o cache do resolver.
- Bundle: `esbuild src/extension.ts --bundle --outfile=dist/extension.js ...` (script `compile`). O conteúdo dos `snippets/*.snippets.json` é embutido diretamente no bundle — `src/**` e `snippets/**` são ignorados no `.vscodeignore`, só `dist/extension.js` vai para o pacote.

## Comandos comuns

```bash
npm install                    # instala esbuild/typescript/@types/vitest (devDependencies)
npm run compile                # bundla src/extension.ts (+ dados JSON) em dist/extension.js via esbuild
npm run watch                  # compile em modo watch
npx tsc --noEmit               # type-check sem emitir arquivos (cobre src/, snippets/ e test/)
npm test                       # roda a suíte de testes unitários (vitest run)
npm run test:watch             # vitest em modo watch
npm run vscode:prepublish      # roda compile (dispara automaticamente antes de empacotar/publicar)
npm run pack                   # gera o pacote .vsix (vsce package)
npm run publish                # empacota e publica no Marketplace
npm run publish:pre-release    # publica como pre-release
npm run release -- patch       # bump de versão + CHANGELOG.md + build + commit/tag (ver scripts/release.js)
```

Um `Makefile` na raiz espelha esses comandos em alvos curtos (`make build`, `make test`, `make release-patch`, `make release VERSION=x.y.z`, etc.), puramente como atalho — a lógica real fica nos scripts `npm`.

Suíte de testes unitários com **vitest** em `test/`: `namespaceResolver.test.ts` (resolução PSR-4, monorepo, cache por mtime e invalidação) e `snippetProvider.test.ts` (substituição de custom-variables, substituição/omissão do marcador de namespace, snippets sem marcador, toggle de `enable-symfony-snippets`). Como `vscode` não existe como módulo real em runtime Node, `vitest.config.ts` faz alias de `vscode` para `test/mocks/vscode.ts` (mock mínimo de `Uri`, `CompletionItem`, `SnippetString`, `workspace.getWorkspaceFolder`, `workspace.getConfiguration`). Além disso, testar manualmente: F5 no VS Code (`.vscode/launch.json` já roda `vscode:prepublish` como `preLaunchTask`) abre uma janela de Extension Development Host.

## Convenções observadas nos snippets

- Muitos snippets oferecem variantes para **anotações** vs **atributos** e para diferentes versões do Symfony (ex.: `command` tem variantes para ^6.4, 5.x–6.3 e versões antigas) — múltiplas entradas no mesmo `.snippets.json` com o mesmo `prefix`.
- Placeholders usam a sintaxe padrão de snippets do VS Code (`$1`, `${2:default}`, `${3|opcao1,opcao2|}`).
- Snippets que geram `namespace` usam o marcador de texto `$PHP_RESOLVED_NAMESPACE` (**não** é um tabstop numerado). Em runtime, o provider (`src/snippetProvider.ts`) sempre o substitui por **texto plano** (namespace resolvido ou string vazia), então o cursor nunca para nele — os demais parâmetros do snippet ficam numerados de `$1` em diante, na ordem em que devem ser preenchidos, sem reservar número nenhum para o namespace. Não escreva esse marcador à mão em snippets novos a menos que o namespace real do projeto deva ser inserido ali.

## Documentação relacionada

- `README.md`: lista completa e atualizada de todos os prefixos de snippets disponíveis e a seção "About namespace generation" (explica a resolução via PSR-4) — deve ser mantida em sincronia ao adicionar/remover/renomear snippets.
- `CONTRIBUTING.md`: explica onde editar snippets (`snippets/*.snippets.json`), as variáveis customizadas (`$PHP_VARIABLE_TYPE`, etc.) e o mecanismo de namespace dinâmico.
- `CHANGELOG.md`: notas de release; mantém sempre uma seção `## [Unreleased]` no topo (populada manualmente a cada mudança) que `scripts/release.js` move para `## [x.y.z] - YYYY-MM-DD` ao rodar `npm run release`.
