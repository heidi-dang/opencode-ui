import React from 'react';
import { WorkflowSummary } from './WorkflowSummary';
import { MessageFeed } from './MessageFeed';
import { ComposerPlaceholder } from './ComposerPlaceholder';
import { LoadablePanel } from './LoadablePanel';
import { LoadableState } from '../types/ui';

interface BuilderWorkspaceProps {
  loadableState?: LoadableState;
}

export const BuilderWorkspace: React.FC<BuilderWorkspaceProps> = ({
  loadableState = 'ready',
}) => {
  return (
    <main className="h-full flex flex-col bg-slate-900/40 dark:bg-slate-950/40 text-slate-100 overflow-hidden">
      {/* Scrollable Chat / Feed Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        <LoadablePanel
          state={loadableState}
          loadingMessage="Connecting to OpenCode workspace..."
          degradedWarning="Gateway API offline in Phase 1A. Showing static demo conversation."
        >
          {/* Workflow Execution Summary */}
          <WorkflowSummary />

          {/* Messages Feed */}
          <MessageFeed />
        </LoadablePanel>
      </div>

      {/* Fixed Composer at Bottom */}
      <div className="shrink-0 p-2 sm:p-3 bg-slate-950/80 border-t border-slate-800">
        <ComposerPlaceholder />
      </div>
    </main>
  );
};
