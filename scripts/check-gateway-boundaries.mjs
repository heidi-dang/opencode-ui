#!/usr/bin/env node

/**
 * check-gateway-boundaries.mjs
 *
 * Gateway boundary guard: scans apps/gateway/ for forbidden dependencies
 * and source patterns. The gateway may use Fastify and Zod but must not
 * import the OpenCode SDK or implement real-time transports.
 *
 * Run:  node scripts/check-gateway-boundaries.mjs
 * CI:   npm run check:boundaries
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const GATEWAY_SRC = join(ROOT, 'apps/gateway');

const FORBIDDEN_DEPENDENCIES = [
  '@opencode-ai/sdk',
  'eventsource',
  'ws',
  'axios',
  'sqlite3',
  'better-sqlite3',
  'sql.js',
  'prisma',
  '@prisma/client',
  'node-pty',
  'pty',
  'child_process',
];

const FORBIDDEN_PATTERNS = [
  { pattern: 'EventSource', wordBoundary: true },
  { pattern: 'new WebSocket', wordBoundary: true },
  { pattern: 'prompt_async', wordBoundary: true },
  { pattern: 'XMLHttpRequest', wordBoundary: true },
];

const issues = [];

// ── 1. Check package.json dependencies ──────────────────────────────
const pkgPath = join(GATEWAY_SRC, 'package.json');
try {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const [name, version] of Object.entries(allDeps)) {
    if (FORBIDDEN_DEPENDENCIES.includes(name)) {
      issues.push({
        file: 'apps/gateway/package.json',
        detail: `Forbidden dependency "${name}" (${version}) in gateway package.`,
      });
    }
  }
} catch {
  issues.push({ file: 'apps/gateway/package.json', detail: 'Cannot read package.json' });
}

// ── 2. Scan source files ───────────────────────────────────────────
const extensions = ['.ts', '.tsx', '.js', '.mjs'];
function collectFiles(dir) {
  const files = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'dist') {
        files.push(...collectFiles(full));
      } else if (stat.isFile() && extensions.some((e) => full.endsWith(e))) {
        files.push(full);
      }
    }
  } catch { /* ignore */ }
  return files;
}

const srcFiles = collectFiles(join(GATEWAY_SRC, 'src')).filter(
  (f) => !f.endsWith('boundary.test.ts') && !f.endsWith('boundary.test.tsx'),
);

for (const file of srcFiles) {
  const content = readFileSync(file, 'utf-8');
  const relativePath = file.replace(ROOT, '').replace(/^\//, '');

  for (const { pattern, wordBoundary } of FORBIDDEN_PATTERNS) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = wordBoundary
      ? new RegExp(`\\b${escaped}\\b`, 'i')
      : new RegExp(escaped, 'i');
    if (regex.test(content)) {
      issues.push({
        file: relativePath,
        detail: `Literal string "${pattern}" found in gateway source.`,
      });
    }
  }
}

// ── Results ─────────────────────────────────────────────────────────
if (issues.length === 0) {
  console.log('✅  check:gateway-boundaries  —  No forbidden integrations found in gateway.');
  process.exit(0);
}

console.error(`❌  check:gateway-boundaries  —  ${issues.length} violation(s) found:\n`);
for (const issue of issues) {
  console.error(`  ${issue.file}`);
  console.error(`    → ${issue.detail}`);
  console.error();
}
process.exit(1);
