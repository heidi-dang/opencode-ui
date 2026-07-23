#!/usr/bin/env node

/**
 * check-forbidden-integrations.mjs
 *
 * Boundary guard: scans src/ for any import, require, or string reference
 * to backend-only packages, server modules, or forbidden integrations.
 *
 * Phase 1A/1B must remain 100% frontend-only. This script enforces that
 * nothing leaks in from the server / SDK / API layer.
 *
 * Run:  node scripts/check-forbidden-integrations.mjs
 * CI:   npm run check:boundaries
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');

// ── Forbidden patterns ─────────────────────────────────────────────
// Anything in this list that appears as an import, require, or
// top-level reference in src/ will fail the check.

const FORBIDDEN_IMPORTS = [
  // Node server / HTTP
  'fastify',
  'express',
  'koa',
  'hapi',
  'node:http',
  'node:https',
  'node:net',
  'node:ws',
  'ws',
  'socket.io',
  'socket.io-client',

  // WebContainers
  '@webcontainer/api',

  // Pty / terminals
  'node-pty',
  'xterm',
  '@xterm/xterm',
  'node:child_process',

  // SDK / API clients
  '@google-genai',
  '@google/generative-ai',
  'openai',
  'anthropic',
  '@opencode/sdk',

  // Backend database / ORM
  'prisma',
  '@prisma/client',
  'drizzle-orm',
  'better-sqlite3',
  'sql.js',
  'better-sqlite3',
  'sqlite3',

  // Auth backends
  'next-auth',
  'passport',
  'auth0',
  'clerk',
  '@supabase/supabase-js',

  // Server-Sent Events (Phase 1C)
  'eventsource',
  'event-source-polyfill',
];

// ── Scan logic ──────────────────────────────────────────────────────

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
const excludeDirs = new Set([
  'node_modules',
  'dist',
  '.git',
  '.vite',
  'coverage',
]);

const issues = [];

function collectFiles(dir) {
  const files = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      if (!excludeDirs.has(entry) && !entry.startsWith('.')) {
        files.push(...collectFiles(full));
      }
    } else if (
      stat.isFile() &&
      extensions.some((ext) => full.endsWith(ext))
    ) {
      files.push(full);
    }
  }
  return files;
}

const srcFiles = collectFiles(SRC);

for (const file of srcFiles) {
  const content = readFileSync(file, 'utf-8');
  const relativePath = file.replace(ROOT, '').replace(/^\//, '');

  for (const forbidden of FORBIDDEN_IMPORTS) {
    // Check import/require statements and dynamic imports
    const importRegex = new RegExp(
      `(from\\s+['"\`]${escapeRegex(forbidden)}|require\\(['"\`]${escapeRegex(forbidden)}|import\\(['"\`]${escapeRegex(forbidden)})`,
      'i',
    );

    if (importRegex.test(content)) {
      issues.push({
        file: relativePath,
        forbidden,
        detail: `Import/require of "${forbidden}" detected. Phase 1A/1B must remain frontend-only.`,
      });
    }
  }
}

// ── Results ─────────────────────────────────────────────────────────

if (issues.length === 0) {
  console.log('✅  check:boundaries  —  No forbidden integrations found.');
  process.exit(0);
}

console.error(`❌  check:boundaries  —  ${issues.length} violation(s) found:\n`);
for (const issue of issues) {
  console.error(`  ${issue.file}`);
  console.error(`    → ${issue.detail}`);
  console.error();
}
process.exit(1);

// ── Helpers ─────────────────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
