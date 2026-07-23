import React from 'react';
import {
  Button,
  Badge,
  Panel,
  Tabs,
  StateBlock,
  CodeBlock,
  KeyShortcut,
  SectionHeader,
  SegmentedControl,
} from '../components/ui';
import { SESSION_STATUS_VISUALS } from '../contracts/presentation';
import { getDemoGatewayStatus, getDemoPreviewStatus } from '../adapters/demoGatewayAdapter';
import {
  STRESS_SESSION_TITLE,
  STRESS_WORKSPACE_NAME,
  STRESS_BRANCH_NAME,
  STRESS_FILE_PATH,
  STRESS_LONG_MARKDOWN,
  STRESS_LONG_CODE,
  STRESS_TODOS,
  STRESS_WORKFLOW_OUTPUT,
  STRESS_SESSIONS_COUNT,
} from '../mocks/frontendStressData';

export const QualityAssurancePage: React.FC = () => {
  const [segmentedValue, setSegmentedValue] = React.useState('option1');

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-8">
      {/* 1. QA Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Badge variant="premium">QA</Badge>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Frontend QA Sandbox — Demo Only
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Visual verification and accessibility testing page. No backend calls.
        </p>
      </div>

      {/* 2. UI State Gallery */}
      <section className="space-y-4">
        <SectionHeader title="UI State Gallery" subtitle="All component variants" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button Variants */}
          <Panel title="Button Variants" bodyClassName="p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="secondary" disabled>Disabled</Button>
              <Button variant="danger" disabled>Disabled</Button>
            </div>
          </Panel>

          {/* Badge Variants */}
          <Panel title="Badge Variants" bodyClassName="p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="premium">Premium</Badge>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <StateBlock visual={SESSION_STATUS_VISUALS.idle} />
              <StateBlock visual={SESSION_STATUS_VISUALS.busy} />
              <StateBlock visual={SESSION_STATUS_VISUALS.retrying} />
              <StateBlock visual={SESSION_STATUS_VISUALS.attention} />
              <StateBlock visual={SESSION_STATUS_VISUALS.error} />
            </div>
          </Panel>

          {/* Panel */}
          <Panel title="Panel Component" subtitle="With subtitle" bodyClassName="p-4" footer="Footer content">
            <p className="text-xs text-slate-300">
              Panel body with content. This demonstrates the Panel component with header, body, and footer.
            </p>
          </Panel>

          {/* Tabs */}
          <Panel title="Tabs Component" bodyClassName="p-0">
            <Tabs
              items={[
                { id: 'tab1', label: 'Tab One', count: 3 },
                { id: 'tab2', label: 'Tab Two', count: 7 },
                { id: 'tab3', label: 'Tab Three', count: 1 },
                { id: 'tab4', label: 'Tab Four' },
              ]}
              activeId="tab1"
              onChange={() => {}}
            />
            <div className="p-4 text-xs text-slate-400">
              Tab content area — switching tabs is a visual demo only.
            </div>
          </Panel>

          {/* KeyShortcut */}
          <Panel title="Key Shortcuts" bodyClassName="p-4 space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <KeyShortcut keys={['Cmd', 'K']} />
              <KeyShortcut keys={['Ctrl', 'S']} />
              <KeyShortcut keys={['Shift', 'Enter']} />
              <KeyShortcut keys={['Alt', 'ArrowUp']} separator="+" />
            </div>
          </Panel>

          {/* SegmentedControl */}
          <Panel title="Segmented Control" bodyClassName="p-4 space-y-3">
            <SegmentedControl
              options={[
                { id: 'option1', label: 'Option 1' },
                { id: 'option2', label: 'Option 2' },
                { id: 'option3', label: 'Option 3' },
              ]}
              value={segmentedValue}
              onChange={setSegmentedValue}
            />
            <p className="text-xs text-slate-400">
              Selected: {segmentedValue}
            </p>
          </Panel>

          {/* StateBlock */}
          <Panel title="State Block Variants" bodyClassName="p-4 space-y-3">
            <div className="space-y-2">
              <StateBlock visual={SESSION_STATUS_VISUALS.idle} detail="Ready" />
              <StateBlock visual={SESSION_STATUS_VISUALS.busy} detail="Processing" />
              <StateBlock visual={SESSION_STATUS_VISUALS.retrying} detail="Attempt 2/5" />
              <StateBlock visual={SESSION_STATUS_VISUALS.attention} detail="Review required" />
              <StateBlock visual={SESSION_STATUS_VISUALS.error} detail="Connection failed" />
            </div>
            <div className="flex gap-2">
              <StateBlock visual={SESSION_STATUS_VISUALS.idle} dotOnly />
              <StateBlock visual={SESSION_STATUS_VISUALS.busy} dotOnly />
              <StateBlock visual={SESSION_STATUS_VISUALS.error} dotOnly />
            </div>
          </Panel>
        </div>
      </section>

      {/* 3. Empty/Loading/Error/Degraded States */}
      <section className="space-y-4">
        <SectionHeader title="Empty, Loading, Error & Degraded States" subtitle="State rendering verification" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Empty State */}
          <Panel title="Empty State" bodyClassName="p-6 flex flex-col items-center justify-center">
            <div className="py-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center">
                <span className="text-slate-400 text-lg">Ø</span>
              </div>
              <p className="text-xs text-slate-400">No items to display.</p>
              <p className="text-[10px] text-slate-500 mt-1">This is the empty state placeholder.</p>
            </div>
          </Panel>

          {/* Loading State */}
          <Panel title="Loading State" bodyClassName="p-6 flex flex-col items-center justify-center">
            <div className="py-8 text-center">
              <div className="w-8 h-8 mx-auto mb-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Loading data...</p>
              <p className="text-[10px] text-slate-500 mt-1">Simulated spinner for loading state.</p>
            </div>
          </Panel>

          {/* Error State */}
          <Panel title="Error State" bodyClassName="p-6 flex flex-col items-center justify-center">
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-lg">!</span>
              </div>
              <div>
                <p className="text-xs text-red-400 font-semibold">Failed to load data</p>
                <p className="text-[10px] text-slate-500 mt-1">An unexpected error occurred.</p>
              </div>
              <Button variant="secondary" size="sm">Retry Connection</Button>
            </div>
          </Panel>

          {/* Degraded State */}
          <Panel title="Degraded State" bodyClassName="p-6 flex flex-col items-center justify-center">
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <span className="text-amber-400 text-lg">~</span>
              </div>
              <div>
                <p className="text-xs text-amber-400 font-semibold">Connection degraded</p>
                <p className="text-[10px] text-slate-500 mt-1">Some features may be unavailable.</p>
              </div>
              <Button variant="secondary" size="sm">Reconnect</Button>
            </div>
          </Panel>
        </div>
      </section>

      {/* 4. Stress Data Rendering */}
      <section className="space-y-4">
        <SectionHeader title="Stress Data Rendering" subtitle="Layout containment verification" />

        <div className="grid grid-cols-1 gap-4">
          <Panel title="STRESS TEST: Long Session Title" bodyClassName="p-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <h4 className="text-xs font-semibold truncate">{STRESS_SESSION_TITLE}</h4>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="truncate max-w-[120px]">{STRESS_BRANCH_NAME}</span>
              </p>
              <p className="text-xs text-slate-400 mt-2 break-words">{STRESS_LONG_MARKDOWN}</p>
            </div>
          </Panel>

          <Panel title="STRESS TEST: Long File Path" bodyClassName="p-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 max-w-full overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-200 truncate break-all">{STRESS_FILE_PATH}</span>
              </div>
            </div>
          </Panel>

          <Panel title="STRESS TEST: Long Workspace Name" bodyClassName="p-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <span className="text-xs font-mono text-slate-200 truncate block max-w-full">{STRESS_WORKSPACE_NAME}</span>
            </div>
          </Panel>

          <Panel title={`STRESS TEST: ${STRESS_TODOS.length} Todo Items`} bodyClassName="p-4 max-h-64 overflow-y-auto">
            <div className="space-y-1.5">
              {STRESS_TODOS.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-2 p-1.5 rounded-lg text-xs text-slate-300"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    readOnly
                    className="accent-amber-500"
                    aria-label={todo.task}
                  />
                  <span className={todo.completed ? 'line-through text-slate-500' : ''}>{todo.task}</span>
                  <Badge variant="info">{todo.category}</Badge>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="STRESS TEST: Long Code Block (30+ lines)" bodyClassName="p-0">
            <CodeBlock code={STRESS_LONG_CODE} language="typescript" showLineNumbers maxHeight="300px" />
          </Panel>

          <Panel title="STRESS TEST: Long Workflow Output" bodyClassName="p-4">
            <pre className="text-xs font-mono text-slate-400 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
              {STRESS_WORKFLOW_OUTPUT}
            </pre>
          </Panel>

          <Panel title={`STRESS TEST: ${STRESS_SESSIONS_COUNT} Sessions Count`} bodyClassName="p-4">
            <p className="text-xs text-slate-300">
              This QA page verifies that <strong>{STRESS_SESSIONS_COUNT}</strong> sessions can be rendered
              without layout breakage. The <code className="text-amber-400">STRESS_SESSIONS_COUNT</code> constant
              is set to 50 to simulate a realistic session list load.
            </p>
          </Panel>
        </div>
      </section>

      {/* 5. Typography Samples */}
      <section className="space-y-4">
        <SectionHeader title="Typography Samples" subtitle="Heading hierarchy and text styles" />

        <Panel bodyClassName="p-4 space-y-3">
          <h1 className="text-2xl font-bold text-white">Heading 1 — Page Title</h1>
          <h2 className="text-xl font-bold text-slate-100">Heading 2 — Section Title</h2>
          <h3 className="text-lg font-semibold text-slate-200">Heading 3 — Panel Title</h3>
          <h4 className="text-base font-semibold text-slate-200">Heading 4 — Subsection</h4>
          <h5 className="text-sm font-semibold text-slate-300">Heading 5 — Group Label</h5>
          <h6 className="text-xs font-semibold text-slate-300">Heading 6 — Small Label</h6>

          <hr className="border-slate-800 my-2" />

          <p className="text-sm text-slate-300">
            Body text — Regular paragraph content for reading. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-xs text-slate-400">
            Small body text — Secondary content and metadata.
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            Code/mono text — 10px monospace for technical details.
          </p>
          <p className="text-[10px] text-slate-500">
            Extra small text — Footers and timestamps.
          </p>
        </Panel>
      </section>

      {/* 6. Focus Ring Examples */}
      <section className="space-y-4">
        <SectionHeader title="Focus Ring Examples" subtitle="Keyboard focus visibility" />

        <Panel bodyClassName="p-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Focusable Button</Button>
            <Button variant="secondary">Focusable Secondary</Button>
            <Button variant="ghost">Focusable Ghost</Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Focusable input"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-400 focus-ring"
              aria-label="Sample text input"
            />
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-xs text-amber-400 hover:text-amber-300 focus-ring"
            >
              Focusable link
            </a>
            <select
              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus-ring"
              aria-label="Sample select"
            >
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>

          <p className="text-[10px] text-slate-500">
            Tab through these elements to verify visible amber focus rings.
          </p>
        </Panel>
      </section>

      {/* 7. Reduced Motion Note */}
      <section className="space-y-4">
        <SectionHeader title="Reduced Motion Support" subtitle="prefers-reduced-motion" />

        <Panel bodyClassName="p-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2">
            <Badge variant="info">Accessibility</Badge>
            <p className="text-xs text-slate-300">
              The application includes a <code className="text-amber-400">@media (prefers-reduced-motion: reduce)</code> block
              in <code className="text-amber-400">src/index.css</code> that disables all animations, transitions, and smooth
              scrolling when the user's system accessibility settings request reduced motion.
            </p>
            <p className="text-xs text-slate-400">
              This respects WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions).
            </p>
          </div>
        </Panel>
      </section>

      {/* 8. Accessibility Check */}
      <section className="space-y-4">
        <SectionHeader title="Accessibility Check" subtitle="ARIA attributes used" />

        <Panel bodyClassName="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <h4 className="text-xs font-bold text-slate-200 mb-2">ARIA Roles</h4>
              <ul className="text-[10px] text-slate-400 space-y-1 list-disc list-inside">
                <li><code className="text-amber-400">role="dialog"</code> — Command palette, drawers</li>
                <li><code className="text-amber-400">role="listbox"</code> — Session list, command list</li>
                <li><code className="text-amber-400">role="option"</code> — List items</li>
                <li><code className="text-amber-400">role="tablist"</code> — Context panel tabs</li>
                <li><code className="text-amber-400">role="tab"</code> — Tab buttons</li>
                <li><code className="text-amber-400">role="radiogroup"</code> — Segmented controls</li>
                <li><code className="text-amber-400">role="radio"</code> — Segmented options</li>
                <li><code className="text-amber-400">role="button"</code> — Drawer backdrop</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <h4 className="text-xs font-bold text-slate-200 mb-2">ARIA Attributes</h4>
              <ul className="text-[10px] text-slate-400 space-y-1 list-disc list-inside">
                <li><code className="text-amber-400">aria-modal="true"</code> — Modals</li>
                <li><code className="text-amber-400">aria-label</code> — Icon buttons, inputs</li>
                <li><code className="text-amber-400">aria-expanded</code> — Panel toggles</li>
                <li><code className="text-amber-400">aria-current="page"</code> — Active nav links</li>
                <li><code className="text-amber-400">aria-selected</code> — Active options/tabs</li>
                <li><code className="text-amber-400">aria-pressed</code> — Toggle buttons</li>
                <li><code className="text-amber-400">aria-disabled</code> — Disabled buttons</li>
                <li><code className="text-amber-400">aria-haspopup</code> — Command palette</li>
              </ul>
            </div>
          </div>

          <p className="text-[10px] text-slate-500">
            All interactive elements have accessible names. Focus indicators use the <code className="text-amber-400">.focus-ring</code> class.
          </p>
        </Panel>
      </section>

      {/* Gateway Integration Readiness */}
      <section className="space-y-4">
        <SectionHeader title="Gateway Integration Readiness" subtitle="Phase 2 preparation status" />

        <Panel bodyClassName="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <h4 className="text-xs font-bold text-slate-200 mb-2">Connection</h4>
              <p className="text-[10px] text-slate-400 space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-400 font-mono text-[10px]">
                  {getDemoGatewayStatus().connection}
                </span>
              </p>
              <p className="text-[10px] text-slate-500 mt-2">Demo adapter — no real connection.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <h4 className="text-xs font-bold text-slate-200 mb-2">SDK Status</h4>
              <ul className="text-[10px] text-slate-400 space-y-1">
                <li>📦 <code className="text-amber-400">@opencode-ai/sdk</code>: <span className="text-slate-500">Not installed</span></li>
                <li>📡 SSE: <span className="text-slate-500">Not implemented</span></li>
                <li>🔌 WebSocket: <span className="text-slate-500">Not implemented</span></li>
                <li>🌐 Gateway: <span className="text-slate-500">Not implemented</span></li>
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <h4 className="text-xs font-bold text-slate-200 mb-2">Preview Runtime</h4>
              <p className="text-[10px] text-slate-400">
                State: <code className="text-slate-500">{getDemoPreviewStatus().state}</code>
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Preview runtime management requires Phase 2 gateway.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <h4 className="text-xs font-bold text-slate-200 mb-2">Contracts</h4>
              <ul className="text-[10px] text-slate-400 space-y-1">
                <li>✅ View-model contracts ready</li>
                <li>✅ Demo adapter ready</li>
                <li>✅ Integration contract docs ready</li>
                <li>⬜ Gateway server: <span className="text-slate-500">Phase 2</span></li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <p className="text-[10px] text-amber-400 font-medium">
              ⚡ Phase 2 — Gateway Contract Implementation
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              The next phase will scaffold a Fastify gateway server, install the OpenCode SDK,
              implement SSE event streaming, and connect the frontend demo adapter to real data.
              No gateway work has started in Phase 1.
            </p>
          </div>
        </Panel>
      </section>
    </div>
  );
};
