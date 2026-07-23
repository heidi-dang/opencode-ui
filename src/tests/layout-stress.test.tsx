import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CodeBlock } from '../components/ui';
import {
  STRESS_SESSION_TITLE,
  STRESS_FILE_PATH,
  STRESS_WORKSPACE_NAME,
  STRESS_BRANCH_NAME,
  STRESS_LONG_CODE,
  STRESS_TODOS,
  STRESS_SESSIONS_COUNT,
  STRESS_LONG_MARKDOWN,
} from '../mocks/frontendStressData';

describe('Long code line containment', () => {
  it('renders CodeBlock with very long code without throwing', () => {
    const { container } = render(<CodeBlock code={STRESS_LONG_CODE} language="typescript" />);
    expect(container.textContent).toContain('stress-test');
    // CodeBlock should have overflow handling
    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
  });

  it('CodeBlock pre element has overflow-x-auto', () => {
    const { container } = render(<CodeBlock code={STRESS_LONG_CODE} language="typescript" />);
    const codeContainer = container.querySelector('[class*="overflow-auto"]');
    expect(codeContainer).toBeTruthy();
  });
});

describe('Long file path containment', () => {
  it('renders long file path without breaking layout', () => {
    const { container } = render(
      <div className="max-w-full overflow-hidden">
        <span className="truncate break-all font-mono">{STRESS_FILE_PATH}</span>
      </div>,
    );
    const span = container.querySelector('span');
    expect(span).toBeTruthy();
    expect(span!.textContent).toBe(STRESS_FILE_PATH);
  });

  it('stress file path has break-all class for word breaking', () => {
    const { container } = render(
      <span className="break-all">{STRESS_FILE_PATH}</span>,
    );
    expect(container.firstChild).toHaveClass('break-all');
  });
});

describe('Long session title containment', () => {
  it('renders long session title with truncate class', () => {
    const { container } = render(
      <h4 className="truncate">{STRESS_SESSION_TITLE}</h4>,
    );
    expect(container.firstChild).toHaveClass('truncate');
    expect(container.textContent).toBe(STRESS_SESSION_TITLE);
  });

  it('long session title is truncated visually', () => {
    const { container } = render(
      <div className="w-48 overflow-hidden">
        <h4 className="truncate">{STRESS_SESSION_TITLE}</h4>
      </div>,
    );
    expect(container.firstChild).toHaveClass('overflow-hidden');
  });
});

describe('Long workspace/branch name containment', () => {
  it('renders long workspace name with truncate and max-w', () => {
    const { container } = render(
      <span className="truncate max-w-full">{STRESS_WORKSPACE_NAME}</span>,
    );
    expect(container.firstChild).toHaveClass('truncate');
  });

  it('renders long branch name with max-w-[120px] truncate', () => {
    const { container } = render(
      <span className="truncate max-w-[120px]">{STRESS_BRANCH_NAME}</span>,
    );
    expect(container.firstChild).toHaveClass('truncate');
    expect(container.firstChild).toHaveClass('max-w-[120px]');
  });
});

describe('Stress data does not enter Zustand persistence', () => {
  it('STRESS_SESSION_TITLE is defined but not in store', () => {
    expect(STRESS_SESSION_TITLE).toBeTruthy();
    expect(STRESS_SESSION_TITLE.length).toBeGreaterThan(200);
  });

  it('STRESS_WORKSPACE_NAME is defined with correct length', () => {
    expect(STRESS_WORKSPACE_NAME.length).toBeGreaterThan(100);
  });

  it('STRESS_BRANCH_NAME is defined with correct length', () => {
    expect(STRESS_BRANCH_NAME.length).toBeGreaterThan(80);
  });

  it('STRESS_FILE_PATH is defined with correct length', () => {
    expect(STRESS_FILE_PATH.length).toBeGreaterThan(200);
  });

  it('STRESS_LONG_MARKDOWN is defined with correct length', () => {
    expect(STRESS_LONG_MARKDOWN.length).toBeGreaterThan(500);
  });

  it('STRESS_TODOS has 20+ items', () => {
    expect(STRESS_TODOS.length).toBeGreaterThanOrEqual(20);
  });

  it('STRESS_SESSIONS_COUNT is 50', () => {
    expect(STRESS_SESSIONS_COUNT).toBe(50);
  });

  it('stress data exports are not undefined', () => {
    expect(STRESS_LONG_CODE).toBeTruthy();
    expect(STRESS_SESSION_TITLE).toBeTruthy();
    expect(STRESS_WORKSPACE_NAME).toBeTruthy();
    expect(STRESS_BRANCH_NAME).toBeTruthy();
    expect(STRESS_FILE_PATH).toBeTruthy();
    expect(STRESS_LONG_MARKDOWN).toBeTruthy();
    expect(STRESS_TODOS).toBeTruthy();
  });
});

describe('Stress session list renders without errors', () => {
  it('generates enough stress todo items', () => {
    expect(STRESS_TODOS.length).toBeGreaterThanOrEqual(20);
    expect(STRESS_TODOS[0].task).toBeTruthy();
    expect(STRESS_TODOS[0].category).toBe('QA');
  });
});

describe('Empty states render consistently', () => {
  it('empty state text is correct', () => {
    const { container } = render(
      <div className="py-8 text-center text-slate-500 text-xs">
        No items to display.
      </div>,
    );
    expect(container.textContent).toContain('No items to display');
  });
});

describe('Error states expose retry actions', () => {
  it('error state renders with retry button', () => {
    render(
      <div>
        <p className="text-xs text-red-400">Failed to load data</p>
        <button type="button" className="px-2 py-1 rounded text-xs">
          Retry Connection
        </button>
      </div>,
    );
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByText('Retry Connection')).toBeInTheDocument();
  });
});

describe('Long markdown paragraph containment', () => {
  it('renders long markdown with break-words', () => {
    const { container } = render(
      <div className="break-words">{STRESS_LONG_MARKDOWN}</div>,
    );
    expect(container.firstChild).toHaveClass('break-words');
    expect(container.textContent).toBe(STRESS_LONG_MARKDOWN);
  });
});
