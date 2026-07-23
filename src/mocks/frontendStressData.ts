/**
 * Stress-test mock data for QA sandbox. Not persisted in Zustand. Opt-in only.
 */

export const STRESS_SESSION_TITLE =
  'This is an extremely long session title that exceeds two hundred characters to test layout containment and overflow handling in the session list component. It should be gracefully truncated without breaking the UI layout or causing horizontal scroll on the panel. Let us verify this works correctly with truncate and overflow-hidden.';

export const STRESS_WORKSPACE_NAME =
  'this-is-an-extremely-long-workspace-name-that-is-over-one-hundred-characters-long-and-should-truncate-gracefully-in-the-selector';

export const STRESS_BRANCH_NAME =
  'feature/this-is-a-very-long-branch-name-that-is-over-eighty-characters-and-must-be-truncated';

export const STRESS_FILE_PATH =
  'src/this/is/an/extremely/deep/nested/directory/structure/that/goes/very/deep/into/the/project/hierarchy/to/test/path/containment/in/the/context/panel/with/an/even/longer/path/that/exceeds/two/hundred/characters/easily/now/file-name-that-is-also-quite-long.tsx';

export const STRESS_LONG_MARKDOWN =
  'This is an extremely long markdown paragraph that should wrap gracefully within the message feed and not cause overflow issues. It contains enough text to simulate a real-world scenario where the assistant produces a verbose response with detailed explanations, code walkthroughs, and architectural analysis of the OpenCode frontend shell. The layout should handle this without horizontal scrollbars or broken layout. Let us ensure that long prose content is properly contained within the message bubble.';

export const STRESS_LONG_CODE = `// Stress test: very long code block with 30+ lines
function extremelyLongFunctionNameThatExceedsNormalLength() {
  const variableWithVeryLongName = 'this is a very long string value that keeps going and going';
  const anotherVariable = { key1: 'value1', key2: 'value2', key3: 'value3', key4: 'value4' };

  // Line 5
  for (let i = 0; i < 100; i++) {
    console.log('Iteration number: ' + i + ' with some extra text for good measure');
  }

  // Line 10
  const result = someOtherFunctionCall()
    .then(handleResponse)
    .catch(handleError)
    .finally(cleanupResources);

  // Line 15
  return {
    status: 'completed',
    data: { items: [], total: 0, page: 1, pageSize: 50 },
    metadata: { timestamp: Date.now(), source: 'stress-test' },
    errors: [],
  };
}

// Line 25
function helperFunction(arg1: string, arg2: number, arg3: boolean): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Helper completed with:', arg1, arg2, arg3);
      resolve();
    }, 1000);
  });
}

// Line 35
export const CONFIGURATION = {
  debug: true,
  logLevel: 'verbose',
  maxRetries: 5,
  timeout: 30000,
  endpoints: {
    api: 'https://api.example.com/v1',
    ws: 'wss://ws.example.com',
  },
};
`;

export const STRESS_TODOS = [
  { id: 'stress-todo-1', task: 'Verify layout containment for long session titles', completed: true, category: 'QA' },
  { id: 'stress-todo-2', task: 'Verify truncation of long branch names in session list', completed: true, category: 'QA' },
  { id: 'stress-todo-3', task: 'Verify file path overflow containment in context panel', completed: true, category: 'QA' },
  { id: 'stress-todo-4', task: 'Verify long code block horizontal scrolling', completed: true, category: 'QA' },
  { id: 'stress-todo-5', task: 'Verify long markdown paragraph wrapping', completed: true, category: 'QA' },
  { id: 'stress-todo-6', task: 'Verify many todo items render without performance issues', completed: false, category: 'QA' },
  { id: 'stress-todo-7', task: 'Verify 50 sessions render without layout breakage', completed: false, category: 'QA' },
  { id: 'stress-todo-8', task: 'Verify focus trap works in command palette', completed: true, category: 'Accessibility' },
  { id: 'stress-todo-9', task: 'Verify focus restoration on modal close', completed: true, category: 'Accessibility' },
  { id: 'stress-todo-10', task: 'Verify aria-expanded on panel toggles', completed: true, category: 'Accessibility' },
  { id: 'stress-todo-11', task: 'Verify reduced motion CSS media query', completed: true, category: 'Accessibility' },
  { id: 'stress-todo-12', task: 'Verify keyboard navigation in session list', completed: true, category: 'Accessibility' },
  { id: 'stress-todo-13', task: 'Verify disabled button has accessible explanation', completed: true, category: 'Accessibility' },
  { id: 'stress-todo-14', task: 'Verify code block copy button announces state', completed: false, category: 'Accessibility' },
  { id: 'stress-todo-15', task: 'Verify responsive drawer closes on Escape', completed: true, category: 'Accessibility' },
  { id: 'stress-todo-16', task: 'Verify toggle buttons respond to keyboard Enter/Space', completed: true, category: 'UX' },
  { id: 'stress-todo-17', task: 'Verify loading spinner appears during simulated loading', completed: false, category: 'UX' },
  { id: 'stress-todo-18', task: 'Verify empty state renders for empty session lists', completed: true, category: 'UX' },
  { id: 'stress-todo-19', task: 'Verify error state shows retry action', completed: true, category: 'UX' },
  { id: 'stress-todo-20', task: 'Verify theme toggle cycles through all modes', completed: true, category: 'UX' },
  { id: 'stress-todo-21', task: 'Verify mobile drawer does not overflow viewport', completed: false, category: 'Layout' },
];

export const STRESS_WORKFLOW_OUTPUT =
  'Step 1: Initializing workspace environment... Done (1.2s)\n' +
  'Step 2: Loading project configuration from opencode.json... Done (0.8s)\n' +
  'Step 3: Scanning source directory for TypeScript files... Found 142 files (2.4s)\n' +
  'Step 4: Running typecheck across all modules... 0 errors, 3 warnings (4.1s)\n' +
  'Step 5: Linting with ESLint... 0 errors, 0 warnings (3.7s)\n' +
  'Step 6: Building with Vite... Build completed successfully (6.2s)\n' +
  'Step 7: Running test suite... 120 tests passed, 0 failed (8.5s)\n' +
  'Step 8: Checking boundaries... No forbidden integrations found (1.1s)\n' +
  'Step 9: Generating bundle report... Bundle size: 245KB gzipped (0.9s)\n' +
  'Step 10: All checks passed. Ready for deployment.\n'.repeat(10);

export const STRESS_SESSIONS_COUNT = 50;
