import { describe, it, expect } from 'vitest';

/**
 * Boundary enforcement tests.
 *
 * These tests verify that the src/ tree does not contain imports
 * of forbidden backend packages. The same logic is enforced at CI
 * by `scripts/check-forbidden-integrations.mjs`.
 */
describe('Frontend boundary enforcement', () => {
  const FORBIDDEN_PATTERNS = [
    'fastify',
    'express',
    'node:http',
    'node:net',
    'node:ws',
    'ws',
    'socket.io',
    '@webcontainer/api',
    'node-pty',
    '@google-genai',
    '@google/generative-ai',
    'openai',
    'anthropic',
    '@opencode/sdk',
    'prisma',
    '@prisma/client',
    'drizzle-orm',
    'better-sqlite3',
    'sql.js',
    'sqlite3',
    'next-auth',
    'passport',
    'eventsource',
    'event-source-polyfill',
  ];

  it('detects no forbidden backend imports in src/', () => {
    // Read the actual output of the boundary check script
    const { execSync } = require_node('child_process');
    const result = execSync(
      'node scripts/check-forbidden-integrations.mjs',
      { encoding: 'utf-8', cwd: resolve_root() }
    );
    expect(result).toContain('No forbidden integrations found');
  });

  const FORBIDDEN_SNIPPETS = FORBIDDEN_PATTERNS.map((p) => ({
    pattern: p,
    regex: new RegExp(
      `(from\\s+['"\`]${p.replace(/[/@.-]/g, '\\$&')}|require\\(['"\`]${p.replace(/[/@.-]/g, '\\$&')}|import\\(['"\`]${p.replace(/[/@.-]/g, '\\$&')})`,
    ),
  }));

  it('has no literal forbidden import strings in source files', () => {
    const fs = require_node('fs');
    const path = require_node('path');
    const root = resolve_root();
    const srcDir = path.join(root, 'src');

    function scanFiles(dir: string): string[] {
      const results: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist') {
          results.push(...scanFiles(full));
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
          results.push(full);
        }
      }
      return results;
    }

    const files = scanFiles(srcDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const { pattern, regex } of FORBIDDEN_SNIPPETS) {
        if (regex.test(content)) {
          const relativePath = path.relative(root, file);
          expect.unreachable(`Found forbidden import "${pattern}" in ${relativePath}`);
        }
      }
    }
  });
});

describe('check:boundaries script', () => {
  it('exists at expected path', () => {
    const fs = require_node('fs');
    const path = require_node('path');
    const scriptPath = path.join(resolve_root(), 'scripts/check-forbidden-integrations.mjs');
    expect(fs.existsSync(scriptPath)).toBe(true);
  });
});

// Helpers to avoid import issues in vitest/jsdom
function require_node(module: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(module);
}
function resolve_root(): string {
  return require_node('path').resolve(__dirname, '../..');
}
