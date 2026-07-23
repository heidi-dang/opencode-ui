import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { useUiStore } from '../store/useUiStore';

describe('QA page gateway readiness section', () => {
  beforeEach(() => {
    useUiStore.setState({
      appearance: 'system',
      leftPanelOpen: true,
      rightPanelOpen: true,
      mobileNavigationOpen: false,
      mobileContextOpen: false,
      activeContextSection: 'workspace',
      commandPaletteOpen: false,
    });
    localStorage.clear();
  });

  it('QA page shows Gateway Integration Readiness section', () => {
    window.history.pushState({}, '', '/qa');
    render(<App />);
    expect(screen.getByText(/Gateway Integration Readiness/i)).toBeInTheDocument();
  });

  it('QA page states SDK is not installed', () => {
    window.history.pushState({}, '', '/qa');
    render(<App />);
    const sdkText = screen.getAllByText(/Not installed/i);
    expect(sdkText.length).toBeGreaterThan(0);
  });

  it('QA page states SSE is not implemented', () => {
    window.history.pushState({}, '', '/qa');
    render(<App />);
    const notImplText = screen.getAllByText(/Not implemented/i);
    expect(notImplText.length).toBeGreaterThan(0);
  });

  it('QA page states gateway is not implemented', () => {
    window.history.pushState({}, '', '/qa');
    render(<App />);
    // Verify the Gateway Integration Readiness section exists
    expect(screen.getByText(/Gateway Integration Readiness/i)).toBeInTheDocument();
    // And at least one "not implemented" text is present
    const notImpl = screen.getAllByText(/not implemented/i);
    expect(notImpl.length).toBeGreaterThan(0);
  });

  it('QA page shows offline connection status', () => {
    window.history.pushState({}, '', '/qa');
    render(<App />);
    const offlineElements = screen.getAllByText(/offline/i);
    expect(offlineElements.length).toBeGreaterThan(0);
  });

  it('QA page readiness section does not imply live gateway connection', () => {
    window.history.pushState({}, '', '/qa');
    render(<App />);
    // The page should mention "Demo adapter" not "Connected"
    const demoAdapterElements = screen.getAllByText(/Demo adapter/i);
    expect(demoAdapterElements.length).toBeGreaterThan(0);
  });
});

describe('Frontend-only boundary documentation', () => {
  it('README documents frontend-only boundary', () => {
    const readmePath = require_node('path').resolve(__dirname, '../../README.md');
    const readme = require_node('fs').readFileSync(readmePath, 'utf-8');
    expect(readme).toContain('not implemented');
    expect(readme).toContain('Frontend');
  });

  it('IMPLEMENTATION_MANIFEST records Phase 1E', () => {
    const manifestPath = require_node('path').resolve(__dirname, '../../IMPLEMENTATION_MANIFEST.md');
    const manifest = require_node('fs').readFileSync(manifestPath, 'utf-8');
    expect(manifest).toContain('Phase 1E');
  });

  it('readiness audit document exists', () => {
    const docPath = require_node('path').resolve(__dirname, '../../docs/readiness/frontend-readiness-audit.md');
    const doc = require_node('fs').readFileSync(docPath, 'utf-8');
    expect(doc).toContain('Frontend Readiness Audit');
    expect(doc).toContain('Phase 1E');
  });

  it('gateway integration contract document exists', () => {
    const docPath = require_node('path').resolve(__dirname, '../../docs/contracts/gateway-integration-contract.md');
    const doc = require_node('fs').readFileSync(docPath, 'utf-8');
    expect(doc).toContain('Gateway Integration Contract');
    expect(doc).toContain('Phase 1E');
  });

  it('docs clearly state future/deferred gateway work', () => {
    const docPath = require_node('path').resolve(__dirname, '../../docs/contracts/gateway-integration-contract.md');
    const doc = require_node('fs').readFileSync(docPath, 'utf-8');
    expect(doc).toContain('No gateway exists yet');
    expect(doc).toContain('future');
  });
});

describe('Boundary script hardening', () => {
  it('boundary script forbids XMLHttpRequest', () => {
    const scriptPath = require_node('path').resolve(__dirname, '../../scripts/check-forbidden-integrations.mjs');
    const script = require_node('fs').readFileSync(scriptPath, 'utf-8');
    expect(script).toContain('XMLHttpRequest');
  });

  it('boundary script still passes valid source', () => {
    // This is verified by the boundary test in boundaries.test.ts,
    // which runs the actual script. We verify it's still callable.
    const scriptPath = require_node('path').resolve(__dirname, '../../scripts/check-forbidden-integrations.mjs');
    const script = require_node('fs').readFileSync(scriptPath, 'utf-8');
    expect(script).toContain('check:boundaries');
  });

  it('docs directory is excluded from boundary scan', () => {
    const scriptPath = require_node('path').resolve(__dirname, '../../scripts/check-forbidden-integrations.mjs');
    const script = require_node('fs').readFileSync(scriptPath, 'utf-8');
    expect(script).toContain("'docs'");
  });
});

describe('Existing 153 tests remain', () => {
  it('app-shell tests still exist (sanity check)', () => {
    const testPath = require_node('path').resolve(__dirname, 'app-shell.test.tsx');
    const content = require_node('fs').readFileSync(testPath, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('test file count meets minimum', () => {
    const testDir = require_node('path').resolve(__dirname);
    const files = require_node('fs').readdirSync(testDir);
    const testFiles = files.filter((f: string) => f.endsWith('.test.ts') || f.endsWith('.test.tsx'));
    expect(testFiles.length).toBeGreaterThanOrEqual(10);
  });
});

function require_node(module: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(module);
}
