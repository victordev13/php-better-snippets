import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

interface Psr4Rule {
  prefix: string;
  baseDir: string;
}

interface ComposerCacheEntry {
  mtimeMs: number;
  rules: Psr4Rule[];
}

const composerCache = new Map<string, ComposerCacheEntry>();

export function invalidateComposerCache(composerJsonPath?: string): void {
  if (composerJsonPath) {
    composerCache.delete(composerJsonPath);
    return;
  }
  composerCache.clear();
}

function findNearestComposerJson(fileDir: string, boundary: string): string | undefined {
  let dir = fileDir;
  while (true) {
    const candidate = path.join(dir, 'composer.json');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    if (dir === boundary) {
      return undefined;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
}

function loadPsr4Rules(composerJsonPath: string): Psr4Rule[] {
  const stat = fs.statSync(composerJsonPath);
  const cached = composerCache.get(composerJsonPath);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.rules;
  }

  const rules: Psr4Rule[] = [];
  try {
    const raw = fs.readFileSync(composerJsonPath, 'utf8');
    const json = JSON.parse(raw);
    const composerDir = path.dirname(composerJsonPath);

    for (const section of ['autoload', 'autoload-dev']) {
      const psr4 = json?.[section]?.['psr-4'];
      if (!psr4 || typeof psr4 !== 'object') {
        continue;
      }
      for (const [prefix, dirs] of Object.entries(psr4)) {
        const dirList = Array.isArray(dirs) ? dirs : [dirs];
        for (const d of dirList) {
          if (typeof d !== 'string') {
            continue;
          }
          const baseDir = path.normalize(path.join(composerDir, d)).replace(/[\\/]+$/, '');
          rules.push({ prefix, baseDir });
        }
      }
    }
  } catch {
    // composer.json inválido ou ilegível: nenhuma regra resolvida.
  }

  composerCache.set(composerJsonPath, { mtimeMs: stat.mtimeMs, rules });
  return rules;
}

/**
 * Resolve o namespace PHP real do diretório de um arquivo, com base no
 * mapeamento PSR-4 (autoload/autoload-dev) do composer.json mais próximo.
 * Retorna undefined se não houver composer.json ou nenhuma entrada PSR-4
 * cobrir o arquivo — quem chama decide o que fazer nesse caso (ex.: deixar
 * o tab-stop vazio para edição manual).
 */
export function resolveNamespace(fileUri: vscode.Uri): string | undefined {
  if (fileUri.scheme !== 'file') {
    return undefined;
  }

  const filePath = fileUri.fsPath;
  const fileDir = path.dirname(filePath);
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
  const boundary = workspaceFolder ? workspaceFolder.uri.fsPath : path.parse(filePath).root;

  const composerJsonPath = findNearestComposerJson(fileDir, boundary);
  if (!composerJsonPath) {
    return undefined;
  }

  const rules = loadPsr4Rules(composerJsonPath);
  if (rules.length === 0) {
    return undefined;
  }

  let best: Psr4Rule | undefined;
  for (const rule of rules) {
    const isAncestor = fileDir === rule.baseDir || fileDir.startsWith(rule.baseDir + path.sep);
    if (isAncestor && (!best || rule.baseDir.length > best.baseDir.length)) {
      best = rule;
    }
  }
  if (!best) {
    return undefined;
  }

  const relative = path.relative(best.baseDir, fileDir);
  const relativeNs = relative.split(path.sep).filter(Boolean).join('\\');
  const prefix = best.prefix.endsWith('\\') ? best.prefix.slice(0, -1) : best.prefix;

  return relativeNs ? `${prefix}\\${relativeNs}` : prefix;
}
