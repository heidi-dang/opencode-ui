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

// Additional config / source files to scan beyond src/
const CONFIG_FILES = [
  'package.json',
  'vite.config.ts',
  'eslint.config.js',
].map((f) => join(ROOT, f));

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
  'pty',
  'xterm',
  '@xterm/xterm',
  'node:child_process',
  'child_process',

  // SDK / API clients
  '@google-genai',
  '@google/generative-ai',
  'openai',
  'anthropic',
  '@opencode/sdk',
  '@opencode-ai/sdk',
  'createOpencode',
  'createOpencodeClient',

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

  // Server-Sent Events / realtime
  'eventsource',
  'event-source-polyfill',
  'EventSource',

  // WebSocket / realtime
  'new WebSocket',

  // OpenCode API
  'prompt_async',
  '/api/opencode',

  // Network addresses (runtime code only)
  'localhost:',
  '127.0.0.1:',

  // Environment variables (source code only)
  'GEMINI_API_KEY',

  // HTTP client libraries
  'axios',
];

// ── Patterns that require an import/require context ──────────────────

const IMPORT_PATTERNS = [
  'fastify', 'express', 'koa', 'hapi',
  'node:http', 'node:https', 'node:net', 'node:ws',
  'ws', 'socket.io', 'socket.io-client',
  '@webcontainer/api',
  'node-pty', 'xterm', '@xterm/xterm', 'node:child_process',
  '@google-genai', '@google/generative-ai', 'openai', 'anthropic',
  '@opencode/sdk', '@opencode-ai/sdk',
  'prisma', '@prisma/client', 'drizzle-orm',
  'better-sqlite3', 'sql.js', 'sqlite3',
  'next-auth', 'passport', 'auth0', 'clerk', '@supabase/supabase-js',
  'eventsource', 'event-source-polyfill',
  'axios',
];

// ── Patterns that are literal strings in source code ─────────────────
// These patterns require word boundaries to avoid false positives from
// comments describing deferred functionality.

const LITERAL_PATTERNS = [
  { pattern: 'createOpencode', wordBoundary: true },
  { pattern: 'createOpencodeClient', wordBoundary: true },
  { pattern: 'prompt_async', wordBoundary: true },
  { pattern: '/api/opencode', wordBoundary: false },
  { pattern: 'GEMINI_API_KEY', wordBoundary: true },
  { pattern: 'localhost:', wordBoundary: false },
  { pattern: '127.0.0.1:', wordBoundary: false },
  // Network request patterns — catch actual function calls, not string references
  { pattern: 'fetch(', wordBoundary: true },
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
const allFiles = [...srcFiles, ...CONFIG_FILES.filter((f) => {
  try { statSync(f); return true; } catch { return false; }
})];

for (const file of allFiles) {
  const content = readFileSync(file, 'utf-8');
  const relativePath = file.replace(ROOT, '').replace(/^\//, '');

  // 1. Check import/require patterns
  for (const forbidden of IMPORT_PATTERNS) {
    const importRegex = new RegExp(
      `(from\\s+['"\`]${escapeRegex(forbidden)}|require\\(['"\`]${escapeRegex(forbidden)}|import\\(['"\`]${escapeRegex(forbidden)})`,
      'i',
    );

    if (importRegex.test(content)) {
      issues.push({
        file: relativePath,
        forbidden,
        detail: `Import/require of "${forbidden}" detected. Frontend source must not import backend packages.`,
      });
    }
  }

  // 2. Check literal patterns in source files only (skip lockfiles/docs)
  if (
    file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') ||
    file.endsWith('.jsx') || file.endsWith('.mjs') || file.endsWith('.cjs') ||
    file.endsWith('.json')
  ) {
    // Skip files that deliberately check for these patterns (boundary tests)
    if (file.includes('boundaries.test.ts') || file.includes('boundary-contract.test.ts')) continue;
    if (file.endsWith('check-forbidden-integrations.mjs')) continue;

    for (const { pattern, wordBoundary } of LITERAL_PATTERNS) {
      const escaped = escapeRegex(pattern);
      const regex = wordBoundary
        ? new RegExp(`\\b${escaped}\\b`, 'i')
        : new RegExp(escaped, 'i');

      if (regex.test(content)) {
        issues.push({
          file: relativePath,
          forbidden: pattern,
          detail: `Literal string "${pattern}" found in source code. Backend/network references not allowed in Phase 1C.`,
        });
      }
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
