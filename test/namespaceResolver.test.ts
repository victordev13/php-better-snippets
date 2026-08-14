import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Uri, workspace } from 'vscode';
import { invalidateComposerCache, resolveNamespace } from '../src/namespaceResolver';

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return { ...actual, readFileSync: vi.fn(actual.readFileSync) };
});

function writeComposerJson(dir: string, content: unknown): void {
  fs.writeFileSync(path.join(dir, 'composer.json'), JSON.stringify(content));
}

function mkdirs(...segments: string[]): string {
  const dir = path.join(...segments);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

describe('resolveNamespace', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pbs-namespace-'));
    // Bounds the directory walk-up to the test's own tmpdir, so it doesn't
    // accidentally find a real composer.json on the machine.
    vi.mocked(workspace.getWorkspaceFolder).mockReturnValue({ uri: Uri.file(root) } as never);
  });

  afterEach(() => {
    invalidateComposerCache();
    fs.rmSync(root, { recursive: true, force: true });
    vi.mocked(workspace.getWorkspaceFolder).mockReset();
  });

  it('resolves via autoload psr-4', () => {
    writeComposerJson(root, { autoload: { 'psr-4': { 'App\\': 'src/' } } });
    const fileDir = mkdirs(root, 'src', 'Service');
    const file = Uri.file(path.join(fileDir, 'Foo.php'));

    expect(resolveNamespace(file)).toBe('App\\Service');
  });

  it('resolves via autoload-dev psr-4', () => {
    writeComposerJson(root, {
      autoload: { 'psr-4': { 'App\\': 'src/' } },
      'autoload-dev': { 'psr-4': { 'App\\Tests\\': 'tests/' } }
    });
    const fileDir = mkdirs(root, 'tests', 'Unit');
    const file = Uri.file(path.join(fileDir, 'FooTest.php'));

    expect(resolveNamespace(file)).toBe('App\\Tests\\Unit');
  });

  it('resolves to the bare prefix when the file sits directly in the base dir', () => {
    writeComposerJson(root, { autoload: { 'psr-4': { 'App\\': 'src/' } } });
    const fileDir = mkdirs(root, 'src');
    const file = Uri.file(path.join(fileDir, 'Foo.php'));

    expect(resolveNamespace(file)).toBe('App');
  });

  it('returns undefined when there is no composer.json up to the workspace boundary', () => {
    const fileDir = mkdirs(root, 'src', 'Service');
    const file = Uri.file(path.join(fileDir, 'Foo.php'));

    expect(resolveNamespace(file)).toBeUndefined();
  });

  it('returns undefined when no psr-4 entry covers the file', () => {
    writeComposerJson(root, { autoload: { 'psr-4': { 'App\\': 'src/' } } });
    const fileDir = mkdirs(root, 'other', 'Place');
    const file = Uri.file(path.join(fileDir, 'Foo.php'));

    expect(resolveNamespace(file)).toBeUndefined();
  });

  it('picks the most specific (longest) psr-4 entry when several match', () => {
    writeComposerJson(root, {
      autoload: {
        'psr-4': {
          'App\\': 'src/',
          'App\\Admin\\': 'src/Admin/'
        }
      }
    });
    const fileDir = mkdirs(root, 'src', 'Admin', 'Controller');
    const file = Uri.file(path.join(fileDir, 'FooController.php'));

    expect(resolveNamespace(file)).toBe('App\\Admin\\Controller');
  });

  it('resolves using the nearest composer.json in a monorepo, not the root one', () => {
    writeComposerJson(root, { autoload: { 'psr-4': { 'Root\\': 'src/' } } });
    const pkgDir = mkdirs(root, 'packages', 'foo');
    writeComposerJson(pkgDir, { autoload: { 'psr-4': { 'Foo\\': 'src/' } } });
    const fileDir = mkdirs(pkgDir, 'src', 'Bar');
    const file = Uri.file(path.join(fileDir, 'Bar.php'));

    expect(resolveNamespace(file)).toBe('Foo\\Bar');
  });

  it('returns undefined for non-file schemes', () => {
    const file = { scheme: 'untitled', fsPath: path.join(root, 'Foo.php') } as unknown as Uri;

    expect(resolveNamespace(file)).toBeUndefined();
  });

  it('picks up composer.json changes after invalidateComposerCache', () => {
    writeComposerJson(root, { autoload: { 'psr-4': { 'App\\': 'src/' } } });
    const fileDir = mkdirs(root, 'src', 'Service');
    const file = Uri.file(path.join(fileDir, 'Foo.php'));

    expect(resolveNamespace(file)).toBe('App\\Service');

    writeComposerJson(root, { autoload: { 'psr-4': { 'Renamed\\': 'src/' } } });
    // Without invalidating, the mtime-based cache may or may not have
    // already noticed the change depending on the FS clock resolution —
    // force explicit invalidation, the path used by FileSystemWatcher in production.
    invalidateComposerCache(path.join(root, 'composer.json'));

    expect(resolveNamespace(file)).toBe('Renamed\\Service');
  });

  it('does not reparse composer.json on a second resolve with the same mtime', () => {
    writeComposerJson(root, { autoload: { 'psr-4': { 'App\\': 'src/' } } });
    const fileDir = mkdirs(root, 'src', 'Service');
    const file = Uri.file(path.join(fileDir, 'Foo.php'));

    resolveNamespace(file);
    const readFileSync = vi.mocked(fs.readFileSync);
    const callsAfterFirstResolve = readFileSync.mock.calls.length;

    resolveNamespace(file);

    expect(readFileSync.mock.calls.length).toBe(callsAfterFirstResolve);
  });
});
