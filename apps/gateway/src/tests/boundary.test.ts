import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gatewayRoot = resolve(__dirname, '../..');
const srcDir = resolve(gatewayRoot, 'src');

function readPackageJson(): Record<string, unknown> {
  return JSON.parse(readFileSync(resolve(gatewayRoot, 'package.json'), 'utf-8'));
}

function collectSourceFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory() && entry !== 'node_modules') {
        files.push(...collectSourceFiles(full));
      } else if (stat.isFile() && extname(full) === '.ts') {
        files.push(full);
      }
    }
  } catch { /* ignore */ }
  return files;
}

const sourceFiles = collectSourceFiles(srcDir).filter(
  (f) => !f.endsWith('boundary.test.ts') && !f.endsWith('sdk-adapter.test.ts'),
);

function readAllSource(): string {
  return sourceFiles.map((f) => readFileSync(f, 'utf-8')).join('\n');
}

describe('Boundary: no forbidden dependencies', () => {
  it('No @opencode-ai/sdk dependency in package.json', () => {
    const pkg = readPackageJson();
    const allDeps = {
      ...(pkg.dependencies as Record<string, string> || {}),
      ...(pkg.devDependencies as Record<string, string> || {}),
    };
    const sdkDeps = Object.keys(allDeps).filter((d) => d.startsWith('@opencode-ai/'));
    expect(sdkDeps).not.toContain('@opencode-ai/sdk');
  });

  it('No SQLite dependency', () => {
    const pkg = readPackageJson();
    const allDeps = {
      ...(pkg.dependencies as Record<string, string> || {}),
      ...(pkg.devDependencies as Record<string, string> || {}),
    };
    const sqliteDeps = Object.keys(allDeps).filter(
      (d) => d.includes('sqlite') || d.includes('sql.js') || d.includes('better-sqlite3'),
    );
    expect(sqliteDeps).toHaveLength(0);
  });
});

describe('Boundary: no forbidden API references in source', () => {
  it('No EventSource reference in source files', () => {
    const source = readAllSource();
    const lines = source.split('\n').filter((l) => l.includes('EventSource'));
    const codeRefs = lines.filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*'));
    expect(codeRefs).toHaveLength(0);
  });

  it('No WebSocket reference in source files', () => {
    const source = readAllSource();
    const lines = source.split('\n').filter((l) => l.includes('WebSocket'));
    const codeRefs = lines.filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*'));
    expect(codeRefs).toHaveLength(0);
  });

  it('No prompt_async reference', () => {
    const source = readAllSource();
    const lines = source.split('\n').filter((l) => l.includes('prompt_async'));
    const codeRefs = lines.filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*'));
    expect(codeRefs).toHaveLength(0);
  });
});
