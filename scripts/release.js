#!/usr/bin/env node
'use strict';

/**
 * Release helper: bumps package.json's version, moves the CHANGELOG.md
 * "Unreleased" section under a new dated version heading, runs the
 * type-check/test/build pipeline, and commits + tags the result.
 *
 * Usage: npm run release -- <patch|minor|major|x.y.z> [--no-git]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PKG_PATH = path.join(ROOT, 'package.json');
const PKG_LOCK_PATH = path.join(ROOT, 'package-lock.json');
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function run(command) {
  execSync(command, { stdio: 'inherit', cwd: ROOT });
}

function parseArgs() {
  const bump = process.argv[2];
  const noGit = process.argv.includes('--no-git');
  if (!bump) {
    fail('Usage: npm run release -- <patch|minor|major|x.y.z> [--no-git]');
  }
  return { bump, noGit };
}

function bumpVersion(current, bump) {
  if (/^\d+\.\d+\.\d+$/.test(bump)) {
    return bump;
  }
  const [major, minor, patch] = current.split('.').map(Number);
  if (bump === 'major') {
    return `${major + 1}.0.0`;
  }
  if (bump === 'minor') {
    return `${major}.${minor + 1}.0`;
  }
  if (bump === 'patch') {
    return `${major}.${minor}.${patch + 1}`;
  }
  fail(`Invalid bump type "${bump}". Use patch, minor, major, or an explicit x.y.z version.`);
}

function ensureCleanWorkingTree() {
  const status = execSync('git status --porcelain', { cwd: ROOT }).toString().trim();
  if (status) {
    fail('Working tree is not clean. Commit or stash your changes before releasing.');
  }
}

function readUnreleasedSection(changelog) {
  const match = changelog.match(/## \[Unreleased\]\n([\s\S]*?)(?=\n## \[|\n?$)/);
  if (!match) {
    fail('CHANGELOG.md has no "## [Unreleased]" section. Add one and document your changes before releasing.');
  }
  return { full: match[0], body: match[1].trim() };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function main() {
  const { bump, noGit } = parseArgs();

  if (!noGit) {
    ensureCleanWorkingTree();
  }

  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  const newVersion = bumpVersion(pkg.version, bump);

  const changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const { full, body } = readUnreleasedSection(changelog);
  if (!body) {
    fail('The "## [Unreleased]" section in CHANGELOG.md is empty. Document the changes before releasing.');
  }

  console.log(`\nReleasing ${pkg.version} → ${newVersion}\n`);

  console.log('› Type-checking...');
  run('npx tsc --noEmit');

  console.log('› Running tests...');
  run('npm test');

  pkg.version = newVersion;
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');

  const newSection = `## [Unreleased]\n\n## [${newVersion}] - ${today()}\n\n${body}\n`;
  fs.writeFileSync(CHANGELOG_PATH, changelog.replace(full, newSection.trimEnd() + '\n'));

  console.log('› Building extension bundle...');
  run('npm run compile');

  if (!noGit) {
    console.log('› Committing and tagging...');
    const filesToCommit = ['package.json', 'CHANGELOG.md', ...(fs.existsSync(PKG_LOCK_PATH) ? ['package-lock.json'] : [])];
    run(`git add ${filesToCommit.join(' ')}`);
    run(`git commit -m "chore: release v${newVersion}"`);
    run(`git tag v${newVersion}`);
  }

  console.log(`\n✔ Released v${newVersion}\n`);
  console.log('Next steps:');
  if (!noGit) {
    console.log(`  git push && git push origin v${newVersion}`);
  }
  console.log('  npm run pack       # build the .vsix locally');
  console.log('  npm run publish    # publish to the Marketplace');
}

main();
